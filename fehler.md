src/**tests**/api/portfolio/portfolio-id.test.ts:391:45 - error TS2322: Type 'Promise<{ id: string |
null; }>' is not assignable to type 'Promise<{ id: string; }>'. Type '{ id: string | null; }' is not
assignable to type '{ id: string; }'. Types of property 'id' are incompatible. Type 'string | null'
is not assignable to type 'string'. Type 'null' is not assignable to type 'string'.

391 const response = await GET(request, { params: mockParams }); ~~~~~~

src/app/api/portfolio/[id]/route.ts:14:17 14 { params }: { params: Promise<{ id: string }> } ~~~~~~
The expected type comes from property 'params' which is declared here on type '{ params: Promise<{
id: string; }>; }'

src/**tests**/utils/test-utils.ts:46:54 - error TS2345: Argument of type 'RequestInit' is not
assignable to parameter of type
'import("/home/marax/kili/PortfolioWebapp/node_modules/next/dist/server/web/spec-extension/request").RequestInit'.
Types of property 'signal' are incompatible. Type 'AbortSignal | null | undefined' is not assignable
to type 'AbortSignal | undefined'. Type 'null' is not assignable to type 'AbortSignal | undefined'.

46 return new NextRequest(urlWithParams.toString(), requestInit); ~~~~~~~~~~~

Found 2 errors in 2 files.

Errors Files 1 src/**tests**/api/portfolio/portfolio-id.test.ts:391 1
src/**tests**/utils/test-utils.ts:46
