[{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Resolver<{ title: string; categoryId: string; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string; description?: string | undefined; status?: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\" | undefined; featured?: boolean | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  Types of parameters 'values' and 'values' are incompatible.\n    Type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }' is not assignable to type '{ title: string; categoryId: string; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string; description?: string | undefined; status?: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\" | undefined; featured?: boolean | undefined; metadata?: { ...; } | undefined; }'.\n      Types of property 'tags' are incompatible.\n        Type 'string[]' is not assignable to type 'string'.",
	"source": "ts",
	"startLineNumber": 85,
	"startColumn": 5,
	"endLineNumber": 85,
	"endColumn": 13,
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'string' is not assignable to type '(string | undefined)[]'.",
	"source": "ts",
	"startLineNumber": 94,
	"startColumn": 7,
	"endLineNumber": 94,
	"endColumn": 11,
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type '(data: CreatePortfolioFormData) => Promise<void>' is not assignable to parameter of type 'SubmitHandler<TFieldValues>'.\n  Types of parameters 'data' and 'data' are incompatible.\n    Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n      Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 262,
	"startColumn": 45,
	"endLineNumber": 262,
	"endColumn": 53,
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 311,
	"startColumn": 25,
	"endLineNumber": 311,
	"endColumn": 32,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 336,
	"startColumn": 23,
	"endLineNumber": 336,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 350,
	"startColumn": 23,
	"endLineNumber": 350,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 371,
	"startColumn": 23,
	"endLineNumber": 371,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 402,
	"startColumn": 23,
	"endLineNumber": 402,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 431,
	"startColumn": 23,
	"endLineNumber": 431,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 466,
	"startColumn": 23,
	"endLineNumber": 466,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 480,
	"startColumn": 23,
	"endLineNumber": 480,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 494,
	"startColumn": 23,
	"endLineNumber": 494,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 508,
	"startColumn": 23,
	"endLineNumber": 508,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 522,
	"startColumn": 23,
	"endLineNumber": 522,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 536,
	"startColumn": 23,
	"endLineNumber": 536,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Control<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n  The types of '_options.resolver' are incompatible between these types.\n    Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues> | undefined' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }> | undefined'.\n      Type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, TFieldValues>' is not assignable to type 'Resolver<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }, any, { ...; }>'.\n        Type 'TFieldValues' is not assignable to type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }'.\n          Type 'FieldValues' is missing the following properties from type '{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?: { ...; } | undefined; }': title, categoryId, status, featured, and 3 more.",
	"source": "ts",
	"startLineNumber": 624,
	"startColumn": 23,
	"endLineNumber": 624,
	"endColumn": 30,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 12,
			"message": "The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ title: string; categoryId: string; status: \"PUBLISHED\" | \"DRAFT\" | \"REVIEW\" | \"ARCHIVED\"; featured: boolean; mediaType: \"IMAGE\" | \"VIDEO\"; filePath: string; tags: string[]; description?: string | undefined; metadata?...'",
			"resource": "/home/marax/PortfolioWebapp/node_modules/react-hook-form/dist/types/controller.d.ts"
		}
	],
	"modelVersionId": 1
},{
	"resource": "/home/marax/PortfolioWebapp/src/app/(admin)/admin/portfolio/create/page.tsx",
	"owner": "eslint",
	"code": {
		"value": "@next/next/no-img-element",
		"target": {
			"$mid": 1,
			"path": "/docs/messages/no-img-element",
			"scheme": "https",
			"authority": "nextjs.org"
		}
	},
	"severity": 4,
	"message": "Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element",
	"source": "eslint",
	"startLineNumber": 588,
	"startColumn": 27,
	"endLineNumber": 592,
	"endColumn": 29,
	"modelVersionId": 1
}]