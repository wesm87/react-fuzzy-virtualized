import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode, ChangeEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import {
  prop,
  identity,
  complement,
  isNil,
  isEmpty,
  ifElse,
  always,
  anyPass,
} from 'ramda';

type GenericObject = { [key: string]: any };

const KEY_CODE_DOWN = 40;
const KEY_CODE_UP = 38;
const KEY_CODE_ENTER = 13;

const isNotNilOrEmpty = complement(anyPass([isNil, isEmpty]));

export const SearchContainer = styled.div`
  padding: 4px;
  box-shadow: 0 4px 15px 4px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  background-color: #fff;
`;

export const SearchInput = styled.input.attrs({
  type: 'text',
})`
  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #eee;
  border-radius: 2px;
  line-height: 24px;
  font-size: 16px;
  font-family: inherit;
  color: #666;
`;

export const SearchResultsContainer = styled.div`
  box-sizing: border-box;
  position: relative;
  overflow: auto;
  width: 100%;
  max-height: 400px;
  border: 1px solid #eee;
  border-top: 0;
  box-shadow: 0px 12px 30px 2px rgba(0, 0, 0, 0.1);
`;

const getSearchResultBackgroundColor = ifElse(
  prop('isActive'),
  always('#f9f9f9'),
  always('#fff'),
);

type SearchResultProps = {
  isActive: boolean;
};

export const SearchResult = styled.div<SearchResultProps>`
  position: relative;
  padding: 12px;
  border-top: 1px solid #eee;
  font-size: 14px;
  background-color: ${getSearchResultBackgroundColor};
  color: #666;
`;

type State = {
  results: Array<GenericObject>;
  selectedValue: GenericObject | null;
  activeResultIndex: number;
};

type RenderResultsProps = Props & {
  onClick: (value: GenericObject) => void;
};

type OptionalProps = {
  id?: string;
  className?: string;
  width: number | string;
  placeholder: string;
  autoFocus: boolean;
  fuseOptions: Fuse.IFuseOptions<any>;
  filterResults: (results: Array<GenericObject>) => Array<GenericObject>;
  renderResults: (
    props: RenderResultsProps,
    state: State,
  ) => ReactNode | Array<ReactNode>;
};

type RequiredProps = {
  onSelect: (value: GenericObject) => void;
  list: Array<GenericObject>;
};

type Props = OptionalProps & RequiredProps;

const renderResultsDefault = (
  props: RenderResultsProps,
  state: State,
): Array<ReactNode> => {
  const { onClick } = props;
  const { results, activeResultIndex } = state;

  return results.map((value, i) => {
    const isActive = activeResultIndex === i;
    const handleClick = () => onClick(value);

    return (
      <SearchResult key={i} isActive={isActive} onClick={handleClick}>
        {prop('title', value)}
      </SearchResult>
    );
  });
};

const FuzzySearch = (props: Props) => {
  const {
    className,
    width,
    placeholder,
    autoFocus,
    list,
    fuseOptions,
    filterResults,
    renderResults,
    onSelect,
  } = props;

  const inputRef = useRef(null);
  const fuseRef = useRef<Fuse<GenericObject, GenericObject> | null>(null);
  const [results, setResults] = useState<GenericObject[]>([]);
  const [selectedValue, setSelectedValue] = useState<GenericObject | null>(
    null,
  );
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);

  const renderFnState = useMemo(
    () => ({ results, selectedValue, activeResultIndex }),
    [results, selectedValue, activeResultIndex],
  );

  useEffect(() => {
    fuseRef.current = new Fuse(list, fuseOptions);
  });

  const getResults = useCallback((value: string): GenericObject[] => {
    const { search } = fuseRef.current ?? {};

    if (!search) {
      return [];
    }

    return filterResults(search(value));
  }, []);

  const setActiveResultIndexSafely = useCallback((index: number) => {
    setActiveResultIndex(isNaN(index) ? 0 : index);
  }, []);

  const clearActiveResult = useCallback(() => {
    setResults([]);
    setActiveResultIndex(0);
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;

      setResults(getResults(value));
    },
    [],
  );

  const handleKeyDown = useCallback((event: KeyboardEvent): void => {
    const { keyCode } = event;
    const maxIndex = results.length - 1;

    if (keyCode === KEY_CODE_DOWN && activeResultIndex < maxIndex) {
      setActiveResultIndexSafely(activeResultIndex + 1);
      return;
    }

    if (keyCode === KEY_CODE_UP && activeResultIndex > 0) {
      setActiveResultIndexSafely(activeResultIndex - 1);
      return;
    }

    if (keyCode === KEY_CODE_ENTER) {
      const selectedValue = results[activeResultIndex];

      if (selectedValue) {
        onSelect(selectedValue);
        setSelectedValue(selectedValue);
      }

      clearActiveResult();
    }
  }, []);

  const handleMouseClick = useCallback((value: GenericObject): void => {
    if (value) {
      onSelect(value);
    }

    clearActiveResult();
  }, []);

  const containerClassName = classNames('react-fuzzy-container', className);

  const renderResultsProps = {
    ...props,
    onClick: handleMouseClick,
  };

  const { title = '' } = selectedValue || {};

  return (
    <div
      className={containerClassName}
      onKeyDown={handleKeyDown}
      style={{ width }}
    >
      <SearchContainer>
        <SearchInput
          ref={inputRef}
          value={title}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={handleChange}
        />
      </SearchContainer>
      {isNotNilOrEmpty(results) && (
        <SearchResultsContainer>
          {renderResults(renderResultsProps, renderFnState)}
        </SearchResultsContainer>
      )}
    </div>
  );
};

FuzzySearch.defaultProps = {
  width: 430,
  placeholder: 'Search',
  autoFocus: false,
  fuseOptions: {},
  filterResults: identity,
  renderResults: renderResultsDefault,
};

export default FuzzySearch;
