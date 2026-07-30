package transport

import "net/http"

func NewRouter() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", HealthHandler)
	mux.HandleFunc("POST /api/v1/calculations", CalculationsHandler)
	return WithCORS(mux)
}
