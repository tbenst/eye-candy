FROM node:6
RUN mkdir -p /www/src
RUN mkdir /www/view
RUN mkdir /www/static
RUN mkdir /www/node_modules
COPY web/src /www/src
COPY web/package.json /www
COPY web/view /www/view
COPY web/static /www/static
COPY web/node_modules /www/node_modules
WORKDIR /www
