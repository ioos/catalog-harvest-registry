#!/bin/bash

set -e

BUILD_NAME=catalog-harvest-registry-${REGISTRY_VERSION}

echo "[-] Installing application"
mkdir -p ${APP_DIR}
wget -O ${APP_DIR}/${BUILD_NAME}.tar.gz https://s3.amazonaws.com/asa-dev/releases/${BUILD_NAME}.tar.gz
cd $APP_DIR
tar -zxvf ${BUILD_NAME}.tar.gz
cd catalog-harvest-registry/programs/server
npm install
