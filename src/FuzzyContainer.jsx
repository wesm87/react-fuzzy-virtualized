// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Fuse, { type FuseOptions } from 'fuse.js'
import {
  pipe,
  prop,
  take,
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
    const handleClick = () => onClick(i)

    return (
      <Result key={i} selected={isSelected} onClick={handleClick}>
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
  id?: string,
  className?: string,
  width: number | string,
  placeholder: string,
  renderResults: (props: RenderResultsProps, state: State) => Node,
  autoFocus: boolean,
  maxResults: number,
  fuseOptions: FuseOptions,
}

type RequiredProps = {
  onSelect: (value: {}) => void,
  list: Array<{}>,
}

type Props = OptionalProps & RequiredProps

export default class FuzzyContainer extends PureComponent {
  static defaultProps: OptionalProps = {
    width: 430,
    placeholder: 'Search',
    renderResults: renderResultsDefault,
    autoFocus: false,
    maxResults: 10,
    fuseOptions: {},
  };

  props: Props
  state: State = {
    results: [],
    selectedIndex: 0,
    selectedValue: {},
  }

  _inputRef: Node = null

  componentWillMount() {
    const { list, fuseOptions } = this.props

    this.fuse = new Fuse(list, fuseOptions)
  }

  setInputRef = (ref) => {
    this._inputRef = ref
  }

  getInputRef = () => this._inputRef

  getResults = pipe(
    take(this.props.maxResults),
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

    const maxIndex = results.length - 1

    if (keyCode === 40 && selectedIndex < maxIndex) {
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
