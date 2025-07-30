.next/types/app/api/admin/inquiries/[id]/reply/route.ts:166:7 - error TS2344: Type '{ **tag**:
"POST"; **param_position**: "second"; **param_type**: { params: { id: string; }; }; }' does not
satisfy the constraint 'ParamCheck<RouteContext>'. The types of '**param_type**.params' are
incompatible between these types. Type '{ id: string; }' is missing the following properties from
type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

166 { ~ 167 **tag**: 'POST' ~~~~~~~~~~~~~~~~~~~~~~~ ... 169 **param_type**:
SecondArg<MaybeField<TEntry, 'POST'>> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
170 }, ~~~~~~~

.next/types/app/api/admin/inquiries/[id]/route.ts:283:7 - error TS2344: Type '{ **tag**: "PATCH";
**param_position**: "second"; **param_type**: { params: { id: string; }; }; }' does not satisfy the
constraint 'ParamCheck<RouteContext>'. The types of '**param_type**.params' are incompatible between
these types. Type '{ id: string; }' is missing the following properties from type 'Promise<any>':
then, catch, finally, [Symbol.toStringTag]

283 { ~ 284 **tag**: 'PATCH' ~~~~~~~~~~~~~~~~~~~~~~~~ ... 286 **param_type**:
SecondArg<MaybeField<TEntry, 'PATCH'>>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 287 }, ~~~~~~~

.next/types/app/api/admin/portfolio/[id]/route.ts:49:7 - error TS2344: Type '{ **tag**: "GET";
**param_position**: "second"; **param_type**: { params: { id: string; }; }; }' does not satisfy the
constraint 'ParamCheck<RouteContext>'. The types of '**param_type**.params' are incompatible between
these types. Type '{ id: string; }' is missing the following properties from type 'Promise<any>':
then, catch, finally, [Symbol.toStringTag]

49 { ~ 50 **tag**: 'GET' ~~~~~~~~~~~~~~~~~~~~~~ ... 52 **param_type**: SecondArg<MaybeField<TEntry,
'GET'>> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 53 }, ~~~~~~~

.next/types/app/api/admin/portfolio/[id]/route.ts:205:7 - error TS2344: Type '{ **tag**: "PUT";
**param_position**: "second"; **param_type**: { params: { id: string; }; }; }' does not satisfy the
constraint 'ParamCheck<RouteContext>'. The types of '**param_type**.params' are incompatible between
these types. Type '{ id: string; }' is missing the following properties from type 'Promise<any>':
then, catch, finally, [Symbol.toStringTag]

205 { ~ 206 **tag**: 'PUT' ~~~~~~~~~~~~~~~~~~~~~~ ... 208 **param_type**:
SecondArg<MaybeField<TEntry, 'PUT'>> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
209 }, ~~~~~~~

.next/types/app/api/categories/[id]/route.ts:205:7 - error TS2344: Type '{ **tag**: "PUT";
**param_position**: "second"; **param_type**: { params: { id: string; }; }; }' does not satisfy the
constraint 'ParamCheck<RouteContext>'. The types of '**param_type**.params' are incompatible between
these types. Type '{ id: string; }' is missing the following properties from type 'Promise<any>':
then, catch, finally, [Symbol.toStringTag]

205 { ~ 206 **tag**: 'PUT' ~~~~~~~~~~~~~~~~~~~~~~ ... 208 **param_type**:
SecondArg<MaybeField<TEntry, 'PUT'>> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
209 }, ~~~~~~~

.next/types/app/api/categories/[id]/route.ts:244:7 - error TS2344: Type '{ **tag**: "DELETE";
**param_position**: "second"; **param_type**: { params: { id: string; }; }; }' does not satisfy the
constraint 'ParamCheck<RouteContext>'. The types of '**param_type**.params' are incompatible between
these types. Type '{ id: string; }' is missing the following properties from type 'Promise<any>':
then, catch, finally, [Symbol.toStringTag]

244 { ~ 245 **tag**: 'DELETE' ~~~~~~~~~~~~~~~~~~~~~~~~~ ... 247 **param_type**:
SecondArg<MaybeField<TEntry, 'DELETE'>>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 248 }, ~~~~~~~

src/app/api/admin/inquiries/[id]/reply/route.ts:40:22 - error TS2551: Property
'createAuthenticationError' does not exist on type 'typeof ErrorHandler'. Did you mean
'createValidationError'?

40 ErrorHandler.createAuthenticationError('Admin access required'), ~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/error-handler.ts:437:10 437 static createValidationError( ~~~~~~~~~~~~~~~~~~~~~
'createValidationError' is declared here.

src/app/api/admin/inquiries/[id]/reply/route.ts:116:29 - error TS2345: Argument of type '{ category:
InquiryCategory; message: string; userId: string | null; name: string; id: string; email: string;
status: InquiryStatus; createdAt: Date; ... 8 more ...; resolvedAt: Date | null; }' is not
assignable to parameter of type '{ id: string; name: string; email: string; subject?: string |
undefined; category: string; }'. Types of property 'subject' are incompatible. Type 'string | null'
is not assignable to type 'string | undefined'. Type 'null' is not assignable to type 'string |
undefined'.

116 await sendCustomReply(inquiry, replyData.message); ~~~~~~~

src/app/api/admin/inquiries/[id]/reply/route.ts:142:11 - error TS2353: Object literal may only
specify known properties, and 'inquiryId' does not exist in type '{ route?: string | undefined;
operation?: string | undefined; inputData?: Record<string, unknown> | undefined; }'.

142 inquiryId, ~~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/admin/inquiries/[id]/reply/route.ts:149:22 - error TS2339: Property
'createExternalServiceError' does not exist on type 'typeof ErrorHandler'.

149 ErrorHandler.createExternalServiceError('Failed to send reply email'),
~~~~~~~~~~~~~~~~~~~~~~~~~~

src/app/api/admin/inquiries/[id]/reply/route.ts:235:9 - error TS2353: Object literal may only
specify known properties, and 'metadata' does not exist in type '{ route?: string | undefined;
operation?: string | undefined; inputData?: Record<string, unknown> | undefined; }'.

235 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/admin/inquiries/[id]/route.ts:38:22 - error TS2551: Property 'createAuthenticationError'
does not exist on type 'typeof ErrorHandler'. Did you mean 'createValidationError'?

38 ErrorHandler.createAuthenticationError('Admin access required'), ~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/error-handler.ts:437:10 437 static createValidationError( ~~~~~~~~~~~~~~~~~~~~~
'createValidationError' is declared here.

src/app/api/admin/inquiries/[id]/route.ts:98:47 - error TS2339: Property 'errors' does not exist on
type 'ZodError<unknown>'.

98 validationErrors: validationError.errors, ~~~~~~

src/app/api/admin/inquiries/[id]/route.ts:99:42 - error TS2769: No overload matches this call.
Overload 1 of 2, '(o: {}): string[]', gave the following error. Argument of type 'unknown' is not
assignable to parameter of type '{}'. Overload 2 of 2, '(o: object): string[]', gave the following
error. Argument of type 'unknown' is not assignable to parameter of type 'object'.

99 submittedFields: Object.keys(body), ~~~~

src/app/api/admin/inquiries/[id]/route.ts:206:9 - error TS2353: Object literal may only specify
known properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?:
string | undefined; inputData?: Record<string, unknown> | undefined; }'.

206 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/admin/inquiries/route.ts:23:22 - error TS2551: Property 'createAuthenticationError' does
not exist on type 'typeof ErrorHandler'. Did you mean 'createValidationError'?

23 ErrorHandler.createAuthenticationError('Admin access required'), ~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/error-handler.ts:437:10 437 static createValidationError( ~~~~~~~~~~~~~~~~~~~~~
'createValidationError' is declared here.

src/app/api/admin/inquiries/route.ts:120:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

120 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/admin/portfolio/[id]/route.ts:61:9 - error TS2554: Expected 1 arguments, but got 2.

61 { id: portfolioId } ~~~~~~~~~~~~~~~~~~~

src/app/api/admin/portfolio/[id]/route.ts:123:9 - error TS2353: Object literal may only specify
known properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?:
string | undefined; inputData?: Record<string, unknown> | undefined; }'.

123 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/admin/portfolio/[id]/route.ts:187:52 - error TS2339: Property 'errors' does not exist on
type 'ZodError<{ title?: string | undefined; description?: string | null | undefined; categoryId?:
string | null | undefined; status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined; ... 5
more ...; thumbnailPath?: string | ... 1 more ... | undefined; }>'.

187 const errorDetails = validationResult.error?.errors || []; ~~~~~~

src/app/api/admin/portfolio/[id]/route.ts:189:14 - error TS7006: Parameter 'err' implicitly has an
'any' type.

189 .map(err => `${err.path.join('.')}: ${err.message}`) ~~~

src/app/api/admin/portfolio/[id]/route.ts:279:9 - error TS2353: Object literal may only specify
known properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?:
string | undefined; inputData?: Record<string, unknown> | undefined; }'.

279 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/admin/portfolio/route.ts:214:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

214 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/analytics/route.ts:34:11 - error TS2353: Object literal may only specify known
properties, and 'route' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

34 route: '/api/analytics', ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/app/api/analytics/route.ts:248:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

248 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/categories/[id]/route.ts:110:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

110 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/categories/[id]/route.ts:203:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

203 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/categories/route.ts:178:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

178 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/categories/route.ts:281:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

281 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/contact-debug/route.ts:49:26 - error TS2339: Property 'errors' does not exist on type
'ZodError<unknown>'.

49 details: error.errors, ~~~~~~

src/app/api/contact/route.ts:86:26 - error TS2339: Property 'errors' does not exist on type
'ZodError<unknown>'.

86 details: error.errors, ~~~~~~

src/app/api/portfolio/[id]/route.ts:242:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

242 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/portfolio/route.ts:204:9 - error TS2353: Object literal may only specify known
properties, and 'metadata' does not exist in type '{ route?: string | undefined; operation?: string
| undefined; inputData?: Record<string, unknown> | undefined; }'.

204 metadata: { ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/portfolio/route.ts:271:41 - error TS2339: Property 'errors' does not exist on type
'ZodError<{ title: string; mediaType: "IMAGE" | "VIDEO"; filePath: string; status: "DRAFT" |
"REVIEW" | "PUBLISHED" | "ARCHIVED"; featured: boolean; tags: string[]; sortOrder: number;
description?: string | ... 1 more ... | undefined; ... 4 more ...; metadata?: any; }>'.

271 errors: validationResult.error?.errors, ~~~~~~

src/app/api/portfolio/route.ts:282:52 - error TS2339: Property 'errors' does not exist on type
'ZodError<{ title: string; mediaType: "IMAGE" | "VIDEO"; filePath: string; status: "DRAFT" |
"REVIEW" | "PUBLISHED" | "ARCHIVED"; featured: boolean; tags: string[]; sortOrder: number;
description?: string | ... 1 more ... | undefined; ... 4 more ...; metadata?: any; }>'.

282 const errorDetails = validationResult.error?.errors || []; ~~~~~~

src/app/api/portfolio/route.ts:284:14 - error TS7006: Parameter 'err' implicitly has an 'any' type.

284 .map(err => `${err.path.join('.')}: ${err.message}`) ~~~

src/app/api/portfolio/route.ts:419:9 - error TS2322: Type
'ReadableStream<Uint8Array<ArrayBufferLike>> | null' is not assignable to type 'Record<string,
unknown> | undefined'. Type 'null' is not assignable to type 'Record<string, unknown> | undefined'.

419 inputData: request.body, ~~~~~~~~~

src/app/api/settings/password/route.ts:35:11 - error TS2353: Object literal may only specify known
properties, and 'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

35 reason: 'no_session', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/app/api/settings/password/route.ts:56:11 - error TS2353: Object literal may only specify known
properties, and 'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

56 reason: 'insufficient_role', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/app/api/settings/password/route.ts:91:11 - error TS2353: Object literal may only specify known
properties, and 'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

91 reason: 'no_password_hash', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/app/api/settings/password/route.ts:117:11 - error TS2353: Object literal may only specify known
properties, and 'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

117 reason: 'invalid_current_password', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/app/api/settings/password/route.ts:170:9 - error TS2353: Object literal may only specify known
properties, and 'email' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

170 email: user.email, ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/app/api/settings/password/route.ts:188:15 - error TS2304: Cannot find name 'session'.

188 userId: session?.user?.id, ~~~~~~~

src/app/api/settings/password/route.ts:197:26 - error TS2339: Property 'errors' does not exist on
type 'ZodError<unknown>'.

197 details: error.errors.map(err => ({ ~~~~~~

src/app/api/settings/password/route.ts:197:37 - error TS7006: Parameter 'err' implicitly has an
'any' type.

197 details: error.errors.map(err => ({ ~~~

src/app/api/settings/portfolio/route.ts:88:15 - error TS2304: Cannot find name 'session'.

88 userId: session?.user?.id, ~~~~~~~

src/app/api/settings/portfolio/route.ts:181:15 - error TS2304: Cannot find name 'session'.

181 userId: session?.user?.id, ~~~~~~~

src/app/api/settings/portfolio/route.ts:190:26 - error TS2339: Property 'errors' does not exist on
type 'ZodError<unknown>'.

190 details: error.errors.map(err => ({ ~~~~~~

src/app/api/settings/portfolio/route.ts:190:37 - error TS7006: Parameter 'err' implicitly has an
'any' type.

190 details: error.errors.map(err => ({ ~~~

src/app/api/settings/profile/route.ts:110:26 - error TS2339: Property 'errors' does not exist on
type 'ZodError<unknown>'.

110 details: error.errors.map(err => ({ ~~~~~~

src/app/api/settings/profile/route.ts:110:37 - error TS7006: Parameter 'err' implicitly has an 'any'
type.

110 details: error.errors.map(err => ({ ~~~

src/app/api/upload/route.ts:165:13 - error TS2353: Object literal may only specify known properties,
and 'fileName' does not exist in type '{ route?: string | undefined; operation?: string | undefined;
inputData?: Record<string, unknown> | undefined; }'.

165 fileName: file.name, ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/api/upload/route.ts:229:9 - error TS2353: Object literal may only specify known properties,
and 'responseTime' does not exist in type '{ route?: string | undefined; operation?: string |
undefined; inputData?: Record<string, unknown> | undefined; }'.

229 responseTime: totalResponseTime, ~~~~~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/app/contact/page.tsx:73:5 - error TS2322: Type 'Resolver<{ name: string; email: string; subject:
string; message: string; gdprConsent: boolean; phone?: string | undefined; category?: "NATURE" |
"TRAVEL" | "EVENT" | "VIDEOGRAPHY" | "OTHER" | undefined; budgetRange?: string | undefined;
eventDate?: string | undefined; location?: string | undefined; }, any, { ...; }>' is not assignable
to type 'Resolver<{ name: string; email: string; subject: string; message: string; category:
"NATURE" | "TRAVEL" | "EVENT" | "VIDEOGRAPHY" | "OTHER"; gdprConsent: boolean; phone?: string |
undefined; budgetRange?: string | undefined; eventDate?: string | undefined; location?: string |
undefined; }, any, { ...; }>'. Types of parameters 'options' and 'options' are incompatible. Type
'ResolverOptions<{ name: string; email: string; subject: string; message: string; category: "NATURE"
| "TRAVEL" | "EVENT" | "VIDEOGRAPHY" | "OTHER"; gdprConsent: boolean; phone?: string | undefined;
budgetRange?: string | undefined; eventDate?: string | undefined; location?: string | undefined; }>'
is not assignable to type 'ResolverOptions<{ name: string; email: string; subject: string; message:
string; gdprConsent: boolean; phone?: string | undefined; category?: "NATURE" | "TRAVEL" | "EVENT" |
"VIDEOGRAPHY" | "OTHER" | undefined; budgetRange?: string | undefined; eventDate?: string |
undefined; location?: string | undefined; }>'. Type '"NATURE" | "TRAVEL" | "EVENT" | "VIDEOGRAPHY" |
"OTHER" | undefined' is not assignable to type '"NATURE" | "TRAVEL" | "EVENT" | "VIDEOGRAPHY" |
"OTHER"'. Type 'undefined' is not assignable to type '"NATURE" | "TRAVEL" | "EVENT" | "VIDEOGRAPHY"
| "OTHER"'.

73 resolver: zodResolver(contactSchema), ~~~~~~~~

src/app/contact/page.tsx:159:46 - error TS2345: Argument of type '(data: ContactFormData) =>
Promise<void>' is not assignable to parameter of type 'SubmitHandler<TFieldValues>'. Types of
parameters 'data' and 'data' are incompatible. Type 'TFieldValues' is not assignable to type '{
name: string; email: string; subject: string; message: string; category: "NATURE" | "TRAVEL" |
"EVENT" | "VIDEOGRAPHY" | "OTHER"; gdprConsent: boolean; phone?: string | undefined; budgetRange?:
string | undefined; eventDate?: string | undefined; location?: string | undefined; }'. Type
'FieldValues' is missing the following properties from type '{ name: string; email: string; subject:
string; message: string; category: "NATURE" | "TRAVEL" | "EVENT" | "VIDEOGRAPHY" | "OTHER";
gdprConsent: boolean; phone?: string | undefined; budgetRange?: string | undefined; eventDate?:
string | undefined; location?: string | undefined; }': name, email, subject, message, and 2 more.

159 <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'> ~~~~~~~~

src/components/analytics/charts.tsx:194:16 - error TS2304: Cannot find name 'showDots'.

194 dot={showDots ? { fill: color, strokeWidth: 2, r: 3 } : false} ~~~~~~~~

src/hooks/useMasonry.ts:200:5 - error TS2322: Type 'RefObject<HTMLDivElement | null>' is not
assignable to type 'RefObject<HTMLDivElement>'. Type 'HTMLDivElement | null' is not assignable to
type 'HTMLDivElement'. Type 'null' is not assignable to type 'HTMLDivElement'.

200 containerRef, ~~~~~~~~~~~~

src/hooks/useMasonry.ts:25:3 25 containerRef: React.RefObject<HTMLDivElement>; ~~~~~~~~~~~~ The
expected type comes from property 'containerRef' which is declared here on type 'MasonryLayout'

src/lib/auth.ts:98:17 - error TS2353: Object literal may only specify known properties, and 'reason'
does not exist in type '{ attempts?: number | undefined; blockedReason?: string | undefined;
riskScore?: number | undefined; }'.

98 reason: 'missing_credentials', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:118:15 - error TS2353: Object literal may only specify known properties, and 'email'
does not exist in type '{ attempts?: number | undefined; blockedReason?: string | undefined;
riskScore?: number | undefined; }'.

118 email: credentials.email, ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:142:17 - error TS2353: Object literal may only specify known properties, and
'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?: string |
undefined; riskScore?: number | undefined; }'.

142 reason: 'invalid_credentials', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:163:17 - error TS2353: Object literal may only specify known properties, and
'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?: string |
undefined; riskScore?: number | undefined; }'.

163 reason: 'insufficient_role', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:185:15 - error TS2353: Object literal may only specify known properties, and 'email'
does not exist in type '{ attempts?: number | undefined; blockedReason?: string | undefined;
riskScore?: number | undefined; }'.

185 email: credentials.email, ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:212:15 - error TS2353: Object literal may only specify known properties, and
'reason' does not exist in type '{ attempts?: number | undefined; blockedReason?: string |
undefined; riskScore?: number | undefined; }'.

212 reason: 'system_error', ~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:290:11 - error TS2353: Object literal may only specify known properties, and 'email'
does not exist in type '{ attempts?: number | undefined; blockedReason?: string | undefined;
riskScore?: number | undefined; }'.

290 email: user.email, ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:321:11 - error TS2353: Object literal may only specify known properties, and 'email'
does not exist in type '{ attempts?: number | undefined; blockedReason?: string | undefined;
riskScore?: number | undefined; }'.

321 email: userEmail, ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth.ts:346:11 - error TS2353: Object literal may only specify known properties, and 'email'
does not exist in type '{ attempts?: number | undefined; blockedReason?: string | undefined;
riskScore?: number | undefined; }'.

346 email: user.email, ~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/auth/**tests**/auth.test.ts:5:46 - error TS2307: Cannot find module '@/**mocks**/setup' or
its corresponding type declarations.

5 import { resetAllMocks, setupAllMocks } from '@/**mocks**/setup'; ~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:110:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

110 const result = await provider.authorize({}, mockReq); ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:121:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

121 const result = await provider.authorize( ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:135:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

135 const result = await provider.authorize( ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:155:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

155 const result = await provider.authorize( ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:184:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

184 const result = await provider.authorize( ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:213:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

213 const result = await provider.authorize( ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:239:37 - error TS2339: Property 'authorize' does not exist on
type '{ credentials: Record<string, unknown>; }'.

239 const result = await provider.authorize( ~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:261:56 - error TS2345: Argument of type '{ user: { id: string;
email: string; role: string; }; }' is not assignable to parameter of type '{ token: JWT; user: User
| AdapterUser; account: Account | null; profile?: Profile | undefined; trigger?: "signIn" | "update"
| "signUp" | undefined; isNewUser?: boolean | undefined; session?: any; }'. Type '{ user: { id:
string; email: string; role: string; }; }' is missing the following properties from type '{ token:
JWT; user: User | AdapterUser; account: Account | null; profile?: Profile | undefined; trigger?:
"signIn" | "update" | "signUp" | undefined; isNewUser?: boolean | undefined; session?: any; }':
token, account

261 const result = await authOptions.callbacks!.jwt!({ ~ 262 token, ~~~~~~~~~~~~~~ 263 user:
mockUser, ~~~~~~~~~~~~~~~~~~~~~~~ 264 } as { user: { id: string; email: string; role: string; } });
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:283:56 - error TS2345: Argument of type '{ user: { id: string;
email: string; role: string; }; }' is not assignable to parameter of type '{ token: JWT; user: User
| AdapterUser; account: Account | null; profile?: Profile | undefined; trigger?: "signIn" | "update"
| "signUp" | undefined; isNewUser?: boolean | undefined; session?: any; }'. Type '{ user: { id:
string; email: string; role: string; }; }' is missing the following properties from type '{ token:
JWT; user: User | AdapterUser; account: Account | null; profile?: Profile | undefined; trigger?:
"signIn" | "update" | "signUp" | undefined; isNewUser?: boolean | undefined; session?: any; }':
token, account

283 const result = await authOptions.callbacks!.jwt!({ ~ 284 token: existingToken,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 285 } as { user: { id: string; email: string; role: string; } });
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:283:56 - error TS2352: Conversion of type '{ token: { id:
string; email: string; role: string; }; }' to type '{ user: { id: string; email: string; role:
string; }; }' may be a mistake because neither type sufficiently overlaps with the other. If this
was intentional, convert the expression to 'unknown' first. Property 'user' is missing in type '{
token: { id: string; email: string; role: string; }; }' but required in type '{ user: { id: string;
email: string; role: string; }; }'.

283 const result = await authOptions.callbacks!.jwt!({ ~ 284 token: existingToken,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 285 } as { user: { id: string; email: string; role: string; } });
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:285:14 285 } as { user: { id: string; email: string; role:
string; } }); ~~~~ 'user' is declared here.

src/lib/auth/**tests**/auth.test.ts:307:60 - error TS2345: Argument of type '{ user: { id: string;
email: string; role: string; }; }' is not assignable to parameter of type '{ session: Session;
token: JWT; user: AdapterUser; } & { newSession: any; trigger: "update"; }'. Type '{ user: { id:
string; email: string; role: string; }; }' is missing the following properties from type '{ session:
Session; token: JWT; user: AdapterUser; }': session, token

307 const result = await authOptions.callbacks!.session!({ ~ 308 session: mockSession,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 309 token: mockToken, ~~~~~~~~~~~~~~~~~~~~~~~~~ 310 } as { user: { id:
string; email: string; role: string; } });
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:307:60 - error TS2352: Conversion of type '{ session: { user: {
id: string; email: string; role: string; }; expires: string; }; token: { id: string; email: string;
firstName: string; lastName: string; role: string; emailVerified: boolean; }; }' to type '{ user: {
id: string; email: string; role: string; }; }' may be a mistake because neither type sufficiently
overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
Property 'user' is missing in type '{ session: { user: { id: string; email: string; role: string; };
expires: string; }; token: { id: string; email: string; firstName: string; lastName: string; role:
string; emailVerified: boolean; }; }' but required in type '{ user: { id: string; email: string;
role: string; }; }'.

307 const result = await authOptions.callbacks!.session!({ ~ 308 session: mockSession,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 309 token: mockToken, ~~~~~~~~~~~~~~~~~~~~~~~~~ 310 } as { user: { id:
string; email: string; role: string; } });
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:310:14 310 } as { user: { id: string; email: string; role:
string; } }); ~~~~ 'user' is declared here.

src/lib/auth/**tests**/auth.test.ts:328:60 - error TS2345: Argument of type '{ user: { id: string;
email: string; role: string; }; }' is not assignable to parameter of type '{ session: Session;
token: JWT; user: AdapterUser; } & { newSession: any; trigger: "update"; }'. Type '{ user: { id:
string; email: string; role: string; }; }' is missing the following properties from type '{ session:
Session; token: JWT; user: AdapterUser; }': session, token

328 const result = await authOptions.callbacks!.session!({ ~ 329 session: mockSession,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 330 token: null, ~~~~~~~~~~~~~~~~~~~~ 331 } as { user: { id: string;
email: string; role: string; } }); ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:328:60 - error TS2352: Conversion of type '{ session: { user: {
id: string; email: string; role: string; }; expires: string; }; token: null; }' to type '{ user: {
id: string; email: string; role: string; }; }' may be a mistake because neither type sufficiently
overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
Property 'user' is missing in type '{ session: { user: { id: string; email: string; role: string; };
expires: string; }; token: null; }' but required in type '{ user: { id: string; email: string; role:
string; }; }'.

328 const result = await authOptions.callbacks!.session!({ ~ 329 session: mockSession,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 330 token: null, ~~~~~~~~~~~~~~~~~~~~ 331 } as { user: { id: string;
email: string; role: string; } }); ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:331:14 331 } as { user: { id: string; email: string; role:
string; } }); ~~~~ 'user' is declared here.

src/lib/auth/**tests**/auth.test.ts:374:19 - error TS2540: Cannot assign to 'NODE_ENV' because it is
a read-only property.

374 process.env.NODE_ENV = 'development'; ~~~~~~~~

src/lib/auth/**tests**/auth.test.ts:378:19 - error TS2540: Cannot assign to 'NODE_ENV' because it is
a read-only property.

378 process.env.NODE_ENV = originalEnv; ~~~~~~~~

src/lib/db-utils.ts:204:7 - error TS2322: Type '{ publishedAt?: string | undefined; updatedAt:
string; title?: string | undefined; description?: string | null | undefined; categoryId?: string |
null | undefined; status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined; ... 5 more
...; thumbnailPath?: string | ... 1 more ... | undefined; }' is not assignable to type
'(Without<PortfolioItemUpdateInput, PortfolioItemUncheckedUpdateInput> &
PortfolioItemUncheckedUpdateInput) | (Without<...> & PortfolioItemUpdateInput)'. Type '{
publishedAt?: string | undefined; updatedAt: string; title?: string | undefined; description?:
string | null | undefined; categoryId?: string | null | undefined; status?: "DRAFT" | "REVIEW" |
"PUBLISHED" | "ARCHIVED" | undefined; ... 5 more ...; thumbnailPath?: string | ... 1 more ... |
undefined; }' is not assignable to type 'Without<PortfolioItemUncheckedUpdateInput,
PortfolioItemUpdateInput> & PortfolioItemUpdateInput'. Type '{ publishedAt?: string | undefined;
updatedAt: string; title?: string | undefined; description?: string | null | undefined; categoryId?:
string | null | undefined; status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined; ... 5
more ...; thumbnailPath?: string | ... 1 more ... | undefined; }' is not assignable to type
'Without<PortfolioItemUncheckedUpdateInput, PortfolioItemUpdateInput>'. Types of property
'categoryId' are incompatible. Type 'string | null | undefined' is not assignable to type
'undefined'. Type 'null' is not assignable to type 'undefined'.

204 data: updateData, ~~~~

node_modules/.prisma/client/index.d.ts:5029:5 5029 data: XOR<PortfolioItemUpdateInput,
PortfolioItemUncheckedUpdateInput> ~~~~ The expected type comes from property 'data' which is
declared here on type '{ select?: PortfolioItemSelect<DefaultArgs> | null | undefined; omit?:
PortfolioItemOmit<DefaultArgs> | null | undefined; include?: PortfolioItemInclude<...> | ... 1 more
... | undefined; data: (Without<...> & PortfolioItemUncheckedUpdateInput) | (Without<...> &
PortfolioItemUpdateInput); where: PortfolioItemWhereUn...'

src/lib/email.ts:39:21 - error TS2551: Property 'createTransporter' does not exist on type 'typeof
import("/home/marax/kili/PortfolioWebapp/node_modules/@types/nodemailer/index")'. Did you mean
'createTransport'?

39 return nodemailer.createTransporter({ ~~~~~~~~~~~~~~~~~

node_modules/@types/nodemailer/index.d.ts:45:17 45 export function createTransport( ~~~~~~~~~~~~~~~
'createTransport' is declared here.

src/lib/email.ts:355:61 - error TS2339: Property 'createdAt' does not exist on type '{ id: string;
name: string; email: string; subject?: string | undefined; category: string; }'.

355 <p><strong>Datum:</strong> ${new Date(inquiry.createdAt).toLocaleString('de-DE')}</p> ~~~~~~~~~

src/lib/email.ts:358:25 - error TS2339: Property 'budgetRange' does not exist on type '{ id: string;
name: string; email: string; subject?: string | undefined; category: string; }'.

358 ${inquiry.budgetRange ? `<p><strong>Budget:</strong> ${inquiry.budgetRange}</p>` : ''}
~~~~~~~~~~~

src/lib/email.ts:358:78 - error TS2339: Property 'budgetRange' does not exist on type '{ id: string;
name: string; email: string; subject?: string | undefined; category: string; }'.

358 ${inquiry.budgetRange ? `<p><strong>Budget:</strong> ${inquiry.budgetRange}</p>` : ''}
~~~~~~~~~~~

src/lib/email.ts:359:25 - error TS2339: Property 'eventDate' does not exist on type '{ id: string;
name: string; email: string; subject?: string | undefined; category: string; }'.

359 ${inquiry.eventDate ?
`<p><strong>Event Datum:</strong> ${new Date(inquiry.eventDate).toLocaleDateString('de-DE')}</p>` :
''} ~~~~~~~~~

src/lib/email.ts:359:90 - error TS2339: Property 'eventDate' does not exist on type '{ id: string;
name: string; email: string; subject?: string | undefined; category: string; }'.

359 ${inquiry.eventDate ?
`<p><strong>Event Datum:</strong> ${new Date(inquiry.eventDate).toLocaleDateString('de-DE')}</p>` :
''} ~~~~~~~~~

src/lib/email.ts:362:56 - error TS2339: Property 'message' does not exist on type '{ id: string;
name: string; email: string; subject?: string | undefined; category: string; }'.

362 <p style="font-style: italic;">${inquiry.message}</p> ~~~~~~~

src/lib/error-handler.ts:124:9 - error TS2353: Object literal may only specify known properties, and
'metadata' does not exist in type '{ route?: string | undefined; operation?: string | undefined;
inputData?: Record<string, unknown> | undefined; }'.

124 metadata: context?.metadata, ~~~~~~~~

src/lib/logger.ts:121:3 121 context?: { ~~~~~~~ The expected type comes from property 'context'
which is declared here on type 'Omit<ErrorLogEntry, "timestamp">'

src/lib/error-handler.ts:176:30 - error TS2339: Property 'errors' does not exist on type
'ZodError<unknown>'.

176 const details = (error.errors || []).reduce( ~~~~~~

src/lib/error-handler.ts:177:10 - error TS7006: Parameter 'acc' implicitly has an 'any' type.

177 (acc, err) => { ~~~

src/lib/error-handler.ts:177:15 - error TS7006: Parameter 'err' implicitly has an 'any' type.

177 (acc, err) => { ~~~

src/lib/image-processor.ts:360:15 - error TS2339: Property 'dominant' does not exist on type '{
data: Buffer<ArrayBufferLike>; info: OutputInfo; }'.

360 const { dominant } = await sharp(buffer) ~~~~~~~~

src/lib/logger.ts:160:49 - error TS2339: Property 'slice' does not exist on type '{}'.

160 const reqId = requestId ? `[${requestId.slice(0, 8)}]` : ''; ~~~~~

src/lib/logger.ts:161:45 - error TS2339: Property 'toUpperCase' does not exist on type '{}'.

161 const cat = category ? `[${category.toUpperCase()}]` : ''; ~~~~~~~~~~~

src/lib/logger.ts:216:9 - error TS2353: Object literal may only specify known properties, and
'filter' does not exist in type 'FileTransportOptions'.

216 filter: info => info.category === LogCategory.SECURITY, ~~~~~~

src/lib/logger.ts:216:17 - error TS7006: Parameter 'info' implicitly has an 'any' type.

216 filter: info => info.category === LogCategory.SECURITY, ~~~~

src/lib/middleware/logging.ts:85:20 - error TS2339: Property 'ip' does not exist on type
'NextRequest'.

85 return request.ip || 'unknown'; ~~

src/lib/middleware/logging.ts:284:7 - error TS2322: Type '"UNAUTHORIZED_ACCESS" |
"PERMISSION_DENIED" | "SUSPICIOUS_ACTIVITY" | "RATE_LIMITED"' is not assignable to type
'"LOGIN_SUCCESS" | "LOGIN_FAILURE" | "UNAUTHORIZED_ACCESS" | "PERMISSION_DENIED" |
"SUSPICIOUS_ACTIVITY"'. Type '"RATE_LIMITED"' is not assignable to type '"LOGIN_SUCCESS" |
"LOGIN_FAILURE" | "UNAUTHORIZED_ACCESS" | "PERMISSION_DENIED" | "SUSPICIOUS_ACTIVITY"'.

284 eventType, ~~~~~~~~~

src/lib/logger.ts:57:3 57 eventType: ~~~~~~~~~ The expected type comes from property 'eventType'
which is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/middleware/logging.ts:293:9 - error TS2353: Object literal may only specify known
properties, and 'timestamp' does not exist in type '{ attempts?: number | undefined; blockedReason?:
string | undefined; riskScore?: number | undefined; }'.

293 timestamp: new Date().toISOString(), ~~~~~~~~~

src/lib/logger.ts:64:3 64 details?: { ~~~~~~~ The expected type comes from property 'details' which
is declared here on type 'Omit<SecurityLogEntry, "timestamp">'

src/lib/middleware/logging.ts:328:34 - error TS2345: Argument of type '[NextRequest, ...T]' is not
assignable to parameter of type 'T'. '[NextRequest, ...T]' is assignable to the constraint of type
'T', but 'T' could be instantiated with a different subtype of constraint 'unknown[]'.

328 response = await handler(request, ...args); ~~~~~~~~~~~~~~~~
