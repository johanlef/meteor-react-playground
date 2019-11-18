import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'reactstrap'

const defaultPerPage = 12

class InfiniteScroll extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: props.offset || 200,
      defaultLimit: props.visible || defaultPerPage
    }
  }
  componentDidMount () {
    window.addEventListener('scroll', this.onScroll, false)
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll, false)
  }
  componentDidUpdate () {
    window.addEventListener('scroll', this.onScroll, false)
  }
  onScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - this.state.offset &&
      !this.props.loading &&
      this.props.visible < this.props.total
    ) {
      this.props.onInfiniteScroll()
      window.removeEventListener('scroll', window.onScroll, false)
    }
  }
  render () {
    return (
      <>
        {this.props.children}
        {this.props.loading && Spinner ? (
          <div className={'my-4 text-center'}>
            <Spinner type={'grow'} color={'primary'} />
          </div>
        ) : null}
      </>
    )
  }
}

InfiniteScroll.propTypes = {
  visible: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  offset: PropTypes.number,
  loading: PropTypes.bool,
  onInfiniteScroll: PropTypes.func
}

export default InfiniteScroll
