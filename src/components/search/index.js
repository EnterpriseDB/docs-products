import React, { useState, useEffect, useCallback, createRef, useRef } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Configure,
  connectSearchBox,
} from 'react-instantsearch-dom';
import { Tab, Nav } from 'react-bootstrap';
import Icon, { iconNames } from '../icon/';
import {
  AdvancedSearchTabLink,
  SearchTab,
  SlashIndicator,
  ClearButton,
  SearchPane,
} from './formComps';

const searchClient = algoliasearch(
  'NQVJGNW933',
  '3c95fc5297e90a44b6467f3098a4e6ed',
);

const docsIndex = { title: 'Documentation', index: 'edb-products' };
const learnIndex = { title: 'Guides', index: 'advocacy' };

const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`mousedown`, `touchstart`]
  const detectClickOutside = event =>
    !ref.current.contains(event.target) && handler()
  useEffect(() => {
    for (const event of events)
      document.addEventListener(event, detectClickOutside)
    return () => {
      for (const event of events)
        document.removeEventListener(event, detectClickOutside)
    }
  })
};

const SearchForm = ({currentRefinement, refine, query}) => {
  const searchBarRef = createRef();
  const [focus, setFocus] = useState(false);
  const inputRef = createRef();
  const searchContentRef = useRef(null);
  const [arrowIndex, setArrowIndex] = useState(0);

  const close = useCallback(() => {
    setFocus(false);
    setArrowIndex(0);
  }, []);

  const moveArrowIndex = useCallback((key) => {
    const dropdownItems = searchContentRef.current.querySelector('.tab-pane.active').querySelectorAll('.dropdown-item');
    let nextIndex = arrowIndex;
    if (key === "ArrowDown") {
      nextIndex = Math.min(arrowIndex + 1, dropdownItems.length - 1);
    }
    if (key === 'ArrowUp') {
      nextIndex = Math.max(arrowIndex - 1, 0);
    }
    setArrowIndex(nextIndex);
    if (nextIndex === dropdownItems.length - 1) {
      searchContentRef.current.scrollTop = searchContentRef.current.scrollHeight;
    } else if (dropdownItems[nextIndex]) {
      dropdownItems[nextIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [searchContentRef, arrowIndex, setArrowIndex]);

  const searchKeyboardShortcuts = useCallback((e) => {
    const inputFocused = inputRef.current.id === document.activeElement.id;

    if (e.key === '/' && !inputFocused) {
      inputRef.current.focus();
      e.preventDefault();
    }

    if (inputFocused) {
      switch(e.key) {
        case 'Escape':
          inputRef.current.blur();
          close();
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          moveArrowIndex(e.key);
          e.preventDefault();
          break;
        case 'Enter':
          const dropdownItems = searchContentRef.current.querySelector('.tab-pane.active').querySelectorAll('.dropdown-item');
          dropdownItems[arrowIndex].click();
          e.preventDefault();
          break;
        default:
          // do nothing
      }
    }
  }, [inputRef, searchContentRef, arrowIndex, close, moveArrowIndex]);

  useEffect(() => {
    document.addEventListener("keydown", searchKeyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", searchKeyboardShortcuts);
    };
  }, [searchKeyboardShortcuts]);

  useClickOutside(searchBarRef, close);

  return (
    <div className={`${query.length > 0 && focus && 'shadow'}`} ref={searchBarRef}>
      <form noValidate action="" autoComplete="off" role="search" className={`search-form d-flex align-items-center ${query.length > 0 && focus && 'open'}`}>
        <Icon iconName={iconNames.SEARCH} className="fill-black ml-3 opacity-5 flex-shrink-0" width="22" height="22" />
        <input
          id='search-input'
          className="form-control form-control-lg border-0 pl-3"
          type="text"
          aria-label="search"
          placeholder="Search"
          value={currentRefinement}
          onChange={e => refine(e.currentTarget.value)}
          onFocus={() => setFocus(true)}
          ref={inputRef}
        />
        <ClearButton onClick={() => { refine('') }} className={`${query.length === 0 && 'd-none'}`} />
        <SlashIndicator query={query} />
      </form>

      <div
        className={`dropdown-menu w-100 p-0 ${query.length > 0 && focus && 'show'}`}
      >
        <Tab.Container defaultActiveKey={docsIndex.index}>
          <Tab.Content className="search-content mb-1 mt-1" ref={searchContentRef}>
            <SearchPane searchIndex={docsIndex} arrowIndex={arrowIndex} />
            <SearchPane searchIndex={learnIndex} arrowIndex={arrowIndex} />
          </Tab.Content>

          <Nav className="search-tabs" onSelect={() => {inputRef.current.focus(); setArrowIndex(0)}}>
            <SearchTab searchIndex={docsIndex} />
            <SearchTab searchIndex={learnIndex} />
            <AdvancedSearchTabLink />
          </Nav>
        </Tab.Container>
      </div>
    </div>
  );
};
const Search = connectSearchBox(SearchForm);

const SearchBar = () => {
  const ref = createRef();
  const [query, setQuery] = useState(``);

  return (
    <div className="w-100 position-relative" ref={ref}>
      <InstantSearch
        searchClient={searchClient}
        indexName={docsIndex.index}
        onSearchStateChange={({ query }) => setQuery(query)}
        className='dropdown'
      >
        <Configure hitsPerPage={30} />
        <Search query={query} />
      </InstantSearch>
    </div>
  );
};

export default SearchBar;
