import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { RegisterEmail, GenerateEmail } from 'meteor/lef:systemmailing'

Accounts.urls.resetPassword = token => {
  return Meteor.absoluteUrl('reset-password/' + token)
}

RegisterEmail({
  _id: 'resetPassword',
  params: {
    firstname: 'user.profile.firstname',
    lastname: 'user.profile.lastname',
    url: 'url'
  }
})

RegisterEmail({
  _id: 'verifyEmail',
  params: {
    firstname: 'user.profile.firstname',
    lastname: 'user.profile.lastname',
    url: 'url'
  }
})

const resetPasswordMail = ({ profile }) => {
  const { language } = profile
  return new GenerateEmail({ _id: 'resetPassword', language })
}

const verifyEmailMail = ({ profile }) => {
  const { language } = profile
  return new GenerateEmail({ _id: 'verifyEmail', language })
}

Accounts.emailTemplates = {
  resetPassword: {
    from: () => resetPasswordMail({ profile: { language: 'en' } }).from(),
    subject: user => resetPasswordMail(user).subject({ user }),
    html: (user, url) => resetPasswordMail(user).html({ user, url })
  },
  verifyEmail: {
    from: () => verifyEmailMail({ profile: { language: 'en' } }).from(),
    subject: user => verifyEmailMail(user).subject({ user }),
    html: (user, url) => verifyEmailMail(user).html({ user, url })
  }
}
