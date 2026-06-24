import { CONFIG } from '../config';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: CONFIG.siteName,
    url: CONFIG.siteUrl,
    description: CONFIG.description,
    inLanguage: CONFIG.lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: CONFIG.siteUrl + '/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: CONFIG.siteName,
    url: CONFIG.siteUrl,
    description: CONFIG.description,
    logo: {
      '@type': 'ImageObject',
      url: CONFIG.siteUrl + '/og-default.png',
      width: 1200,
      height: 630,
    },
    sameAs: [
      'https://cnssmaroc.ma',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONFIG.contact,
      contactType: 'customer service',
      availableLanguage: ['fr', 'ar'],
    },
    founder: {
      '@type': 'Person',
      name: CONFIG.author.name,
      url: CONFIG.author.url,
    },
  };
}

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: CONFIG.author.name,
    url: CONFIG.author.url,
    jobTitle: CONFIG.author.credentials,
    worksFor: {
      '@type': 'Organization',
      name: CONFIG.siteName,
      url: CONFIG.siteUrl,
    },
    knowsAbout: [
      'Cotisations CNSS',
      'Protection sociale Maroc',
      'Retraite CNSS',
      'AMO Maroc',
      'TVA Maroc',
    ],
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function buildArticleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    image: {
      '@type': 'ImageObject',
      url: CONFIG.siteUrl + '/og-default.png',
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: CONFIG.author.name,
      url: CONFIG.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: CONFIG.siteName,
      url: CONFIG.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: CONFIG.siteUrl + '/og-default.png',
        width: 1200,
        height: 630,
      },
    },
    inLanguage: CONFIG.lang,
  };
}

export function buildSoftwareAppSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MAD',
    },
    author: {
      '@type': 'Person',
      name: CONFIG.author.name,
    },
  };
}
