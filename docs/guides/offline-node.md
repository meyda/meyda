---
layout: default
---

**Note: This guide requires a working installation of Node JS. If you don't have
one, please get set up using the [Node Version Manager][nvm]**

# Offline Audio Feature Extraction in Node.js

There are many cases where you don't need to run audio feature extraction in
real time on audio that is playing in the browser. In the case of building a
database of audio features extracted from samples, for use in machine learning
or visual score generation for example, you may wish to script the audio feature
extraction process. Meyda exposes two interfaces for scripting audio feature
extraction:

- [A Command Line Interface][offline-cli]
  - Useful for bash scripting of audio feature extraction
- A Javascript API that does not depend up on Web Audio
  - Useful for scripting feature extraction in Node JS

This article will discuss offline audio feature extraction in Node JS.

One significant advantage of Meyda's Javascript API for use in Node JS over its
command line interface is that you can run audio feature extraction as part of
the rest of your application - for example, you could build a RESTful Web API,
where a client could upload audio from their system, and receive the results of
feature extraction in response. This is useful if you do not wish to run audio
feature extraction in the client - perhaps you need to target browsers that do
not support the Web Audio API.

_This guide doesn't cover how to load audio from disk in Node - it applies to
audio wherever you've loaded it from. If you'd like to learn how to load audio
from disk in Node, check out [this article][load-audio-from-disk-article]._

## How to call Meyda in Node

Meyda exposes a small Javascript API, which you can learn from our [reference
documentation][api-reference].

We start by installing and importing Meyda in our Node JS project. If you don't
already have a Node JS project into which you wish to import Meyda, you should
run the following commands in your terminal application to create a directory
and initialize a new Node JS project:

```
mkdir meyda-node-tutorial
cd meyda-node-tutorial
npm init -y
touch index.js
```

Run the following command to install Meyda:

```
npm install --save meyda
```

In our Javascript file (`index.js` in the example above), we'll import Meyda:

```javascript
var Meyda = require("meyda");
```

Next, we will construct a signal that contains 20 zero crosses. A signal is a
list of numbers that can be between the values of -1 and 1. When a signal goes
from a negative value to a positive value, or vice versa, it has crossed zero.

```javascript
var signal = new Array(32).fill(0).map((element, index) => {
  const remainder = index % 3;
  if (remainder === 0) {
    return 1;
  } else if (remainder === 1) {
    return 0;
  }
  return -1;
});
```

The signal looks like this:

![A graph of a signal over time that oscillates from 1, to 0, to -1, and repeats
until there are 32 values in the signal][signal-image]

Finally, we can pass the signal to Meyda and ask it to calculate the zero
crossing rate for the signal:

```javascript
Meyda.extract("zcr", signal);
// returns 20
```

We see that Meyda correctly calculates 20 zero crosses for our constructed
signal.

## Conclusion

In this article, you have learned how to extract Audio Features using Meyda in
Node JS. You can use this knowledge to build applications that extract audio
in a variety of contexts, including web servers, command line utilities,
scripts that extract audio features and insert them into a database for later
use, and much more.

You can see an example implementation of the code in this demo in our [runkit
demo page][runkit-demo]

Next, why don't you check out our [audio feature reference]
[audio-feature-reference] to learn about the various audio features that Meyda
can extract?

[nvm]: https://github.com/creationix/nvm
[offline-cli]: /guides/offline-cli
[api-reference]: /reference
[signal-image]: /images/signal-image.png
[runkit-demo]: https://runkit.com/raw/5ba62181c2e2f10013c5bf38
[audio-feature-reference]: /audio-features
[load-audio-from-disk-article]: https://www.hughrawlinson.me/posts/2021/05/19/loading-audio-in-node-js
