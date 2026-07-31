package transport_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"calculator-app/backend/internal/calculation"
	"calculator-app/backend/internal/transport"
)

type calculationResponse struct {
	Expression string  `json:"expression"`
	Result     float64 `json:"result"`
}

type errorResponse struct {
	Error struct {
		Code string `json:"code"`
	} `json:"error"`
}

func TestCalculationsHandlerCalculatesBasicOperations(t *testing.T) {
	tests := []struct {
		name       string
		expression string
		expected   float64
	}{
		{name: "addition", expression: "2+3+4", expected: 9},
		{name: "subtraction", expression: "20-5-3", expected: 12},
		{name: "multiplication", expression: "2*3*4", expected: 24},
		{name: "division", expression: "100/2/5", expected: 10},
		{name: "division with negative divisor", expression: "100/-2/5", expected: -10},
		{name: "mixed precedence", expression: "2+3*4", expected: 14},
		{name: "power", expression: "2^3", expected: 8},
		{name: "power precedence", expression: "2+3^2", expected: 11},
		{name: "same precedence left to right", expression: "20/5*2", expected: 8},
		{name: "square root", expression: "sqrt(81)", expected: 9},
		{name: "square root with mixed precedence", expression: "sqrt(16)+2*3", expected: 10},
		{name: "percentage", expression: "200%10", expected: 20},
		{name: "percentage precedence", expression: "100+200%10", expected: 120},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"`+test.expression+`"}`))
			response := httptest.NewRecorder()

			transport.CalculationsHandler(response, request)

			if response.Code != http.StatusOK {
				t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
			}

			var body calculationResponse
			if err := json.NewDecoder(response.Body).Decode(&body); err != nil {
				t.Fatalf("expected valid JSON response: %v", err)
			}

			if body.Expression != test.expression {
				t.Fatalf("expected expression %s, got %q", test.expression, body.Expression)
			}

			if body.Result != test.expected {
				t.Fatalf("expected result %v, got %v", test.expected, body.Result)
			}
		})
	}
}

func TestCalculationsHandlerRejectsInvalidJSON(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "INVALID_JSON")
}

func TestCalculationsHandlerRejectsIncompleteExpression(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"2^"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "INCOMPLETE_EXPRESSION")
}

func TestCalculationsHandlerRejectsInvalidCharacter(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"2a3"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "INVALID_CHARACTER")
}

func TestCalculationsHandlerRejectsEmptyExpression(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":""}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "EMPTY_EXPRESSION")
}

func TestCalculationsHandlerRejectsExpressionOverMaxLength(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"`+strings.Repeat("1", calculation.MaxExpressionLength+1)+`"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "EXPRESSION_TOO_LONG")
}

func TestCalculationsHandlerRejectsDivisionByZero(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"10/0"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "DIVISION_BY_ZERO")
}

func TestCalculationsHandlerRejectsNegativeSquareRoot(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"sqrt(-9)"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "NEGATIVE_SQUARE_ROOT")
}

func TestCalculationsHandlerRejectsNonFiniteResult(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"9999999999^9999999999"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "NON_FINITE_RESULT")
}

func assertErrorCode(t *testing.T, response *httptest.ResponseRecorder, expectedStatus int, expectedCode string) {
	t.Helper()

	if response.Code != expectedStatus {
		t.Fatalf("expected status %d, got %d", expectedStatus, response.Code)
	}

	var body errorResponse
	if err := json.NewDecoder(response.Body).Decode(&body); err != nil {
		t.Fatalf("expected valid JSON error response: %v", err)
	}

	if body.Error.Code != expectedCode {
		t.Fatalf("expected error code %s, got %s", expectedCode, body.Error.Code)
	}
}
