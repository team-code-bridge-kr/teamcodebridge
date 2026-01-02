---
description: Deployment and Local Development Workflow
---

# Deployment and Local Development Workflow

This workflow outlines the strict procedures for running the application locally and deploying it to the production server.

## 1. Local Development (Testing)

**CRITICAL:** Always test changes locally before deploying.

- **Method:** Use `npm run dev` for quick local testing.
  - **Command:** `npm run dev`
  - **Note:** If ports 3000 or 3001 are in use, Next.js will automatically try the next available port (e.g., 3002). Check the terminal output for the correct URL (e.g., `http://localhost:3002`).
  - **Docker (Optional but Recommended for Full Parity):** If `npm` is insufficient or environment parity is critical, use Docker.
    - **Command:** `docker-compose up -d --build`
    - **Prerequisite:** Ensure Docker Desktop is running.

## 2. Production Deployment (Server)

**CRITICAL:** The production environment **MUST** run using **Docker and Docker Compose**. Never run `npm start` directly on the server.

- **Server IP:** `175.123.252.36`
- **User:** `root`
- **Project Directory:** `/root/teamcodebridge`

### Deployment Steps:

1.  **Transfer Files:** Copy modified files from local to server.
    - Use `scp` for individual files or directories.
    - Example: `scp -r ./local/path root@175.123.252.36:/root/teamcodebridge/remote/path`

2.  **Rebuild and Restart Containers:**
    - Connect to the server: `ssh root@175.123.252.36`
    - Navigate to directory: `cd /root/teamcodebridge`
    - **Execute Deployment Command:**
      ```bash
      docker-compose down --rmi all && docker system prune -f && docker-compose up -d --build
      ```
      - `docker-compose down --rmi all`: Stops containers and removes images to ensure a fresh build.
      - `docker system prune -f`: Cleans up unused data.
      - `docker-compose up -d --build`: Rebuilds images and starts containers in detached mode.

3.  **Verification:**
    - Check logs: `docker logs teamcodebridge-web`
    - Verify status: `docker ps`
    - Test endpoints: `curl -I http://localhost:3001/workspace` (or relevant path)

## 3. Key Configuration Files

- **`Dockerfile`**: Defines the multi-stage build process (deps -> builder -> runner).
  - **Must include:** `RUN npx prisma generate` (in builder stage) and `RUN npm install sharp` (in runner stage).
- **`docker-compose.yml`**: Orchestrates the service.
  - **Port Mapping:** `3001:3000` (Host:Container).
  - **Env File:** Loads `.env`.
- **`next.config.js`**:
  - **Must include:** `output: 'standalone'` for Docker optimization.
  - **Must include:** CORS headers for `api.teamcodebridge.dev`.
- **`middleware.ts`**: Handles authentication and redirects.
  - **Must include:** Logic to redirect unauthenticated users to `/workspace/login`.

## 4. Troubleshooting

- **"sharp" missing:** Ensure `RUN npm install sharp` is in the `runner` stage of `Dockerfile`.
- **Prisma Client error:** Ensure `RUN npx prisma generate` is in the `builder` stage of `Dockerfile`.
- **404 on API:** Check `next.config.js` CORS settings and Nginx proxy configuration.
- **Permission Denied:** Check file permissions on the server or Docker user settings.
