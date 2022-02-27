# node-docker-starter
Docker image for fetching the latest NYT article, converting to .mobi, and emailing it to kindle email of choice.

## Usage
docker run -it -e OAUTH_ID=id -e OAUTH_SECRET=secret -e OAUTH_REFRESH_TOKEN=token nytimes-kindle-fetch:latest