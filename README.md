# SPT DB Items Search

Source for the SPT DB Item Lookup website hosted at:
https://db.sp-tarkov.com

## Local Build

Requirements:
- Node v20.12
- Bun v1.1

Clone the repository into a local directory.

Build the front-end:
- `cd frontend`
- `npm install`
- `npm run build`

Move the front-end build into the back-end public directory:
- `mkdir -p ../api/public`
- `cp -r dist/* ../api/public/`

Build the back-end:
- `cd ../api`
- `cp .env.example .env`
- `bun install`

Start the local server:
- `bun run start`

## Development with Docker

- `docker build --build-arg PROD=false -t db-website:local .`
- `docker run -p 3001:3001 db-website:local`
- Visit http://localhost:3001