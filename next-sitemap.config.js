/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com',
  generateRobotsTxt: true,
  exclude: ['/account/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/account/', '/api/'] },
    ],
  },
}
