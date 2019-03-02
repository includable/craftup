#!/usr/bin/env bash

docker build -t craft .
docker tag craft tschoffelen/craft:latest

if [ ${TRAVIS_BRANCH} == "master" ]; then
    docker push tschoffelen/craft:latest
fi
