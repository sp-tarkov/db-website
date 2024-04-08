# SPT DB Items Search

Source for the SPT DB Item Lookup website hosted at:
https://db.sp-tarkov.com

## Required Secrets

| Secret Name     | Description |
| :-------------- | :---------- |
| SSH_DEPLOY_HOST | The remote server host where deployments are pushed. |
| SSH_PRIVATE_KEY | The private key that the SSH connection uses to connect to the remote server. |
| SSH_KNOWN_HOSTS | The known_hosts entry for the remote server. |

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
