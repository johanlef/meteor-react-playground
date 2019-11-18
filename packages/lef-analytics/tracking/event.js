import ReactGA from 'react-ga'

const gaEvent = eventData => (ReactGA.ga() ? ReactGA.event(eventData) : null)

export default gaEvent
