#!/bin/bash

npm install
npm run build
mv -f build /var/www/password-manager-frontend/