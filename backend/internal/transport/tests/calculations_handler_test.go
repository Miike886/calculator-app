package transport_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

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
		{name: "left to right", expression: "2+3*4", expected: 20},
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

func TestCalculationsHandlerRejectsUnsupportedOperation(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"2^3"}`))
	response := httptest.NewRecorder()

	transport.CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "UNSUPPORTED_OPERATION")
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
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"1234567890123456789012345678901234567890123456789+1"}`))
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
