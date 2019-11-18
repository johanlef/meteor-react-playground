import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

const UserContext = React.createContext('meteorUser')

const UserContainer = withTracker(props => {
  const user = Meteor.isServer ? null : Meteor.user()
  const userId = Meteor.isServer ? null : Meteor.userId()
  return {
    meteorUser: {
      user,
      userId,
      isLoggedIn: !!userId
    }
  }
})

const Provider = props => {
  return (
    <UserContext.Provider value={props.meteorUser}>
      {props.children}
    </UserContext.Provider>
  )
}

const UserProvider = UserContainer(Provider)

const withUser = Component => {
  return function UserComponent (props) {
    return (
      <UserContext.Consumer>
        {meteorUser => <Component {...props} {...meteorUser} />}
      </UserContext.Consumer>
    )
  }
}

export { withUser, UserProvider }
