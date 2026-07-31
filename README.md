# calculator-app
Full-stack calculator with React and Go.

## API

The backend exposes:

- `GET /health`
- `POST /api/v1/calculations`

Example:

```bash
curl -X POST http://localhost:8080/api/v1/calculations \
  -H "Content-Type: application/json" \
  -d "{\"expression\":\"200%10\"}"
```

Successful response:

```json
{
  "expression": "200%10",
  "result": 20
}
```

Supported expressions use `+`, `-`, `*`, `/`, `^`, `%` and `sqrt(value)`. Mixed binary operators are evaluated left to right without mathematical precedence.

## Validation

Backend:

```bash
cd backend
go test ./...
```

Frontend unit/component tests:

```bash
cd frontend
npm test
```

End-to-end tests:

```bash
cd frontend
npm run e2e
```

Production build:

```bash
cd frontend
npm run build
```

See `docs/testing.md` for the current test strategy and coverage by layer.
