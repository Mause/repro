oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g repro
$ repro COMMAND
running command...
$ repro (--version)
repro/0.0.0 linux-x64 node-v16.17.0
$ repro --help [COMMAND]
USAGE
  $ repro COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`repro hello PERSON`](#repro-hello-person)
* [`repro hello world`](#repro-hello-world)
* [`repro help [COMMAND]`](#repro-help-command)
* [`repro plugins`](#repro-plugins)
* [`repro plugins:install PLUGIN...`](#repro-pluginsinstall-plugin)
* [`repro plugins:inspect PLUGIN...`](#repro-pluginsinspect-plugin)
* [`repro plugins:install PLUGIN...`](#repro-pluginsinstall-plugin-1)
* [`repro plugins:link PLUGIN`](#repro-pluginslink-plugin)
* [`repro plugins:uninstall PLUGIN...`](#repro-pluginsuninstall-plugin)
* [`repro plugins:uninstall PLUGIN...`](#repro-pluginsuninstall-plugin-1)
* [`repro plugins:uninstall PLUGIN...`](#repro-pluginsuninstall-plugin-2)
* [`repro plugins update`](#repro-plugins-update)

## `repro hello PERSON`

Say hello

```
USAGE
  $ repro hello [PERSON] -f <value>

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

_See code: [dist/commands/hello/index.ts](https://github.com/Mause/repro/blob/v0.0.0/dist/commands/hello/index.ts)_

## `repro hello world`

Say hello world

```
USAGE
  $ repro hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `repro help [COMMAND]`

Display help for repro.

```
USAGE
  $ repro help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for repro.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `repro plugins`

List installed plugins.

```
USAGE
  $ repro plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ repro plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `repro plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ repro plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ repro plugins add

EXAMPLES
  $ repro plugins:install myplugin 

  $ repro plugins:install https://github.com/someuser/someplugin

  $ repro plugins:install someuser/someplugin
```

## `repro plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ repro plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ repro plugins:inspect myplugin
```

## `repro plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ repro plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ repro plugins add

EXAMPLES
  $ repro plugins:install myplugin 

  $ repro plugins:install https://github.com/someuser/someplugin

  $ repro plugins:install someuser/someplugin
```

## `repro plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ repro plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ repro plugins:link myplugin
```

## `repro plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ repro plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ repro plugins unlink
  $ repro plugins remove
```

## `repro plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ repro plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ repro plugins unlink
  $ repro plugins remove
```

## `repro plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ repro plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ repro plugins unlink
  $ repro plugins remove
```

## `repro plugins update`

Update installed plugins.

```
USAGE
  $ repro plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
