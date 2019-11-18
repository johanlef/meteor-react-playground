# lef-utils

Tiny utilities package:

- [Text](#text)
- [hashScroll](#hashscroll)
- [InfiniteScroll](#infinitescroll)
- [getThumbnail](#getthumbnail)
- [userContext](#usercontext)
- [geoLocator](#geoLocator)

## Text

This is a very simple component which renders any given string in MarkDown. All [markdown-it](https://github.com/markdown-it/markdown-it) settings are available as props.

```JSX
import { Text } from 'meteor/lef:utils'

const Article = content => <Text content={content} />

const mdOptions = {
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: true, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  linkify: true, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (/* str, lang */) {
    return ''
  }
}

const CustomArticle = content => <Text content={content} options={mdOptions} />
```

## hashScroll

Use this function in componentDidMount and/or componentDidUpdate. It checks if a hash is present in the url and then scrolls to the hash location.

You need to check manually if all subscriptions are ready, like so:

```JSX
import { hashScroll } from 'meteor/lef:utils'

class LongList extends Component {
  componentDidUpdate() {
    if (this.props.ready) hashScroll()
  }
  render() {
    return this.props.items.map({_id, contents} => (
      <div id={_id}>
        {contents}
      </div>
    ))
  }
}
```

If you do not wait until all subscriptions are ready, the position of the hash element on page can change, due to new elements added while loading.

## InfiniteScroll

Use this component to render a list with an increasing limit while scrolling.

```JSX
import { InfiniteScroll } from 'meteor/lef:utils'

class LongList extends Component {
  constructor (props) {
    this.state = { page: 1 }
    this.increasePage = this.increasePage.bind(this)
  }
  increasePage(){
    this.setState({page: this.state.page + 1})
  }
  render () {
    <ListContainer page={this.state.page} onInfiniteScroll={this.increasePage} />
  }
}

const ListContainer = withTracker(({page}) => {
  const perPage = 12
  const handle = Meteor.subscribe('items')
  return {
    loading: !handle.ready(),
    items: Collection.find({},{limit: page * perPage}),
    totalItems: Collection.find().count()
  }
})(({page, items, loading, totalItems, onInfiniteScroll}) => {
  if (loading) return null
  return <InfiniteScroll loading={loading} visible={items.length} total={totalItems} onInfiniteScroll={onInfiniteScroll}>
    <RenderList items={items} />
  </InfiniteScroll>
})
```

The `InfiniteScroll` component gets props specific for this list. When the bottom of the list is reached (configurable with the prop `offset`), the method `increasePage()` is called which in turn updates the Tracker with a new limit.

## getThumbnail

Use this function to get a thumbnail from the imgUpload package (when thumbnail sizes are applied).

This function expects thumbnails to be saved like this:

```JSON
{
  "_id" : "galleryItem",
  "other" : "stuff",
  "image" : {
    "url" : "url of original uploaded image, can be any size",
    "thumbnails" : {
      "256" : "url of thumbnail fitting within 256 × 256 px",
      "512" : "url of thumbnail fitting within 512 × 512 px",
      "1024" : "url of thumbnail fitting within 1024 × 1024 px"
    }
  }
}
```

Usage

```JSX
import { getThumbnail } from 'meteor/lef:utils'

const ListItem = ({ _id, image }) => {
  const picture = getThumbnail(image, 512)
  return = <div style={{ backgroundImage: `url(${picture})`}} />
}
```

If a thumbnail with size 512 does not exist, the next larger one is returned. If no thumbnails are present, the original is returned.

## userContext

This is a context provider for Meteor.user(). See [docs](https://reactjs.org/docs/context.html) for more details about React context.

Usage:

```JSX
import { UserProvider, withUser } from 'meteor/lef:utils'

const Home = ({user, userId, isLoggedIn}) => (
  <div>
    {isLoggedIn ?
    `Welcome ${user.profile.name}!` :
    'Hello guest!'}
  </div>
)

const HomeWithUser = withUser(Home)

const App = () => (
  <div>
    <HomeWithUser />
  </div>
)

const AppContainer = () => (
  <UserProvider>
    <App />
  </UserProvider>
)

export default AppContainer
```

Use this context provider wherever you need information about the current user. Using a context provider also means there is only one Tracker used for user data.

As a bonus, `withUser` is also available as HOC.

## Text

This is a wrapper for MarkdownIt.

```JSX
import { Text } from 'meteor/lef:utils'

const mdOptions = {
  // Enable HTML tags in source
  html: true,

  // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  xhtmlOut: false,

  // Convert '\n' in paragraphs into <br>
  breaks: true,

  // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  langPrefix: 'language-',

  // Autoconvert URL-like text to links
  linkify: true,

  // Enable some language-neutral replacement + quotes beautification
  typographer: true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (/* str, lang */) {
    return ''
  }
}

const Article = ({ markdownString }) => <Text content={markdownString} options={mdOptions} />
```
