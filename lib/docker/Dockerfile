FROM php:7.3-apache

ENV LANG C.UTF-8
ENV APACHE_DOCUMENT_ROOT /app/web

WORKDIR /app

COPY docker/bin /bin

RUN /bin/install-deps
RUN /bin/install-extensions
RUN /bin/configure-apache
RUN rm /bin/install-deps /bin/install-extensions /bin/configure-apache

COPY config/php /usr/local/etc/php/conf.d
COPY config/apache /etc/apache2/conf-enabled

RUN /bin/run-composer
RUN rm /bin/run-composer

ENTRYPOINT ["/bin/launch-craft"]
