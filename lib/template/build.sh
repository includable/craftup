#!/usr/bin/env bash

cd src

composer update --optimize-autoloader

rm .env 2> /dev/null
rm craftup.json 2> /dev/null
rm -rf ./storage/backups 2> /dev/null
rm -rf ./storage/composer-backups 2> /dev/null
rm -rf ./storage/config-backups 2> /dev/null
rm -rf ./storage/logs 2> /dev/null
rm -rf ./storage/runtime 2> /dev/null
rm -rf ./web/cpresources 2> /dev/null
mkdir -p ./web/cpresources
touch ./web/cpresources/.gitkeep

mkdir -p ../dist
rm ../dist/template.zip 2> /dev/null

zip -qr ../dist/template.zip .
