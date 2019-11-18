# Translations/CMS

Meteor React package for translations and CMS.

## Installation


1. Add this repo as a git submodule in the `/packages` repository
1. `$ meteor add lef:translations`
1. Make sure the following icons are in your **fontawesome library**:
  `faQuestion, faFlag, faCheck, faEdit, faTimes`<br>
  (Using an [icons helper file*](#icons-helper-file) is recommended.)

## Wrapper

Use the HOC to wrap your application, or at least the parts that need translations. Use the settings to layout some ground rules.

```JSX
import { Translator } from 'meteor/lef:translations'

const languageSettings = {
  languages: ['nl', 'fr'],
  default: 'nl'
}

<Translator settings={languageSettings}>
  // your app code
</Translator>
```

## Text component

Use the `<Translate />` React component to insert text in the app. Editing the translation is possible by double clicking on it while logged in as admin. Optionally use `md` to set as a textfield (with markdown support). Set `getString` to only get the translation string returned. Default a `<span>` will be returned, but thiscan be overridden with the `tag` prop. Optionally use the `category` prop to classify translations and make the admin overview clearer. Extra classes canbe added through the prop `className`. The `_id` is diplayed by default if no translation is available. You can override this by setting the prop `autoHide`. Use the `params` prop to use placeholders in the translation.

```JSX
import { Translate } from 'meteor/lef:translations'

<Translate _id='welcome_message' md category='home' autoHide params={{username: user.profile.name}} />
```

## Admin component

Insert the `<Translations />` React component in an admin interface to edit all translations. Make sure the user has the `'admin'` role set in their user account.

## Pick language menu

This creates a bootstrap uncontrolled dropdown menu for use in a `nav` element.

```JSX
import { PickLanguage } from 'meteor/lef:translations'

<PickLanguage />
```

## withTranslator

If for some reason you need the current language settings or want to change some of them you can use `withTranslator`.

```JSX
import { withTranslator } from 'meteor/lef:translations'

const Component = ({translator}) => {
  return (
    <p>This is the current language: {translator.currentLanguage}</p>
    <button onClick={() => translator.setCurrentLanguage('nl')}>
      Set current language to NL
    </button>
  )
}

const ComponentContainer = withTranslator(Component)
```

`translator` looks usually like this:
```JS
const translator = {
  currentLanguage: 'nl',
  default: 'nl',
  languages: ['nl', 'fr', 'en'],
  setCurrentLanguage: function(lang) {},
  user: {} /* current user – when logged in */
}
```

## Icons helper file

Import a file with this structure on startup:

```JS
import { library } from '@fortawesome/fontawesome-svg-core'
import { ...icons } from '@fortawesome/free-solid-svg-icons'
library.add(...icons)
```
