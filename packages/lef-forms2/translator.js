import React from 'react'
import { isString, get, head, map } from 'lodash'
import { Translate } from 'meteor/lef:translations'

const translation = ({ translate }) => {
  if (translate) return <Translate _id={translate} />
}

const translatorText = (text, translator, getDefault) => {
  if (text) {
    if (isString(text)) return text
    const lang = getDefault
      ? get(translator, 'default', 'currentLanguage')
      : get(translator, 'currentLanguage', 'default')
    return text[lang] || text.default || translation(text) || head(map(text))
  } else return ''
}

export { translatorText }
