FAIL src/**tests**/api/auth/nextauth.test.ts ● NextAuth Configuration › Credentials Provider
Authorization › should authenticate valid admin user successfully

    expect(received).toEqual(expected) // deep equality

    Expected: {"email": "admin@example.com", "emailVerified": true, "firstName": "Test", "id": "ik7seiaqm7l", "lastName": "User s42f", "role": "ADMIN"}
    Received: null

      52 |
      53 |       // Assert
    > 54 |       expect(result).toEqual({
         |                      ^
      55 |         id: mockUser.id,
      56 |         email: mockUser.email,
      57 |         firstName: mockUser.firstName,

      at Object.toEqual (src/__tests__/api/auth/nextauth.test.ts:54:22)

● NextAuth Configuration › Credentials Provider Authorization › should reject user with missing
credentials

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "LOGIN_FAILURE", "message": "Login attempt with missing credentials", "severity": "MEDIUM"}

    Number of calls: 0

      87 |       // Assert
      88 |       expect(result).toBeNull();
    > 89 |       expect(mockLogger.securityLog).toHaveBeenCalledWith(
         |                                      ^
      90 |         expect.objectContaining({
      91 |           message: 'Login attempt with missing credentials',
      92 |           eventType: 'LOGIN_FAILURE',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:89:38)

● NextAuth Configuration › Credentials Provider Authorization › should reject user with invalid
credentials

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "LOGIN_FAILURE", "message": StringContaining "Authentication failed", "severity": "MEDIUM"}

    Number of calls: 0

      106 |       // Assert
      107 |       expect(result).toBeNull();
    > 108 |       expect(mockLogger.securityLog).toHaveBeenCalledWith(
          |                                      ^
      109 |         expect.objectContaining({
      110 |           message: expect.stringContaining('Authentication failed'),
      111 |           eventType: 'LOGIN_FAILURE',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:108:38)

● NextAuth Configuration › Credentials Provider Authorization › should reject non-admin user

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "UNAUTHORIZED_ACCESS", "message": StringContaining "Access denied - insufficient privileges", "severity": "HIGH"}

    Number of calls: 0

      130 |       // Assert
      131 |       expect(result).toBeNull();
    > 132 |       expect(mockLogger.securityLog).toHaveBeenCalledWith(
          |                                      ^
      133 |         expect.objectContaining({
      134 |           message: expect.stringContaining(
      135 |             'Access denied - insufficient privileges'

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:132:38)

● NextAuth Configuration › Credentials Provider Authorization › should handle authentication system
error

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "LOGIN_FAILURE", "message": StringContaining "Authentication system error", "severity": "HIGH"}

    Number of calls: 0

      152 |       // Assert
      153 |       expect(result).toBeNull();
    > 154 |       expect(mockLogger.securityLog).toHaveBeenCalledWith(
          |                                      ^
      155 |         expect.objectContaining({
      156 |           message: expect.stringContaining('Authentication system error'),
      157 |           eventType: 'LOGIN_FAILURE',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:154:38)

● NextAuth Configuration › Credentials Provider Authorization › should log IP address and user agent
from headers

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"ip": "203.0.113.1", "userAgent": "Mozilla/5.0 Test Browser"}

    Number of calls: 0

      189 |
      190 |       // Assert
    > 191 |       expect(mockLogger.securityLog).toHaveBeenCalledWith(
          |                                      ^
      192 |         expect.objectContaining({
      193 |           ip: '203.0.113.1',
      194 |           userAgent: 'Mozilla/5.0 Test Browser',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:191:38)
