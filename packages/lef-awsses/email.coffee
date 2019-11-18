Future = Npm.require 'fibers/future'
nodemailer = Npm.require 'node4mailer'
AWS = Npm.require 'aws-sdk/clients/ses'

_ = lodash

Email = {}
EmailTest = {}

EmailInternals =
   NpmModules:
      mailcomposer:
         version: Npm.require('node4mailer/package.json').version
         module: Npm.require('node4mailer/lib/mail-composer')
      nodemailer:
         version: Npm.require('node4mailer/package.json').version
         module: Npm.require('node4mailer')

MailComposer = EmailInternals.NpmModules.mailcomposer.module

makeTransport = ->
   if Meteor.settings.ses
      check Meteor.settings.ses.sendingRate, Number
      transport = nodemailer.createTransport
         SES: new AWS
            accessKeyId: Meteor.settings.ses.accesskey
            secretAccessKey: Meteor.settings.ses.secret
            apiVersion: '2010-12-01'
            region: Meteor.settings.ses.region
         sendingRate: Meteor.settings.ses.sendingRate
   else if Meteor.settings.smtpURL
      check Meteor.settings.smtpURL, String
      transport = nodemailer.createTransport Meteor.settings.smtpURL
   else
      transport = undefined
   return transport

getTransport = ->
   unless @cache
      @cache = makeTransport()
   return @cache

nextDevModeMailId = 0
output_stream = process.stdout

# Testing hooks
EmailTest.overrideOutputStream = (stream) ->
   nextDevModeMailId = 0
   output_stream = stream

EmailTest.restoreOutputStream = ->
   output_stream = process.stdout

devModeSend = (mail) ->
   devModeMailId = nextDevModeMailId++
   stream = output_stream
   # This approach does not prevent other writers to stdout from interleaving.
   stream.write '====== BEGIN MAIL #' + devModeMailId + ' ======\n'
   stream.write '(Mail not sent; to enable sending, set the SES Meteor settings.)\n'
   readStream = new MailComposer(mail).compile().createReadStream()
   readStream.pipe stream, end: false
   future = new Future
   readStream.on 'end', ->
      stream.write '====== END MAIL #' + devModeMailId + ' ======\n'
      future.return()
   future.wait()

sendHooks = []
EmailTest.hookSend = (f) ->
  sendHooks.push f

Email.send = (options) ->
   i = 0
   while i < sendHooks.length
      if !sendHooks[i](options)
         return
      i++
   if options.mailComposer
      options = options.mailComposer.mail
   transport = getTransport()
   if transport
      transport.sendMail options, options.cb
   else
      devModeSend options


Meteor.methods
   testSESMailing: (n, from, to) ->
      types = ["success","bounce","ooto","complaint","suppressionlist"]
      unless _.includes types, to
         console.log "'To' should be one of #{EJSON.stringify(types)}"
         return
      i = 1
      while i <= n
         Email.send
            to: "#{to}@simulator.amazonses.com"
            from: from
            subject: "Testing SES service for #{to}"
            text: "Testing SES service for #{to}"
            cb: (e,r) ->
               if e
                  console.error "Error testing Amazon SES"
                  console.error e
               else
                  console.log "Successfully delivered email"
         i++