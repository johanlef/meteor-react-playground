# lef:analytics

## Install

Add this repo as git submodule to your `packages` folder and run `meteor add lef:analytics`.

Update your settings file (or provide these [manually](#startup)):
```JSON
{
  "public" : {
    "ga" : {
      "trackingId": "UA-000000-01",
      "options": {
          "debug": true
      },
      "optIn": false
    }
  }
}
```

property | required | notes
| --- | --- | --- |
trackingId | yes | format: `UA-XXXXXX-XX`
options | no
optIn | no | Set to `true` if you want users to opt-in.<br>_You currently need to build the opt-in modal yourself.[*](#opt-in)_

## Usage

### Startup

In your client startup file:

```JS
import { gaInit } from 'meteor/lef:analytics'

// get trackingId and options from Meteor.settings or hardcoded
const gaSettings =
  Meteor.settings.public.ga
  || { trackingId: 'UA-XXXXXX-01' }

Meteor.startup(() => gaInit(gaSettings)
```

### PageViews

In your top level component:

```JSX
import { PageView } from 'meteor/lef:analytics'

const App = () => (
  <Router history={history}>
    <PageView>
      <Switch>
        <Route path={'/contact'} exact component={Contact} />
        <Route path={'/'} exact component={Home} />
      </Switch>
    </PageView>
  </Router>
)
```

The `PageView` component takes care of every change in your pathname. Hash changes and paramteres are currently not counted for.

### Events

In any component with interactivity:

```JSX
import { gaEvent } from 'meteor/lef:analytics'

class ChangeColor extends React.Component {
  changeColor () {
    const color = getRandomColor()
    this.setState({ color })
    gaEvent({
      category: 'Color',
      action: 'Change',
      label: color, // String
      // value: 1 // Number
    })
  }
  render() {
    return (
      <Button onClick={this.changeColor}>Randomise color</Button>
    )
  }
}
```

## Opt-in

If you want start/stop the tracking programmatically, you can execute the init function again, with optin set to the appropriate value.

```JS
// starts tracking for trackingId UA-XXXXXX-01
gaInit({ trackingId: 'UA-XXXXXX-01', optIn: false })

// stops tracking for trackingId UA-XXXXXX-01
gaInit({ trackingId: 'UA-XXXXXX-01', optIn: true })
```
