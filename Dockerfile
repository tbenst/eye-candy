FROM node:10.13-stretch
RUN mkdir -p /www/src
RUN mkdir /www/view
RUN mkdir /www/static
WORKDIR /www
# RUN npm install --quiet --production
RUN apt-get update && apt-get -y install \
    ffmpeg \
    libx264-dev
COPY web/package.json /www
COPY web/package-lock.json /www
RUN npm install --quiet
COPY web/src /www/src
COPY web/static /www/static
COPY web/view /www/view
