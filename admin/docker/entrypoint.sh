#!/bin/sh

# Generate /usr/share/nginx/html/env-config.js with all environment variables prefixed with VITE_ if not exists
ENV_CONFIG_PATH="/usr/share/nginx/html/env-config.js"

if [ ! -f "$ENV_CONFIG_PATH" ]; then
  echo "window.env = {" > "$ENV_CONFIG_PATH"

  # Loop through all environment variables
  for VAR in $(printenv | awk -F= '{print $1}'); do
    # Include only variables starting with VITE_
    if echo "$VAR" | grep -q '^VITE_'; then
      VALUE=$(printenv "$VAR")
      echo "  $VAR: \"$VALUE\"," >> "$ENV_CONFIG_PATH"
    fi
  done

  # Close the window.env object
  echo "};" >> "$ENV_CONFIG_PATH"
fi

# Check if the script tag exists in index.html, and add it if not present
INDEX_HTML="/usr/share/nginx/html/index.html"
SCRIPT_TAG='<script src="/env-config.js"></script>'

if ! grep -q "$SCRIPT_TAG" "$INDEX_HTML"; then
  sed -i "/<\/body>/i $SCRIPT_TAG" "$INDEX_HTML"
fi

# Start Nginx
exec "$@"
