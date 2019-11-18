import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import {
  map,
  forEach,
  reduce,
  upperCase,
  upperFirst,
  kebabCase,
  get,
  find,
  includes,
  stubTrue,
  cloneDeep,
  assign,
  size,
  isString,
  isArray,
  isPlainObject
} from 'lodash'

const collections = () => window.myCollections || []

export default withTracker(({ element, translator }) => {
  const { subscription, fields, defaultOptions } = element
  const coll = find(collections(), c => c.subscription == subscription)
  if (subscription && !coll) {
    console.warn(
      `“${subscription}” not found. Make sure your collections are declared globally. See documentation for more information.`
    )
  }
  const handle = coll
    ? Meteor.subscribe(coll.subscription)
    : { ready: stubTrue }
  const collOptions = {}
  if (isArray(fields) && fields.length) {
    collOptions.fields = {}
    fields.forEach(f => (collOptions.fields[f] = 1))
    collOptions.sort = { [fields[0]]: 1 }
  }
  const documents = coll
    ? coll.collection
      .find({}, size(collOptions) ? collOptions : undefined)
      .fetch()
    : []
  return {
    loading: !handle.ready(),
    element: assign(cloneDeep(element), {
      options: (isArray(defaultOptions) ? defaultOptions : []).concat(
        size(documents)
          ? documents.map(d => ({
            _id: d._id,
            default: isArray(fields)
              ? fields.map(f => get(d, f, '…')).join(' • ')
              : d._id
          }))
          : []
      ),
      fields: fields,
      type: 'select'
    })
  }
})

const collectionHeader = () => [
  {
    key: 'select.divider',
    type: 'divider',
    layout: { col: { xs: '12' } }
  },
  {
    key: 'select.subscription',
    name: 'subscription',
    type: 'select',
    label: 'Collection from which items can be selected',
    required: true,
    options: map(collections(), c => ({
      _id: c.subscription,
      default: upperFirst(c.subscription)
    })),
    layout: { col: { xs: 12, md: 6 } }
  }
]

const collectionElements = () => [
  {
    key: 'select.fields',
    name: 'fields',
    type: 'textarea',
    label: {
      nl: 'Lijsteigenschappen die als optie getoond worden',
      fr: 'Fields to generate a name from',
      en: 'Fields to generate a name from'
    },
    layout: { col: { xs: 12, sm: 6 } },
    attributes: {
      rows: 3,
      placeholders: {
        nl: 'Eén optie per lijn',
        fr: 'One item per line',
        en: 'One item per line'
      },
      style: { whiteSpace: 'nowrap' }
    }
  }
]

export { collectionHeader, collectionElements }
