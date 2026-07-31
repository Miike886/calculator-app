package transport

import (
	"encoding/json"
	"errors"
	"net/http"

	"calculator-app/backend/internal/calculation"
)

type calculationRequest struct {
	Expression string `json:"expression"`
}

type calculationResponse struct {
	Expression string  `json:"expression"`
	Result     float64 `json:"result"`
}

type errorResponse struct {
	Error apiError `json:"error"`
}

type apiError struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Details map[string]string `json:"details,omitempty"`
}

func CalculationsHandler(w http.ResponseWriter, r *http.Request) {
	var request calculationRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{
			Error: apiError{
				Code:    "INVALID_JSON",
				Message: "El cuerpo de la solicitud no es JSON valido.",
			},
		})
		return
	}

	result, err := calculation.Calculate(request.Expression)
	if err != nil {
		writeCalculationError(w, request.Expression, err)
		return
	}

	writeJSON(w, http.StatusOK, calculationResponse{
		Expression: request.Expression,
		Result:     result,
	})
}

func writeCalculationError(w http.ResponseWriter, expression string, err error) {
	apiErr := apiError{
		Code:    "INVALID_EXPRESSION",
		Message: "La expresion no es valida.",
		Details: map[string]string{
			"expression": expression,
		},
	}

	switch {
	case errors.Is(err, calculation.ErrEmptyExpression):
		apiErr.Code = "EMPTY_EXPRESSION"
		apiErr.Message = "La expresion no puede estar vacia."
	case errors.Is(err, calculation.ErrExpressionTooLong):
		apiErr.Code = "EXPRESSION_TOO_LONG"
		apiErr.Message = "La expresion supera el limite permitido."
	case errors.Is(err, calculation.ErrUnsupportedOperation):
		apiErr.Code = "UNSUPPORTED_OPERATION"
		apiErr.Message = "La operacion no esta soportada en esta version."
	case errors.Is(err, calculation.ErrInvalidCharacter):
		apiErr.Code = "INVALID_CHARACTER"
		apiErr.Message = "La expresion contiene caracteres no permitidos."
	case errors.Is(err, calculation.ErrInvalidExpression):
		apiErr.Code = "INCOMPLETE_EXPRESSION"
		apiErr.Message = "La expresion esta incompleta o contiene operandos invalidos."
	case errors.Is(err, calculation.ErrDivisionByZero):
		apiErr.Code = "DIVISION_BY_ZERO"
		apiErr.Message = "No se puede dividir entre cero."
	case errors.Is(err, calculation.ErrNegativeSquareRoot):
		apiErr.Code = "NEGATIVE_SQUARE_ROOT"
		apiErr.Message = "No se puede calcular la raiz cuadrada de un numero negativo."
	case errors.Is(err, calculation.ErrNonFiniteResult):
		apiErr.Code = "NON_FINITE_RESULT"
		apiErr.Message = "El resultado no es finito."
	}

	writeJSON(w, http.StatusBadRequest, errorResponse{Error: apiErr})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
