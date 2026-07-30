package calculation

import (
	"errors"
	"testing"
)

func TestCalculateBasicOperationsWithMultipleOperands(t *testing.T) {
	tests := []struct {
		name       string
		expression string
		expected   float64
	}{
		{name: "addition", expression: "2+3+4", expected: 9},
		{name: "subtraction", expression: "20-5-3", expected: 12},
		{name: "multiplication", expression: "2*3*4", expected: 24},
		{name: "division", expression: "100/2/5", expected: 10},
		{name: "negative dividend", expression: "-100/2/5", expected: -10},
		{name: "negative divisor", expression: "100/-2/5", expected: -10},
		{name: "negative operands", expression: "-100/-2/5", expected: 10},
		{name: "decimals", expression: "1.5+2.25", expected: 3.75},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result, err := Calculate(test.expression)
			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}

			if result != test.expected {
				t.Fatalf("expected %v, got %v", test.expected, result)
			}
		})
	}
}

func TestCalculateEvaluatesLeftToRightWithoutMixedPrecedence(t *testing.T) {
	result, err := Calculate("2+3*4")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 20 {
		t.Fatalf("expected 20, got %v", result)
	}
}

func TestCalculateIgnoresSpaces(t *testing.T) {
	result, err := Calculate(" 8 / 2 / 2 ")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 2 {
		t.Fatalf("expected 2, got %v", result)
	}
}

func TestCalculateRejectsEmptyExpression(t *testing.T) {
	_, err := Calculate(" ")

	if !errors.Is(err, ErrEmptyExpression) {
		t.Fatalf("expected ErrEmptyExpression, got %v", err)
	}
}

func TestCalculateRejectsExpressionOverMaxLength(t *testing.T) {
	_, err := Calculate("1234567890123456789012345678901234567890123456789+1")

	if !errors.Is(err, ErrExpressionTooLong) {
		t.Fatalf("expected ErrExpressionTooLong, got %v", err)
	}
}

func TestCalculateRejectsIncompleteExpression(t *testing.T) {
	tests := []string{"1+", "+1", "1++2", "1.", "-", "1/-"}

	for _, expression := range tests {
		t.Run(expression, func(t *testing.T) {
			_, err := Calculate(expression)

			if !errors.Is(err, ErrInvalidExpression) {
				t.Fatalf("expected ErrInvalidExpression, got %v", err)
			}
		})
	}
}

func TestCalculateRejectsUnsupportedOperations(t *testing.T) {
	_, err := Calculate("2^3")

	if !errors.Is(err, ErrUnsupportedOperation) {
		t.Fatalf("expected ErrUnsupportedOperation, got %v", err)
	}
}

func TestCalculateRejectsInvalidCharacters(t *testing.T) {
	_, err := Calculate("2a3")

	if !errors.Is(err, ErrInvalidCharacter) {
		t.Fatalf("expected ErrInvalidCharacter, got %v", err)
	}
}

func TestCalculateRejectsDivisionByZero(t *testing.T) {
	_, err := Calculate("10/0")

	if !errors.Is(err, ErrDivisionByZero) {
		t.Fatalf("expected ErrDivisionByZero, got %v", err)
	}
}
