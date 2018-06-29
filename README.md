IOOS Catalog Harvest Registry
=============================

Web based User Interface for registering and managing metadata harvest
endpoints.


License
=======

The MIT License (MIT)
Copyright (C) 2016 RPS ASA

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


Release Instructions
====================
1. Identify the next version
2. Update `app/package.json` `Dockerfile` and `build/build.sh` with the new
   version.
   [Example](https://github.com/ioos/catalog-harvest-registry/commit/c6e0760eb9a533d0739491fd3f4c8b060a909f3a)
3. Build the project with `build/build.sh`
4. Push the changes so that dockerhub picks them up and builds an image
5. Publish a release

Installation
============

1. Clone the project
2. Install `maka-cli`

   ```
   npm install -g maka-cli
   ```

3. Install the project dependencies

   ```
   maka npm install
   ```

Linux/Ubuntu
============
You may need to run:

```
curl https://install.meteor.com/ | sh
```

to install meteor if issues with the above steps. 

Running
=======

To run the project use:

```
maka run
```

in the project's root directory.

If you want to specify an external Mongo server, which is necessary for integrating with the other services:

```
export MONGO_URL=mongodb://localhost:27017/registry
maka run
```


Configuring the project
=======================

The project connects to several external services for functionality. These
configuration parameters are configured in `config/development/settings.json`.

```json
{
    "email": {
        "mail_url": "smtp://<user>:<password>@<host>:<port>",
        "notification_list": [
            "<recipient email>"
        ],
        "support_email": "<support team email>"
    },
    "public": {
        "ckan_api_url": "http://<CKAN Host>/api/3/"
    },
    "services": {
        "ckan_api_key": "<CKAN Admin API Key>",
        "ckan_api_url": "http://<CKAN Host>/api/3/",
        "harvestAPI": "http://<catalog-harvesting host>/api/harvest"
    }
}

```


Docker
======

The docker build process for this project works by setting up nodeJS and then
downloading a fully built project from Amazon S3 where the releases are built
and uploaded to. The release instructions are further up in this document.

The project can be built by:

```
docker build -t ioos/catalog-harvest-registry .
```

The project can be run with docker. We recommend using docker-compose.

Here's an example docker-compose.yml

```
version: '2'

services:
  catalog-harvest-registry:
    image: ioos/catalog-harvest-registry
    env_file: envfile
    ports:
      - "3000:3000"

  mongo:
    image: mongo:latest
    container_name: mongo
    volumes:
      - "mongo_data:/data/db"

  catalog-harvesting:
    image: ioos/catalog-harvesting:latest
    container_name: catalog-harvesting
    environment:
      - "ENABLE_CRON=true"
    env_file: envfile
    volumes:
      - "waf_data:/data"

  harvester:
    image: ioos/catalog-harvesting:latest
    env_file: envfile
    command: "/sbin/my_init -- /sbin/setuser harvest /run_worker.py"
    volumes:
      - "waf_data:/data"

  waf:
    image: lukecampbell/docker-waf
    container_name: waf
    env_file: envfile
    volumes:
      - "waf_data:/usr/share/nginx/html/waf"
    ports:
      - "3001:80"

  redis:
    image: redis:3.0.7-alpine
    container_name: redis
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes


volumes:
  mongo_data:
  redis_data:
  waf_data:

```

Here's the environment file:

```
METEOR_SETTINGS={"email":{"mail_url":"","notification_list":[],"support_email":"luke.campbell@rpsgroup.com"},"public":{},"services":{"ckan_api_key":"","ckan_api_url":"","harvestAPI":"http://catalog-harvesting:3002/api/harvest"}}
MONGO_URL=mongodb://mongo:27017/registry
ROOT_URL=http://localhost:3000/
CRON_STRING=32 0 * * *
REDIS_URL=redis://redis:6379/0
CKAN_API=http://ckan:8080/
CKAN_API_KEY=
WAF_URL_ROOT=http://localhost:3001/
```

In the case of Mac's which use docker-machine, use:

```
METEOR_SETTINGS={"email":{"mail_url":"","notification_list":[],"support_email":"luke.campbell@rpsgroup.com"},"public":{},"services":{"ckan_api_key":"","ckan_api_url":"","harvestAPI":"http://catalog-harvesting:3002/api/harvest"}}
MONGO_URL=mongodb://mongo:27017/registry
ROOT_URL=http://192.168.99.100:3000/
CRON_STRING=32 0 * * *
REDIS_URL=redis://redis:6379/0
CKAN_API=http://ckan:8080/
CKAN_API_KEY=
WAF_URL_ROOT=http://192.168.99.100:3001/
```

Where `192.168.99.100` is the IP-Address of the docker-machine's VM.
