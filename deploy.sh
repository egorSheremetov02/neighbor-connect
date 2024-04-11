#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BUILD_DIR=${DIR}"/build/"

bash ./stop_containers.sh

#if use 'rebuild.sh --no-cache' then run 'docker compose build --no-cache'
if [ "$1" == "--no-cache" ]; then
  echo "--no-cache arg set"
  docker compose --verbose build --no-cache
else 
  echo "--no-cache arg is not set"
  docker compose --verbose build
fi
echo "Building is finished"

docker compose --verbose up -d 

echo "Up is finished"

# Health checks for the containers
docker inspect --format='{{json .State.Health}}' nc_db
docker inspect --format='{{json .State.Health}}' nc_backend