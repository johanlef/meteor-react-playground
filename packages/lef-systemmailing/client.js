import React from 'react'
import { Meteor } from 'meteor/meteor'
import AdminList from 'meteor/lef:adminlist'
import SystemMailsCollection from './collection'
import { Switch, Route } from 'react-router-dom'
import { Translate, withTranslator } from 'meteor/lef:translations'
import { withTracker } from 'meteor/react-meteor-data'
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Button,
  ButtonGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  Row,
  Col
} from 'reactstrap'
import { NewAlert } from 'meteor/lef:alerts'
import MarkdownIt from 'markdown-it'
import PropTypes from 'prop-types'
import { MarkdownImageUpload } from 'meteor/lef:imgupload'

const Overview = ({ history, match }) => {
  return (
    <>
      <h1>
        <Translate _id='system_mails' category='admin' />
      </h1>
      <AdminList
        collection={SystemMailsCollection}
        getIdsCall='getSystemMailsIds'
        subscription='systemmails'
        fields={['_id']}
        getTotalCall='totalSystemMails'
        edit={{ action: doc => `${match.url}/edit/${doc._id}`, link: true }}
      />
    </>
  )
}

class InsertParams extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdownOpen: false
    }
  }
  render () {
    const { params, insertParam, where } = this.props
    return (
      <InputGroupButtonDropdown
        addonType='append'
        isOpen={this.state.dropdownOpen}
        toggle={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}
      >
        <DropdownToggle caret color={'info'}>
          <Translate _id='insert' category='admin' />
        </DropdownToggle>
        <DropdownMenu right>
          {Object.keys(params).map(param => {
            return (
              <DropdownItem
                onClick={() => insertParam(param, where)}
                key={param}
              >
                <Translate _id={param} category='admin' />
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </InputGroupButtonDropdown>
    )
  }
}

class Edit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      language: this.props.translator.default
    }
    this.handleChange = this.handleChange.bind(this)
    this.insertParam = this.insertParam.bind(this)
    this.save = this.save.bind(this)
  }
  static getDerivedStateFromProps ({ mail }) {
    return { mail } || null
  }
  changeLanguage (language) {
    this.setState({ language })
  }
  handleChange (e) {
    const { name, value } = e.target
    const { mail, language } = this.state
    mail[name][language] = value
    this.setState({ mail })
  }
  insertParam (param, where) {
    const { mail, language } = this.state
    mail[where][language] = `${mail[where][language] || ''} {{${param}}}`
    this.setState({ mail })
    document.getElementsByName(where)[0].focus()
  }
  save () {
    console.log(this.state.mail)
    Meteor.call('updateSystemMail', this.state.mail, (e, r) => {
      if (r) NewAlert({ translate: 'saved', type: 'success' })
      if (e) NewAlert({ msg: e.error, type: 'danger' })
    })
  }
  render () {
    if (this.props.loading) return 'loading...'
    else {
      const { translator } = this.props
      const { language } = this.state
      const { _id, params, subject, body } = this.state.mail
      return (
        <>
          <h1>Edit {_id}</h1>
          <Row>
            <Col xs={12} sm={9}>
              <FormGroup>
                <Label>
                  <Translate _id='subject' category='admin' />
                </Label>
                <InputGroup>
                  <Input
                    type='text'
                    name='subject'
                    value={subject[language] || ''}
                    onChange={this.handleChange}
                  />
                  <InsertParams
                    params={params}
                    insertParam={this.insertParam}
                    where='subject'
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup>
                <Label>
                  <Translate _id='edit_language' category='admin' />
                </Label>
                <div>
                  <ButtonGroup size={'sm'}>
                    {translator.languages.map(language => {
                      return (
                        <Button
                          onClick={() => this.changeLanguage(language)}
                          key={language}
                          color={'warning'}
                          className={
                            this.state.language == language ? 'active' : ''
                          }
                        >
                          {language.toUpperCase()}
                        </Button>
                      )
                    })}
                  </ButtonGroup>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md='9'>
              <FormGroup>
                <Label>
                  <Translate _id='email_body' category='admin' />
                </Label>
                <InputGroup>
                  <Input
                    type='textarea'
                    name='body'
                    rows='10'
                    value={body[language] || ''}
                    onChange={this.handleChange}
                  />
                  <InsertParams
                    params={params}
                    insertParam={this.insertParam}
                    where='body'
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md='3'>
              <FormGroup>
                <Label>
                  <Translate _id='email_insert_image' category='admin' />
                </Label>
                <MarkdownImageUpload
                  onSubmit={tag => {
                    const { mail, language } = this.state
                    mail.body[language] =
                      (mail.body[language] || '') + ' ' + tag
                    this.setState({ mail })
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Button onClick={this.save} color='success'>
            <Translate _id='save' category='admin' />
          </Button>{' '}
          <Button onClick={this.props.history.goBack} color='warning'>
            <Translate _id='cancel' category='admin' />
          </Button>
          <article className={'my-4'}>
            <h3>
              <Translate _id='preview' category='admin' />
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: MarkdownIt({
                  html: true,
                  linkify: true,
                  typography: true
                }).render(body[language] || '')
              }}
            />
          </article>
        </>
      )
    }
  }
}

const EditContainer = withTranslator(
  withTracker(({ match }) => {
    const { _id } = match.params
    const handle = Meteor.subscribe('systemmails', { _id })
    return {
      loading: !handle.ready(),
      mail: SystemMailsCollection.findOne({ _id })
    }
  })(Edit)
)

const SystemMailsAdmin = ({ match }) => {
  return (
    <Switch>
      <Route path={match.url} exact component={Overview} />
      <Route path={match.url + '/edit/:_id'} exact component={EditContainer} />
    </Switch>
  )
}

SystemMailsAdmin.propTypes = {
  match: PropTypes.object.isRequired
}

export default SystemMailsAdmin
