#!/bin/bash

ssh -t root@nomdecode.fun "su codenames -c 'cd /home/codenames/main && git pull && pm2 restart 0 1 2 && cd client && npx webpack'"