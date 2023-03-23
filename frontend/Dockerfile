FROM node:19

COPY . /app

WORKDIR /app

RUN apt-get -y update
RUN apt-get -y upgrade
RUN npm i

CMD npm start