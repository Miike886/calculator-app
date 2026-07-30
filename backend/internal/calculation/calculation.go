package calculation

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

var (
	ErrEmptyExpression      = errors.New("empty expression")
	ErrExpressionTooLong    = errors.New("expression too long")
	ErrUnsupportedOperation = errors.New("unsupported operation")
	ErrInvalidCharacter     = errors.New("invalid character")
	ErrInvalidExpression    = errors.New("invalid expression")
	ErrDivisionByZero       = errors.New("division by zero")
)

const MaxExpressionLength = 48

func Calculate(expression string) (float64, error) {
	normalized := strings.ReplaceAll(expression, " ", "")
	if normalized == "" {
		return 0, ErrEmptyExpression
	}

	if len(normalized) > MaxExpressionLength {
		return 0, ErrExpressionTooLong
	}

	tokens, err := tokenize(normalized)
	if err != nil {
		return 0, err
	}

	if len(tokens) < 3 || len(tokens)%2 == 0 {
		return 0, ErrInvalidExpression
	}

	result, err := parseNumber(tokens[0])
	if err != nil {
		return 0, err
	}

	for index := 1; index < len(tokens); index += 2 {
		operator := tokens[index]
		next, err := parseNumber(tokens[index+1])
		if err != nil {
			return 0, err
		}

		switch operator {
		case "+":
			result += next
		case "-":
			result -= next
		case "*":
			result *= next
		case "/":
			if next == 0 {
				return 0, ErrDivisionByZero
			}
			result /= next
		default:
			return 0, ErrInvalidCharacter
		}
	}

	return result, nil
}

func tokenize(expression string) ([]string, error) {
	tokens := make([]string, 0)
	start := 0

	for index, char := range expression {
		switch {
		case isDigit(char) || char == '.':
			continue
		case char == '-' && start == index:
			continue
		case isOperator(char):
			if start == index {
				return nil, ErrInvalidExpression
			}
			tokens = append(tokens, expression[start:index], string(char))
			start = index + 1
		case isFutureOperator(char):
			return nil, ErrUnsupportedOperation
		default:
			return nil, ErrInvalidCharacter
		}
	}

	if start == len(expression) {
		return nil, ErrInvalidExpression
	}

	tokens = append(tokens, expression[start:])
	return tokens, nil
}

func parseNumber(value string) (float64, error) {
	number, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return 0, fmt.Errorf("%w: operand", ErrInvalidExpression)
	}

	return number, nil
}

func isDigit(value rune) bool {
	return value >= '0' && value <= '9'
}

func isOperator(value rune) bool {
	return value == '+' || value == '-' || value == '*' || value == '/'
}

func isFutureOperator(value rune) bool {
	return value == '^' || value == '%'
}
