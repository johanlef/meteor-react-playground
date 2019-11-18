# Forms v2

This is a composition based form generator. Every composed form is also [reformed](https://github.com/davezuko/react-reformed), allowing for easy model bindings.

A composed form requires a `Library` that provides a component for every type of `element` in your form. These components can be augmented by a `DecoratorLibrary`, which consists of so called "decorators" that wrap around components, to modify their behaviour and/or look & feel.

A library of default components and one for decorators is provided. You can extend or modify these default libraries, by adding, removing or replacing components or decorators. This is how you customize behaviour for a specific application.

A form editor is also available, with which you can modify form elements.

## EasyForm

The easiest way of creating forms is using the `EasyForm`.

Let's assume the form is configured with a hardcoded list of elements:

```JSX
const formElements = [
  {
    key: 'unique_key_foo', // forms built with FormEditor are automatically taken care of
    name: 'foo',
    type: 'textarea',
    attributes: {
      rows: 5,
    }
  },
  {
    key: 'unique_key_bar',
    name: 'bar',
    type: 'text'
  },
]

const groupedFormEls = [
  {}, // elements as above
  { type: 'divider', key: 'divider_1' }, // adds 'hr'
  {}, // elements as above
]

const MyForm = new EasyForm().instance()

class Example extends Component {
  _onSubmit = (model) => {
    // this gets called when the form is submitted
    // e.preventDefault() has already been called of course
    console.log(model);
  }
  render() {
    return (
      <MyForm
        elements={formElements}
        initialModel={{bar: "Example text"}}
        onSubmit={this._onSubmit}
        <Button type="submit">Submit</Button>
      </MyForm>
    )
  }
}
```

The `EasyForm` constructor accepts a configuration object with:

- `library`: a component `Library`, which is an extended [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object that holds all form components
- `decorators`: a `DecoratorLibrary`, which is an extended `Library` that holds decorators

The component library defaults to `DefaultComponents`, which is a simple library of "reformed" `reactstrap` form components. Similarly, `decorators` defaults to `DefaultDecorators`.

`EasyForm.prototype.instance` is then used to create a React `Component`, which you can instantiate with `props`. You can supply a `config` object to the `instance` function, with the following supported fields:

- `decorators`: an Array with the names of the decorators that you wish to apply. If not supplied, _all_ decorators are applied.
- `components`: an Array of component types that you wish to make available to the form. If not supplied, all components are available. (Note that this is more relevant in the `editor` mode below.)

For example, you might only want to apply the standard `FormGroup` decorator:

```JSX
const MyForm = new EasyForm().instance({decorators:["formgroup"]})
```

Note that the decorators are applied _in sequence_, either the "natural" sequence in the `DecoratorLibrary` or the sequence in the `instance` arguments (applied left to right). This is important if you need to be certain of the position of a wrapper in the hierarchy.

`initialModel` is used to fill the initial values.

Note that the `attributes` from the element are applied directly to the `Input` component by the `Textarea` component. This is an example of a _convention_ from this specific component library. Similarly, `name` and `type` are applied as you would expect.

Blueprint of an element:

```JSON
{
  "key" : "unique key: only needed if name can cause identical keys (e.g. when using dependent) OR when using form editor",
  "name" : "name.supports.nesting",
  "type" : "text/textarea/select/checkbox/divider/infobox",
  "label" : {
    "nl" : "LabelText (NL)",
    "en" : "LabelText (EN)"
  },
  "attributes" : {
    "placeholders" : {
      "nl" : "PlaceholderText (NL)",
      "en" : "PlaceholderText (EN)"
    },
    "multiple": true,
    "size": 12,
    "rows" : 5
  },
  "required" : true,
  "dependent" : {
    "on" : "dependentOn",
    "operator" : "in, gt, gte, lt, lte, is isnt, ''",
    "values" : "value or array of values"
  },
  "schema": {
    "description": {
      "nl" : "HelpText (NL)",
      "en" : "HelpText (EN)"
    }
  },
  "layout" : {
    "col" : {
      "xs" : 12,
      "md" : 6
    }
  },
  "options" : [
    {
      "_id" : "~red",
      "nl" : "Rood",
      "en" : "Red"
    },
    {
      "_id" : "~blue",
      "nl" : "Blauw",
      "en" : "Blue"
    }
  ]
}
```

### Architectural note

You (probably) only need to make one `EasyForm` instance per "type" of form in your application. You can simply reuse it as a component throughout your application.

## Modifying libraries

If you wish to modify the standard component and decorator libraries, you can do things like this:

```JSX
import { withTranslator } from 'meteor/lef:translations'

const MyFormConfig = new EasyForm()
MyFormConfig.addComponent(name1,component)
MyFormConfig.removeComponent(name2)
MyFormConfig.addDecorator(name3,decorator)
MyFormConfig.removeDecorator(name4)
const MyForm = MyFormConfig.instance()
const MyTranslatedForm = withTranslator(MyForm)
```

or

```JSX
const MyDecorators = DefaultDecorators.subset(["formgroup","layout"])
const MyComponents = DefaultComponents.subset(["textarea","checkbox"])
const MyForm = new EasyForm({library:MyComponents,decorators:MyDecorators}).instance()
```

## Editing forms

It's extremely easy to get a form editor for the example form above:

```JSX
import { withTranslator } from 'meteor/lef:translations'

const MyFormEditor = new EasyForm().editor()
const MyTranslatedFormEditor = withTranslator(MyFormEditor)

class Example extends Component {
  _onSubmit = (formElements) => {
    // this gets called when the form editor is saved
    // e.preventDefault() has already been called of course
    console.log(formElements);
  }
  render() {
    return (
      <MyTranslatedFormEditor
        initialModel={formElements}
        onSubmit={this._onSubmit}
      >
        <Button type="submit">Submit</Button>
      </MyFormEditor>
    )
  }
}
```

Note that you only need to supply the form elements as the initial model.

Also note that both components and decorators basically carry their own configuration inside the respective libraries, which is used to lay-out the form editor.

## Components

You can write components like this:

```JSX
class TextComponent extends Component {
  get type() {
    return "text"
  }
  render() {
    const { bindInput, element, attributes: propsAttributes } = this.props
    const { name, type, attributes: elementAttributes } = element
    return (
      <Input type={type}  {...bindInput(name)} {...elementAttributes} {...propsAttributes} />
    )
  }
}

const transform = (element, { translator, model }, saving) => {
  // perform mutations of element properties
  // when saving or retrieving (saving = true/false)
  // Example: see translations for selects
  return element // do not forget to return the altered element
}

const config = ({ translator, model }) = return [
  {
    key: "name",
    name: "name",
    type: "text",
    label: "Field name", // or translator object { nl: "", en: "" }
    attributes: {
      placeholder: "Technical name for field",
      // OR
      placeholders: {
        en: "Technical name for field",
      }
    },
    required: true,
    layout: { col: { xs: 12 } },
  },
  {
    key: "attributes.placeholder",
    name: "attributes.placeholders",
    type: "text",
    label: "Placeholder",
    layout: { col: { xs: 12 } }
  }
]

export default TextComponent
export { transform, config }
```

Note that the `config` will determine what can be edited in the form editor.

When adding a component, you can for example do it like this:

```JSX
const easyForm = new EasyForm()
const path = '../imports/components/TextComponent'
easyForm.addComponent("mytext",{
    component: require(path).default,
    config: require(path).config
})
```

You could also directly add the component and its configuration to a `Library`.

## Decorators

This is where the magic happens. Essentially what we can do is _modify_ the component library, so that a higher order component (the decorator) is in control of the render function. The decorator can e.g. inject props, decide to render something completely different or wrap the component in something.

Let's assume for instance that we would like to wrap every form component in a `FormGroup` and add a label if is present in the element configuration. It would look something like this:

```JSX
const FormGroupDecorator = WrappedComponent => props => (
  <FormGroup>
    {props.element.label?<Label for={props.element.name}>{props.element.label}</Label>:null}
    <WrappedComponent {...props} /> // don't forget to "push down" the props into the wrapped component
  </FormGroup>
)

const transform = (element, { translator, model }, saving) => {
  // perform mutations of element properties
  // when saving or retrieving (saving = true/false)
  // Example: see translations for selects
  return element // do not forget to return the altered element
}

const config = ({ translator, model }) => [
  {
    key: "label",
    name: "label",
    type: "textarea",
    label: "Field label or introduction",
    layout: {col: {md:"12"}}
  }
]

// Configuration of label is put in front
const combine = _.flip(_.union)

// we're only interested in certain components:
const filter = componentType => _.includes(["textarea", "text"], componentType)

export default FormGroupDecorator
export { transform, config, combine, filter }
```

You also need to add it to the `DecoratorLibrary`, for example like this:

```JSX
const easyForm = new EasyForm()
const decorator = require('../imports/decorators/FormGroupDecorator')
easyForm.addDecorator("myformgroup", {
  decorator: decorator.default,
  config: isArray(decorator.config) ? decorator.config : [],
  combine: isFunction(decorator.combine) ? decorator.combine : union,
  filter: isFunction(decorator.filter) ? decorator.filter : stubTrue,
})
```

Note the special (optional) configuration fields:

- `filter`: a `function` that returns true if supplied with the name of a component that it wishes to modify.
- `combine`: a `function` that is supplied with two arguments: the component `config` (an array of form fields) and the decorator `config`. By default, the decorator configuration (also an array of fields) is appended to the element form, but in this case it is added first.

To make use of the new `label` functionality, we can add them to the element configuration:

```JSX
const formElements = [
  {
    key: 'foo',
    name: 'foo',
    label: 'Fill your foo',
    type: 'textarea',
    attributes: {
      rows: 5,
    },
  },
  {
    key: 'bar',
    name: 'bar',
    label: 'Add your bar',
    type: 'text'
  },
]
```

Note that the `props` that are passed to the decorator include both `element` configuration, as well as the `model`. This means the decorator could easily respond to the current values in _any part_ of the form.

If you are creating a large component and/or decorator library, it might be worthwhile to have a look at `Components.js` and `Decorators.js` for ideas on how to bring the together.

## Translations

When wrapping the Form instance or editor in `lef:translation`’s `withTranslator`, you have access to the `translator` object inside library config fields. It is then recommended to pass `translator` as a prop to each `<Form />` component.

There is a helper function available to make it easier to retrieve the correct language from `placeholders`, `label` and other fields.

```JS
import { translatorText } from '<root>/translator'

const label = {
  nl: 'NL Label',
  en: 'EN Label'
}

// example function for demonstration purposes
const getLabel = ({ translator }) => translatorText('Label String', translator)
// returns label if label is a String

const getLabel = ({ translator }) => translatorText(label, translator, false) || 'fallback'
// returns 'NL Label' if translator.currentLanguage == 'nl'
// returns 'EN Label' if translator.currentLanguage is undefined, but default language == 'en'
// returns label.default if translator is undefined
// returns first item in label if translator is undefined and key 'default' is not present in label
// returns '' if label is empty, you can then project a fallback

// The last parameter forces 'default' as first key to check
```

## Special Components

### select-collection

You can create a select with options gathered from a collection.

```JS
const element = {
  "key" : "selectCollection.orgs",
  "name" : "organization",
  "label" : {
    "nl" : "Organisatie",
    "en" : "Organization"
  },
  "type" : "select-collection",
  "subscription" : "userOrg", // subscription name
  "fields" : [ // fields to show as option
      "name", // if populated, this field is used for sorting
      "address.city"
  ],
  "defaultOptions" : [ // values for extra options
    "_id" : "~new-organization",
    "nl" : "Nieuwe organisatie",
    "en" : "New organization"
  ]
}
```

Before the form can access documents from these collections, you should declare them globally as shown below. **Import this file at least in the client startup file.** Collections declared here are available in the form Editor.

```JS
const collections = [
  { subscription: 'forms', collection: Forms },
  { /* etc. */ }
]

if (Meteor.isClient) window.myCollections = collections
if (Meteor.isServer) global.myCollections = collections
```

### upload

When using an `imgUpload`, you can specify an array of sizes to which the images need to be resized. E.g.: `[256, 512, 1024]`. The images are resized on the client and uploaded together with the original file. The thumbnails are saved as follows:

```JS
const document = {
  image: 'url-to-original',
  imageThumbnails: [ // same property name as original + 'Thumbnails'
    {
      size: 256,
      url: 'url-to-thumb-256x256'
    }
    {
      size: 512,
      url: 'url-to-thumb-512x512'
    }
    {
      size: 1024,
      url: 'url-to-thumb-1024x1024'
    }
  ]
}
