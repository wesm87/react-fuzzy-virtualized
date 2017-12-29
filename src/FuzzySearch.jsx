// @flow

import React, { PureComponent, type Node } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Fuse, { type FuseOptions } from 'fuse.js'
import {
  pipe,
  prop,
  identity,
  complement,
  isNil,
  isEmpty,
  ifElse,
  always,
  anyPass,
} from 'ramda'

const KEY_CODE_DOWN = 40
const KEY_CODE_UP = 38
const KEY_CODE_ENTER = 13

const isNotNilOrEmpty = complement(anyPass([isNil, isEmpty]))

export const SearchContainer = styled.div`
  padding: 4px;
  box-shadow: 0 4px 15px 4px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  background-color: #fff;
`

export const SearchInput = styled.input.attrs({ type: 'text' })`
  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #eee;
  border-radius: 2px;
  line-height: 24px;
  font-size: 16px;
  font-family: inherit;
  color: #666;
`

export const SearchResultsContainer = styled.div`
  box-sizing: border-box;
  position: relative;
  overflow: auto;
  width: 100%;
  max-height: 400px;
  border: 1px solid #eee;
  border-top: 0;
  box-shadow: 0px 12px 30px 2px rgba(0, 0, 0, 0.1);
`

const getSearchResultBackgroundColor = ifElse(
  prop('active'),
  always('#f9f9f9'),
  always('#fff'),
)

export const SearchResult = styled.div`
  position: relative;
  padding: 12px;
  border-top: 1px solid #eee;
  font-size: 14px;
  background-color: ${getSearchResultBackgroundColor};
  color: #666;
`

type State = {
  results: Array<Object>,
  selectedValue: Object,
  activeResultIndex: number,
}

// eslint-disable-next-line no-use-before-define
type RenderResultsProps = Props & {
  onClick: (value: Object) => void,
}

type OptionalProps = {
  id?: string,
  className?: string,
  width: number | string,
  placeholder: string,
  autoFocus: boolean,
  fuseOptions: FuseOptions,
  filterResults: (results: Array<Object>) => Array<Object>,
  renderResults: (props: RenderResultsProps, state: State) => Node | Array<Node>,
}

type RequiredProps = {
  onSelect: (value: Object) => void,
  list: Array<Object>,
}

type Props = OptionalProps & RequiredProps

const renderResultsDefault = (props: RenderResultsProps, state: State): Node | Array<Node> => {
  const { onClick } = props
  const { results, activeResultIndex } = state

  return results.map((value, i) => {
    const isActive = activeResultIndex === i
    const handleClick = () => onClick(value)

    return (
      <SearchResult key={i} active={isActive} onClick={handleClick}>
        {prop('title', value)}
      </SearchResult>
    )
  })
}

export default class FuzzySearch extends PureComponent<Props, State> {
  static defaultProps: OptionalProps = {
    width: 430,
    placeholder: 'Search',
    autoFocus: false,
    fuseOptions: {},
    filterResults: identity,
    renderResults: renderResultsDefault,
  };

  props: Props
  state: State = {
    results: [],
    selectedValue: {},
    activeResultIndex: 0,
  }

  _inputRef: ?Node = null
  _fuse: ?Fuse<{}> = null

  componentWillMount() {
    const { list, fuseOptions } = this.props

    this._fuse = new Fuse(list, fuseOptions)
  }

  setInputRef = (ref: Node) => {
    this._inputRef = ref
  }

  getInputRef = () => this._inputRef

  getResults = (value: string): Array<Object> => {
    const { filterResults } = this.props
    const { search } = (this._fuse || {})

    if (!search) {
      return []
    }

    return pipe(
      search,
      filterResults,
    )(value)
  }

  handleChange = (event: SyntheticInputEvent<EventTarget>): void => {
    const { value } = event.target

    this.setState({
      results: this.getResults(value),
    })
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<EventTarget>): void => {
    const { keyCode } = event
    const { results, activeResultIndex } = this.state
    const { onSelect } = this.props

    const maxIndex = results.length - 1

    if (keyCode === KEY_CODE_DOWN && activeResultIndex < maxIndex) {
      this.setState({
        activeResultIndex: activeResultIndex + 1,
      })
    } else if (keyCode === KEY_CODE_UP && activeResultIndex > 0) {
      this.setState({
        activeResultIndex: activeResultIndex - 1,
      })
    } else if (keyCode === KEY_CODE_ENTER) {
      const selectedValue = results[activeResultIndex]

      if (selectedValue) {
        onSelect(selectedValue)
        this.setState({ selectedValue })
      }

      this.setState({
        results: [],
        activeResultIndex: 0,
      })
    }
  }

  handleMouseClick = (value: Object): void => {
    const { onSelect } = this.props

    if (value) {
      onSelect(value)
    }

    this.setState({
      results: [],
      activeResultIndex: 0,
    })
  }

  clearActiveResult = () => {
    this.setState({
      results: [],
      activeResultIndex: 0,
    })
  }

  render(): Node {
    const {
      className,
      width,
      placeholder,
      autoFocus,
      renderResults,
    } = this.props

    const { results, selectedValue } = this.state

    const containerClassName = classNames('react-fuzzy-container', className)

    const renderResultsProps = {
      ...this.props,
      onClick: this.handleMouseClick,
    }

    const { title = '' } = (selectedValue || {})

    return (
      <div
        className={containerClassName}
        onKeyDown={this.handleKeyDown}
        style={{ width }}
      >
        <SearchContainer>
          <SearchInput
            ref={this.setInputRef}
            value={title}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onChange={this.handleChange}
          />
        </SearchContainer>
        {isNotNilOrEmpty(results) && (
          <SearchResultsContainer>
            {renderResults(renderResultsProps, this.state)}
          </SearchResultsContainer>
        )}
      </div>
    )
  }
}
