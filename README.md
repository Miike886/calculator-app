# Calculator App

Full-stack calculator built with React, TypeScript and Go. The frontend behaves like a visual calculator and calls a REST backend to evaluate arithmetic expressions.

## Stack

- Frontend: React 19, TypeScript, Vite.
- Backend: Go, standard `net/http`.
- API: REST over HTTP with JSON responses.
- Tests: Go tests, Vitest + React Testing Library, Playwright E2E.
- Deployment: Dockerfiles for both apps and `docker-compose.yml`.

## Repository Structure

```text
calculator-app/
  backend/        Go API service
  frontend/       React + Vite app
  docs/           Specification, architecture, UI, testing and prompts
  docker-compose.yml
```

The backend keeps HTTP transport in `backend/internal/transport` and calculation logic in `backend/internal/calculation`. Frontend calculator state and normalization helpers live in `frontend/src/calculator.ts`; the API client lives in `frontend/src/api/calculations.ts`.

## Prerequisites

- Go 1.23 or compatible.
- Node.js 22 or compatible.
- npm.
- Docker Desktop, only if running with Docker Compose.

## Environment Variables

Backend:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8080` | HTTP port used by the Go API. |

Frontend:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend base URL consumed by the browser. |

Examples are available in `backend/.env.example` and `frontend/.env.example`.

## Run Locally

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
PORT=8080 go run ./cmd/api
```

On PowerShell:

```powershell
cd backend
$env:PORT = "8080"
go run ./cmd/api
```

Start the frontend in another terminal:

```bash
cd frontend
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

On PowerShell:

```powershell
cd frontend
$env:VITE_API_BASE_URL = "http://localhost:8080"
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Run With Docker Compose

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:18080/health`

The backend container listens on `8080` internally and is exposed on host port `18080` to avoid collisions with local development servers. The frontend image is built with `VITE_API_BASE_URL=http://localhost:18080`, so browser requests go to the backend port exposed by Compose.

Stop the stack:

```bash
docker compose down
```

## API

### `GET /health`

```bash
curl http://localhost:8080/health
```

Response:

```json
{
  "status": "ok"
}
```

### `POST /api/v1/calculations`

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

Error response:

```json
{
  "error": {
    "code": "DIVISION_BY_ZERO",
    "message": "No se puede dividir entre cero.",
    "details": {
      "expression": "5/0"
    }
  }
}
```

Supported API expressions:

| Operation | API format | Notes |
| --- | --- | --- |
| Addition | `2+3` | Supports multiple operands. |
| Subtraction | `20-5-3` | Evaluated left to right. |
| Multiplication | `2*3*4` | Evaluated left to right. |
| Division | `100/2/5` | Division by zero returns an error. |
| Power | `2^3` | Evaluated before multiplication, division, percentage, addition and subtraction. |
| Square root | `sqrt(81)` | Negative values return an error. |
| Percentage | `200%10` | Calculates `value * rate / 100` with multiplication/division precedence. |

Mixed expressions respect operator precedence: square root, power, multiplication/division/percentage, then addition/subtraction. Operators with the same priority are evaluated left to right, including power.

Common error codes:

- `INVALID_JSON`
- `EMPTY_EXPRESSION`
- `EXPRESSION_TOO_LONG`
- `INVALID_CHARACTER`
- `INCOMPLETE_EXPRESSION`
- `UNSUPPORTED_OPERATION`
- `DIVISION_BY_ZERO`
- `NEGATIVE_SQUARE_ROOT`
- `NON_FINITE_RESULT`

## Tests And Validation

Backend unit, handler and contract tests:

```bash
cd backend
go test ./...
```

Backend coverage:

```bash
cd backend
go test -coverpkg=calculator-app/backend/internal/calculation,calculator-app/backend/internal/transport ./internal/calculation/tests ./internal/transport/tests
```

Frontend unit and component tests:

```bash
cd frontend
npm test
```

Frontend type check and production build:

```bash
cd frontend
npm run build
```

E2E tests:

```bash
cd frontend
npm run e2e
```

Playwright starts the backend and frontend automatically. If Go is not available as `go` in your `PATH`, set `GO_BINARY`:

```powershell
cd frontend
$env:GO_BINARY = "C:\Program Files\Go\bin\go.exe"
npm run e2e
```

Optional E2E ports:

```bash
E2E_BACKEND_PORT=18081 E2E_FRONTEND_PORT=5174 npm run e2e
```

Frontend coverage is not configured yet because the current assessment only requires unit tests and a coverage report can be generated for the Go backend with the command above.

## Design Decisions

- Monorepo keeps frontend, backend, Docker and documentation versioned together.
- The backend is a single stateless microservice; no persistence, authentication or history is included.
- One calculation endpoint keeps the API small and sufficient for this scope.
- The backend is authoritative for calculation validation and edge cases.
- The frontend performs lightweight validation for better UX, then normalizes visual symbols before calling the API.
- Expressions respect calculator precedence while preserving left-to-right evaluation for operators with the same priority.
- Tests are separated by layer: domain logic, HTTP handlers, React behavior and full E2E flows.

## Known Limitations

- No calculation history or persistence.
- No authentication or user accounts.
- No parentheses, variables or additional mathematical functions.
- Expression length is limited to 24 characters in the current visual UI.
- Frontend coverage tooling is not configured.

## AI Usage

AI tooling was used to help define specifications, implement features, review tests and prepare documentation. The prompts used during the work are recorded in `docs/prompt-usados.md`.

## More Documentation

- `docs/specification.md`
- `docs/architecture.md`
- `docs/ui-specification.md`
- `docs/testing.md`
- `docs/features/`
