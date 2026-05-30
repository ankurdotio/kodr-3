# Project Docs

This project runs behind a local Kubernetes ingress on `http://localhost`.

## Overview

The workspace is split into these runtime services:

- `auth` service for registration and login
- `sandbox` service for creating projects and starting sandbox environments
- `ai` service for streaming AI/code-agent responses
- `sandbox router` service for routing preview and agent traffic to the correct sandbox pod

## What Is Required

To run the project correctly, the services depend on these external systems and environment values:

- MongoDB for the auth service
- MongoDB for the sandbox service
- RabbitMQ for sharing new user data from auth to sandbox
- Redis for sandbox session tracking and router expiry
- Kubernetes cluster access for creating and deleting sandbox pods and services
- JWT secret for signing and verifying login tokens
- AI provider keys for the AI service
- AWS S3 credentials for the sync agent inside sandbox pods

Common environment values used by the services:

- `AUTH_DB_URL`
- `SANDBOX_DB_URL`
- `REDIS_URL`
- `MQ_URL`
- `JWT_SECRET`
- `MISTRAL_API_KEY`
- `GOOGLE_API_KEY`
- `CLAUDE_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`

## Base URLs

All examples below assume the ingress is reachable on `http://localhost`.

- Auth API: `http://localhost/api/auth`
- Sandbox API: `http://localhost/api/sandbox`
- AI API: `http://localhost/api/ai`
- Sandbox preview apps: `http://{sandboxId}.preview.localhost`
- Sandbox agent apps: `http://{sandboxId}.agent.localhost`

## Auth Service

### Health Check

`GET /_status/healthz`

Required:

- No request body

Returns:

```json
{
  "status": "ok"
}
```

### Readiness Check

`GET /_status/readyz`

Required:

- No request body

Returns:

```json
{
  "status": "ok"
}
```

### Register User

`POST /api/auth/register`

Required:

- JSON body with `name`, `email`, and `password`
- `name` must be a non-empty string
- `email` must be unique
- `password` is stored after hashing

Example request:

```json
{
  "name": "Ankur",
  "email": "ankur@example.com",
  "password": "secret123"
}
```

Returns:

- `201 Created` when the user is registered
- Sets an httpOnly `token` cookie
- Publishes the new user data to the RabbitMQ queue `AUTH_SANDBOX_REGISTER`

Success response:

```json
{
  "message": "User registered successfully"
}
```

Possible error responses:

- `400` with `{"message":"User already exists"}`
- `500` with `{"message":"Server error","error":"..."}`

### Login User

`POST /api/auth/login`

Required:

- JSON body with `email` and `password`

Example request:

```json
{
  "email": "ankur@example.com",
  "password": "secret123"
}
```

Returns:

- `200 OK` on successful login
- Sets an httpOnly `token` cookie

Success response:

```json
{
  "message": "Login successful",
  "user": {
    "id": "66f...",
    "name": "Ankur",
    "email": "ankur@example.com"
  }
}
```

Possible error responses:

- `400` with `{"message":"Invalid credentials"}`
- `500` with `{"message":"Server error","error":"..."}`

## Sandbox Service

All sandbox routes require authentication.

Authentication is accepted from either:

- `Authorization: Bearer <token>` header
- `token` cookie

### Root Check

`GET /`

Required:

- No body

Returns:

```text
Hello World!
```

### Health Check

`GET /_status/healthz`

Required:

- No request body

Returns:

```json
{
  "status": "ok"
}
```

### Readiness Check

`GET /_status/readyz`

Required:

- No request body

Returns:

```json
{
  "status": "ok"
}
```

### Create Project

`POST /api/sandbox/project`

Required:

- Auth token in header or cookie
- JSON body with `title`

Example request:

```json
{
  "title": "My Sandbox App"
}
```

Returns:

- `201 Created`
- A project document stored in MongoDB for the authenticated user

Success response:

```json
{
  "message": "Project created successfully",
  "project": {
    "_id": "66f...",
    "user": "66f...",
    "title": "My Sandbox App",
    "__v": 0
  }
}
```

### List Projects

`GET /api/sandbox/project`

Required:

- Auth token in header or cookie
- No request body

Returns:

- `200 OK`
- All projects belonging to the authenticated user

Success response:

```json
{
  "message": "Projects fetched successfully",
  "projects": [
    {
      "_id": "66f...",
      "user": "66f...",
      "title": "My Sandbox App",
      "__v": 0
    }
  ]
}
```

### Start Sandbox

`POST /api/sandbox/start`

Required:

- Auth token in header or cookie
- JSON body with `projectId`

Example request:

```json
{
  "projectId": "66f..."
}
```

Returns:

- `201 Created`
- Creates a Kubernetes pod and service for the sandbox
- Stores sandbox state in Redis for 20 minutes
- Returns a preview hostname for the new environment

Success response:

```json
{
  "message": "Sandbox environment created successfully",
  "sandboxId": "a1b2c3d4-...",
  "preview": "a1b2c3d4-....preview.localhost"
}
```

## AI Service

### Health Check

`GET /_status/healthz`

Required:

- No request body

Returns:

```text
Hello, World!
```

### Readiness Check

`GET /_status/readyz`

Required:

- No request body

Returns:

```text
Hello, World!
```

### Invoke AI Stream

`POST /api/ai/invoke`

Required:

- JSON body with `userInput`
- JSON body with `sandboxId`

Example request:

```json
{
  "userInput": "Create a landing page with a hero section",
  "sandboxId": "a1b2c3d4-..."
}
```

Returns:

- `200 OK`
- Server-Sent Events stream
- Each chunk is sent as `data: <json>`
- A final `data: {"type":"done"}` event is sent when the stream ends
- On failure, an `error` SSE event is returned

Stream example:

```text
data: {"type":"message","content":"..."}

data: {"type":"done"}
```

Error example:

```text
event: error
data: {"message":"..."}
```

## Sandbox Router

The router service is used for sandbox subdomains.

### Health Check

`GET /_status/healthz`

Returns:

```json
{
  "status": "ok"
}
```

### Readiness Check

`GET /_status/readyz`

Returns:

```json
{
  "status": "ok"
}
```

### Routing Behavior

- Requests to `*.preview.localhost` are proxied to the sandbox preview container on port `5173`
- Requests to `*.agent.localhost` are proxied to the agent container on port `3000`
- The router keeps sandbox activity alive by refreshing the Redis expiry for the sandbox key

## Response Summary

- Auth register returns a success message and sets a token cookie
- Auth login returns a success message, the user object, and sets a token cookie
- Sandbox project routes return created or fetched project documents
- Sandbox start returns the generated `sandboxId` and preview host name
- AI invoke returns an SSE stream, not a single JSON response
- Health and readiness endpoints return either `{"status":"ok"}` or `Hello, World!` depending on the service
