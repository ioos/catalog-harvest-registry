#!/bin/bash
set -e

VERSION=1.1.0

maka build --architecture os.linux.x86_64
cd build
mv bundle catalog-harvest-registry
tar -zcvf catalog-harvest-registry-${VERSION}.tar.gz catalog-harvest-registry
aws s3 cp catalog-harvest-registry-${VERSION}.tar.gz s3://asa-dev/releases/catalog-harvest-registry-${VERSION}.tar.gz --acl public-read
rm -rf catalog-harvest-registry*
