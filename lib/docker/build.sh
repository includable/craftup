#!/usr/bin/env bash

docker build -t craft .
docker tag craft craftcms/craft:latest

if [ ${TRAVIS_BRANCH} == "master" ]; then
    docker push craftcms/craft:latest
fi
