# Blog Mobile Frontend (React Native / Expo)

This is a React Native (Expo) mobile frontend generated to match your Spring Boot Blog REST API.

## 1) Set the API base URL

By default it uses:

- Android emulator: `http://10.0.2.2:8080`

If you're running the backend on your PC and testing on a **physical phone** (same Wi‑Fi), set:

```bash
export EXPO_PUBLIC_API_BASE_URL="http://<YOUR_PC_LAN_IP>:8080"
```

On Windows PowerShell:

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://<YOUR_PC_LAN_IP>:8080"
```

(Example LAN IP: `192.168.1.50`)

## 2) Install + run

```bash
npm install
npm start
```

Then scan the QR code with Expo Go.

## What’s implemented

- Auth:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - Token stored in AsyncStorage and attached as `Authorization: Bearer <token>`

- Posts:
  - `GET /api/posts`
  - `GET /api/posts/{id}`

- Comments:
  - `GET /api/posts/{postId}/comments`
  - `POST /api/posts/{postId}/comments`

- Categories:
  - `GET /api/v1/categories`

## Notes

- Your backend seems to allow **GET /api/** publicly and restrict create/update/delete by role (`ADMIN`).
- If your `/api/v1/categories/{id}` mapping is missing the slash in your controller (it shows `{id}`), fix it to `"/{id}"` in Spring.
