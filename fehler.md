src/app/api/portfolio/**tests**/portfolio.test.ts:109:9 - error TS2322: Type '{ id: string; title:
string; description: string; mediaType: any; filePath: string; status: string; viewCount: number;
createdAt: string; category: { id: string; name: string; slug: string; description: null; sortOrder:
number; coverImage: null; isActive: boolean; createdAt: string; }; }[]' is not assignable to type
'({ category: { name: string; id: string; createdAt: Date; description: string | null; sortOrder:
number; slug: string; coverImage: string | null; isActive: boolean; } | null; } & { id: string; ...
15 more ...; userId: string | null; })[]'. Type '{ id: string; title: string; description: string;
mediaType: any; filePath: string; status: string; viewCount: number; createdAt: string; category: {
id: string; name: string; slug: string; description: null; sortOrder: number; coverImage: null;
isActive: boolean; createdAt: string; }; }' is not assignable to type '{ category: { name: string;
id: string; createdAt: Date; description: string | null; sortOrder: number; slug: string;
coverImage: string | null; isActive: boolean; } | null; } & { id: string; ... 15 more ...; userId:
string | null; }'. Type '{ id: string; title: string; description: string; mediaType: any; filePath:
string; status: string; viewCount: number; createdAt: string; category: { id: string; name: string;
slug: string; description: null; sortOrder: number; coverImage: null; isActive: boolean; createdAt:
string; }; }' is not assignable to type '{ category: { name: string; id: string; createdAt: Date;
description: string | null; sortOrder: number; slug: string; coverImage: string | null; isActive:
boolean; } | null; }'. The types of 'category.createdAt' are incompatible between these types. Type
'string' is not assignable to type 'Date'.

109 items: mockPortfolioItems, ~~~~~

src/app/api/portfolio/**tests**/portfolio.test.ts:350:9 - error TS2345: Argument of type '{ id:
string; title: string; description: string; mediaType: any; filePath: string; thumbnailPath: null;
tags: string; metadata: string; status: string; featured: boolean; sortOrder: number; viewCount:
number; ... 5 more ...; category: { ...; }; }' is not assignable to parameter of type '({ category:
{ name: string; id: string; createdAt: Date; description: string | null; sortOrder: number; slug:
string; coverImage: string | null; isActive: boolean; } | null; } & { ...; }) | Promise<...>'. Type
'{ id: string; title: string; description: string; mediaType: any; filePath: string; thumbnailPath:
null; tags: string; metadata: string; status: string; featured: boolean; sortOrder: number;
viewCount: number; ... 5 more ...; category: { ...; }; }' is not assignable to type '{ category: {
name: string; id: string; createdAt: Date; description: string | null; sortOrder: number; slug:
string; coverImage: string | null; isActive: boolean; } | null; } & { id: string; ... 15 more ...;
userId: string | null; }'. Type '{ id: string; title: string; description: string; mediaType: any;
filePath: string; thumbnailPath: null; tags: string; metadata: string; status: string; featured:
boolean; sortOrder: number; viewCount: number; ... 5 more ...; category: { ...; }; }' is not
assignable to type '{ category: { name: string; id: string; createdAt: Date; description: string |
null; sortOrder: number; slug: string; coverImage: string | null; isActive: boolean; } | null; }'.
The types of 'category.createdAt' are incompatible between these types. Type 'string' is not
assignable to type 'Date'.

350 mockCreatedItem ~~~~~~~~~~~~~~~
