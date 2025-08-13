FAIL src/**tests**/api/admin/portfolio/admin-portfolio-id.test.ts ● Console

    console.log
      Update request body: {
        "title": "Updated Title",
        "description": "Updated description",
        "status": "PUBLISHED",
        "featured": true,
        "tags": "[\"updated\",\"published\"]",
        "metadata": "{\"camera\":\"Sony A7R5\"}"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "title": "",
        "status": "INVALID_STATUS"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "status": "DRAFT"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "status": "REVIEW"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "status": "PUBLISHED"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "status": "ARCHIVED"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "featured": true
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "title": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "description": "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "title": "Updated Title"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "description": null,
        "categoryId": null,
        "thumbnailPath": null
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "title": "New Title"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

    console.log
      Update request body: {
        "title": "Test Title"
      }

      at log (src/app/api/admin/portfolio/[id]/route.ts:179:13)

● /api/admin/portfolio/[id] › PUT /api/admin/portfolio/[id] › should update portfolio item
successfully

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -18,10 +18,10 @@
            "updated",
            "published",
          ],
          "thumbnailPath": null,
          "title": "Updated Title",
    -     "updatedAt": 2025-08-13T13:29:36.965Z,
    +     "updatedAt": "2025-08-13T13:29:36.965Z",
          "viewCount": 0,
        },
        "success": true,
      }

      200 |       // Assert
      201 |       expect(response.status).toBe(200);
    > 202 |       expect(responseData).toEqual({
          |                            ^
      203 |         success: true,
      204 |         data: {
      205 |           ...updatedItem,

      at Object.toEqual (src/__tests__/api/admin/portfolio/admin-portfolio-id.test.ts:202:28)

FAIL src/**tests**/api/auth/nextauth.test.ts ● NextAuth Configuration › Credentials Provider
Authorization › should authenticate valid admin user successfully

    expect(received).toEqual(expected) // deep equality

    Expected: {"email": "admin@example.com", "emailVerified": true, "firstName": undefined, "id": "zlgfci71qfg", "lastName": undefined, "role": "ADMIN"}
    Received: null

      70 |
      71 |       // Assert
    > 72 |       expect(result).toEqual({
         |                      ^
      73 |         id: mockUser.id,
      74 |         email: mockUser.email,
      75 |         firstName: mockUser.firstName,

      at Object.toEqual (src/__tests__/api/auth/nextauth.test.ts:72:22)

● NextAuth Configuration › Credentials Provider Authorization › should reject user with missing
credentials

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "LOGIN_FAILURE", "message": "Login attempt with missing credentials", "severity": "MEDIUM"}

    Number of calls: 0

      102 |       // Assert
      103 |       expect(result).toBeNull();
    > 104 |       expect(Logger.securityLog).toHaveBeenCalledWith(
          |                                  ^
      105 |         expect.objectContaining({
      106 |           message: 'Login attempt with missing credentials',
      107 |           eventType: 'LOGIN_FAILURE',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:104:34)

● NextAuth Configuration › Credentials Provider Authorization › should reject user with invalid
credentials

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "LOGIN_FAILURE", "message": StringContaining "Authentication failed", "severity": "MEDIUM"}

    Number of calls: 0

      121 |       // Assert
      122 |       expect(result).toBeNull();
    > 123 |       expect(Logger.securityLog).toHaveBeenCalledWith(
          |                                  ^
      124 |         expect.objectContaining({
      125 |           message: expect.stringContaining('Authentication failed'),
      126 |           eventType: 'LOGIN_FAILURE',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:123:34)

● NextAuth Configuration › Credentials Provider Authorization › should reject non-admin user

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "UNAUTHORIZED_ACCESS", "message": StringContaining "Access denied - insufficient privileges", "severity": "HIGH"}

    Number of calls: 0

      145 |       // Assert
      146 |       expect(result).toBeNull();
    > 147 |       expect(Logger.securityLog).toHaveBeenCalledWith(
          |                                  ^
      148 |         expect.objectContaining({
      149 |           message: expect.stringContaining('Access denied - insufficient privileges'),
      150 |           eventType: 'UNAUTHORIZED_ACCESS',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:147:34)

● NextAuth Configuration › Credentials Provider Authorization › should handle authentication system
error

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"eventType": "LOGIN_FAILURE", "message": StringContaining "Authentication system error", "severity": "HIGH"}

    Number of calls: 0

      165 |       // Assert
      166 |       expect(result).toBeNull();
    > 167 |       expect(Logger.securityLog).toHaveBeenCalledWith(
          |                                  ^
      168 |         expect.objectContaining({
      169 |           message: expect.stringContaining('Authentication system error'),
      170 |           eventType: 'LOGIN_FAILURE',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:167:34)

● NextAuth Configuration › Credentials Provider Authorization › should log IP address and user agent
from headers

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"ip": "203.0.113.1", "userAgent": "Mozilla/5.0 Test Browser"}

    Number of calls: 0

      202 |
      203 |       // Assert
    > 204 |       expect(Logger.securityLog).toHaveBeenCalledWith(
          |                                  ^
      205 |         expect.objectContaining({
      206 |           ip: '203.0.113.1',
      207 |           userAgent: 'Mozilla/5.0 Test Browser',

      at Object.toHaveBeenCalledWith (src/__tests__/api/auth/nextauth.test.ts:204:34)

PASS src/**tests**/api/portfolio/portfolio-id.test.ts PASS
src/**tests**/api/admin/portfolio/admin-portfolio.test.ts PASS
src/app/api/portfolio/**tests**/portfolio.test.ts ● Console

    console.log
      Received request body: {
        "title": "New Portfolio Item",
        "description": "Test description",
        "mediaType": "IMAGE",
        "filePath": "/uploads/test-image.jpg",
        "categoryId": "category-1",
        "status": "DRAFT",
        "featured": false,
        "tags": [
          "test",
          "portfolio"
        ],
        "metadata": {
          "camera": "Canon EOS R5"
        },
        "sortOrder": 0
      }

      at log (src/app/api/portfolio/route.ts:257:13)

    console.log
      Validation result: {
        success: true,
        error: undefined,
        errorType: undefined,
        issues: undefined,
        errors: undefined
      }

      at log (src/app/api/portfolio/route.ts:262:15)

    console.log
      Received request body: {
        "title": "",
        "mediaType": "IMAGE",
        "filePath": "/test.jpg"
      }

      at log (src/app/api/portfolio/route.ts:257:13)

    console.log
      Validation result: {
        success: false,
        error: ZodError: [
          {
            "origin": "string",
            "code": "too_small",
            "minimum": 1,
            "inclusive": true,
            "path": [
              "title"
            ],
            "message": "Too small: expected string to have >=1 characters"
          }
        ]
            at new ZodError (/home/marax/kili/PortfolioWebapp/node_modules/zod/v4/core/core.cjs:35:39)
            at Object.safeParse (/home/marax/kili/PortfolioWebapp/node_modules/zod/v4/core/parse.cjs:68:20)
            at _.inst.safeParse (/home/marax/kili/PortfolioWebapp/node_modules/zod/v4/classic/schemas.cjs:139:46)
            at safeParse (/home/marax/kili/PortfolioWebapp/src/app/api/portfolio/route.ts:261:54)
            at Object.<anonymous> (/home/marax/kili/PortfolioWebapp/src/app/api/portfolio/__tests__/portfolio.test.ts:344:24),
        errorType: 'ZodError',
        issues: [
          {
            origin: 'string',
            code: 'too_small',
            minimum: 1,
            inclusive: true,
            path: [Array],
            message: 'Too small: expected string to have >=1 characters'
          }
        ],
        errors: [
          {
            origin: 'string',
            code: 'too_small',
            minimum: 1,
            inclusive: true,
            path: [Array],
            message: 'Too small: expected string to have >=1 characters'
          }
        ]
      }

      at log (src/app/api/portfolio/route.ts:262:15)

    console.log
      Validation failed: {
        errors: [
          {
            origin: 'string',
            code: 'too_small',
            minimum: 1,
            inclusive: true,
            path: [Array],
            message: 'Too small: expected string to have >=1 characters'
          }
        ],
        body: { title: '', mediaType: 'IMAGE', filePath: '/test.jpg' }
      }

      at log (src/app/api/portfolio/route.ts:283:15)

    console.log
      Received request body: {
        "title": "Test Item",
        "mediaType": "IMAGE",
        "filePath": "/test.jpg"
      }

      at log (src/app/api/portfolio/route.ts:257:13)

    console.log
      Validation result: {
        success: true,
        error: undefined,
        errorType: undefined,
        issues: undefined,
        errors: undefined
      }

      at log (src/app/api/portfolio/route.ts:262:15)

PASS src/**tests**/api/debug/debug.test.ts PASS src/**tests**/utils/mock-factories.ts PASS
src/**tests**/setup/mock-setup.ts PASS src/**tests**/utils/test-utils.ts PASS
src/**tests**/setup/setup.ts

Test Suites: 2 failed, 8 passed, 10 total Tests: 7 failed, 92 passed, 99 total Snapshots: 0 total
Time: 2.263 s, estimated 3 s Ran all test suites. 🧹 Starting global test teardown... 🛑 Stopping
test database container...
