---
layout: default
---

# Major changes Policy

Early on in the development of Meyda, we had to contend with the issue of how to relate changes to
audio feature extractors to semantic versioning. Specifically, the question was this: if a bug fix
to an audio feature extractor causes the result of that extractor to differ between Meyda versions,
should we consider that to be a breaking change. On the one hand, a correction to a feature
extractor is a bug fix, and therefore should correspond to a semantic versioning patch number
increment. But there were deeper considerations to take into account.

Several applications that relate to audio feature extraction involve caching the results of feature
extraction on some corpus, for use in lookup systems. For example, storing the audio features of
known labelled sounds in a database such that at a later time the audio features of an unknown
sound can be extracted and used with the [K Nearest Neighbors] algorithm for classification.

When audio features are stored/cached on a corpus of sound for these lookup systems, a specific
feature extractor algorithm was used. The same extractor (more accurately, an extractor that is
an equivalent pure function of a given signal) must be used at the lookup stage on the unknown
signal in order to provide comparable audio features on the new signal. Otherwise, the system
would in effect be comparing apples to oranges.

If Meyda were to change audio feature extractor implementations in such a way as to break extractor
equivalency between patch versions, we would reduce the efficacy of systems that are sensitive to
these changes. Specifically, publishing these changes as patch versions could cause issues in user
projects that are particularly difficult to diagnose, since patch versions can be upgraded through
version ranges with no code changes in the user's package.

Therefore, we have decided that every change to the output of an audio feature extractor _including
bugfixes_ are to be considered breaking changes.

[k nearest neighbors]: https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm
