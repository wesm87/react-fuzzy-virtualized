import React from 'react';
import { prop, complement, isNil, isEmpty, anyPass } from 'ramda';

import { SearchResult } from './styled';
import type { RenderResultsProps } from './types';

export const isNotNilOrEmpty = complement(anyPass([isNil, isEmpty]));

export const renderResultsDefault = (props: RenderResultsProps) => {
  const { onClick, results, activeResultIndex } = props;

  return results.map((value, index) => {
    const isActive = activeResultIndex === index;
    const handleClick = () => onClick(value);

    return (
      <SearchResult
        key={index}
        className="FuzzySearch-searchResult"
        isActive={isActive}
        onClick={handleClick}
      >
        {prop('title', value)}
      </SearchResult>
    );
  });
};
