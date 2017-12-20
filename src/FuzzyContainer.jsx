// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Fuse from 'fuse.js'
import {
  pipe,
  prop,
  pick,
  slice,
  sortBy,
  isNil,
  isEmpty,
  complement,
  ifElse,
  always,
  anyPass,
} from 'ramda'

const nonePass = complement(anyPass)
const isNotNilOrEmpty = nonePass([isNil, isEmpty])

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

export const ResultsContainer = styled.div`
  box-sizing: border-box;
  position: relative;
  overflow: auto;
  width: 100%;
  max-height: 400px;
  border: 1px solid #eee;
  border-top: 0;
  box-shadow: 0px 12px 30px 2px rgba(0, 0, 0, 0.1);
`

const getResultBgColor = ifElse(
  prop('selected'),
  always('#f9f9f9'),
  always('#fff'),
)

export const Result = styled.div`
  position: relative;
  padding: 12px;
  border-top: 1px solid #eee;
  font-size: 14px;
  background-color: ${getResultBgColor};
  color: #666;
`

const renderResultsDefault = (props, state) => {
  const { onClick } = props
  const { results, selectedIndex } = state

  return results.map((val, i) => {
    const isSelected = selectedIndex === i

    return (
      <Result key={i} selected={isSelected} onClick={() => onClick(i)}>
        {prop('title', val)}
      </Result>
    )
  })
}

type State = {
  results: Array<*>,
  selectedIndex: number,
  selectedValue: {},
}

// eslint-disable-next-line no-use-before-define
type RenderResultsProps = Props & {
  onClick: (index: number) => void,
}

type OptionalProps = {
  caseSensitive?: boolean,
  className?: string,
  distance?: number,
  id?: string,
  include?: Array<*>,
  maxPatternLength?: number,
  width?: number | string,
  keys?: Array<string> | string,
  location?: number,
  placeholder?: string,
  renderResults?: (props: RenderResultsProps, state: State) => Node,
  shouldSort?: boolean,
  sortFn?: (a: number, b: number) => number,
  threshold?: number,
  tokenize?: boolean,
  verbose?: boolean,
  autoFocus?: boolean,
  maxResults?: number,
}

type RequiredProps = {
  onSelect: (value: {}) => void,
  list: Array<{}>,
}

type Props = OptionalProps & RequiredProps

export default class FuzzyContainer extends PureComponent {
  static defaultProps: OptionalProps = {
    caseSensitive: false,
    distance: 100,
    include: [],
    location: 0,
    width: 430,
    placeholder: 'Search',
    renderResults: renderResultsDefault,
    shouldSort: true,
    sortFn: sortBy(prop('score')),
    threshold: 0.6,
    tokenize: false,
    verbose: false,
    autoFocus: false,
    maxResults: 10,
  };

  props: Props
  state: State = {
    results: [],
    selectedIndex: 0,
    selectedValue: {},
  }

  _inputRef: Node = null

  componentWillMount() {
    const { list } = this.props

    this.fuse = new Fuse(list, this.getOptions())
  }

  setInputRef = (ref) => {
    this._inputRef = ref
  }

  getInputRef = () => this._inputRef

  getOptions = () => pick([
    'caseSensitive',
    'id',
    'include',
    'keys',
    'shouldSort',
    'sortFn',
    'tokenize',
    'verbose',
    'maxPatternLength',
    'distance',
    'threshold',
    'location',
  ], this.props)

  getResults = pipe(
    slice(0, this.props.maxResults - 1),
    this.fuse.search,
  )

  handleChange = (event) => {
    const { value } = event.target

    this.setState({
      results: this.getResults(value),
    })
  }

  handleKeyDown = (event) => {
    const { keyCode } = event
    const { results, selectedIndex } = this.state
    const { onSelect } = this.props

    if (keyCode === 40 && selectedIndex < results.length - 1) {
      this.setState({
        selectedIndex: selectedIndex + 1,
      })
    } else if (keyCode === 38 && selectedIndex > 0) {
      this.setState({
        selectedIndex: selectedIndex - 1,
      })
    } else if (keyCode === 13) {
      const selectedValue = results[selectedIndex]

      if (selectedValue) {
        onSelect(selectedValue)
        this.setState({ selectedValue })
      }

      this.setState({
        results: [],
        selectedIndex: 0,
      })
    }
  }

  handleMouseClick = (clickedIndex) => {
    const { results } = this.state
    const { onSelect } = this.props

    const selectedValue = results[clickedIndex]

    if (selectedValue) {
      onSelect(selectedValue)
    }

    this.setState({
      results: [],
      selectedIndex: 0,
    })
  }

  render() {
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

    return (
      <div
        className={containerClassName}
        style={{ width }}
        onKeyDown={this.handleKeyDown}
      >
        <SearchContainer>
          <SearchInput
            ref={this.setInputRef}
            value={prop('title', selectedValue)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onChange={this.handleChange}
          />
        </SearchContainer>
        {isNotNilOrEmpty(results) && (
          <ResultsContainer>
            {renderResults(renderResultsProps, this.state)}
          </ResultsContainer>
        )}
      </div>
    )
  }
}
