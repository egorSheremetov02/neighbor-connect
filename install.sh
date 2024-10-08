#!/bin/bash

sudo apt update

# better to use `pyenv` to manage python versions
sudo apt install -y python3.12

# better to use `nvm` to manage node versions
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs npm

apt install -y postgresql postgresql-contrib

echo "Installed versions:"
python3.12 --version
node --version
npm --version
psql --version
