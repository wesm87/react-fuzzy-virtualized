import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import Fuse from 'fuse.js';
import { identity } from 'ramda';

import type { Obj, Props } from './types';

const KEY_CODE_DOWN = 40;
const KEY_CODE_UP = 38;
const KEY_CODE_ENTER = 13;

const isIntegerPolyfill = (value: number): boolean =>
  typeof value === 'number' && isFinite(value) && Math.floor(value) === value;

const isInteger = Number.isInteger ?? isIntegerPolyfill;

const useFuzzySearch = (props: Props) => {
  const { list, onSelect, fuseOptions = {}, filterResults = identity } = props;

  const fuseRef = useRef<Fuse<Obj, Obj> | null>(null);
  const [results, setResults] = useState<Obj[]>([]);
  const [selectedValue, setSelectedValue] = useState<Obj | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);

  useEffect(() => {
    fuseRef.current = new Fuse(list, fuseOptions);

    return () => {
      fuseRef.current = null;
    };
  });

  const getResults = useCallback((value: string): Obj[] => {
    const { search } = fuseRef.current ?? {};

    if (!search) {
      return [];
    }

    return filterResults(search(value));
  }, []);

  const incrementActiveResultIndexBy = useCallback(
    (amount: number, index: number) => {
      if (isInteger(index)) {
        setActiveResultIndex(index + amount);
      }
    },
    [],
  );

  const incrementActiveResultIndex = useCallback((index: number) => {
    incrementActiveResultIndexBy(1, index);
  }, []);

  const decrementActiveResultIndex = useCallback((index: number) => {
    incrementActiveResultIndexBy(-1, index);
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
    const canIncrementIndex = activeResultIndex < maxIndex;
    const canDecrementIndex = activeResultIndex > 0;

    if (keyCode === KEY_CODE_DOWN && canIncrementIndex) {
      incrementActiveResultIndex(activeResultIndex);
      return;
    }

    if (keyCode === KEY_CODE_UP && canDecrementIndex) {
      decrementActiveResultIndex(activeResultIndex);
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

  const handleMouseClick = useCallback((value: Obj): void => {
    if (value) {
      onSelect(value);
    }

    clearActiveResult();
  }, []);

  const renderResultsProps = useMemo(
    () => ({
      results,
      selectedValue,
      activeResultIndex,
      onClick: handleMouseClick,
    }),
    [results, selectedValue, activeResultIndex, handleMouseClick],
  );

  const result = useMemo(
    () => ({
      results,
      selectedValue,
      renderResultsProps,
      handleChange,
      handleKeyDown,
    }),
    [results, selectedValue, renderResultsProps, handleChange, handleKeyDown],
  );

  return result;
};

export default useFuzzySearch;
