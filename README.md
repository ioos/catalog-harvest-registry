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
