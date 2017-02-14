FROM node:7.5.0

RUN npm set progress=false && \
    npm install -g --progress=false yarn \
    	bower

RUN mkdir /www
COPY web/package.json /www
WORKDIR /www
# RUN npm install --quiet
# RUN npm install -g bower
COPY web/bower.json /www

RUN yarn install
RUN bower install --allow-root
COPY web/webpack.config.js /www

COPY web/src/*.js /www/src/
COPY web/src/epl /www/src/epl

CMD sh -c "npm run webpack:watch & node --harmony src/app.js"