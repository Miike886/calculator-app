package main

import (
	"log"
	"net/http"

	"calculator-app/backend/internal/config"
	"calculator-app/backend/internal/transport"
)

func main() {
	cfg := config.Load()
	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: transport.NewRouter(),
	}

	log.Printf("calculator API listening on :%s", cfg.Port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}
