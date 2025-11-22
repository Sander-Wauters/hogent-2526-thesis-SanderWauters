#!/bin/bash

printf "\nRemoving old test environments...\n"
rm -r poc/tmptestenv/
rm -r poc/tmptestenvtotal/

printf "\nCreating test environments...\n"
cp -r poc/__testenv__/ poc/tmptestenv/
cp -r poc/__testenv__/ poc/tmptestenvtotal/

printf "\nRunning updaters...\n"
cd poc/updater/
yarn build || exit -1

printf "# v16-v17\n\n" > ../../output/metrics.md
cd ../tmptestenv/
yarn ng update @angular/core@17 @angular/cli@17
cd ../updater/
node dist/src/version/update16-17.js ../tmptestenv/ ../controlenv/ >> ../../output/metrics.md

printf "\n# v17-v18\n\n" >> ../../output/metrics.md
cd ../tmptestenv/
yarn ng update @angular/core@18 @angular/cli@18
cd ../updater/
node dist/src/version/update17-18.js ../tmptestenv/ ../controlenv/ >> ../../output/metrics.md

printf "\n# v18-v19\n\n" >> ../../output/metrics.md
cd ../tmptestenv/
yarn ng update @angular/core@19 @angular/cli@19
cd ../updater/
node dist/src/version/update18-19.js ../tmptestenv/ ../controlenv/ >> ../../output/metrics.md

printf "\n# v19-v20\n\n" >> ../../output/metrics.md
cd ../tmptestenv/
yarn ng update @angular/core@20 @angular/cli@20
cd ../updater/
node dist/src/version/update19-20.js ../tmptestenv/ ../controlenv/ >> ../../output/metrics.md

printf "\n# v16-v20\n\n" >> ../../output/metrics.md
node dist/src/version/update16-20.js ../tmptestenvtotal/ ../controlenv/ >> ../../output/metrics.md

[ "$1" = "-c" ] && {
  printf "\nRemoving test environment...\n";
  rm -r ../tmptestenv/;
  rm -r ../tmptestenvtotal/;
}
