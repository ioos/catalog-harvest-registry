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


Running the project
===================

1. Install the project dependencies:
   - [Meteor](http://www.meteor.com/)
   - [nodeJS](https://nodejs.org/en/download/)
   - [PostGIS](http://postgis.net/)
   - [Postgrest](http://postgrest.com/)

   If you're on a mac:
   ```
   brew install node postgis postgrest sqitch
   echo "Thank god for homebrew!!!!"
   ```

   Debian:
   ```
   sudo apt-get install -y postgis curl libpq-dev wget git sqitch
   curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
   sudo apt-get install -y nodejs
   wget -q -O- https://s3.amazonaws.com/download.fpcomplete.com/ubuntu/fpco.key | sudo apt-key add -
   echo 'deb http://download.fpcomplete.com/ubuntu/trusty stable main'|sudo tee /etc/apt/sources.list.d/fpco.list
   sudo apt-get update && sudo apt-get install stack -y
   git clone https://github.com/begriffs/postgrest.git
   cd postgrest
   stack build --install-ghc
   sudo stack install --allow-different-user --local-bin-path /usr/local/bin
   ```



2. Get the maka client
   ```
   npm install -g maka-cli
   ```

3. Clone the project
   ```
   git clone https://github.com/ioos/catalog-harvest-registry/
   ```

4. Install the database:

   ```
   git clone https://github.com/ioos/catalog-registry/
   cd catalog-registry/sqitch/
   createdb registry
   sqitch deploy db:pg:registry
   cd ..
   psql registry < data_load/data_load.sql
   ```

5. Run postgrest

   ```
   postgrest postgres://localhost/registry -p 3100 -a $USER --schema catalog_registry
   ```

6. Run the project

   ```
   cd catalog-harvest-registry
   maka run
   ```
   
