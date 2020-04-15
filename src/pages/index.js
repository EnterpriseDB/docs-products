import React from 'react';
import Layout from '../components/layout';
import ContentCol from '../components/contentCol';
import IndexLinks from '../components/indexLinks';
import ProductGroups from '../components/productGroups';
import ArticleStubs from '../components/articleStubs';
import EdbLogo from '../components/edbLogo';
import { Container, Row, Col } from 'react-bootstrap';
import { indexLinkList, linkGroups, articles } from '../indexLinkList';
import styled from '@emotion/styled';

const FlexColumn = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 20px;
  h2 {
    font-size: 2rem;
  }
`;

const HeadlineWithStrap = ({ headline, strap }) => {
  return (
    <FlexColumn>
      <h2>{headline}</h2>
      <div>{strap}</div>
    </FlexColumn>
  );
};

export default () => {
  return (
    <>
      <Layout>
        <Container fluid>
          <Row>
            <Col md={3}>
              <EdbLogo />
              <IndexLinks indexLinkList={indexLinkList} />
            </Col>
            <ContentCol md={9}>
              <h1>welcome to docs</h1>
              <ProductGroups linkGroups={linkGroups} />
              <HeadlineWithStrap
                headline=" Learn EDB Postgres"
                strap="Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, asperiores!"
              />

              <ArticleStubs articles={articles} />
            </ContentCol>
          </Row>
        </Container>
      </Layout>
    </>
  );
};
