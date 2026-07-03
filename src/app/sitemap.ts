import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.typelively.app';

  // Main core URLs
  const routes = [
    '',
    '/practice',
    '/daily',
    '/coding',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const baseEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic typing-test landing pages
  const typingTestSlugs = [
    '1-minute-typing-test',
    '3-minute-typing-test',
    '5-minute-typing-test',
    '10-minute-typing-test',
    '1-page-typing-test',
    '2-page-typing-test',
    '5-page-typing-practice',
    'python-typing-test',
    'javascript-typing-test',
    'html-typing-test',
    'easy-typing-test',
    'medium-typing-test',
    'hard-typing-test',
    'english-typing-test',
    'hindi-typing-test',
    'gujarati-typing-test',
    'coding-typing-practice',
    'beginner-typing-practice',
  ];

  const testEntries = typingTestSlugs.map((slug) => ({
    url: `${baseUrl}/typing-tests/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...baseEntries, ...testEntries];
}
