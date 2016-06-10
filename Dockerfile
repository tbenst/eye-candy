FROM node:6
RUN mkdir -p /www/src
RUN mkdir /www/view
RUN mkdir /www/static
COPY web/src /www/src
COPY web/package.json /www
COPY web/view /www/view
COPY web/static /www/static
WORKDIR /www
RUN npm install --quiet --production
