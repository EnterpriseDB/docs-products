import React from 'react';
import {
  Index,
  Hits,
  connectStateResults,
  connectPagination,
  connectCurrentRefinements,
} from 'react-instantsearch-dom';
import {
  AdvancedPageHit,
  ResultTabulator,
} from './index';
import { products } from '../../constants/products';
import { docsIndex, learnIndex } from '../search/indices';

const ResultsSummary = connectCurrentRefinements(connectStateResults(
  ({ searchResults: res, resultTotal, items}) => {
    const resultCount = resultTotal || (res && res.nbHits);
    const query = res && res.query;
    const [product, version] = items.length > 0 && items[0].currentRefinement.split(' > ');
    const productName = products[product] ? products[product].name : product;

    return (
      <p className="search-text-summary">
        {resultCount} result{resultCount !== 1 && 's'} for "{query}"
        { productName && ' in ' }
        { productName && <span className='font-weight-400'>{productName}</span> }
        { version && ' and ' }
        { version && <span className='font-weight-400'>Version {version}</span> }
      </p>
    );
  }
));

const Pagination = connectPagination(
  ({ currentRefinement, nbPages, refine }) => {
    const previousEnabled = currentRefinement > 1;
    const nextEnabled = currentRefinement < nbPages;
    const goPrevious = (e) => {
      refine(currentRefinement - 1);
      e.preventDefault();
    };
    const goNext = (e) => {
      refine(currentRefinement + 1);
      e.preventDefault();
    };

    if (previousEnabled || nextEnabled) {
      return (
        <div className="mt-5">
          <hr/>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="max-w-40">
              <a
                href="/"
                className={`p-3 d-inline-block btn btn-outline-primary text-left ${!previousEnabled && 'disabled-grey'}`}
                onClick={goPrevious}
                disabled={!previousEnabled}
              >
                <h5 className="m-0">&larr; Previous Page</h5>
              </a>
            </div>
            <div>
              {currentRefinement} / {nbPages}
            </div>
            <div className="max-w-40">
              <a
                href="/"
                className={`p-3 d-inline-block btn btn-outline-primary text-right ${!nextEnabled && 'disabled-grey'}`}
                onClick={goNext}
                disabled={!nextEnabled}
              >
                <h5 className="m-0">Next Page &rarr;</h5>
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
);

const ResultsContent = ({ children }) => (
  <div className="search-content mb-5">
    {children}
  </div>
);

const ResultsIndex = ({ index, setTotal, filterIndex }) => (
  <Index key={index.index} indexName={index.index} >
    <ResultTabulator setResultTotal={setTotal} />
    { (!filterIndex || filterIndex === index) && <Hits hitComponent={AdvancedPageHit} /> }
    { filterIndex === index && <Pagination /> }
  </Index>
);

export const AdvancedSearchResults = ({ query, filterIndex, learnTotal, setLearnTotal, docsTotal, setDocsTotal }) => {
  const queryLength = (query || '').length;
  const resultTotal = () => {
    if (filterIndex === docsIndex) {
      return docsTotal;
    } else if (filterIndex === learnIndex) {
      return learnTotal;
    }
    return docsTotal + learnTotal;
  }

  if (queryLength === 0) {
    return (
      <p className="search-text-summary">Please enter a search query to begin.</p>
    );
  }

  return (
    <ResultsContent>
      <ResultsSummary resultTotal={resultTotal()} />
      <ResultsIndex index={learnIndex} setTotal={setLearnTotal} filterIndex={filterIndex} />
      <ResultsIndex index={docsIndex} setTotal={setDocsTotal} filterIndex={filterIndex} />
      { !filterIndex && <Pagination /> }
    </ResultsContent>
  );
};
