fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android changelog

```sh
[bundle exec] fastlane android changelog
```

Get changelog from git and create a new versioned tag on the current branch

### android remove_tags

```sh
[bundle exec] fastlane android remove_tags
```

Remove remote latest and version tags. If run with local:true, only local tags will be removed

### android beta

```sh
[bundle exec] fastlane android beta
```

Build webapp and android app

### android build_for_screengrab

```sh
[bundle exec] fastlane android build_for_screengrab
```

Build debug and test APK for screenshots

### android release

```sh
[bundle exec] fastlane android release
```

Release a new version to the Google Play on production track

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
