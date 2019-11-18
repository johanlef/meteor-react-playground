import React from 'react'
import { withRouter } from 'react-router'
import ReactGA from 'react-ga'

class PageView extends React.Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    if (ReactGA.ga()) ReactGA.pageview(this.props.location.pathname)
  }
  componentWillReceiveProps ({ location: { pathname } }) {
    const currentLocation = this.props.location
    if (location !== currentLocation && ReactGA.ga()) ReactGA.pageview(pathname)
  }
  render () {
    return this.props.children
  }
}

export default withRouter(PageView)
