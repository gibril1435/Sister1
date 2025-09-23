# Perkuliahan CRUD Web (Node.js + Express)

A simple web app to manage `Perkuliahan` database tables: `Mhs`, `MataKuliah`, `Dosen`, and `Kuliah` with create, read, update, delete operations.

## Prerequisites
- Node.js 18+
- MySQL running, and the `Perkuliahan` DB created (run `../perkuliahan.sql`).

## Setup
```bash
cd "$(dirname "$0")"
cp -n .env.example .env 2>/dev/null || true
npm install
```
Edit `.env` if needed (credentials, port).

## Run
```bash
npm start
```
Open http://localhost:3000

## API Endpoints
- GET/POST `/api/mhs`, PUT/DELETE `/api/mhs/:nim`
- GET/POST `/api/mk`, PUT/DELETE `/api/mk/:kode`
- GET/POST `/api/dosen`, PUT/DELETE `/api/dosen/:nip`
- GET/POST `/api/kuliah`, PUT `/api/kuliah/:nim/:nip/:kode`, DELETE same

## Notes
- Deleting a master record removes dependent `Kuliah` rows first to respect FK constraints.
- Frontend is served from `public/`. 