import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import useFuzzySearch from './useFuzzySearch';
import { isNotNilOrEmpty, renderResultsDefault } from './utils';
import { SearchContainer, SearchInput, SearchResultsContainer } from './styled';
import type { Props } from './types';

const FuzzySearch = (props: Props) => {
  const {
    id,
    className,
    width = 430,
    placeholder = 'Search',
    autoFocus = false,
    renderResults = renderResultsDefault,
  } = props;

  const inputRef = useRef(null);

  const {
    results,
    selectedValue,
    activeResultIndex,
    handleChange,
    handleKeyDown,
    handleMouseClick,
  } = useFuzzySearch(props);

  const renderResultsProps = useMemo(
    () => ({
      results,
      selectedValue,
      activeResultIndex,
      onClick: handleMouseClick,
    }),
    [results, selectedValue, activeResultIndex, handleMouseClick],
  );

  const { title = '' } = selectedValue ?? {};

  return (
    <div
      id={id}
      className={cx('FuzzySearch-container', className)}
      onKeyDown={handleKeyDown}
      style={{ width }}
    >
      <SearchContainer className="FuzzySearch-searchContainer">
        <SearchInput
          className="FuzzySearch-searchInput"
          ref={inputRef}
          value={title}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={handleChange}
        />
      </SearchContainer>
      {isNotNilOrEmpty(results) && (
        <SearchResultsContainer className="FuzzySearch-searchResultsContainer">
          {renderResults(renderResultsProps)}
        </SearchResultsContainer>
      )}
    </div>
  );
};

FuzzySearch.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  fuseOptions: PropTypes.object,
  filterResults: PropTypes.func,
  renderResults: PropTypes.func,
};

export default FuzzySearch;
