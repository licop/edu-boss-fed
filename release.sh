#!/bin/bash

tar -zcvf release.tgz src node_modules public .browserslistrc .editorconfig .eslintrc.js babel.config.js package.json tsconfig.json vue.config.js

scp -r release.tgz root@39.107.225.18:/root/edu-boss-fed

rm -rf release.tgz