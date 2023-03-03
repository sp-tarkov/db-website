# Walkthrough

## Summary
* [Overview](#overview)
* [Pipeline definition](#pipeline-definition)
* [Pipeline concurrency](#pipeline-concurrency)
* [Triggers](#triggers)
* [Steps](#steps)
    * [Replace hosts and user variables](#replace-hosts-and-user-variables)
    * [Install frontend dependencies and build it](#install-frontend-dependencies-and-build-it)
    * [Run the frontend](#run-the-frontend)
    * [Test frontend](#test-frontend)
    * [Check ansible syntax](#check-ansible-syntax)
    * [Apply ansible playbook](#apply-ansible-playbook)
        * [Playbook definition](#playbook-definition)
        * [Delete old spt-items-api](#delete-old-spt-items-api)
        * [Copy the project](#copy-the-project)
        * [Copy PHP env file](#copy-php-env-file)
        * [Get JavaScript chunks name](#get-javascript-chunks-name)
        * [Get file names from find output](#get-file-names-from-find-output)
        * [Copy app.blade.php file](#copy-appbladephp-file)
        * [Download and install composer dependencies](#download-and-install-composer-dependencies)

## Overview
* The project is split between the frontend and the backend
    * the backend is a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) located in [api](../api) that points towards [https://dev.sp-tarkov.com/Rev/spt-items-api.git](https://dev.sp-tarkov.com/Rev/spt-items-api.git)
    * the frontend is a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) located in [frontend](../frontend) that points towards [https://dev.sp-tarkov.com/shirito/item-finder-website-frontend.git](https://dev.sp-tarkov.com/shirito/item-finder-website-frontend.git)
* There are two Ansible pipelines
    * A docker pipeline [drone-docker.yml](../../.drone-docker.yml)
    * A kubernetes pipeline [drone-kubernetes.yml](../../.drone-kubernetes.yml)
* All ansible playbook files are located in [.ansible](../../.ansible-items)
* The documentation is located in [documentation](../docs)

## Pipeline definition
```yml
kind: pipeline
type: kubernetes
name: default
```
The pipeline is defined either as Docker or Kubernetes depending on [.drone-docker.yml](../.drone-docker.yml) or [.drone-kubernetes.yml](../.drone-kubernetes.yml). The name is set as `default`.

## Pipeline Concurrency
```yml
concurrency:
  limit: 1
```
The pipeline is set to only one build at a time (every subsequent build with be pending).

## Triggers
```yml
trigger:
  event:
    - push
```
The pipeline is run on every push We want to check that every development on `development` branch is correct and deploy automatically when merged in `master`/`main`.
## Steps
### Replace hosts and user variables
```yml
- name: replace hosts and user variables
  image: ubuntu:impish
  environment:
    SPT_ITEMS_HOSTNAME:
      from_secret: spt_items_hostname
    DEPLOY_HOSTNAME:
      from_secret: deploy_hostname
    DEPLOY_USER:
      from_secret: deploy_username
    DEPLOY_PRIVATE_KEY:
      from_secret: deploy_ssh_key
    DEPLOY_SSH_KEY_PASSPHRASE:
      from_secret: deploy_ssh_key_passphrase
  commands:
    - sed -i 's/{{ SPT_ITEMS_HOSTNAME }}/'"$SPT_ITEMS_HOSTNAME"'/g' ./frontend/.env.example
    - mv ./frontend/.env.example ./frontend/.env
    - echo "$DEPLOY_PRIVATE_KEY" > private.key && chmod 600 private.key
    - sed -i 's/{{ DEPLOY_HOSTNAME }}/'"$DEPLOY_HOSTNAME"'/g' ./.ansible-items/inventory
    - sed -i 's/{{ DEPLOY_SSH_KEY_PASSPHRASE }}/'"$DEPLOY_SSH_KEY_PASSPHRASE"'/g' ./.ansible-items/inventory
    - sed -i 's/{{ DEPLOY_USER }}/'"$DEPLOY_USER"'/g' ./.ansible-items/inventory
```
Executed on every push. \
The following environment variables are injected using Drone secrets:
    * `SPT_ITEMS_HOSTNAME` is used by the frontend to call the backend.
    * `DEPLOY_HOSTNAME` is used by Ansible to connect to the remote server via SSH.
    * `DEPLOY_USER` is used by Ansible to connect to the remote server via SSH.
    * `DEPLOY_PRIVATE_KEY` is the SSH key used to connect to the remote server via SSH
    * `DEPLOY_SSH_KEY_PASSPHRASE` is the SSH key passphrase
Using `sed` makes temporary changes in the container/pod instead of commiting secrets in the repo in plain text. \
The changes are never pushed and are discarded when the container/pod is terminated.

### Install frontend dependencies and build it
```yml
- name: install dependencies and build frontend
  image: node:lts-alpine3.14
  commands:
    - node -v
    - npm -v
    - yarn --version
    - yarn --cwd ./frontend install
    - yarn --cwd ./frontend build --pure-lockfile
    - rm -rf ./api/public/static/*
    - cp -r ./frontend/build/* ./api/public
    - rm ./api/public/index.html
  depends_on:
    - replace hosts and user variables
```
Executed on every push. \
Since the PHP backend serves the ReactJS frontend, the former is built and moved in the latter.
Notes:
* `yarn --cwd <path> <command>` executes the command in the specified file
* `rm -rf ./api/public/static/*` deletes the static files to make sure no old JavaScript files remain
* `rm ./api/public/invdex.html` ReactJS is bundled with a `index.html`. It is discarded to use [](https://dev.sp-tarkov.com/Rev/spt-items-api/raw/branch/master/resources/views/app.blade.php) instead.

### Run the frontend
```yaml
- name: frontend
  image: nginx:1.21.4-alpine
  commands:
    - cp -r ./frontend/build/* /usr/share/nginx/html
    - cp ./frontend/src/cypress/nginx_config/default.conf /etc/nginx/conf.d/default.conf
    - nginx -g "daemon off;"
  detach: true
  depends_on:
    - install dependencies and build frontend
```
Copies the frontend and the nginx conf in the container to be able to test it.
The frontend is run and `detach` is specified so the End-to-End tests (using cypress) can run on it

### Test frontend
```yaml
- name: test frontend
  image: cypress/browsers:node16.5.0-chrome94-ff93
  commands:
    - node -v
    - npm -v
    - yarn --version
    - yarn --cwd ./frontend cy:ci
  depends_on:
    - install dependencies and build frontend
```
Run frontend tests using Cypress

### Check ansible syntax
```yml
- name: check ansible syntax
  image: plugins/ansible:3
  settings:
    playbook: ./.ansible-items/playbook.yml
    inventory: ./.ansible-items/inventory
    galaxy: ./.ansible-items/requirements.yml
    syntax_check: true
  when:
    branch:
      - development
```
Executed on every push. \
Check the Ansible syntax in [playbook.yml](../../.ansible-items/playbook.yml), [inventory](../../.ansible-items/inventory) and [requirements.yml](../../.ansible-items/requirements.yml). The check is executed on every push since we want to detect any error before validating the build using the promotion.

### Apply ansible playbook
```yml
- name: apply ansible playbook
  image: plugins/ansible:3
  settings:
    playbook: ./.ansible-items/playbook.yml
    inventory: ./.ansible-items/inventory
    galaxy: ./.ansible-items/requirements.yml
    timeout: 60
    verbose: 2
  environment:
    SPT_ITEMS_HOSTNAME:
      from_secret: spt_items_hostname
    DEPLOY_HOSTNAME:
      from_secret: deploy_hostname
    DEPLOY_USER:
      from_secret: deploy_username
    DEPLOY_USER_GROUP:
      from_secret: deploy_user_group
    SPT_ITEMS_PATH:
      from_secret: deploy_path
  depends_on:
    - test frontend
  when:
    branch:
      - master
      - main
```
Executed only on promotion to production. \
This step actually deploys to the server. \
This step is [idempotent](https://en.wikipedia.org/wiki/Idempotence). \
The following environment variables are injected using Drone secrets:
    * `SPT_ITEMS_HOSTNAME` is used by the PHP env file.
    * `DEPLOY_HOSTNAME` is used to connect to the remote server via SSH.
    * `DEPLOY_USER` is used to connect to the remote server via SSH.
    * `DEPLOY_USER_GROUP` is the user group, used to give read/write/execute permissions to the whole group. It must be the same as Nginx's user.
    * `SPT_ITEMS_PATH` is the path on the remote server where the files will be copyed to.

#### Playbook definition
```yml
hosts: sptarkov
```
Uses the host defined in [inventory](../../.ansible-items/inventory). Remember, the step [Replace hosts and user variables](#replace-hosts-and-user-variables) already replaced the variables at this point.

#### Delete old spt-items-api
```yml
- name: Delete spt-items-api before adding everything again
  file:
    state: absent
    path: "{{ lookup('env', 'SPT_ITEMS_PATH') }}"
```
Since the copy does not override the folder, this step takes care of it. \
`SPT_ITEMS_PATH` is injected in the environments properties (see [Apply ansible playbook](#apply-ansible-playbook))

#### Copy the project
```yml
- name: Copy the project
  copy:
    src: ../api/
    dest: "{{ lookup('env', 'SPT_ITEMS_PATH') }}"
```
Copies the whole project (frontend and backend) from the [api](../api) folder into the server.

#### Copy PHP env file
```yml
- name: Copy PHP .env file
  template:
    src: ./templates/.php-env.j2
    dest: "{{ lookup('env', 'SPT_ITEMS_PATH') }}/.env"
```
Uses [Jinja2](https://jinja2docs.readthedocs.io/en/stable/) to resolve the [template for the PHP .env file](../../.ansible-items/templates/.php-env.j2). \
`SPT_ITEMS_PATH` is injected in the environments properties (see [Apply ansible playbook](#apply-ansible-playbook)) \
`SPT_ITEMS_HOSTNAME` is injected in the environments properties (see [Apply ansible playbook](#apply-ansible-playbook))

#### Get JavaScript chunks name
```yml
- name: Get Chunk 2 name
  shell:
    cmd: find "{{ lookup('env', 'SPT_ITEMS_PATH') }}" -type f -name "*chunk.js" -printf "%f\n"
  register: find_output
```
Prepare a find of all JavaScript chunk files for the [app.blade.php.j2](../../.ansible-items/templates/app.blade.php.j2) template. \
`SPT_ITEMS_PATH` is injected in the environments properties (see [Apply ansible playbook](#apply-ansible-playbook))

#### Get file names from find output
```yml
- name: Get file names from find output
  set_fact:
    chunk_list: "{{ find_output['stdout'].split('\n') }}"
```
Splits the string containing the list of all JavaScript chunk files for the [app.blade.php.j2](../../.ansible-items/templates/app.blade.php.j2) template.

#### Copy app.blade.php file
```yml
- name: Copy app.blade.php file
  template:
    src: ./templates/app.blade.php.j2
    dest: "{{ lookup('env', 'SPT_ITEMS_PATH') }}/resources/views/app.blade.php"
```
Uses [Jinja2](https://jinja2docs.readthedocs.io/en/stable/) to resolve the [template for the PHP app.blade.php file](../../.ansible-items/templates/app.blade.php.j2). \
`SPT_ITEMS_PATH` is injected in the environments properties (see [Apply ansible playbook](#apply-ansible-playbook)).

#### Download and install composer dependencies
```yml
- name: Download and installs all composer libs and dependencies
  community.general.composer:
    command: install
    working_dir: "{{ lookup('env', 'SPT_ITEMS_PATH') }}"
```

#### Reset files permissions
```yml
- name: Reset files permissions
  file:
    path: "{{ lookup('env', 'SPT_ITEMS_PATH') }}"
    owner: "{{ lookup('env', 'DEPLOY_USER') }}"
    group: "{{ lookup('env', 'DEPLOY_USER_GROUP') }}"
    mode: 0774
    recurse: yes
```
Permissions 0644:
    * user: read/write/execute
    * group: read/write/execute (for Nginx to execute the php as well as write in the Laravel logs)
    * other: read
`SPT_ITEMS_PATH` is injected in the environments properties (see [Apply ansible playbook](#apply-ansible-playbook)).

#### Initialize database
```yml
- name: Initialize database
  uri:
    url: "https://{{ lookup('env', 'SPT_ITEMS_HOSTNAME') }}/api/refresh"
    method: GET
    status_code: [200, 204]
    timeout: 60
```
The call to `/api/refresh` fetches the data from AKI Server repository, `development` branch.