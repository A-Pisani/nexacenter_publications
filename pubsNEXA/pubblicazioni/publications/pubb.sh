#!/bin/bash

PEOPLE=../people.json

for id in $(grep 'current":true' $PEOPLE | sed -e "s/[^0-9]*//g"); do 
echo "--> $id"
curl -o ${id}.json "https://www.swas.polito.it/dotnet/WMHandler/IrisEsportaJson.ashx?m=${id}&l=1"
done