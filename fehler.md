13:31:15.395 info  Fetching portfolio item by ID Fetching portfolio item by ID {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "database",
    "requestId": "c2536565-9fd2-4d8b-b6f4-cd2cf0318e6d",
    "operation": "READ",
    "table": "PortfolioItem",
    "queryTime": 0,
    "metadata": {
      "portfolioId": "cmdn0qso80001p4os2ixu2grc"
    }
  }
}
prisma:query SELECT `main`.`portfolio_items`.`id`, `main`.`portfolio_items`.`title`, `main`.`portfolio_items`.`description`, `main`.`portfolio_items`.`mediaType`, `main`.`portfolio_items`.`filePath`, `main`.`portfolio_items`.`thumbnailPath`, `main`.`portfolio_items`.`tags`, `main`.`portfolio_items`.`metadata`, `main`.`portfolio_items`.`status`, `main`.`portfolio_items`.`featured`, `main`.`portfolio_items`.`sortOrder`, `main`.`portfolio_items`.`viewCount`, `main`.`portfolio_items`.`createdAt`, `main`.`portfolio_items`.`updatedAt`, `main`.`portfolio_items`.`publishedAt`, `main`.`portfolio_items`.`categoryId`, `main`.`portfolio_items`.`userId` FROM `main`.`portfolio_items` WHERE (`main`.`portfolio_items`.`id` = ? AND `main`.`portfolio_items`.`status` = ?) LIMIT ? OFFSET ?
13:31:15.396 info  Portfolio item not found Portfolio item not found {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "api",
    "requestId": "c2536565-9fd2-4d8b-b6f4-cd2cf0318e6d",
    "method": "GET",
    "url": "http://localhost:3000/api/portfolio/cmdn0qso80001p4os2ixu2grc",
    "ip": "unknown",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
    "statusCode": 404,
    "responseTime": 3,
    "metadata": {
      "portfolioId": "cmdn0qso80001p4os2ixu2grc",
      "dbQueryTime": 1
    }
  }
}
13:31:15.396 error  NOT_FOUND_ERROR: Portfolio item not found NOT_FOUND_ERROR: Portfolio item not found {
  "metadata": {
    "service": "portfolio-webapp",
    "environment": "development",
    "version": "0.1.0",
    "category": "error",
    "requestId": "c2536565-9fd2-4d8b-b6f4-cd2cf0318e6d",
    "ip": "unknown",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
    "method": "GET",
    "url": "http://localhost:3000/api/portfolio/cmdn0qso80001p4os2ixu2grc",
    "error": {
      "name": "AppError",
      "message": "Portfolio item not found",
      "stack": "AppError: Portfolio item not found\n    at ErrorHandler.createNotFoundError (/home/marax/PortfolioWebapp/.next/server/chunks/[root-of-the-server]__fe1416b1._.js:1517:16)\n    at GET (/home/marax/PortfolioWebapp/.next/server/chunks/[root-of-the-server]__52f5e038._.js:1638:172)\n    at async AppRouteRouteModule.do (/home/marax/PortfolioWebapp/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:38782)\n    at async AppRouteRouteModule.handle (/home/marax/PortfolioWebapp/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:45984)\n    at async responseGenerator (/home/marax/PortfolioWebapp/.next/server/chunks/node_modules_40583ce4._.js:28700:38)\n    at async AppRouteRouteModule.handleResponse (/home/marax/PortfolioWebapp/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:1:183725)\n    at async handleResponse (/home/marax/PortfolioWebapp/.next/server/chunks/node_modules_40583ce4._.js:28762:32)\n    at async handler (/home/marax/PortfolioWebapp/.next/server/chunks/node_modules_40583ce4._.js:28814:13)\n    at async doRender (/home/marax/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1586:34)\n    at async DevServer.renderToResponseWithComponentsImpl (/home/marax/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1928:13)\n    at async DevServer.renderPageComponent (/home/marax/PortfolioWebapp/node_modules/next/dist/server/base-server.js:2394:24)\n    at async DevServer.renderToResponseImpl (/home/marax/PortfolioWebapp/node_modules/next/dist/server/base-server.js:2434:32)\n    at async DevServer.pipeImpl (/home/marax/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1034:25)\n    at async NextNodeServer.handleCatchallRenderRequest (/home/marax/PortfolioWebapp/node_modules/next/dist/server/next-server.js:393:17)\n    at async DevServer.handleRequestImpl (/home/marax/PortfolioWebapp/node_modules/next/dist/server/base-server.js:925:17)\n    at async /home/marax/PortfolioWebapp/node_modules/next/dist/server/dev/next-dev-server.js:398:20\n    at async Span.traceAsyncFn (/home/marax/PortfolioWebapp/node_modules/next/dist/trace/trace.js:157:20)\n    at async DevServer.handleRequest (/home/marax/PortfolioWebapp/node_modules/next/dist/server/dev/next-dev-server.js:394:24)\n    at async invokeRender (/home/marax/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:239:21)\n    at async handleRequest (/home/marax/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:436:24)\n    at async requestHandlerImpl (/home/marax/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:464:13)\n    at async Server.requestListener (/home/marax/PortfolioWebapp/node_modules/next/dist/server/lib/start-server.js:218:13)",
      "code": "NOT_FOUND"
    },
    "context": {
      "route": "/api/portfolio/[id]",
      "operation": "fetch_portfolio_item",
      "inputData": {
        "id": "cmdn0qso80001p4os2ixu2grc"
      }
    }
  }
}
 GET /api/portfolio/cmdn0qso80001p4os2ixu2grc 404 in 55ms