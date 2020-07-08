import React from 'react';
import type { KeyboardEvent } from 'react';
import { prop, complement, isNil, isEmpty, anyPass } from 'ramda';

import {
  KEY_PROP_ENTER,
  KEY_PROP_UP,
  KEY_PROP_DOWN,
  KEY_CODES_MAP,
} from './keyCodes';
import { SearchResult } from './styled';
import type { RenderResultsProps } from './types';

export const isNotNilOrEmpty = complement(anyPass([isNil, isEmpty]));

const isIntegerPolyfill = (value: number): boolean =>
  typeof value === 'number' && isFinite(value) && Math.floor(value) === value;

export const isInteger = Number.isInteger ?? isIntegerPolyfill;

const isKeyboardEventForKey = (keyProp: string) => (event: KeyboardEvent) => {
  const { keys, keyCode } = KEY_CODES_MAP[keyProp] ?? {};

  if (!keys && !keyCode) {
    return false;
  }

  return keys.includes(event?.key) || event?.keyCode === keyCode;
};

export const isEnterKeyEvent = isKeyboardEventForKey(KEY_PROP_ENTER);
export const isUpKeyEvent = isKeyboardEventForKey(KEY_PROP_UP);
export const isDownKeyEvent = isKeyboardEventForKey(KEY_PROP_DOWN);

export const renderResultsDefault = (props: RenderResultsProps) => {
  const { results, activeResultIndex, onClick } = props;

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
