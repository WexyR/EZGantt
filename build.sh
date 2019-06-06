
cd ./src/ts/
while true; do
    read -p "Do you want to recompile this software? [Y/n]  >> " yn
    if [ -n "$yn" ]; then
        if [ $yn = "N" ] || [ $yn = "n" ]; then break; fi
    fi
    echo "Compilation en cours..."
    tsc *.ts */*.ts --lib es2015,dom
    cd bdd
    browserify bdd.js -o bundle.js
    cd -
    echo "Compilation terminée!"
    echo ""
done
cd -
