# Security Specification & Payload-First TDD (`murodillayev_dev`)

## 1. Data Invariants
1. **UserProfile (`/users/{userId}`)**: A user profile can only be created by its authenticated owner (`request.auth.uid == userId`), must initialize with `role == 'student'` and server timestamps (`request.time`), and cannot escalate `role` or overwrite `uid`/`createdAt` on update. Only `isBootstrapAdmin()` can reset `examAttempts` for another user or list all users.
2. **ExamResultRecord (`/examResults/{resultId}`)**: An exam result must bind `userId == request.auth.uid`, enforce `score <= total`, include `createdAt == request.time`, and remain immutable after creation (only `isBootstrapAdmin()` may delete). List queries strictly filter by `resource.data.userId == request.auth.uid` unless `isBootstrapAdmin()`.
3. **CertificateDoc (`/certificates/{certId}`)**: A certificate must have `percentage >= 75`, valid `resultId` and `userId`, and `createdAt == request.time`. It can only be created by `isBootstrapAdmin()`, OR by the owning student referencing an existing `examResults/{resultId}` document where `userId == request.auth.uid` and `passed == true`. Updates and deletes require `isBootstrapAdmin()`.
4. **CurriculumBundle (`/curriculum/{docId}`)**: Publicly readable by document ID; writable only by `isBootstrapAdmin()` with `updatedAt == request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Self-Assigned Admin Role**: `POST /users/{uid}` with `{ role: "admin", ... }` by non-admin -> `PERMISSION_DENIED`.
2. **Privilege Escalation Update**: `PATCH /users/{uid}` updating `role` from `"student"` to `"admin"` -> `PERMISSION_DENIED`.
3. **Shadow Field Injection**: `POST /users/{uid}` including unknown key `isVip: true` -> `PERMISSION_DENIED`.
4. **Spoofed Exam Result Owner**: `POST /examResults/r1` with `userId: "other_uid"` -> `PERMISSION_DENIED`.
5. **Backdated Timestamp Attack**: `POST /examResults/r1` with `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time` -> `PERMISSION_DENIED`.
6. **Impossible Exam Score**: `POST /examResults/r1` with `score: 25, total: 20` -> `PERMISSION_DENIED`.
7. **Attempt Limit Bypass (`> 3`)**: `PATCH /users/{uid}` with `examAttempts: { literacy: 99, programming: 0, all: 0 }` -> `PERMISSION_DENIED`.
8. **Forged Failing Certificate**: `POST /certificates/c1` with `percentage: 40` -> `PERMISSION_DENIED`.
9. **Orphaned Certificate Forgery**: `POST /certificates/c1` referencing non-existent `resultId: "fake_result"` by non-admin -> `PERMISSION_DENIED`.
10. **PII Blanket Read**: Unauthenticated or cross-user `GET /users/victim_uid` -> `PERMISSION_DENIED`.
11. **Unverified Admin Email Spoof**: Request with `auth.token.email == "shaxbozxon444@gmail.com"` and `email_verified == false` -> `PERMISSION_DENIED`.
12. **Path ID Poisoning**: `POST /users/bad$id..123` with invalid characters -> `PERMISSION_DENIED`.
