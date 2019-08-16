Dotacni-Parazit.cz

This script was created during hackathon Hackujstat https://www.hackujstat.cz/ It allows dotacni-parazit.cz to show grants per address https://dotacni-parazit.cz/ares/budovy

Datasets used:
- ARES
- CEDR

How to run:
Install these tools:
- Node.JS 8.x.x - 10.x.x
- Yarn

Setup environment:
- wget -c "https://nodejs.org/dist/v10.16.2/node-v10.16.2-linux-x64.tar.xz"
- tar xvf node-v10.16.2-linux-x64.tar.xz
- mv node-v10.16.2-linux-x64 node
- curl -o- -L https://yarnpkg.com/install.sh | bash
- export PATH=/path/to/node/folder:/home/.yarn/bin/:$PATH

Go to the directory
- install dependencies `yarn install`
- run the script `yarn start`

