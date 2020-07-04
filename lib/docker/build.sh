#!/usr/bin/env bash

# Build craftup/craft image
cd craft
docker build -t craft .
docker tag craft craftup/craft:latest

if [ ${TRAVIS_BRANCH} == "master" ]; then
    docker push craftup/craft:latest
fi

# Build craftup/mysql-client image
cd ../mysql-client
docker build -t mysql-client .
docker tag craft craftup/mysql-client:latest

if [ ${TRAVIS_BRANCH} == "master" ]; then
    docker push craftup/mysql-client:latest
fi
