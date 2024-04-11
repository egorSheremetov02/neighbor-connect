#!/bin/bash

DB_CONTAINER="nc_db"
SERVER_CONTAINER="nc_backend"

for container in $DB_CONTAINER $SERVER_CONTAINER
do
    if [ "$(sudo docker ps -a -q -f name=$container)" ]; then
        if [ "$(sudo docker ps -aq -f status=running -f name=$container)" ]; then
            # cleanup
            sudo docker stop $container
        fi

        if [ "$(sudo docker ps -aq -f status=restarting -f name=$container)" ]; then
            # cleanup
            sudo docker stop $container
        fi

        # delete container
        sudo docker rm -f $container
    fi
done