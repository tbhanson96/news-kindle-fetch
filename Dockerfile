ARG NODE_VERSION
FROM linuxserver/calibre:latest
ARG NODE_VERSION

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - 
RUN apt-get install -y nodejs

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./
RUN npm install
COPY dist ./dist
COPY nytimes.recipe ./

CMD [ "npm", "run", "start:prod" ]
