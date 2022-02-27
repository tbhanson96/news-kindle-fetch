ARG NODE_VERSION
FROM linuxserver/calibre:latest
ARG NODE_VERSION

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - 
RUN apt-get install -y nodejs

ENV OAUTH_ID=oauth_id
ENV OAUTH_SECRET=oauth_secret
ENV OAUTH_REFRESH_TOKEN=oauth_refresh_token

RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN mkdir mnt

COPY package*.json ./
RUN npm install
COPY dist ./dist
COPY nytimes.recipe ./

CMD [ "npm", "run", "start:prod" ]
