FROM node:12
MAINTAINER Ganghee <heeheewuwu@gmail.com>
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
EXPOSE 3000
CMD ["pm2-runtime", "start","./bin/www"]