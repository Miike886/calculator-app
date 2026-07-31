package calculation

import (
	"errors"
	"fmt"
	"math"
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
	ErrNegativeSquareRoot   = errors.New("negative square root")
	ErrNonFiniteResult      = errors.New("non-finite result")
)

const MaxExpressionLength = 24

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

	if len(tokens) == 1 {
		if !isSquareRootToken(tokens[0]) {
			return 0, ErrInvalidExpression
		}
		return parseOperand(tokens[0])
	}

	if len(tokens) < 3 || len(tokens)%2 == 0 {
		return 0, ErrInvalidExpression
	}

	values := make([]float64, 0, (len(tokens)+1)/2)
	operators := make([]string, 0, (len(tokens)-1)/2)

	for index, token := range tokens {
		if index%2 == 0 {
			value, err := parseOperand(token)
			if err != nil {
				return 0, err
			}
			values = append(values, value)
			continue
		}

		operators = append(operators, token)
	}

	result, err := evaluateWithPrecedence(values, operators)
	if err != nil {
		return 0, err
	}

	return result, nil
}

func evaluateWithPrecedence(values []float64, operators []string) (float64, error) {
	precedenceGroups := [][]string{
		{"^"},
		{"*", "/", "%"},
		{"+", "-"},
	}

	for _, group := range precedenceGroups {
		for index := 0; index < len(operators); {
			if !containsOperator(group, operators[index]) {
				index++
				continue
			}

			result, err := applyOperator(values[index], values[index+1], operators[index])
			if err != nil {
				return 0, err
			}

			values[index] = result
			values = append(values[:index+1], values[index+2:]...)
			operators = append(operators[:index], operators[index+1:]...)
		}
	}

	if len(values) != 1 || len(operators) != 0 {
		return 0, ErrInvalidExpression
	}

	return values[0], nil
}

func applyOperator(left float64, right float64, operator string) (float64, error) {
	var result float64

	switch operator {
	case "+":
		result = left + right
	case "-":
		result = left - right
	case "*":
		result = left * right
	case "/":
		if right == 0 {
			return 0, ErrDivisionByZero
		}
		result = left / right
	case "^":
		result = math.Pow(left, right)
	case "%":
		result = left * right / 100
	default:
		return 0, ErrUnsupportedOperation
	}

	if !isFinite(result) {
		return 0, ErrNonFiniteResult
	}

	return result, nil
}

func containsOperator(operators []string, value string) bool {
	for _, operator := range operators {
		if operator == value {
			return true
		}
	}

	return false
}

func tokenize(expression string) ([]string, error) {
	tokens := make([]string, 0)
	expectOperand := true

	for index := 0; index < len(expression); {
		if expectOperand {
			if strings.HasPrefix(expression[index:], "sqrt(") {
				end := strings.Index(expression[index:], ")")
				if end < 0 {
					return nil, ErrInvalidExpression
				}

				end += index
				if end == index+5 {
					return nil, ErrInvalidExpression
				}

				tokens = append(tokens, expression[index:end+1])
				index = end + 1
				expectOperand = false
				continue
			}

			start := index
			if expression[index] == '-' {
				index++
			}

			sawDigit := false
			sawDot := false
			for index < len(expression) {
				char := rune(expression[index])
				if isDigit(char) {
					sawDigit = true
					index++
					continue
				}

				if char == '.' {
					if sawDot {
						return nil, ErrInvalidExpression
					}
					sawDot = true
					index++
					continue
				}

				break
			}

			if !sawDigit {
				return nil, ErrInvalidExpression
			}

			tokens = append(tokens, expression[start:index])
			expectOperand = false
			continue
		}

		char := rune(expression[index])
		if !isOperator(char) {
			return nil, ErrInvalidCharacter
		}
		tokens = append(tokens, string(char))
		index++
		expectOperand = true
	}

	if expectOperand {
		return nil, ErrInvalidExpression
	}

	return tokens, nil
}

func parseOperand(value string) (float64, error) {
	if isSquareRootToken(value) {
		innerValue := strings.TrimSuffix(strings.TrimPrefix(value, "sqrt("), ")")
		number, err := parseNumber(innerValue)
		if err != nil {
			return 0, err
		}

		if number < 0 {
			return 0, ErrNegativeSquareRoot
		}

		result := math.Sqrt(number)
		if !isFinite(result) {
			return 0, ErrNonFiniteResult
		}

		return result, nil
	}

	return parseNumber(value)
}

func parseNumber(value string) (float64, error) {
	number, err := strconv.ParseFloat(value, 64)
	if err != nil {
		if errors.Is(err, strconv.ErrRange) {
			return 0, ErrNonFiniteResult
		}
		return 0, fmt.Errorf("%w: operand", ErrInvalidExpression)
	}

	if !isFinite(number) {
		return 0, ErrNonFiniteResult
	}

	return number, nil
}

func isDigit(value rune) bool {
	return value >= '0' && value <= '9'
}

func isOperator(value rune) bool {
	return value == '+' || value == '-' || value == '*' || value == '/' || value == '^' || value == '%'
}

func isSquareRootToken(value string) bool {
	return strings.HasPrefix(value, "sqrt(") && strings.HasSuffix(value, ")")
}

func isFinite(value float64) bool {
	return !math.IsInf(value, 0) && !math.IsNaN(value)
}
