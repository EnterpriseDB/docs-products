import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';
import LeftNav from '../components/left-nav';
import TableOfContents from '../components/table-of-contents';
import TopBar from '../components/top-bar';
import SideNavigation from '../components/side-navigation';
import MainContent from '../components/main-content';
import Footer from '../components/footer';

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

const ContentRow = ({ children }) => (
  <div class="container p-0 mt-4">
    <Row>{children}</Row>
  </div>
);

const getChildren = (path, navLinks) => {
  return navLinks.filter(
    node =>
      node.fields.path.includes(path) &&
      node.fields.path.split('/').length === path.split('/').length + 1,
  );
};

const Tiles = ({ mdx, navLinks }) => {
  const { path } = mdx.fields;
  const depth = path.split('/').length;
  if (depth === 3) {
    const tiles = getChildren(path, navLinks).map(child => {
      let newChild = { ...child };
      const { path } = newChild.fields;
      newChild['children'] = getChildren(path, navLinks);
      return newChild;
    });
    console.log(tiles);

    return (
      <>
        {tiles.map(tile => {
          return (
            <>
              <div>{tile.frontmatter.title}</div>
              <div>{tile.frontmatter.description}</div>
              {tile.children.map(child => (
                <>
                  <div>{child.frontmatter.title}</div>
                </>
              ))}
            </>
          );
        })}
      </>
    );
  }
  if (depth === 4) {
    const tiles = getChildren(path, navLinks);
    return (
      <>
        {tiles.map(tile => (
          <>
            <div>{tile.frontmatter.title}</div>
            <div>{tile.frontmatter.description}</div>
          </>
        ))}
      </>
    );
  }
  return <div>hi</div>;
};

const LearnDocTemplate = ({ data, pageContext }) => {
  const { mdx } = data;
  const { navLinks, githubLink } = pageContext;
  debugger;

  return (
    <Layout>
      <TopBar />
      <Container className="p-0 d-flex bg-white">
        <SideNavigation>
          <LeftNav navLinks={navLinks} path={mdx.fields.path} />
        </SideNavigation>
        <MainContent>
          <h1 className="balance-text">{mdx.frontmatter.title}</h1>
          <a href={githubLink}>edit on github</a>
          <ContentRow>
            <Col md={9}>
              <MDXRenderer>{mdx.body}</MDXRenderer>
              <Tiles mdx={mdx} navLinks={navLinks} />
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

export default LearnDocTemplate;
