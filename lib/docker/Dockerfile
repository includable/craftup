FROM php:7.2-apache

ENV LANG C.UTF-8
ENV APACHE_DOCUMENT_ROOT /app/web

WORKDIR /app

COPY ./bin /bin

RUN /bin/install-deps && \
    /bin/install-extensions && \
    /bin/configure-apache

RUN curl -sS https://getcomposer.org/installer | php && \
    chmod +x composer.phar && \
    mv composer.phar /usr/local/bin/composer

COPY ./config/php /usr/local/etc/php/conf.d
COPY ./config/apache /etc/apache2/conf-enabled

ENTRYPOINT ["/bin/launch-craft"]
