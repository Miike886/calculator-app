# calculator-app
Full-stack calculator with React and Go.

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
