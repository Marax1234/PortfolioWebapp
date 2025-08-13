prisma:error Invalid `prisma.portfolioItem.findMany()` invocation:

error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or
`postgres://`. --> schema.prisma:10 | 9 | provider = "postgresql" 10 | url = env("DATABASE_URL") |

Validation Error Count: 1 prisma:error Invalid `prisma.portfolioItem.count()` invocation:

error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or
`postgres://`. --> schema.prisma:10 | 9 | provider = "postgresql" 10 | url = env("DATABASE_URL") |

Validation Error Count: 1 13:35:32.690 error Error fetching portfolio items Error fetching portfolio
items { "metadata": { "service": "portfolio-webapp", "environment": "development", "version":
"0.1.0", "category": "error", "requestId": "5e0ff33b-b3de-4bc0-99e0-1e4be0e13004", "responseTime":
7, "error": { "name": "PrismaClientInitializationError", "message": "\nInvalid
`prisma.portfolioItem.findMany()` invocation:\n\n\nerror: Error validating datasource `db`: the URL
must start with the protocol `postgresql://` or `postgres://`.\n --> schema.prisma:10\n | \n 9 |
provider = \"postgresql\"\n10 | url = env(\"DATABASE*URL\")\n | \n\nValidation Error Count: 1",
"stack": "PrismaClientInitializationError: \nInvalid `prisma.portfolioItem.findMany()`
invocation:\n\n\nerror: Error validating datasource `db`: the URL must start with the protocol
`postgresql://` or `postgres://`.\n --> schema.prisma:10\n | \n 9 | provider = \"postgresql\"\n10 |
url = env(\"DATABASE_URL\")\n | \n\nValidation Error Count: 1\n at ri.handleRequestError
(/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:121:7759)\n at
ri.handleAndLogRequestError
(/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:121:6784)\n at
ri.request
(/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:121:6491)\n at
async l (/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:130:9812)\n
at async Promise.all (index 0)\n at async PortfolioQueries.getPublishedItems
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/[root-of-the-server]\_\_28f563b1.*.js:189:32)\n
at async GET
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/[root-of-the-server]**28f563b1._.js:1956:24)\n
at async AppRouteRouteModule.do
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:38782)\n
at async AppRouteRouteModule.handle
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:45984)\n
at async responseGenerator
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/node_modules_next_d7091a83._.js:12864:38)\n at
async AppRouteRouteModule.handleResponse
(/home/marax/kili/PortfolioWebapp/node*modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:1:183725)\n
at async handleResponse
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/node_modules_next_d7091a83.*.js:12926:32)\n at
async handler
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/node*modules_next_d7091a83.*.js:12978:13)\n at
async doRender
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1586:34)\n at async
DevServer.renderToResponseWithComponentsImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1928:13)\n at async
DevServer.renderPageComponent
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:2394:24)\n at async
DevServer.renderToResponseImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:2434:32)\n at async
DevServer.pipeImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1034:25)\n at async
NextNodeServer.handleCatchallRenderRequest
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/next-server.js:393:17)\n at async
DevServer.handleRequestImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:925:17)\n at async
/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/dev/next-dev-server.js:398:20\n at
async Span.traceAsyncFn
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/trace/trace.js:157:20)\n at async
DevServer.handleRequest
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/dev/next-dev-server.js:394:24)\n at
async invokeRender
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:239:21)\n at
async handleRequest
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:436:24)\n at
async requestHandlerImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:464:13)\n at
async Server.requestListener
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/start-server.js:218:13)" },
"context": { "route": "/api/portfolio", "operation": "fetch_portfolio_items", "inputData": {
"featured": "true", "limit": "6", "orderBy": "createdAt", "orderDirection": "desc" } } } }
13:35:32.691 error DATABASE_ERROR: Database connection failed DATABASE_ERROR: Database connection
failed { "metadata": { "service": "portfolio-webapp", "environment": "development", "version":
"0.1.0", "category": "error", "requestId": "5e0ff33b-b3de-4bc0-99e0-1e4be0e13004", "ip": "unknown",
"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0", "method": "GET", "url":
"http://localhost:3000/api/portfolio?featured=true&limit=6&orderBy=createdAt&orderDirection=desc",
"error": { "name": "PrismaClientInitializationError", "message": "Database connection failed",
"stack": "PrismaClientInitializationError: \nInvalid `prisma.portfolioItem.findMany()`
invocation:\n\n\nerror: Error validating datasource `db`: the URL must start with the protocol
`postgresql://` or `postgres://`.\n --> schema.prisma:10\n | \n 9 | provider = \"postgresql\"\n10 |
url = env(\"DATABASE_URL\")\n | \n\nValidation Error Count: 1\n at ri.handleRequestError
(/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:121:7759)\n at
ri.handleAndLogRequestError
(/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:121:6784)\n at
ri.request
(/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:121:6491)\n at
async l (/home/marax/kili/PortfolioWebapp/node_modules/@prisma/client/runtime/library.js:130:9812)\n
at async Promise.all (index 0)\n at async PortfolioQueries.getPublishedItems
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/[root-of-the-server]**28f563b1._.js:189:32)\n
at async GET
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/[root-of-the-server]\_\_28f563b1._.js:1956:24)\n
at async AppRouteRouteModule.do
(/home/marax/kili/PortfolioWebapp/node*modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:38782)\n
at async AppRouteRouteModule.handle
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:45984)\n
at async responseGenerator
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/node_modules_next_d7091a83.*.js:12864:38)\n at
async AppRouteRouteModule.handleResponse
(/home/marax/kili/PortfolioWebapp/node*modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:1:183725)\n
at async handleResponse
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/node_modules_next_d7091a83.*.js:12926:32)\n at
async handler
(/home/marax/kili/PortfolioWebapp/.next/server/chunks/node*modules_next_d7091a83.*.js:12978:13)\n at
async doRender
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1586:34)\n at async
DevServer.renderToResponseWithComponentsImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1928:13)\n at async
DevServer.renderPageComponent
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:2394:24)\n at async
DevServer.renderToResponseImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:2434:32)\n at async
DevServer.pipeImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:1034:25)\n at async
NextNodeServer.handleCatchallRenderRequest
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/next-server.js:393:17)\n at async
DevServer.handleRequestImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/base-server.js:925:17)\n at async
/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/dev/next-dev-server.js:398:20\n at
async Span.traceAsyncFn
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/trace/trace.js:157:20)\n at async
DevServer.handleRequest
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/dev/next-dev-server.js:394:24)\n at
async invokeRender
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:239:21)\n at
async handleRequest
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:436:24)\n at
async requestHandlerImpl
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/router-server.js:464:13)\n at
async Server.requestListener
(/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/lib/start-server.js:218:13)",
"code": "DATABASE_CONNECTION_ERROR" }, "context": { "route": "/api/portfolio", "operation":
"fetch_portfolio_items", "inputData": { "featured": "true", "limit": "6", "orderBy": "createdAt",
"orderDirection": "desc" } } } } GET
/api/portfolio?featured=true&limit=6&orderBy=createdAt&orderDirection=desc 503 in 134ms
