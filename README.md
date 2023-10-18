# SPT Items

## Required secrets
| secret name             | description | example       |
| :-----------------      | :---------- | :-------    |
| spt_items_hostname      | The remote server where spt-items-finder will be reachable <br> used for the frontend resolution  | spt-items.my.server.com |
| deploy_path             | The path to deploy to in the remote machine | `/var/www/html/aki/Website/items` |
| deploy_hostname         | The remote server where to deploy <br> used by Ansible SSH | my.server.com |
| deploy_username         | The default username to use on the remote server <br> used by Ansible SSH | www-data |
| deploy_user_group       | The default user group to use on the remote server <br> used to set permission on the website folder | www-data |
| deploy_ssh_key          | The **content** of the ssh private key used to connect to the remote server <br> The key needs to be in RSA in "RSA PRIVATE KEY" format <br> The ssh publick key needs to already be in the user used in the remote server ~/.ssh/authorized_keys | -----BEGIN RSA PRIVATE KEY----- <br> The key <br> -----END RSA PRIVATE KEY----- |
| deploy_ssh_key_passphrase | The passphrase to decrypt the SSH private key | test |

## ⚠ Important notes for the deployment ⚠
* Add all required secrets in Drone
* Server permissions:
    1. The server must be able to use `apt` package manager
    1. The *deploy_usernam* must exists, be part of the group *deploy_user_group* and be able to SSH into the server
    1. If the parent folder of *deploy_path* already exists, *deploy_username* must have read and write permissions on it
* PHP:
    1. `php8.0-fpm` and all its dependencies must already be installed
    1. `php8.0-fpm` must be configured to use *deploy_username* (to ensure the cache created by Laravel can be deleted before every new deployment)
* Nginx:
    1. Nginx must be using uses the user group *deploy_user_group*
    1. Nginx must be configured to use HTTPS
    1. Nginx must be configured to listen to *spt_items_hostname* and to point to the *deploy_path*


## The pipeline summary
* The Drone pipeline is based on Docker: [.drone-docker.yml](.drone-docker.yml)
* Some enhancement ideas can be found [here](#some-enhancement-ideas)

1. Each push will:
    1. Test the frontend
    2. IF on `development` or `master`/`main` branch
       1. Builds the frontend
    3. IF pushed from `master` or `main` main branch
       1. Move the build frontend in the backend `public` folder
       2. Deploys to the server

## The pipeline walkthrough
see [Walkthrough.md](./docs/Walkthrough.md)

## Some enhancement ideas
- Store the build so that it is not rebuilt on any `promote` event
- Use a volume or a cache for Yarn install

## Thanks
- CWX

## Cache refresh workaround
1. Navigate to `/var/www/html/aki/db-website/items/storage/framework/cache/data`
2. Delete each cache folder
3. Use the site to search for an item
4. New cache should be generated for the DB