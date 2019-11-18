# Lef CSS

CSS extensions. The imports available in this package can work together with bootstrap scss, but also offer alternatives to certain components (e.g. grid).

## Installation

1. Add this package as a git submodule to your project.
2. Add this package to your meteor project:
```
$ meteor add lef:css
```
_**Note:** this step is not technically required since we are just importing scss files from a directory, but we can use versioning!_

## Getting started

1. Add a symlink to /node_modules/bootstrap in your imports folder if you use bootstrap:
```
$ cd imports
$ ln -s ../node_modules/bootstrap .
```
2. Add a symlink to this package in your imports folder:
```
$ ln -s ../packages/lef-css .
```
3. Create the file `client/main.scss`:
```SCSS
// First import your global app scss to override bootstrap defaults
@import './app/_fonts';
@import './app/_settings';

// Put a symlink to /node_modules/bootstrap in /imports (you already did this!)
@import '{}/imports/bootstrap/scss/bootstrap';

// import some files from this package
@import '{}/imports/lef-css/_mixins';
@import '{}/imports/lef-css/_global';
@import '{}/imports/lef-css/_width';
@import '{}/imports/lef-css/_backgrounds';

// import your own component styles
@import './components/_layout';
@import './components/_header';
@import './components/_content';
@import './components/_footer';
```
_**Note:** sample imports!_

## Available imports

_A short description of the most useful CSS-rules available._

### Mixins

Mixins are used as follows:
```SCSS
@include mixinName;
@include mixinName(arguments);
@include mixinName(arguments) {
  // ... custom styles if appropriate
}
```

**`background-retina( $image, $width, $height )`**
- **$image** image location<br>on retina displays, an image with @2x appended to the name will be served
- **$width**, **$height** optional `background-size` values

**`above( $breakpoint ) { ... styles }`**<br>
**`below( $breakpoint ) { ... styles }`**<br>
**`between( $breakpoint, $larger-breakpoint ) { ... styles }`**<br>
**`outside( $breakpoint, $wider-breakpoint ) { ... styles }`**<br>
- **$breakpoint**, **$larger-breakpoint** the breakpoint (screen-width, preferrably in em) above/below the supplied styles should be applied<br>
_The mixins takes overlap into account, so you can use the same breakpoint for above and below (inclusive and exclusive respectively)_

###  Backgrounds

**`.bg`**<br>
Include this class if you want to use any of the background options (color, image, pattern, sizing)!

### Width

_**Note** you can override the breakpoints in your scss settings file:_

```SCSS
$fourk: 240em; /* 3840px */
$threek: 180em; /* 2880px */
$tv: 160em; /* 2560px */
$hd: 120em; /* 1920px */
$full: 100em; /* 1600px */
$width: 90em; /* 1440px */
$desktop: 80em; /* 1280px d */
$laptop: 64em; /* 1024px l */
$netbook: 56em; /* 896px n */
$tablet: 48em; /* 768px t */
$phablet: 40em; /* 640px f */
$phone: 30em; /* 480px p */
$watch: 20em; /* 320px w */
```

If you use bootstrap, you might want to add this too:
```SCSS
$grid-breakpoints: (
  default: 0,
  xs: 0 + 0.001, // bootstrap breakpoint xs
  watch: $watch, // 320px w,
  phone: $phone, // 480px p
  sm: $phone + 0.001, // bootstrap breakpoint sm
  phablet: $phablet, // 640px f
  tablet: $tablet, // 768px t
  md: $tablet + 0.001, // bootstrap breakpoint md
  netbook: $netbook, // 896px n
  laptop: $laptop, // 1024px l
  lg: $laptop + 0.001, // bootstrap breakpoint lg
  desktop: $desktop, // 1280px d
  xl: $desktop + 0.001, // bootstrap breakpoint xl
  width: $width, // 1440px wd
  full: $full, // 1600px fl
  hd: $hd, // 1920px hd
  tv: $tv, // 2560px tv
  threek: $threek, // 2880px k3
  fourk: $fourk // 3840px k4
);
```

**`.width`**<br>
Responsive fluid container<br>
With max-width options:
- **`.width__watch`** 320
- **`.width__phone`** 480
- **`.width__phablet`** 640
- **`.width__tablet`** 768
- **`.width__netbook`** 896
- **`.width__laptop`** 1024
- **`.width__desktop`** 1280
- **`.width__width`** 1440
- **`.width__full`** 1600
- **`.width__hd`** 1920
