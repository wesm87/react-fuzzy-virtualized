import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import Fuse from 'fuse.js';
import { identity } from 'ramda';

import {
  isInteger,
  isEnterKeyEvent,
  isUpKeyEvent,
  isDownKeyEvent,
} from './utils';
import type { Obj, Props } from './types';

const useFuseRef = ({ list, fuseOptions = {} }: Props) => {
  const fuseRef = useRef<Fuse<Obj, Obj> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(list, fuseOptions);

    return () => {
      fuseRef.current = null;
    };
  });

  return fuseRef;
};

const useFuzzySearch = (props: Props) => {
  const { onSelect, filterResults = identity } = props;

  const [results, setResults] = useState<Obj[]>([]);
  const [selectedValue, setSelectedValue] = useState<Obj | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);

  const fuseRef = useFuseRef(props);

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

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setResults(getResults(value));
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const maxIndex = results.length - 1;
    const canIncrementIndex = activeResultIndex < maxIndex;
    const canDecrementIndex = activeResultIndex > 0;

    if (isDownKeyEvent(event) && canIncrementIndex) {
      incrementActiveResultIndex(activeResultIndex);
      return;
    }

    if (isUpKeyEvent(event) && canDecrementIndex) {
      decrementActiveResultIndex(activeResultIndex);
      return;
    }

    if (isEnterKeyEvent(event)) {
      const selectedValue = results[activeResultIndex];

      if (selectedValue) {
        onSelect(selectedValue);
        setSelectedValue(selectedValue);
      }

      clearActiveResult();
    }
  }, []);

  const handleMouseClick = useCallback((value: Obj) => {
    if (value) {
      onSelect(value);
    }

    clearActiveResult();
  }, []);

  const result = useMemo(
    () => ({
      results,
      selectedValue,
      activeResultIndex,
      handleChange,
      handleKeyDown,
      handleMouseClick,
    }),
    [
      results,
      selectedValue,
      activeResultIndex,
      handleChange,
      handleKeyDown,
      handleMouseClick,
    ],
  );

  return result;
};

export default useFuzzySearch;
