FROM node:18-bookworm

RUN apt-get update && apt-get install -y xdg-utils wget xz-utils python3-pyqt5 curl libegl1 libopengl0 libxcb-cursor0 
RUN wget --no-check-certificate -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sh /dev/stdin

RUN apt-get install -y imagemagick

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
