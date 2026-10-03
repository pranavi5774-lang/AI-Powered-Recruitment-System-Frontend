# NexaHire Flask API Contract

The frontend uses `http://127.0.0.1:5000/api` by default. Override it in the browser with `localStorage.setItem('nexahire-api-base-url', 'http://127.0.0.1:5000/api')` before reloading.

For local development, allow CORS from `http://127.0.0.1:4173`. Authenticated requests send `Authorization: Bearer <access_token>`. Return JSON errors as `{ "message": "..." }` so the UI can show the backend message.

## Authentication

`POST /auth/login`

Request: `{ "email": "person@example.com", "password": "..." }`

Response: `{ "access_token": "...", "user": { "id": 1, "name": "Person Name", "email": "person@example.com", "role": "candidate" } }`

`POST /auth/register`

Request: `{ "name": "Person Name", "email": "person@example.com", "password": "...", "role": "Candidate" }`

Response with automatic sign-in: the same `access_token` and `user` shape as login. A successful response without a token returns the UI to sign-in.

Accepted role names include `hr_admin`, `admin`, `candidate`, and `employee`.

## Workspace Data

- `GET /dashboard/stats` returns `open_positions`, `applicants`, `interviews`, and `employee_count`; optional `hiring_activity` is an array of `{ "day": "Mon", "applications": 24, "interviews": 6 }` points for the recruitment chart.
- `GET /candidates` returns an array (or `{ "candidates": [...] }`) with `id`, `name`, `email`, `job_title`, `skills`, `match_score`, `status`, and `applied_at`.
- `GET /jobs` returns an array (or `{ "jobs": [...] }`) with `id`, `title`, `department`, `employment_type`, `location`, `applicant_count`, and `status`.
- `POST /jobs` accepts `title`, `department`, `location`, and `employment_type`.
- `POST /applications` accepts `job_id` and optional `resume_id`.
- `GET /applications/mine` returns the signed-in candidate's applications with `job_title`, `department`, `status`, `applied_at`, and optional `resume_filename`.
- `GET /employees` returns employee records with `name`, `department`, `job_title`, `attendance_status`, and optional leave details.
- `GET /employees/me` returns the signed-in employee's profile with `employee_id`, `name`, `email`, `department`, `job_title`, `manager_name`, `location`, and `start_date`.
- `GET /attendance/me` returns the signed-in employee's `attendance_status`, `leave_balance_days`, and `pending_requests`.
- `GET /leave-requests` returns leave request records; `POST /leave-requests` accepts `leave_type`, `start_date` (`YYYY-MM-DD`), `end_date`, and `reason`.
- `GET /notifications?after_id=<id>` returns new notifications with increasing `id` values and a `message` or `title`. The frontend polls every 5 seconds.

## Uploads

- `POST /resumes` accepts multipart form data with a `resume` field and returns `resume_id` (or `id`).
- `POST /verification/face` accepts multipart form data with an `image` field and returns `{ "verified": true, "message": "..." }`.

Face matching, password hashing, JWT issuance, and role authorization must be implemented and enforced by Flask. The frontend demo fallback is not production authentication.