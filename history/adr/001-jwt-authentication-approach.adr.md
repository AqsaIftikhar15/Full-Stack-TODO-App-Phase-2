# ADR-001: JWT Authentication Approach for Backend API

## Status
Proposed

## Context
The backend API needs to authenticate requests from the frontend using JWT tokens. The frontend uses Better Auth to generate JWT tokens, and the backend must verify these tokens to ensure proper user isolation and security.

## Decision
We will implement a JWT verification-only approach where:
1. The backend only verifies tokens issued by Better Auth on the frontend
2. Backend does not generate new tokens
3. Verification uses the shared BETTER_AUTH_SECRET
4. All API endpoints require valid JWT tokens in the Authorization header
5. User isolation is enforced by validating that the user_id in the URL path matches the authenticated user from the token

## Alternatives Considered
1. **Full JWT implementation** - Backend both verifies and issues tokens: More complex, introduces potential inconsistencies between frontend and backend token formats
2. **Custom session-based authentication** - Would require significant changes to frontend and break integration requirements
3. **API key authentication** - Doesn't leverage existing Better Auth setup and creates additional complexity

## Consequences
### Positive
- Maintains single source of truth for authentication with frontend
- Reduces complexity by not managing token lifecycle on backend
- Ensures compatibility with existing frontend authentication system
- Simplifies security model with clear separation of concerns

### Negative
- Creates dependency on frontend auth system
- Limited backend control over authentication process
- Potential for token mismatch if frontend and backend secrets are not synchronized

## Technical Details
- Token verification using PyJWT with HS256 algorithm
- Shared BETTER_AUTH_SECRET for signature verification
- User ID extraction from token payload for isolation enforcement
- Standardized error responses for invalid tokens (HTTP 401)

## Implementation Notes
- Create JWT utility functions for token verification
- Implement security dependency for FastAPI
- Add middleware for user isolation validation
- Ensure proper error handling for all authentication scenarios