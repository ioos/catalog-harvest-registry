#!/bin/bash
set -e

VERSION=1.2.0

maka build --architecture os.linux.x86_64

mv app.tar.gz catalog-harvest-registry-${VERSION}.tar.gz
aws s3 cp catalog-harvest-registry-${VERSION}.tar.gz s3://asa-dev/releases/catalog-harvest-registry-${VERSION}.tar.gz --acl public-read
rm -rf catalog-harvest-registry*
