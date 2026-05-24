# News Kindle Fetcher
Docker image for fetching the latest news articles, storing them in the Newspapers library, and sending them to Kindle.

## Usage
Each run must specify a delivery method (`api` or `email`) and one or more publications (`nytimes` or `economist`). API delivery uploads the generated EPUB to the Newspapers library and asks the API to deliver it to the default Kindle address. `HOMESERVER_API_KEY` is required for API delivery.

```bash
docker run --rm -it \
  -e HOMESERVER_API_KEY=key \
  -v "$(pwd)/out:/opt/app/out" \
  news-kindle-fetch:latest --delivery api nytimes
```

By default, uploads are sent to `https://files.timbhanson.com/api/ebooks/newspapers`. Override the endpoint when testing against another server:

```bash
docker run --rm -it \
  -e HOMESERVER_API_KEY=key \
  -e NEWSPAPER_UPLOAD_URL=http://host.docker.internal:3000/api/ebooks/newspapers \
  -v "$(pwd)/out:/opt/app/out" \
  news-kindle-fetch:latest --delivery api nytimes
```

Pass multiple publication names to generate and deliver more than one EPUB in a run:

```bash
docker run --rm -it \
  -e HOMESERVER_API_KEY=key \
  -v "$(pwd)/out:/opt/app/out" \
  news-kindle-fetch:latest --delivery api nytimes economist
```

## Delivery Methods

The application supports `--delivery api` and `--delivery email`, passed through the production npm script along with a required publication:

```bash
npm run start:prod -- --delivery api economist
npm run start:prod -- --delivery email economist
npm run docker:start -- --delivery api nytimes
```

The Docker image forwards all caller-provided application options through the final line of the `Dockerfile`:

```dockerfile
ENTRYPOINT ["npm", "run", "start:prod", "--"]
```

Everything appended to `docker run` is forwarded by npm to the application. Neither delivery nor publication is defaulted by the image. Direct email delivery uses the retained OAuth environment variables:

```bash
docker run --rm -it \
  -e OAUTH_ID=id \
  -e OAUTH_SECRET=secret \
  -e OAUTH_REFRESH_TOKEN=token \
  -v "$(pwd)/out:/opt/app/out" \
  news-kindle-fetch:latest --delivery email economist
```

## Environment

The Dockerfile declares placeholders for both delivery methods. Provide real credential values at runtime with `-e`; do not bake secrets into the image.

| Variable | Required | Purpose |
| --- | --- | --- |
| `HOMESERVER_API_KEY` | API delivery | API key sent as the `x-api-key` header when uploading an EPUB. |
| `NEWSPAPER_UPLOAD_URL` | No | Newspaper upload endpoint for API delivery. Defaults to `https://files.timbhanson.com/api/ebooks/newspapers`. |
| `OAUTH_ID` | Email delivery | Gmail OAuth client ID used for direct email delivery. |
| `OAUTH_SECRET` | Email delivery | Gmail OAuth client secret used for direct email delivery. |
| `OAUTH_REFRESH_TOKEN` | Email delivery | Gmail OAuth refresh token used for direct email delivery. |
