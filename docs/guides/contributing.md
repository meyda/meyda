---
layout: default
---

We welcome any and all contributions to Meyda, including filing issues, feature requests, pull requests, feedback, and any other comments. Please familiarise yourself with our [Contributor Covenant](https://github.com/hughrawlinson/meyda/wiki/Contributor-Covenant). The core contributors are quite limited on time, so we'd really appreciate if you could stick to the following few rules:

### Filing issues

- Bug reports
  - Please include comprehensive instructions for us to reproduce the bug. If you can include the source, please do.
  - If you have the time, please consider finding the problem within Meyda yourself, and if you're feeling generous have a go at fixing it and submitting a pull request.
- Feature requests
  - Keep in mind that the core contributors are not full time Meyda developers.
  - If there's a feature you really want that we don't yet support, please consider implementing it yourself and submitting a pull request.

### Pull Requests

- Please try and stick to a similar coding style to what currently exists.
- Make sure your change is covered by tests.
- If you have to make an implementation decision, feel free to ask us for our input by opening an issue on the repository. This may save time in code review.
- Bear in mind that we're not working on Meyda full time, so it may take us a while to review your code.
- Your commit messages should adhere to the [conventional commits] standard. We recommend using [commitizen] to make standard compliant commit messages.

### Conventional Commits

Using conventional commits has proven to add quite a lot of overhead for external contributors, and we're sorry about that.
The reason that we use conventional commits is so that we can automate meyda releases using semantic release, and so that it's
really clear from the git log which commits contain changes that are considered fixes, new features, or breaking changes, which
is crucial to know in a semantically versioned project.

Some pitfalls some run into are documented [here](https://www.hughrawlinson.me/posts/2020/05/17/avoiding-pitfalls-when-installing-semantic-release-for-npm-library-packages). And remember: the top line description of a commit message should be in all lower case.

We hope to have better PR feedback on commit messages in the future - and if possible a bot that will just lint and fix any
minor errors. Follow along [on this issue](https://github.com/meyda/meyda/issues/347).

### Build the project

1. Remember to do it.
2. `npm run default`
3. This will run tests, so make sure they all pass and try and make sure any new code you're submitting is covered properly.

[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[commitizen]: https://github.com/commitizen/cz-cli
