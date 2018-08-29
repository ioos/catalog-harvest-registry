FROM debian:jessie
MAINTAINER Luke Campbell <luke.campbell@rpsgroup.com>

ENV REGISTRY_VERSION 1.2.1

ENV NODE_VERSION 4.6.1
ENV GOSU_VERSION 1.9
ENV SCRIPTS_DIR /opt/build_scripts
ENV BUILD_DIR /opt/build_dir
ENV APP_DIR /opt/meteor/dist
ENV PORT 3000

RUN mkdir -p $SCRIPTS_DIR
RUN useradd -m node

COPY build $BUILD_DIR/
COPY contrib/scripts/ $SCRIPTS_DIR/

RUN $SCRIPTS_DIR/install-deps.sh
RUN $SCRIPTS_DIR/install-node.sh

# Production
RUN $SCRIPTS_DIR/install-app.sh

# Dev
#RUN $SCRIPTS_DIR/install-app-dev.sh

WORKDIR $APP_DIR/bundle
CMD ["/usr/local/bin/gosu", "node", "node", "main.js"]
