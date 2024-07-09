# News kindle fetcher 
Docker image for fetching the latest news articles, and emailing it to kindle email of choice.

## Usage
docker run -it -e OAUTH_ID=id -e OAUTH_SECRET=secret -e OAUTH_REFRESH_TOKEN=token news-kindle-fetch:latest