#!/bin/bash

printf "\nRemoving old test environment...\n"
rm -r poc/tmptestenv/

printf "\nCreating test environment...\n"
cp -r poc/__testenv__/ poc/tmptestenv/

printf "\nRunning updaters...\n"
cd poc/updater
yarn build
node dist/src/version/update16-17.js ../tmptestenv/

[ "$1" = "-c" ] && {
  printf "\nRemoving test environment...\n";
  rm -r ../tmptestenv/;
}
