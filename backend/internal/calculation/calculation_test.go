package calculation

import (
	"errors"
	"testing"
)

func TestCalculateAddsTwoOperands(t *testing.T) {
	result, err := Calculate("12+7")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 19 {
		t.Fatalf("expected 19, got %v", result)
	}
}

func TestCalculateIgnoresSpaces(t *testing.T) {
	result, err := Calculate(" 1.5 + 2.25 ")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != 3.75 {
		t.Fatalf("expected 3.75, got %v", result)
	}
}

func TestCalculateRejectsEmptyExpression(t *testing.T) {
	_, err := Calculate(" ")

	if !errors.Is(err, ErrEmptyExpression) {
		t.Fatalf("expected ErrEmptyExpression, got %v", err)
	}
}

func TestCalculateRejectsIncompleteExpression(t *testing.T) {
	_, err := Calculate("1+")

	if !errors.Is(err, ErrInvalidExpression) {
		t.Fatalf("expected ErrInvalidExpression, got %v", err)
	}
}

func TestCalculateRejectsUnsupportedOperation(t *testing.T) {
	_, err := Calculate("4*2")

	if !errors.Is(err, ErrUnsupportedOperation) {
		t.Fatalf("expected ErrUnsupportedOperation, got %v", err)
	}
}
