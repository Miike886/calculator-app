package transport

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculationsHandlerAddsTwoOperands(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"2+3"}`))
	response := httptest.NewRecorder()

	CalculationsHandler(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var body calculationResponse
	if err := json.NewDecoder(response.Body).Decode(&body); err != nil {
		t.Fatalf("expected valid JSON response: %v", err)
	}

	if body.Expression != "2+3" {
		t.Fatalf("expected expression 2+3, got %q", body.Expression)
	}

	if body.Result != 5 {
		t.Fatalf("expected result 5, got %v", body.Result)
	}
}

func TestCalculationsHandlerRejectsInvalidJSON(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{`))
	response := httptest.NewRecorder()

	CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "INVALID_JSON")
}

func TestCalculationsHandlerRejectsUnsupportedOperation(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":"2*3"}`))
	response := httptest.NewRecorder()

	CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "UNSUPPORTED_OPERATION")
}

func TestCalculationsHandlerRejectsEmptyExpression(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", bytes.NewBufferString(`{"expression":""}`))
	response := httptest.NewRecorder()

	CalculationsHandler(response, request)

	assertErrorCode(t, response, http.StatusBadRequest, "EMPTY_EXPRESSION")
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
