# My project

This project was bootstrapped using [craftup](http://github.com/tschoffelen/craftup), 
the easiest way to set up Craft CMS for local development.


## Usage

For local development, you need to use the following commands and have
these dependencies installed on your machine.


### Dependencies

* [craftup](http://github.com/tschoffelen/craftup), install via `npm i -g craftup`
* [docker](http://docker.com)


### Commands

Run locally

```shell
craftup start
```

Add a Composer package

```shell
craftup composer craftcms/aws-s3
```

Dump database

```shell
craftup dump
```

Upload to production

```shell
craftup push
```

Download database from production

```shell
crafup pull
```
