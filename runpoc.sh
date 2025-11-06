#!/bin/bash

printf "\nRemoving old test environment...\n"
rm -r poc/tmptestenv/

printf "\nCreating test environment...\n"
cp -r poc/__testenv__/ poc/tmptestenv/

printf "\nRunning updaters...\n"
cd poc/updater/
yarn build

printf "\n\n\nv16-v17\n\n\n" > ../../output/metrics.txt
cd ../tmptestenv/
yarn ng update @angular/core@17 @angular/cli@17
cd ../updater/
node dist/src/version/update16-17.js ../tmptestenv/ >> ../../output/metrics.txt

printf "\n\n\nv17-v18\n\n\n" >> ../../output/metrics.txt
cd ../tmptestenv/
yarn ng update @angular/core@18 @angular/cli@18
cd ../updater/
node dist/src/version/update17-18.js ../tmptestenv/ >> ../../output/metrics.txt

printf "\n\n\nv18-v19\n\n\n" >> ../../output/metrics.txt
cd ../tmptestenv/
yarn ng update @angular/core@19 @angular/cli@19
cd ../updater/
node dist/src/version/update18-19.js ../tmptestenv/ >> ../../output/metrics.txt

[ "$1" = "-c" ] && {
  printf "\nRemoving test environment...\n";
  rm -r ../tmptestenv/;
}
