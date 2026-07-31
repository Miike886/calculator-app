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

func TestCalculateEvaluatesMixedOperationsWithPrecedence(t *testing.T) {
	result, err := calculation.Calculate("2+3*4")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 14 {
		t.Fatalf("expected 14, got %v", result)
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

func TestCalculateAdvancedOperations(t *testing.T) {
	tests := []struct {
		name       string
		expression string
		expected   float64
	}{
		{name: "power", expression: "2^3", expected: 8},
		{name: "negative exponent", expression: "2^-2", expected: 0.25},
		{name: "square root", expression: "sqrt(81)", expected: 9},
		{name: "percentage", expression: "200%10", expected: 20},
		{name: "power precedence", expression: "2+3^2", expected: 11},
		{name: "square root as operand", expression: "sqrt(81)+1", expected: 10},
		{name: "square root with mixed precedence", expression: "sqrt(16)+2*3", expected: 10},
		{name: "percentage precedence", expression: "100+200%10", expected: 120},
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

func TestCalculateEvaluatesSamePrecedenceLeftToRight(t *testing.T) {
	tests := []struct {
		name       string
		expression string
		expected   float64
	}{
		{name: "multiplication and division", expression: "20/5*2", expected: 8},
		{name: "addition and subtraction", expression: "20-5+3", expected: 18},
		{name: "power", expression: "2^3^2", expected: 64},
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
