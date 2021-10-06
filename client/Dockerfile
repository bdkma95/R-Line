# Dockerfile
# base image
FROM node:alpine
USER root

WORKDIR /home/app

COPY package.json  /home/app/

COPY package-lock.json /home/app/

RUN npm install --frozen-lockfile

COPY ./ /home/app

RUN chown -R root: /home/app

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]

# copy source files
#COPY . /home/app

# install dependencies
#RUN npm install

# start app
#RUN npm run dev
#EXPOSE 3000
#CMD npm run start