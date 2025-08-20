FAIL src/**tests**/api/portfolio/portfolio-id.test.ts ● /api/portfolio/[id] › GET
/api/portfolio/[id] › should return portfolio item with related items successfully

    expect(received).toEqual(expected) // deep equality

    - Expected  - 12
    + Received  + 12

    @@ -1,81 +1,81 @@
      Object {
        "data": Object {
          "item": Object {
            "categoryId": "category-123",
    -       "createdAt": 2025-08-20T09:46:07.157Z,
    +       "createdAt": "2025-08-20T09:46:07.157Z",
            "description": "Test portfolio item description",
            "featured": false,
            "filePath": "/uploads/test-9g1jj6ys.jpg",
            "id": "portfolio-id-123",
            "mediaType": "IMAGE",
            "metadata": "{\"camera\":\"Test Camera\"}",
    -       "publishedAt": 2025-08-20T09:46:07.157Z,
    +       "publishedAt": "2025-08-20T09:46:07.157Z",
            "sortOrder": 0,
            "status": "PUBLISHED",
            "tags": "[\"test\",\"portfolio\"]",
            "thumbnailPath": null,
            "title": "Test Portfolio Item",
    -       "updatedAt": 2025-08-20T09:46:07.157Z,
    +       "updatedAt": "2025-08-20T09:46:07.157Z",
            "userId": null,
            "viewCount": 0,
          },
          "relatedItems": Array [
            Object {
              "categoryId": "category-123",
    -         "createdAt": 2025-08-20T09:46:07.162Z,
    +         "createdAt": "2025-08-20T09:46:07.162Z",
              "description": "Test portfolio item description",
              "featured": false,
              "filePath": "/uploads/test-wj7mn4a4.jpg",
              "id": "nt68chiy5uo",
              "mediaType": "IMAGE",
              "metadata": "{\"camera\":\"Test Camera\"}",
    -         "publishedAt": 2025-08-20T09:46:07.162Z,
    +         "publishedAt": "2025-08-20T09:46:07.162Z",
              "sortOrder": 0,
              "status": "PUBLISHED",
              "tags": "[\"test\",\"portfolio\"]",
              "thumbnailPath": null,
              "title": "Test Portfolio Item fr3p",
    -         "updatedAt": 2025-08-20T09:46:07.162Z,
    +         "updatedAt": "2025-08-20T09:46:07.162Z",
              "userId": null,
              "viewCount": 0,
            },
            Object {
              "categoryId": "category-123",
    -         "createdAt": 2025-08-20T09:46:07.162Z,
    +         "createdAt": "2025-08-20T09:46:07.162Z",
              "description": "Test portfolio item description",
              "featured": false,
              "filePath": "/uploads/test-i10abs1m.jpg",
              "id": "7m4u92a0op",
              "mediaType": "IMAGE",
              "metadata": "{\"camera\":\"Test Camera\"}",
    -         "publishedAt": 2025-08-20T09:46:07.162Z,
    +         "publishedAt": "2025-08-20T09:46:07.162Z",
              "sortOrder": 1,
              "status": "PUBLISHED",
              "tags": "[\"test\",\"portfolio\"]",
              "thumbnailPath": null,
              "title": "Test Portfolio Item y60p",
    -         "updatedAt": 2025-08-20T09:46:07.162Z,
    +         "updatedAt": "2025-08-20T09:46:07.162Z",
              "userId": null,
              "viewCount": 0,
            },
            Object {
              "categoryId": "category-123",
    -         "createdAt": 2025-08-20T09:46:07.162Z,
    +         "createdAt": "2025-08-20T09:46:07.162Z",
              "description": "Test portfolio item description",
              "featured": false,
              "filePath": "/uploads/test-xbogndab.jpg",
              "id": "ure8nb7k42f",
              "mediaType": "IMAGE",
              "metadata": "{\"camera\":\"Test Camera\"}",
    -         "publishedAt": 2025-08-20T09:46:07.162Z,
    +         "publishedAt": "2025-08-20T09:46:07.162Z",
              "sortOrder": 2,
              "status": "PUBLISHED",
              "tags": "[\"test\",\"portfolio\"]",
              "thumbnailPath": null,
              "title": "Test Portfolio Item 0a4g",
    -         "updatedAt": 2025-08-20T09:46:07.162Z,
    +         "updatedAt": "2025-08-20T09:46:07.162Z",
              "userId": null,
              "viewCount": 0,
            },
          ],
        },

      54 |       // Assert
      55 |       expect(response.status).toBe(200);
    > 56 |       expect(responseData).toEqual({
         |                            ^
      57 |         success: true,
      58 |         data: {
      59 |           item: mockPortfolioItem,

      at Object.toEqual (src/__tests__/api/portfolio/portfolio-id.test.ts:56:28)

● /api/portfolio/[id] › GET /api/portfolio/[id] › should return portfolio item without related items
when no category

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Object {
        "item": Object {
          "categoryId": null,
    -     "createdAt": 2025-08-20T09:46:07.181Z,
    +     "createdAt": "2025-08-20T09:46:07.181Z",
          "description": "Test portfolio item description",
          "featured": false,
          "filePath": "/uploads/test-0k8q9ooq.jpg",
          "id": "portfolio-id-123",
          "mediaType": "IMAGE",
          "metadata": "{\"camera\":\"Test Camera\"}",
    -     "publishedAt": 2025-08-20T09:46:07.181Z,
    +     "publishedAt": "2025-08-20T09:46:07.181Z",
          "sortOrder": 0,
          "status": "PUBLISHED",
          "tags": "[\"test\",\"portfolio\"]",
          "thumbnailPath": null,
          "title": "Test Portfolio Item txs3",
    -     "updatedAt": 2025-08-20T09:46:07.181Z,
    +     "updatedAt": "2025-08-20T09:46:07.181Z",
          "userId": null,
          "viewCount": 0,
        },
        "relatedItems": Array [],
      }

       98 |       // Assert
       99 |       expect(response.status).toBe(200);
    > 100 |       expect(responseData.data).toEqual({
          |                                 ^
      101 |         item: mockItemWithoutCategory,
      102 |         relatedItems: [],
      103 |       });

      at Object.toEqual (src/__tests__/api/portfolio/portfolio-id.test.ts:100:33)
