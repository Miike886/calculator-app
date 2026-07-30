package calculation_test

import (
	"errors"
	"testing"

	"calculator-app/backend/internal/calculation"
)

func TestCalculateRejectsEmptyExpression(t *testing.T) {
	_, err := calculation.Calculate(" ")

	if !errors.Is(err, calculation.ErrEmptyExpression) {
		t.Fatalf("expected ErrEmptyExpression, got %v", err)
	}
}

func TestCalculateRejectsExpressionOverMaxLength(t *testing.T) {
	_, err := calculation.Calculate("1234567890123456789012345678901234567890123456789+1")

	if !errors.Is(err, calculation.ErrExpressionTooLong) {
		t.Fatalf("expected ErrExpressionTooLong, got %v", err)
	}
}

func TestCalculateRejectsIncompleteExpression(t *testing.T) {
	tests := []string{"1+", "+1", "1++2", "1.", "-", "1/-"}

	for _, expression := range tests {
		t.Run(expression, func(t *testing.T) {
			_, err := calculation.Calculate(expression)

			if !errors.Is(err, calculation.ErrInvalidExpression) {
				t.Fatalf("expected ErrInvalidExpression, got %v", err)
			}
		})
	}
}

func TestCalculateRejectsUnsupportedOperations(t *testing.T) {
	_, err := calculation.Calculate("2^3")

	if !errors.Is(err, calculation.ErrUnsupportedOperation) {
		t.Fatalf("expected ErrUnsupportedOperation, got %v", err)
	}
}

func TestCalculateRejectsInvalidCharacters(t *testing.T) {
	_, err := calculation.Calculate("2a3")

	if !errors.Is(err, calculation.ErrInvalidCharacter) {
		t.Fatalf("expected ErrInvalidCharacter, got %v", err)
	}
}

func TestCalculateRejectsDivisionByZero(t *testing.T) {
	_, err := calculation.Calculate("10/0")

	if !errors.Is(err, calculation.ErrDivisionByZero) {
		t.Fatalf("expected ErrDivisionByZero, got %v", err)
	}
}
