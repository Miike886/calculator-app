package calculation_test

import (
	"testing"

	"calculator-app/backend/internal/calculation"
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
			result, err := calculation.Calculate(test.expression)
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
	result, err := calculation.Calculate("2+3*4")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 20 {
		t.Fatalf("expected 20, got %v", result)
	}
}

func TestCalculateIgnoresSpaces(t *testing.T) {
	result, err := calculation.Calculate(" 8 / 2 / 2 ")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 2 {
		t.Fatalf("expected 2, got %v", result)
	}
}
