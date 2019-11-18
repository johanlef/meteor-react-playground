# lef-userui

Creates a dropdown menu to be used in a Bootstrap navbar for user actions (login, logout, forgot password, register).

## Installation

1. Add this repo as a git submodule in the `/packages` repository
1. `$ meteor add lef:userui`
1. Make sure the following icons are in your **fontawesome library**:
  `faUser, faEye, faEyeSlash`<br>
  (Using an [icons helper file*](#icons-helper-file) is recommended.)

## Usage

Optionally set the `profileUrl`, `userNamePath` and the `registerUrl` (defaults to `/register`). Put a route in your app to handle the `/reset-password` request.

```JSX
import UserMenu, { ResetPasswordForm } from 'meteor/lef:userui'

<UserMenu profileUrl='/profile' registerUrl='/register' userNamePath='profile.name' />

<Route exact path='/reset-password/:token' component={ResetPasswordForm} />
```

## Todo

- Password reset mail using `lef:systemmailing`

## Icons helper file

Import a file with this structure on startup:

```JS
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
library.add(faUser, faEye, faEyeSlash)
```
