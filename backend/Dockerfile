FROM golang:1.23-alpine AS build
WORKDIR /app
COPY go.mod ./
COPY . .
RUN go test ./...
RUN go build -o /calculator-api ./cmd/api

FROM alpine:3.21
WORKDIR /app
COPY --from=build /calculator-api /app/calculator-api
ENV PORT=8080
EXPOSE 8080
CMD ["/app/calculator-api"]
