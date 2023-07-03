#!/bin/sh
F_MAIN=$(find -name "main.*.js")
sed -i "s#backend#$URL_API#g" $F_MAIN
#sed -i "s#googlekey.udisemdengue#$GOOGLE_MAPS_API_KEY#g" $F_MAIN
#fim
