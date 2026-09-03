type LinkItem = { name: string; url: string };
type SiteUrl = URL | undefined;

const absolute = (site: SiteUrl, path: string) => new URL(path, site ?? 'https://www.shiftby.pro').href;

export function publisherGraph(site: SiteUrl) {
  const about = absolute(site, '/about/');
  return { '@type': 'Person', '@id': `${about}#author`, name: 'Ananda Krishna Marri', url: about };
}

export function homeStructuredData(site: SiteUrl) {
  const url = absolute(site, '/');
  const person = publisherGraph(site);
  return { '@context': 'https://schema.org', '@graph': [person,
    { '@type': 'WebSite', '@id': `${url}#website`, url, name: 'Shiftby.pro', publisher: { '@id': person['@id'] } },
    { '@type': 'WebPage', '@id': url, url, name: 'Shiftby.pro — Independent Fieldwork on AI-Assisted Work', isPartOf: { '@id': `${url}#website` }, about: { '@id': `${url}#website` } },
  ] };
}

export function aboutStructuredData(site: SiteUrl) {
  const url = absolute(site, '/about/');
  const person = publisherGraph(site);
  return { '@context': 'https://schema.org', '@graph': [person, { '@type': 'AboutPage', '@id': url, url, name: 'About Shiftby.pro', mainEntity: { '@id': person['@id'] } }] };
}

export function collectionStructuredData(site: SiteUrl, path: string, name: string, description: string, items: LinkItem[], type: 'CollectionPage' | 'WebPage' = 'CollectionPage') {
  const url = absolute(site, path);
  const person = publisherGraph(site);
  return { '@context': 'https://schema.org', '@graph': [person,
    { '@type': type, '@id': url, url, name, description, publisher: { '@id': person['@id'] }, mainEntity: { '@type': 'ItemList', '@id': `${url}#items`, numberOfItems: items.length, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: item.url })) } },
  ] };
}

export function projectStructuredData(site: SiteUrl, items: LinkItem[]) {
  const url = absolute(site, '/projects/inspiral/');
  const person = publisherGraph(site);
  return { '@context': 'https://schema.org', '@graph': [person,
    { '@type': 'Project', '@id': `${url}#project`, name: 'Inspiral', description: 'An active exploration of AI-assisted knowledge continuity.', url },
    { '@type': 'CollectionPage', '@id': url, url, name: 'Inspiral — Persistent Understanding for Agentic Work', isPartOf: { '@id': `${url}#project` }, mainEntity: { '@id': `${url}#project` }, publisher: { '@id': person['@id'] }, hasPart: items.map((item) => ({ '@type': 'Article', name: item.name, url: item.url })) },
  ] };
}
