FROM node:7.0.0
RUN mkdir -p /www/src
RUN mkdir /www/view
RUN mkdir /www/static
COPY web/package.json /www
WORKDIR /www
# RUN npm install --quiet --production
RUN npm install --quiet
RUN echo deb http://ftp.debian.org/debian jessie-backports main > /etc/apt/sources.list.d/backports.list 
RUN apt-get update && apt-get -y install \
    ffmpeg \
    libx264-dev
COPY web/src /www/src
COPY web/static /www/static
COPY web/view /www/view
