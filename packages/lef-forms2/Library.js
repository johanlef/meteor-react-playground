import { map, isArray, isFunction, difference, cloneDeep } from 'lodash'

class Library extends Map {
  /*
   * Created a new Library with a selection of only the supplied keys.
   */
  subset (keys) {
    const knownKeys = Array.from(this.keys())
    const diff = difference(keys, knownKeys)
    if (diff.length > 0) {
      throw new Error(
        `Unknown key(s): ${diff.join(',')} (available: ${knownKeys.join(',')})`
      )
    }
    return new Library(map(keys, k => [k, this.get(k)]))
  }
  /*
   * Create a (deep) clone.
   */
  clone () {
    return cloneDeep(this)
  }
}

const grab = (source, field, test, sourceName) => {
  const obj = source[field]
  if (!test(obj)) {
    throw new TypeError(
      `Expected '${field}' to match ${test.name} in ${sourceName}`
    )
  }
  return obj
}

class DecoratorLibrary extends Library {
  subset (keys) {
    return new DecoratorLibrary(super.subset(keys).entries())
  }
  clone () {
    return new DecoratorLibrary(this.entries())
  }
  apply (componentLibrary, context) {
    this.forEach((source, sourceKey) => {
      const decorator = grab(source, 'decorator', isFunction, sourceKey)
      const combine = grab(source, 'combine', isFunction, sourceKey)
      const filter = grab(source, 'filter', isFunction, sourceKey)
      const decoratorConfig = grab(source, 'config', isFunction, sourceKey)
      const decoratorTransform = grab(
        source,
        'transform',
        isFunction,
        sourceKey
      )
      source.transformer = (element, saving) =>
        decoratorTransform(element, context, saving)
      componentLibrary.forEach((target, targetKey) => {
        // is this decorator interested?
        if (filter(targetKey)) {
          // apply the decorator
          const originalDisplayName =
            target.component.displayName ||
            target.component.name ||
            'Component'
          target.component = decorator(target.component)
          target.component.displayName = `${sourceKey}(${originalDisplayName})`
          // combine configurations
          const componentConfig = grab(target, 'config', isFunction, targetKey)
          target.config = () =>
            combine(componentConfig(context), decoratorConfig(context))
          const componentTransform = grab(
            target,
            'transform',
            isFunction,
            targetKey
          )
          target.transformer = (element, saving) =>
            componentTransform(element, context, saving)
        } else {
          // const info = `${sourceKey} is not interested in ${targetKey}`
          // if (console.info) console.info(info)
          // else console.log(info)
        }
      })
    })
  }
}

export { Library, DecoratorLibrary }
