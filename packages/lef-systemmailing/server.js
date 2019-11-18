import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
import SystemMailsCollection from './collection'
import MarkdownIt from 'markdown-it'
import { forEach, get } from 'lodash'

const RegisterEmail = doc => {
  const mail = SystemMailsCollection.findOne(doc._id)
  if (!mail) {
    doc.subject = {}
    doc.body = {}
    doc.rendered = { body: {} }
    SystemMailsCollection.insert(doc)
  }
}

class GenerateEmail {
  constructor ({ _id, language }) {
    console.log(_id, language)
    this.mail = SystemMailsCollection.findOne(_id)
    this.language = language
  }
  from () {
    return Meteor.settings.systemMailsFrom
  }
  subject (params) {
    return this.renderParams(params, this.mail.subject[this.language] || '')
  }
  html (params) {
    let input = ''
    if (this.mail.rendered && this.mail.rendered.body) {
      input = this.mail.rendered.body[this.language]
    }
    return this.renderParams(params, input)
  }
  renderParams (params, input) {
    if (!input) return JSON.stringify(params)
    forEach(this.mail.params, (path, key) => {
      const pattern = new RegExp(`{{${key}}}`, 'g')
      input = input.replace(pattern, get(params, path, ''))
    })
    return input
  }
}

Meteor.publish('systemmails', (q, params) => {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return SystemMailsCollection.find(q, params)
  }
})

Meteor.methods({
  totalSystemMails: query => {
    return SystemMailsCollection.find(query).count()
  },
  getSystemMailsIds: (query, params) => {
    return SystemMailsCollection.find(query, params).map(({ _id }) => _id)
  },
  updateSystemMail: doc => {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const { _id } = doc
      delete doc._id
      doc.rendered = { body: {} }
      forEach(doc.body, (md, language) => {
        doc.rendered.body[language] = MarkdownIt({
          html: true,
          linkify: true,
          typography: true
        }).render(md)
      })
      return SystemMailsCollection.update({ _id }, { $set: doc })
    }
  }
})

export { RegisterEmail, GenerateEmail }
