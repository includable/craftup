#!/usr/bin/env bash

docker build -t craft .
docker tag craft craftcms/craft:latest

if [ ${TRAVIS_BRANCH} == "master" ]; then
    docker push craftcms/craft:latest
fi

cd mysql-client
docker build -t mysql-client .
docker tag craft craftcms/mysql-client:latest

if [ ${TRAVIS_BRANCH} == "master" ]; then
    docker push craftcms/mysql-client:latest
fi
