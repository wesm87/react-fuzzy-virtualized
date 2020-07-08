import React, { KeyboardEvent } from 'react';
import { shallow } from 'enzyme';

import {
  isEnterKeyEvent,
  isUpKeyEvent,
  isDownKeyEvent,
  renderResultsDefault,
} from '../utils';

import {
  KEY_ENTER,
  KEY_UP,
  KEY_UP_IE,
  KEY_DOWN,
  KEY_DOWN_IE,
  KEY_CODE_ENTER,
  KEY_CODE_UP,
  KEY_CODE_DOWN,
} from '../keyCodes';

import type { RenderResultsProps } from '../types';

describe('isEnterKeyEvent', () => {
  it('should return true if event.key is KEY_ENTER', () => {
    const mockEvent = { key: KEY_ENTER } as KeyboardEvent;

    expect(isEnterKeyEvent(mockEvent)).toBe(true);
  });

  it('should return true if event.keyCode is KEY_CODE_ENTER', () => {
    const mockEvent = { keyCode: KEY_CODE_ENTER } as KeyboardEvent;

    expect(isEnterKeyEvent(mockEvent)).toBe(true);
  });
});

describe('isUpKeyEvent', () => {
  it('should return true if event.key is KEY_UP', () => {
    const mockEvent = { key: KEY_UP } as KeyboardEvent;

    expect(isUpKeyEvent(mockEvent)).toBe(true);
  });

  it('should return true if event.key is KEY_UP_IE', () => {
    const mockEvent = { key: KEY_UP_IE } as KeyboardEvent;

    expect(isUpKeyEvent(mockEvent)).toBe(true);
  });

  it('should return true if event.keyCode is KEY_CODE_UP', () => {
    const mockEvent = { keyCode: KEY_CODE_UP } as KeyboardEvent;

    expect(isUpKeyEvent(mockEvent)).toBe(true);
  });
});

describe('isDownKeyEvent', () => {
  it('should return true if event.key is KEY_DOWN', () => {
    const mockEvent = { key: KEY_DOWN } as KeyboardEvent;

    expect(isDownKeyEvent(mockEvent)).toBe(true);
  });

  it('should return true if event.key is KEY_DOWN_IE', () => {
    const mockEvent = { key: KEY_DOWN_IE } as KeyboardEvent;

    expect(isDownKeyEvent(mockEvent)).toBe(true);
  });

  it('should return true if event.keyCode is KEY_CODE_DOWN', () => {
    const mockEvent = { keyCode: KEY_CODE_DOWN } as KeyboardEvent;

    expect(isDownKeyEvent(mockEvent)).toBe(true);
  });
});

describe('renderResultsDefault', () => {
  const MOCK_RESULTS = [
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
  ];

  const RenderProxy = ({
    results,
    activeResultIndex,
    onClick,
  }: Partial<RenderResultsProps>) => {
    const props = {
      results: results ?? MOCK_RESULTS,
      activeResultIndex: activeResultIndex ?? 0,
      onClick,
    } as RenderResultsProps;

    return <>{renderResultsDefault(props)}</>;
  };

  it('should render a list of results', () => {
    const wrapper = shallow(<RenderProxy />);

    expect(wrapper).toMatchSnapshot('with default props');
  });

  it('should set the first item to active by default', () => {
    const wrapper = shallow(<RenderProxy />);
    const activeItemWrapper = wrapper.find('.FuzzySearch-searchResult').at(0);

    expect(activeItemWrapper.prop('isActive')).toBe(true);
  });

  it('should change the active item based on the activeResultIndex', () => {
    const activeResultIndex = 1;
    const wrapper = shallow(
      <RenderProxy activeResultIndex={activeResultIndex} />,
    );
    const activeItemWrapper = wrapper
      .find('.FuzzySearch-searchResult')
      .at(activeResultIndex);

    expect(activeItemWrapper.prop('isActive')).toBe(true);
  });

  it('should trigger onClick with the selected value when an item is clicked', () => {
    const onClick = jest.fn();
    const clickedItemIndex = 2;
    const wrapper = shallow(<RenderProxy onClick={onClick} />);

    wrapper
      .find('.FuzzySearch-searchResult')
      .at(clickedItemIndex)
      .simulate('click');

    expect(onClick.mock.calls[0][0]).toEqual(MOCK_RESULTS[clickedItemIndex]);
  });
});
