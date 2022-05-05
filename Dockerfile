FROM bitnami/minideb:latest
ARG NODE_VERSION

RUN apt-get update && apt-get install -y xdg-utils wget xz-utils python curl
RUN wget --no-check-certificate -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sh /dev/stdin

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - 
RUN apt-get install -y nodejs

RUN apt-get install -y imagemagick

ENV OAUTH_ID=oauth_id
ENV OAUTH_SECRET=oauth_secret
ENV OAUTH_REFRESH_TOKEN=oauth_refresh_token

RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN mkdir out

COPY package*.json ./
RUN npm install
COPY dist ./dist
COPY nytimes.recipe ./
COPY convert.sh ./
COPY nytimes.png ./

CMD [ "npm", "run", "start:prod" ]
