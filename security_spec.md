# Security Specification - ProctorAI

## Data Invariants
1. A User profile can only be created by the authenticated user with exactly 300 coins.
2. A User's coin balance can only be decremented by exactly 50 during interview initiation.
3. Users cannot increase their own coin balance.
4. Interviews can only be created by the owner and are immutable after creation.
5. Users can only read their own profile and their own interviews.

## The Dirty Dozen Payloads
1. **The "Free Money" Attack**: Update user coins from 50 to 1,000,000.
2. **The "Identity Spoof" Attack**: Create a user profile for a different UID.
3. **The "Interviewer Spy" Attack**: Read another user's interview report.
4. **The "History Deleter" Attack**: Delete an interview session to hide a fail.
5. **The "Ghost Field" Attack**: Add `isAdmin: true` to a user profile.
6. **The "Negative Balance" Attack**: Deduct coins when the balance is 0.
7. **The "Timestamp Forge" Attack**: Set `createdAt` to a date in 2020.
8. **The "Bulk Access" Attack**: Query all interviews in the system without a UID filter.
9. **The "Partial Deduction" Attack**: Deduct 1 coin instead of 50.
10. **The "Orphaned Interview" Attack**: Create an interview for a non-existent user.
11. **The "Cross-User Write" Attack**: Update another user's coins.
12. **The "Schema Bypass" Attack**: Send `coins: "lots"` as a string.

## Test Runner (Logic Check)
All payloads above must return `PERMISSION_DENIED`.
