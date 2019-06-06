
cd ./src/ts/
echo "Compilation en cours..."
tsc *.ts */*.ts --lib es2015,dom
cd bdd
echo Command 'browserify bdd.js -o bundle.js' disabled
echo "Compilation terminée!"

