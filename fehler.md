🔍 DEBUG categoryPerformance: { categoriesCount: 4, categoryData: [ { name: 'Nature Photography',
itemCount: 3, totalViews: 1236 }, { name: 'Travel Photography', itemCount: 2, totalViews: 226 }, {
name: 'Event Photography', itemCount: 2, totalViews: 212 }, { name: 'Videography', itemCount: 1,
totalViews: 116 } ] } 🔍 DEBUG groupEventsByDay: { totalEvents: 994, dateRange: { startDate:
'2025-06-28T16:25:45.355Z', endDate: '2025-07-28T16:25:45.355Z' }, daysCount: 31, nonZeroDays: 31,
sampleDays: [ { date: '2025-06-28', count: 6 }, { date: '2025-06-29', count: 18 }, { date:
'2025-06-30', count: 16 }, { date: '2025-07-01', count: 16 }, { date: '2025-07-02', count: 26 } ] }
18:25:45.418 info Analytics dashboard data fetched successfully Analytics dashboard data fetched
successfully { "metadata": { "service": "portfolio-webapp", "environment": "development", "version":
"0.1.0", "category": "database", "requestId": "d63de153-c419-41c5-a009-10cd90bac9a8", "operation":
"READ", "table": "AnalyticsEvent, PortfolioItem, Category", "queryTime": 63, "rowsAffected": 3435,
"metadata": { "totalViews": 1790, "uniqueVisitors": 3435, "topContentCount": 5,
"trafficSourcesCount": 10 } } } 18:25:45.418 info Analytics dashboard data fetched successfully
Analytics dashboard data fetched successfully { "metadata": { "service": "portfolio-webapp",
"environment": "development", "version": "0.1.0", "category": "api", "requestId":
"d63de153-c419-41c5-a009-10cd90bac9a8", "method": "GET", "url":
"http://localhost:3000/api/analytics?period=30d", "ip": "unknown", "userAgent": "Mozilla/5.0
(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36
Edg/138.0.0.0", "statusCode": 200, "responseTime": 65, "metadata": { "adminUser":
"kilian@example.com", "dataPoints": { "totalViews": 1790, "uniqueVisitors": 3435, "portfolioItems":
8, "categories": 4 }, "timeRange": { "startDate": "2025-06-28T16:25:45.355Z", "endDate":
"2025-07-28T16:25:45.355Z", "totalEvents": 3435 }, "dbQueryTime": 63, "cached": false } } } GET
/api/analytics?period=30d 200 in 311ms prisma:query SELECT SUM(`viewCount`) FROM (SELECT
`main`.`portfolio_items`.`viewCount` FROM `main`.`portfolio_items` WHERE
(`main`.`portfolio_items`.`categoryId` = ? AND `main`.`portfolio_items`.`status` = ?) LIMIT ? OFFSET
?) AS `sub` prisma:query SELECT SUM(`viewCount`) FROM (SELECT `main`.`portfolio_items`.`viewCount`
FROM `main`.`portfolio_items` WHERE (`main`.`portfolio_items`.`categoryId` = ? AND
`main`.`portfolio_items`.`status` = ?) LIMIT ? OFFSET ?) AS `sub` prisma:query SELECT
SUM(`viewCount`) FROM (SELECT `main`.`portfolio_items`.`viewCount` FROM `main`.`portfolio_items`
WHERE (`main`.`portfolio_items`.`categoryId` = ? AND `main`.`portfolio_items`.`status` = ?) LIMIT ?
OFFSET ?) AS `sub` prisma:query SELECT SUM(`viewCount`) FROM (SELECT
`main`.`portfolio_items`.`viewCount` FROM `main`.`portfolio_items` WHERE
(`main`.`portfolio_items`.`categoryId` = ? AND `main`.`portfolio_items`.`status` = ?) LIMIT ? OFFSET
?) AS `sub`
