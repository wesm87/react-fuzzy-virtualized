import styled from 'styled-components';
import { prop, ifElse, always } from 'ramda';

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
