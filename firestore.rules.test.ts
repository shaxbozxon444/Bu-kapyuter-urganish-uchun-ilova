/**
 * Payload-First Security TDD specification for murodillayev_dev Firestore rules.
 * Mirrors the 12 adversarial payloads defined in security_spec.md.
 */

export interface DirtyPayloadCase {
  name: string;
  collection: 'users' | 'examResults' | 'certificates' | 'curriculum';
  operation: 'get' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_CASES: DirtyPayloadCase[] = [
  {
    name: '1. Self-assigned admin role on user registration',
    collection: 'users',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { role: 'admin', uid: 'user_1', displayName: 'Attacker' },
  },
  {
    name: '2. Role escalation via user profile update',
    collection: 'users',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { role: 'admin' },
  },
  {
    name: '3. Shadow ghost field injection on user document',
    collection: 'users',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { role: 'student', isVerifiedOverride: true },
  },
  {
    name: '4. Spoofed userId on examResult create',
    collection: 'examResults',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { userId: 'victim_uid', score: 20, total: 20 },
  },
  {
    name: '5. Client-forged timestamp instead of server request.time',
    collection: 'examResults',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
  },
  {
    name: '6. Impossible score exceeding total on examResult',
    collection: 'examResults',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { score: 25, total: 20 },
  },
  {
    name: '7. Exam attempts exceeding maximum boundary of 3 or negative cooldown lock',
    collection: 'users',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { examAttempts: { literacy: 99, programming: 0, all: 0 }, examLockedUntil: { literacy: -1, programming: 0, all: 0 } },
  },
  {
    name: '8. Certificate creation below 75% passing threshold',
    collection: 'certificates',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { percentage: 40, score: 8, total: 20 },
  },
  {
    name: '9. Orphaned certificate referencing non-existent examResult',
    collection: 'certificates',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { resultId: 'non_existent_id', percentage: 95 },
  },
  {
    name: '10. Cross-user PII read on /users/{otherUid}',
    collection: 'users',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '11. Admin email claim with email_verified=false',
    collection: 'curriculum',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '12. Invalid path variable ID containing forbidden characters',
    collection: 'users',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
];
