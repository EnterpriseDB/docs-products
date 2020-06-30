const config = require('./config');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const docQuery = `
{
  allMdx {
    nodes {
      frontmatter {
        title
      }
      id
      fields {
        product
        path
        version
      }
      rawBody
    }
  }
 }
`;

const transformNodeDocs = node => {
  let newNode = node;
  newNode['title'] = node.frontmatter.title;
  newNode['path'] = node.fields.path;
  newNode['product'] = node.fields.product;
  newNode['version'] = node.fields.version;
  newNode['productVersion'] = node.fields.product + ' > ' + node.fields.version;
  delete newNode['frontmatter'];
  delete newNode['fields'];
  return newNode;
};

const transformNodeLearn = node => {
  let newNode = node;
  newNode['title'] = node.frontmatter.title;
  newNode['path'] = node.fields.path;
  delete newNode['frontmatter'];
  delete newNode['fields'];
  return newNode;
};

const makePathDictionary = nodes => {
  let dictionary = {};
  for (let node of nodes) {
    dictionary[node.fields.path] = node.frontmatter.title;
  }
  return dictionary;
};

const makeBreadcrumbs = (node, dictionary, advocacy = false) => {
  let depth = advocacy ? 3 : 4;
  let trail = '';
  const path = node.fields.path;
  const pathPieces = path.split('/');
  for (let i = depth; i < pathPieces.length; i++) {
    let parentPath = pathPieces.slice(0, i).join('/');
    trail += dictionary[parentPath] + ' / ';
  }
  return trail;
};

const addBreadcrumbsToNodes = (nodes, advocacy = false) => {
  const pathDictionary = makePathDictionary(nodes);
  let newNodes = [];
  for (let node of nodes) {
    let newNode = node;
    newNode['breadcrumb'] = makeBreadcrumbs(node, pathDictionary, advocacy);
    newNodes.push(newNode);
  }
  return newNodes;
};

const splitNodeContent = nodes => {
  let result = [];
  for (let node of nodes) {
    let order = 1;
    let content = node.rawBody.replace(/(\n)+/g, '\n');
    const contentArray = content.split('\n');
    let contentAggregator = '';
    let hitTocTree = false;
    for (let i = 0; i < contentArray.length; i++) {
      const section = contentArray[i];
      if (section.startsWith('<div class="toctree"')) {
        hitTocTree = true;
      }
      const cleanedSection = cleanSection(section);
      if (!hitTocTree && cleanedSection !== '') {
        contentAggregator += cleanedSection + ' ';
      }
      if (
        contentAggregator.length > 1000 ||
        (contentAggregator.length > 0 && i == contentArray.length - 1)
      ) {
        let newNode = { ...node };
        delete newNode['rawBody'];
        newNode['excerpt'] = contentAggregator;
        newNode.id = newNode.path + '-' + order;
        order += 1;
        result.push(newNode);
        contentAggregator = '';
      }
    }
  }
  return result;
};

const cleanSection = section => {
  if (
    section.length < 6 ||
    RegExp('<div class=.*>').test(section) ||
    section.includes('</div>') ||
    notStartWith(section, [
      '```',
      'title:',
      'navTitle:',
      'description:',
      '![',
      '<table',
      '</table',
      '---',
      '| ---',
      'import ',
    ])
  ) {
    return '';
  }
  return removeLeadingBrackets(
    removeTheseCharacters(section, [/\s\|\s/g, /`/g]),
  );
};

const notStartWith = (section, list) => {
  for (let item of list) {
    if (section.startsWith(item)) {
      return true;
    }
  }
  return false;
};

const removeTheseCharacters = (section, list) => {
  let newSection = section;
  for (let item of list) {
    newSection = newSection.replace(item, '');
  }
  return newSection;
};

const removeLeadingBrackets = section => {
  if (section.startsWith('> > > ')) {
    return section.substring(6);
  }
  if (section.startsWith('> > ')) {
    return section.substring(4);
  }
  if (section.startsWith('> ')) {
    return section.substring(2);
  }
  return section;
};

const queries = [
  {
    query: docQuery,
    transformer: ({ data }) =>
      splitNodeContent(
        addBreadcrumbsToNodes(
          data.allMdx.nodes.filter(node => !!node.fields.product),
        ).map(node => transformNodeDocs(node)),
      ),
    indexName: 'edb-products', // overrides main index name, optional
  },
  {
    query: docQuery,
    transformer: ({ data }) =>
      splitNodeContent(
        addBreadcrumbsToNodes(
          data.allMdx.nodes.filter(node => !node.fields.product),
          true,
        ).map(node => transformNodeLearn(node)),
      ),
    indexName: 'advocacy', // overrides main index name, optional
  },
];

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    title: 'EDB Docs',
    description:
      'EDB supercharges Postgres with products, services, and support to help you control database risk, manage costs, and scale efficiently.',
    baseUrl: 'https://edb-docs.herokuapp.com',
    imageUrl: 'https://edb-docs.herokuapp.com/images/social.jpg',
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'EDB Documentation',
        short_name: 'EDB Docs',
        start_url: '/',
        background_color: '#EBEFF2',
        theme_color: '#EBEFF2',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'standalone',
        icon: 'static/images/favicon.png', // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        optional_permissions: ['clipboardWrite'],
        crossOrigin: `use-credentials`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: 'docs',
      },
    },
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `advocacy_docs`,
        path: 'advocacy_docs',
        remote: `https://github.com/rocketinsights/edb_docs_advocacy`,
        patterns: `advocacy_docs/**`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/components/layout.js'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve:
              process.env.NODE_ENV === 'development'
                ? 'gatsby-remark-static-images'
                : 'gatsby-remark-images',
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              isIconAfterHeader: true,
              className: 'ml-1',
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: 'static/images',
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /static/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `source code pro\:400`, // you can also specify font weights and styles
        ],
      },
    },
    {
      // This plugin must be placed last in your list of plugins to ensure that it can query all the GraphQL data
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, // default: 1000,
        enablePartialUpdates: true,
      },
    },
  ],
};
