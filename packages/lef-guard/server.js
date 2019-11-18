import Rules from './collections'
import { intersection } from 'lodash'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
  guard: ({ rule }) => {
    const ruleDoc = Rules.findOne({ _id: rule })
    if (!ruleDoc) {
      Rules.insert({ _id: rule, allowedFor: [] })
      return false
    } else {
      const { allowedFor } = ruleDoc
      if (allowedFor.includes('noRole') && !Meteor.userId()) return true
      const user = Meteor.user()
      if (!user) return false
      return intersection(allowedFor, user.roles).length > 0
    }
  }
})

export default Rules
