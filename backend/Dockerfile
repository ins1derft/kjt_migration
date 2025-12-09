FROM php:8.4-cli-alpine AS vendor
RUN apk add --no-cache bash postgresql-dev git icu-dev libzip-dev oniguruma-dev libpng-dev \
    && docker-php-ext-install pdo_pgsql intl zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend
COPY composer.json composer.lock ./
# Skip scripts during build; they'll be runnable in the runtime stage after code is present
RUN composer install --no-dev --no-progress --prefer-dist --optimize-autoloader --no-scripts

FROM php:8.4-fpm-alpine AS app
RUN apk add --no-cache bash postgresql-dev git icu-dev libzip-dev oniguruma-dev libpng-dev && \
    docker-php-ext-install pdo_pgsql intl zip

COPY php.prod.ini /usr/local/etc/php/conf.d/php-memory.ini

WORKDIR /var/www/backend
COPY --from=vendor /var/www/backend/vendor ./vendor
COPY . .

RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache
EXPOSE 9000
CMD ["php-fpm"]
