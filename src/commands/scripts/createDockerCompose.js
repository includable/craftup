const path = require('path')
const fs = require('fs')

module.exports = (name, securityKey, port, targetDir) => {
  const cleanName = name.replace(/-/g, '_')
  const content = `version: '3'
services:
  web:
    container_name: craft_web_${cleanName}
    image: craftcms/craft:latest
    volumes:
    - ./:/app:cached
    ports:
    - ${port}:80
    environment:
      ENVIRONMENT: dev
      SECURITY_KEY: ${securityKey}
      DB_DRIVER: mysql
      DB_SERVER: mysql
      DB_USER: root
      DB_PASSWORD: root
      DB_DATABASE: craft_${cleanName}
      DB_PORT: 3306
    depends_on:
      - mysql
  mysql:
    container_name: craft_mysql_${cleanName}
    restart: always
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: craft_${cleanName}
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - craft_mysql_${cleanName}:/var/lib/mysql

volumes:
  craft_mysql_${cleanName}:
`

  fs.writeFileSync(path.join(targetDir, 'docker-compose.yml'), content, 'utf8')
}
