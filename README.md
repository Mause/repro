@mause/repro
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@mause/repro.svg)](https://npmjs.org/package/@mause/repro)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/@mause/repro.svg)](https://npmjs.org/package/@mause/repro)
[![License](https://img.shields.io/npm/l/@mause/repro.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @mause/repro
$ repro COMMAND
running command...
$ repro (--version)
@mause/repro/0.0.0 linux-x64 node-v16.17.0
$ repro --help [COMMAND]
USAGE
  $ repro COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`repro load ISSUE`](#repro-load-issue)
* [`repro run PERSON`](#repro-run-person)

## `repro load ISSUE`

Load code blocks from an issue into a file

```
USAGE
  $ repro load [ISSUE]

ARGUMENTS
  ISSUE  Issue to load - either a URL or owner/name/issue_id triplet

DESCRIPTION
  Load code blocks from an issue into a file

EXAMPLES
  $ repro load owner/repo/issue_id
```

_See code: [dist/commands/load/index.ts](https://github.com/Mause/repro/blob/v0.0.0/dist/commands/load/index.ts)_

## `repro run PERSON`

Say hello

```
USAGE
  $ repro run [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/run/index.ts](https://github.com/Mause/repro/blob/v0.0.0/dist/commands/run/index.ts)_
<!-- commandsstop -->
