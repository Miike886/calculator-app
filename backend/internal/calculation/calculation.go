package calculation

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

var (
	ErrEmptyExpression      = errors.New("empty expression")
	ErrUnsupportedOperation = errors.New("unsupported operation")
	ErrInvalidExpression    = errors.New("invalid expression")
)

func Calculate(expression string) (float64, error) {
	normalized := strings.ReplaceAll(expression, " ", "")
	if normalized == "" {
		return 0, ErrEmptyExpression
	}

	if strings.ContainsAny(normalized, "-*/^%") {
		return 0, ErrUnsupportedOperation
	}

	parts := strings.Split(normalized, "+")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return 0, ErrInvalidExpression
	}

	left, err := strconv.ParseFloat(parts[0], 64)
	if err != nil {
		return 0, fmt.Errorf("%w: left operand", ErrInvalidExpression)
	}

	right, err := strconv.ParseFloat(parts[1], 64)
	if err != nil {
		return 0, fmt.Errorf("%w: right operand", ErrInvalidExpression)
	}

	return left + right, nil
}
