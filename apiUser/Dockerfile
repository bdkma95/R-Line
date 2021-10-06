FROM node:alpine
USER root

WORKDIR /home/app

COPY package.json  /home/app/

COPY package-lock.json /home/app/

RUN npm install --frozen-lockfile

COPY ./ /home/app

EXPOSE 8080

CMD [ "npm", "start" ]
