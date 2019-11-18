import { EasyForm } from './EasyForm'
import { FormComposer } from './FormComposer'
import { ElementEditor, FormEditor } from './FormEditor'
import DefaultComponents from './Components'
import DefaultDecorators from './Decorators'

import Textarea from './components/Textarea'
import TextInput from './components/Text'
import Checkbox from './components/Checkbox'
import CheckboxMC from './components/CheckboxMC'
import CheckboxMcCollection from './components/CheckboxMcCollection'
import Radio from './components/Radio'
import Select from './components/Select'
import SelectCollection from './components/SelectCollection'
import Divider from './components/Divider'
import InfoBox from './components/InfoBox'
import Upload from './components/Upload'

import FormGroupDecorator from './decorators/FormGroup'
import AttributesDecorator from './decorators/Attributes'
import LayoutDecorator from './decorators/Layout'
import DependentDecorator from './decorators/Dependent'
import ValidateDecorator from './decorators/Validate'
import NameDecorator from './decorators/Name'
import PlaceholderDecorator from './decorators/Placeholder'

// console.log(ComponentConfiguration)

export {
  EasyForm,
  FormComposer,
  FormEditor,
  ElementEditor,
  DefaultComponents,
  DefaultDecorators
}

export {
  Textarea,
  TextInput,
  Checkbox,
  CheckboxMC,
  CheckboxMcCollection,
  Radio,
  Select,
  SelectCollection,
  InfoBox,
  Divider,
  Upload
}

export {
  FormGroupDecorator,
  AttributesDecorator,
  LayoutDecorator,
  ValidateDecorator,
  DependentDecorator,
  NameDecorator,
  PlaceholderDecorator
}
