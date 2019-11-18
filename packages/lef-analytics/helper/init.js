import ReactGA from 'react-ga'

const gaInit = ({ trackingId, options, optIn }) => {
  if (trackingId) {
    if (optIn) window[`ga-disable-${trackingId}`] = true
    else ReactGA.initialize(trackingId, options)
  }
}

export default gaInit
