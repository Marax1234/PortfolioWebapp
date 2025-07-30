src/app/contact/page.tsx:74:5 - error TS2322: Type 'Resolver<{ name: string; email: string; subject:
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

74 resolver: zodResolver(contactSchema), ~~~~~~~~

src/app/contact/page.tsx:163:46 - error TS2345: Argument of type '(data: ContactFormData) =>
Promise<void>' is not assignable to parameter of type 'SubmitHandler<TFieldValues>'. Types of
parameters 'data' and 'data' are incompatible. Type 'TFieldValues' is not assignable to type '{
name: string; email: string; subject: string; message: string; category: "NATURE" | "TRAVEL" |
"EVENT" | "VIDEOGRAPHY" | "OTHER"; gdprConsent: boolean; phone?: string | undefined; budgetRange?:
string | undefined; eventDate?: string | undefined; location?: string | undefined; }'. Type
'FieldValues' is missing the following properties from type '{ name: string; email: string; subject:
string; message: string; category: "NATURE" | "TRAVEL" | "EVENT" | "VIDEOGRAPHY" | "OTHER";
gdprConsent: boolean; phone?: string | undefined; budgetRange?: string | undefined; eventDate?:
string | undefined; location?: string | undefined; }': name, email, subject, message, and 2 more.

163 <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'> ~~~~~~~~

src/lib/db-utils.ts:207:7 - error TS2322: Type '{ publishedAt?: string | undefined; thumbnailPath?:
string | null | undefined; categoryId?: string | null | undefined; updatedAt: string; title?: string
| undefined; description?: string | null | undefined; ... 5 more ...; filePath?: string | undefined;
}' is not assignable to type '(Without<PortfolioItemUpdateInput, PortfolioItemUncheckedUpdateInput>
& PortfolioItemUncheckedUpdateInput) | (Without<...> & PortfolioItemUpdateInput)'. Type '{
publishedAt?: string | undefined; thumbnailPath?: string | null | undefined; categoryId?: string |
null | undefined; updatedAt: string; title?: string | undefined; description?: string | null |
undefined; ... 5 more ...; filePath?: string | undefined; }' is not assignable to type
'Without<PortfolioItemUncheckedUpdateInput, PortfolioItemUpdateInput> & PortfolioItemUpdateInput'.
Type '{ publishedAt?: string | undefined; thumbnailPath?: string | null | undefined; categoryId?:
string | null | undefined; updatedAt: string; title?: string | undefined; description?: string |
null | undefined; ... 5 more ...; filePath?: string | undefined; }' is not assignable to type
'Without<PortfolioItemUncheckedUpdateInput, PortfolioItemUpdateInput>'. Types of property
'categoryId' are incompatible. Type 'string | null | undefined' is not assignable to type
'undefined'. Type 'null' is not assignable to type 'undefined'.

207 data: updateData, ~~~~

node_modules/.prisma/client/index.d.ts:5029:5 5029 data: XOR<PortfolioItemUpdateInput,
PortfolioItemUncheckedUpdateInput> ~~~~ The expected type comes from property 'data' which is
declared here on type '{ select?: PortfolioItemSelect<DefaultArgs> | null | undefined; omit?:
PortfolioItemOmit<DefaultArgs> | null | undefined; include?: PortfolioItemInclude<...> | ... 1 more
... | undefined; data: (Without<...> & PortfolioItemUncheckedUpdateInput) | (Without<...> &
PortfolioItemUpdateInput); where: PortfolioItemWhereUn...'
