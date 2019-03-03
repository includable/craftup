# Craft image for Docker

A ready-to-use PHP 7.2 image for websites built using Craft CMS.


## Basic usage

Create a Dockerfile that looks like this:

```dockerfile
FROM craftcms/craft:latest

# Copy site resources
COPY . /app

# Install composer deps
RUN /bin/run-composer
```


## Using Docker Compose

To run this locally, you would also need a database instance. The 
easiest way to set up both of these at the same time would be by
creating a `docker-compose.yml` file and running `docker-compose up`:

```yaml
version: '3'
services:
  web:
    build: .
    restart: always
    volumes:
    - ./:/app:cached
    ports:
    - 6048:80
    environment:
      ENVIRONMENT: dev
      SECURITY_KEY: yoursecuritykeyhere
      DB_DRIVER: mysql
      DB_SERVER: mysql
      DB_USER: root
      DB_PASSWORD: root
      DB_DATABASE: craft
      DB_PORT: 3306
    depends_on:
      - mysql
  mysql:
    restart: always
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: craft
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - craft_mysql:/var/lib/mysql

volumes:
  craft_mysql:
```
