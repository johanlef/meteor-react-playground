import React, { Component } from 'react'
import { Translate } from 'meteor/lef:translations'
import { Meteor } from 'meteor/meteor'
import {
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Accounts } from 'meteor/accounts-base'
import { withTracker } from 'meteor/react-meteor-data'
import { NewAlert } from 'meteor/lef:alerts'
import { get } from 'lodash'

const minLength = 6

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: '',
      type: 'password'
    }
    this.toggleVisibility = this.toggleVisibility.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    const { email, password } = this.state
    Meteor.loginWithPassword(email, password, error => {
      if (error) {
        this.setState({ error: error.reason })
        setTimeout(() => this.setState({ error: '' }), 5000)
      }
    })
  }
  toggleVisibility () {
    this.setState({
      type: this.state.type === 'text' ? 'password' : 'text'
    })
  }

  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        {this.state.error ? (
          <Alert color='warning'>{this.state.error}</Alert>
        ) : null}
        <FormGroup>
          <Label>
            <Translate _id='email' />
          </Label>
          <Input
            type='email'
            name='email'
            onChange={e => this.setState({ email: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            <Translate _id='password' />
          </Label>
          <div className='input-wrapper'>
            <Input
              type={this.state.type}
              name='password'
              onChange={e => this.setState({ password: e.target.value })}
            />
            <span onClick={this.toggleVisibility} className='errspan'>
              {this.state.type === 'text' ? (
                <FontAwesomeIcon icon='eye-slash' className='icon' />
              ) : (
                <FontAwesomeIcon icon='eye' className='icon' />
              )}
            </span>
          </div>
        </FormGroup>
        <Button type='submit'>
          <Translate _id='log_in' />
        </Button>
        <p>
          {this.props.noRegistration ? null : (
            <Link to={this.props.registerUrl}>
              <Translate _id='no_account?_please_register' />
            </Link>
          )}
          <br />
          <a href='#' onClick={this.props._toggleResetPassword}>
            <Translate _id='forgot_password?' />
          </a>
        </p>
      </Form>
    )
  }
}

class ForgotPasswordForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    Accounts.forgotPassword(this.state)
  }
  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        <FormGroup>
          <Label>
            <Translate _id='email' />
          </Label>
          <Input
            type='email'
            name='email'
            onChange={e => this.setState({ email: e.target.value })}
          />
        </FormGroup>
        <Button type='submit'>
          <Translate _id='reset_password' />
        </Button>
        <a href='#' onClick={this.props._toggleResetPassword}>
          <Translate _id='cancel' />
        </a>
      </Form>
    )
  }
}

class ResetPasswordForm extends Component {
  constructor (props) {
    super(props)
    this.state = { password: '', repeat_password: '' }
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    Accounts.resetPassword(
      this.props.match.params.token,
      this.state.password,
      e => {
        if (e) NewAlert({ msg: e, color: 'danger' })
        else {
          NewAlert({
            translate: 'password_successfully_reset',
            color: 'success'
          })
          this.props.history.push('/')
        }
      }
    )
  }
  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        <FormGroup>
          <Label>
            <Translate _id='password' />
          </Label>
          <Input
            type='password'
            name='password'
            onChange={e => this.setState({ password: e.target.value })}
          />
          <FormText color={'muted'}>
            {`Min. ${minLength} tekens/characters.`}
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label>
            <Translate _id='repeat_password' />
          </Label>
          <Input
            type='password'
            name='repeat_password'
            onChange={e => this.setState({ repeat_password: e.target.value })}
          />
        </FormGroup>
        <Button
          type='submit'
          color='success'
          disabled={
            this.state.password.length >= minLength
              ? this.state.password !== this.state.repeat_password
              : true
          }
        >
          <Translate _id='reset_password' />
        </Button>
      </Form>
    )
  }
}

class ToggleLoginResetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      resetPasswordOpen: false
    }
    this._toggleResetPassword = this._toggleResetPassword.bind(this)
  }
  _toggleResetPassword () {
    this.setState({
      resetPasswordOpen: !this.state.resetPasswordOpen
    })
  }
  render () {
    return this.state.resetPasswordOpen ? (
      <ForgotPasswordForm _toggleResetPassword={this._toggleResetPassword} />
    ) : (
      <LoginForm
        {...this.props}
        _toggleResetPassword={this._toggleResetPassword}
      />
    )
  }
}

const User = withRouter(({ profileUrl, history, user, userNamePath }) => {
  const userName = get(user, userNamePath)
  return (
    <div>
      <Link to={profileUrl || '#'} className='dropdown-item'>
        {userName ? (
          <span>
            <Translate _id='welcome' />, {userName}
          </span>
        ) : (
          <Translate _id='user_profile' />
        )}
      </Link>
      <DropdownItem
        href='#'
        onClick={() => {
          Meteor.logout()
          history.push('/')
        }}
      >
        <Translate _id='sign_out' />
      </DropdownItem>
    </div>
  )
})

const UserMenu = props => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon='user' />
      </DropdownToggle>
      <DropdownMenu right>
        {props.user ? (
          <User {...props} />
        ) : (
          <div className={'dropdown-item ' + props.dropdownClassName}>
            <ToggleLoginResetPassword {...props} />
          </div>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

UserMenu.defaultProps = {
  registerUrl: '/register'
}

UserMenu.propTypes = {
  registerUrl: PropTypes.string,
  profileUrl: PropTypes.string,
  noRegistration: PropTypes.bool
}

const UserMenuContainer = withTracker(() => {
  return {
    user: Meteor.user()
  }
})(UserMenu)

export default UserMenuContainer
export { ResetPasswordForm }
