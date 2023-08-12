#!/bin/bash

git push
ssh -t root@nomdecode.fun "cd /home/codenames/dev && git pull && cd client && npx webpack"