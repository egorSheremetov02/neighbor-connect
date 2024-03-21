#!/bin/bash

sudo apt update

sudo apt install -y python3.10

curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs npm

apt install -y postgresql postgresl-contrib

echo "Installed versions:"
python3.10 --version
node --version
npm --version
psql --version
