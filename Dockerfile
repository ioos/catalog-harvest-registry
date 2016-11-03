FROM debian:jessie
MAINTAINER Luke Campbell <luke.campbell@rpsgroup.com>

ENV NODE_VERSION 4.6.1
ENV GOSU_VERSION 1.9
ENV SCRIPTS_DIR /opt/build_scripts
ENV APP_DIR /opt/meteor/dist
ENV REGISTRY_VERSION 1.0.0
ENV PORT 3000

RUN mkdir -p $SCRIPTS_DIR
RUN useradd -m node

COPY contrib/scripts/install-deps.sh $SCRIPTS_DIR/
RUN $SCRIPTS_DIR/install-deps.sh
COPY contrib/scripts/install-node.sh $SCRIPTS_DIR/
RUN $SCRIPTS_DIR/install-node.sh
COPY contrib/scripts/install-app.sh $SCRIPTS_DIR/
RUN $SCRIPTS_DIR/install-app.sh

WORKDIR $APP_DIR/catalog-harvest-registry
CMD ["/usr/local/bin/gosu", "node", "node", "main.js"]
