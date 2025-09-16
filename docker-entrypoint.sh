#!/bin/sh

# Substitute environment variables in the template
envsubst '${BASE_URL}' < /usr/share/nginx/html/assets/env-config.template.js > /usr/share/nginx/html/assets/env-config.js

# Start nginx
exec "$@"