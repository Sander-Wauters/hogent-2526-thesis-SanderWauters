#!/bin/bash

printf "\nRemoving old test environment...\n"
rm -r poc/tmptestenv/

printf "\nCreating test environment...\n"
cp -r poc/__testenv__/ poc/tmptestenv/

printf "\nRunning updaters...\n"
cd poc/updater/
yarn build

cd ../tmptestenv/
yarn ng update @angular/core@17 @angular/cli@17
cd ../updater/
node dist/src/version/update16-17.js ../tmptestenv/

cd ../tmptestenv/
yarn ng update @angular/core@18 @angular/cli@18
cd ../updater/
node dist/src/version/update17-18.js ../tmptestenv/

[ "$1" = "-c" ] && {
  printf "\nRemoving test environment...\n";
  rm -r ../tmptestenv/;
}
