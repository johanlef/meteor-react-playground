import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AdminDashboard, { AdminAlerts } from '@lefapps/admin-dashboard'

import NotFound from './app/NotFound'
import setup from './app/setup'

class App extends Component {
  render () {
    return (
      <AdminAlerts>
        <BrowserRouter>
          <AdminDashboard
            settings={setup}
            label={'Play Ground'}
            notFoundComponent={NotFound}
          />
        </BrowserRouter>
      </AdminAlerts>
    )
  }
}

export default App
