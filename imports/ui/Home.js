import React from 'react'
import { Translate } from 'meteor/lef:translations'

import TokenLogin from './user/TokenLogin'

const Home = () => {
  return (
    <div>
      <h2>
        <Translate _id='home_title' />
      </h2>
      <hr />
      <Translate _id='home_content' md />
      <div>
        <TokenLogin />
      </div>
    </div>
  )
}

export default Home
