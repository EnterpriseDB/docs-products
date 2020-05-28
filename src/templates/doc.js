import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';
import LeftNav from '../components/left-nav';
import TableOfContents from '../components/table-of-contents';
import VersionDropdown from '../components/version-dropdown';
import TopBar from '../components/top-bar';
import SideNavigation from '../components/side-navigation';
import MainContent from '../components/main-content';
import Footer from '../components/footer';
import { leftNavs } from '../constants/left-navs';

export const query = graphql`
  query($path: String!) {
    mdx(fields: { path: { eq: $path } }) {
      frontmatter {
        title
      }
      fields {
        path
      }
      body
      tableOfContents
    }
  }
`;

const getProductUrlBase = path => {
  return path
    .split('/')
    .slice(0, 2)
    .join('/');
};

const getProductAndVersion = path => {
  return {
    product: path.split('/')[1],
    version: path.split('/')[2],
  };
};

const makeVersionArray = (versions, path) => {
  return versions.map(version => ({
    version: version,
    url: `${getProductUrlBase(path)}/${version}`,
  }));
};

const ContentHeaderWithVersion = ({ title, path, versionArray }) => (
  <div className="d-flex align-items-center justify-content-between">
    <h1 className="balance-text">{title}</h1>
    <div class="dropdown">
      {versionArray.length > 1 && (
        <VersionDropdown versionArray={versionArray} path={path} />
      )}
    </div>
  </div>
);

const ContentRow = ({ children }) => (
  <div class="container p-0 mt-4">
    <Row>{children}</Row>
  </div>
);

const getNavOrder = (product, version, leftNavs) => {
  if (leftNavs[product] && leftNavs[product][version]) {
    return leftNavs[product][version];
  }
  return null;
};

const DocTemplate = ({ data, pageContext }) => {
  const { mdx } = data;
  const { navLinks, versions } = pageContext;
  const versionArray = makeVersionArray(versions, mdx.fields.path);
  const { product, version } = getProductAndVersion(mdx.fields.path);
  const navOrder = getNavOrder(product, version, leftNavs);

  return (
    <Layout>
      <TopBar />
      <Container className="p-0 d-flex bg-white">
        <SideNavigation>
          <LeftNav
            navLinks={navLinks}
            path={mdx.fields.path}
            withVersions={true}
            navOrder={navOrder}
          />
        </SideNavigation>
        <MainContent>
          <ContentHeaderWithVersion
            title={mdx.frontmatter.title}
            path={mdx.fields.path}
            versionArray={versionArray}
          />

          <ContentRow>
            <Col md={9}>
              <MDXRenderer>{mdx.body}</MDXRenderer>
            </Col>

            <Col md={3}>
              {mdx.tableOfContents.items && (
                <TableOfContents toc={mdx.tableOfContents.items} />
              )}
            </Col>
          </ContentRow>

          <Footer />
        </MainContent>
      </Container>
    </Layout>
  );
};

export default DocTemplate;