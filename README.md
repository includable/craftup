# CraftUp

**The easiest way to develop Craft CMS websites.**

## Introduction

The goal of `craftup` is twofold:

#### Make it super easy to start your next Craft CMS project.

We do this by providing a single `craftup init` command which sets up a project scaffold based on the Craft CMS starter
template, with some improvements. It also sets up all the configuration files required to run this new site in Docker,
so that you don't need to install Apache, PHP and MySQL locally.

#### Make deployments painless.

If you haven't already set up continuous integration for your project, deploying usually means copying files over via
FTP, manually exporting your local database and then re-importing that data in the production database. We simplify that
by providing the `craftup pull` and `craftup push` commands, which automate every step of this process.

As a bonus, having a single CLI command that performs the whole deployment makes setting up continuous integration a lot
easier!

## Installation

Make sure you have a recent version of [Node](http://nodejs.org/) (8+) installed. If you plan to develop locally, you
will also need to install [Docker](https://docker.com).

After making sure those dependencies are met, installing `craftup` is as simple as running this command:

```shell
npm i -g craftup
```

Verify your install by running `craftup -v`.

## Starting your project

### Init a project

To start a new project, run:

```shell
craftup init <projectname>
```

This will create a new directory that contains a clean Craft CMS project.

### Start local server

From there, you can start your local development server by changing into the newly created
directory (`cd <projectname>`) and running:

```shell
craftup start
```

This might take a while the first time, since it needs to download the appropriate Docker images to run the project.
Subsequent runs will be much, much faster.

## Tools during development

### Install a dependency

Use the built-in `composer` command to install a composer package:

```shell
craftup composer craftcms/aws-s3
```

This is the same as running `composer require craftcms/aws-s3`. It is run within the Docker container however, meaning
that you don't need to have Composer installed on your machine.

### Dump the database

During development you might want to export your database contents. You can do so from within the Craft dashboard, but
also by running:

```shell
craftup dump [path]
```

If you don't specify a path, this will create a file called `database.sql` in your root project directory.

Warning: this will overwrite any existing files with the same filename.

## Default template

The default template contains these plugins pre-installed:

- Redactor - the rich text editor of choice in Craft
- AWS S3 - an easy way to store assets in the cloud
- [SEO](https://github.com/ethercreative/seo#readme) - a simple SEO plugin from Ethercreative

## Project status

[![Travis](https://img.shields.io/travis/com/tschoffelen/craftup.svg)](https://travis-ci.com/tschoffelen/craftup)
[![npm](https://img.shields.io/npm/v/craftup.svg)](https://npmjs.com/package/craftup)

This project is in beta status. Our team has been using it internally for dozens of projects, but there's still a lot to
do, especially for non-Mac users.

- [x] Create and run new projects with `init` and `start` commands
- [x] Import and export database with `load` and `dump` commands
- [ ] Add FTP support for `push` and `pull` commands
- [ ] Add SSH support for `push` and `pull` commands
- [ ] Add support for Windows and Linux

Please do feel free to help out by submitting pull requests and opening issues.
