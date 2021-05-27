---
layout: default
---

# Getting Started

Meyda is a Javascript Library that can listen to audio and output a selection of
statistics that describe it. Meyda has a variety of different applications, and
environments it can be used in. Lets take a look at some.

## What can you do with Meyda?

You can get audio analysis of

- Audio playing in real time in your browser
- Audio that's stored in buffers or arrays in your browser
- Audio that's stored on disk as a wav file
- Audio that you've loaded in Node.js

You can use these analyses in

- Real Time Audio Visualizations
- Machine Learning
- Visual Score Generation
- Music Recommendation
- ...and anything else you can think of!

## What's in these audio analyses?

Meyda can calculate a wide variety of standard audio features, including
loudness, spectral characteristics like brightness (spectral centroid) and
noisiness (flatness) and much more. For a full list and explanation of the audio
features Meyda supports, please see [our audio feature reference document]
[audio-features].

## Installation

To install Meyda in a modern frontend project, use `npm`:

`npm install --save meyda`

For web use cases, Meyda bundles a browserified copy of itself that exposes a
`Meyda` object on the `window` object. This can be used in situations where npm
is not in use, and you need to include a html link to your dependency, like the
jQuery days. To add Meyda to your web page, you can load it via [unpkg] as
follows:

```html
<script type="text/javascript" src="https://unpkg.com/meyda@<VERSION>/dist/web/meyda.min.js">
```

However, we recommend using npm to install Meyda where possible to avoid
security issues, including Content Security Policy headers on your own site to
allow Javascript sources from unpkg, and using [subresource integrity] to ensure
the integrity of the installed script.

### Typescript support

Type definitions are available in Meyda and are managed in the [DefinitelyTyped repository][typesource]. To get code completion in your IDE and type checking at compile time, install the [@types/meyda] package from npm alongside Meyda.

```
npm install --save @types/meyda
```

## How can you do these things with Meyda?

Please have a look through the following tutorials for the one that closest
matches your needs.

- [Real-time audio feature extraction in the browser][online-web-audio]
- [Offline audio feature extraction on the command line][offline-cli]
- [Audio feature extraction in Node JS][offline-node]

## Need more help?

Can't find a tutorial that matches up with what you're trying to do with Meyda?
Not finding the documentation to be clear enough? Please open a [GitHub Issue]
[new-issue], and we'll do our best to help.

[audio-features]: /audio-features
[new-issue]: https://github.com/meyda/meyda/issues/new
[online-web-audio]: /guides/online-web-audio
[offline-cli]: /guides/offline-cli
[offline-node]: /guides/offline-node
[unpkg]: https://unpkg.com
[subresource integrity]: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
[typesource]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/meyda
[@types/meyda]: https://www.npmjs.com/package/@types/meyda
