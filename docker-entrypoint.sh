#!/bin/sh

sed -i "s|__APP_BACKEND_URL__|$APP_BACKEND_URL|g" \
    /usr/share/nginx/html/assets/env_config.js

nginx -g 'daemon off;'
