---
layout: default
---
We welcome any and all contributions to Meyda, including filing issues, feature requests, pull requests, feedback, and any other comments. Please familiarise yourself with our [Contributor Covenant](https://github.com/hughrawlinson/meyda/wiki/Contributor-Covenant). The core contributors are quite limited on time, so we'd really appreciate if you could stick to the following few rules:

### Filing issues
* Bug reports
  * Please include comprehensive instructions for us to reproduce the bug. If you can include the source, please do.
  * If you have the time, please consider finding the problem within Meyda yourself, and if you're feeling generous have a go at fixing it and submitting a pull request.
* Feature requests
  * Keep in mind that the core contributors are not full time Meyda developers.
  * If there's a feature you really want that we don't yet support, please consider implementing it yourself and submitting a pull request.
* Pull Requests
  * _THANK YOU!_
  * Please try and stick to a similar coding style to what currently exists. We intend to include a specified style in the future, but for now just try not to deviate too much.
  * Always work on the 'next version branch', whose name is the version number of the next release.
  * Please remember to update `meyda.min.js` using the build system.

Feedback can be sent to any of the core team via however you want. Our email addresses are available in the [Web Audio Conference Paper](doc.gold.ac.uk/~mu202hr/publications/RawlinsonSegalFiala_WAC2015.pdf), we're all easily accessible on Twitter. If we have enough interest, we may establish a mailing list.

### Build the project
1. Remember to do it.
2. `npm run default`
3. This will run tests, so make sure they all pass and try and make sure any new code you're submitting is covered properly.
4. Pat yourself on the back for a job well done.

As a quick aside, because of the workflow for updating code coverage building meyda will not automatically run code coverage. You can do this yourself by running `npm run coverage`, which will return a coverage report, but will not post the data to our monitoring service (this would require distributing the secret, which seems like a bad idea).
