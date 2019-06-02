# Installation de Node.JS version 12

en root :

```bash
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs
```
## TypeScript version 3.5.1

```bash
sudo npm install -g typescript --save-dev
sudo npm install -g @types/node --save-dev
```
Initialiser les fichiers de configuration du compilateur Typescript.  
Dans le répertoire de travail :

```bash
npx tsc --init
```

## Dépendances

dans le répertoire de travail :

```bash
npm install dexie --save
npm install dexie-export-import --save-dev
sudo nmp install -g browserify
npm install file-saver --save-dev
npm install @types/file-saver --save-dev
```
## Compilation

```bash
tsc bdd.ts --lib es2015,dom
browserify bdd.js -o bundle.js
```
