@mause/repro
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@mause/repro.svg)](https://npmjs.org/package/@mause/repro)
[![GitHub Actions](https://github.com/Mause/repro/actions/workflows/node.js.yml/badge.svg)](https://github.com/Mause/repro/actions/workflows/node.js.yml)
[![Downloads/week](https://img.shields.io/npm/dw/@mause/repro.svg)](https://npmjs.org/package/@mause/repro)
[![License](https://img.shields.io/npm/l/@mause/repro.svg)](https://github.com/Mause/repro/blob/main/LICENSE)

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
* [`repro run ISSUE`](#repro-run-issue)

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

_See code: [dist/commands/load.ts](https://github.com/Mause/repro/blob/v0.0.0/dist/commands/load.ts)_

## `repro run ISSUE`

Load code blocks from an issue into a file and run them

```
USAGE
  $ repro run [ISSUE]

ARGUMENTS
  ISSUE  Issue to load and run - either a URL or owner/name/issue_id triplet

DESCRIPTION
  Load code blocks from an issue into a file and run them

EXAMPLES
  $ repro run owner/repo/issue_id
```

_See code: [dist/commands/run.ts](https://github.com/Mause/repro/blob/v0.0.0/dist/commands/run.ts)_
<!-- commandsstop -->
