FROM linuxserver/calibre:latest 


RUN apt update
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
RUN apt install nodejs

ENV OAUTH_ID=oauth_id
ENV OAUTH_SECRET=oauth_secret
ENV OAUTH_REFRESH_TOKEN=oauth_refresh_token

RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN mkdir out

COPY package*.json ./
RUN npm install --omit-dev
COPY dist ./dist
COPY nytimes.recipe ./
COPY economist.recipe ./
COPY create-nytimes-cover.sh ./
COPY nytimes.png ./

ENTRYPOINT ["npm", "run", "start:prod"]
