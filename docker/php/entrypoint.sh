#!/bin/sh

set -e

echo "Iniciando contenedor Laravel..."

# Esperar a MySQL
echo "Esperando a MySQL en $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "MySQL no listo, esperando..."
  sleep 2
done

echo "MySQL listo"

# Instalar dependencias solo si no existen
if [ ! -d "vendor" ]; then
    echo "Instalando dependencias..."
    composer install --no-interaction --prefer-dist
else
    echo "Dependencias ya instaladas"
fi

# Generar APP_KEY si no existe
if ! grep -q "APP_KEY=base64" .env; then
    echo "Generando APP_KEY..."
    php artisan key:generate
fi

# Permisos seguros (mejor que 777)
echo "Ajustando permisos..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Migraciones solo una vez (flag file)
if [ ! -f "storage/migrated.flag" ]; then
    echo "Ejecutando migraciones..."
    php artisan migrate --force
    touch storage/migrated.flag
else
    echo "Migraciones ya ejecutadas"
fi

# Solo cachear en producción
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Optimizando Laravel..."
    php artisan config:cache
    php artisan route:cache
fi

echo "Laravel listo"

exec php-fpm
``