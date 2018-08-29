#!/bin/bash
set -e
BUILD_NAME=catalog-harvest-registry-${REGISTRY_VERSION}
echo "[-] Installing application"
mkdir -p ${APP_DIR}
cp ${BUILD_DIR}/app.tar.gz ${APP_DIR}/${BUILD_NAME}.tar.gz
cd $APP_DIR
tar -zxvf ${BUILD_NAME}.tar.gz
cd bundle/programs/server
npm install