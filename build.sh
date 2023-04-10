#!/bin/bash

wait_exit() {
  echo "Press enter to exit";
  read -r;
  exit;
}

cd backend || wait_exit
node env_collector.js || wait_exit
cd ..

cd frontend || wait_exit
npm run build
cd ..

docker-compose build

echo "Build Complete"
wait_exit