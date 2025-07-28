14:49:49.481 info  Portfolio items fetch request Portfolio items fetch request {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "api",
    "requestId": "c867c962-339a-4e7e-a245-c83ffb2a2a51",
    "method": "GET",
    "url": "http://localhost:3000/api/portfolio?orderBy=createdAt&orderDirection=desc&category=nature&page=1",
    "ip": "unknown",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
    "statusCode": 0,
    "responseTime": 0,
    "metadata": {
      "searchParams": {
        "orderBy": "createdAt",
        "orderDirection": "desc",
        "category": "nature",
        "page": "1"
      },
      "timestamp": "2025-07-28T12:49:49.480Z"
    }
  }
}
14:49:49.481 debug  Parsed portfolio query parameters {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "nature",
    "requestId": "c867c962-339a-4e7e-a245-c83ffb2a2a51",
    "page": 1,
    "limit": 12,
    "orderBy": "createdAt",
    "orderDirection": "desc"
  }
}
14:49:49.481 info  Fetching portfolio items Fetching portfolio items {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "database",
    "requestId": "c867c962-339a-4e7e-a245-c83ffb2a2a51",
    "operation": "READ",
    "table": "PortfolioItem",
    "queryTime": 0,
    "metadata": {
      "filters": {
        "page": 1,
        "limit": 12,
        "category": "nature",
        "orderBy": "createdAt",
        "orderDirection": "desc"
      }
    }
  }
}
prisma:query SELECT 1
prisma:query SELECT 1
prisma:query SELECT COUNT(*) AS `_count._all` FROM (SELECT `main`.`portfolio_items`.`id` FROM `main`.`portfolio_items` LEFT JOIN `main`.`categories` AS `j0` ON (`j0`.`id`) = (`main`.`portfolio_items`.`categoryId`) WHERE (`main`.`portfolio_items`.`status` = ? AND (`j0`.`slug` = ? AND (`j0`.`id` IS NOT NULL))) LIMIT ? OFFSET ?) AS `sub`
prisma:query SELECT `main`.`portfolio_items`.`id`, `main`.`portfolio_items`.`title`, `main`.`portfolio_items`.`description`, `main`.`portfolio_items`.`mediaType`, `main`.`portfolio_items`.`filePath`, `main`.`portfolio_items`.`thumbnailPath`, `main`.`portfolio_items`.`tags`, `main`.`portfolio_items`.`metadata`, `main`.`portfolio_items`.`status`, `main`.`portfolio_items`.`featured`, `main`.`portfolio_items`.`sortOrder`, `main`.`portfolio_items`.`viewCount`, `main`.`portfolio_items`.`createdAt`, `main`.`portfolio_items`.`updatedAt`, `main`.`portfolio_items`.`publishedAt`, `main`.`portfolio_items`.`categoryId`, `main`.`portfolio_items`.`userId` FROM `main`.`portfolio_items` LEFT JOIN `main`.`categories` AS `j0` ON (`j0`.`id`) = (`main`.`portfolio_items`.`categoryId`) WHERE (`main`.`portfolio_items`.`status` = ? AND (`j0`.`slug` = ? AND (`j0`.`id` IS NOT NULL))) ORDER BY `main`.`portfolio_items`.`createdAt` DESC LIMIT ? OFFSET ?
prisma:query SELECT `main`.`categories`.`id`, `main`.`categories`.`name`, `main`.`categories`.`slug`, `main`.`categories`.`description`, `main`.`categories`.`coverImage`, `main`.`categories`.`sortOrder`, `main`.`categories`.`isActive`, `main`.`categories`.`createdAt` FROM `main`.`categories` WHERE `main`.`categories`.`id` IN (?) LIMIT ? OFFSET ?
14:49:49.483 info  Portfolio items fetched successfully Portfolio items fetched successfully {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "database",
    "requestId": "c867c962-339a-4e7e-a245-c83ffb2a2a51",
    "operation": "READ",
    "table": "PortfolioItem",
    "queryTime": 1,
    "rowsAffected": 3,
    "metadata": {
      "totalItems": 3,
      "pagesRemaining": 0
    }
  }
}
14:49:49.483 info  Portfolio items fetched successfully Portfolio items fetched successfully {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "api",
    "requestId": "c867c962-339a-4e7e-a245-c83ffb2a2a51",
    "method": "GET",
    "url": "http://localhost:3000/api/portfolio?orderBy=createdAt&orderDirection=desc&category=nature&page=1",
    "ip": "unknown",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
    "statusCode": 200,
    "responseTime": 2,
    "metadata": {
      "itemsReturned": 3,
      "totalItems": 3,
      "currentPage": 1,
      "dbQueryTime": 1,
      "cached": false
    }
  }
}
 GET /api/portfolio?orderBy=createdAt&orderDirection=desc&category=nature&page=1 200 in 31ms
