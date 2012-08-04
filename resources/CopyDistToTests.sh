#! /bin/bash

IFS=$'\n'
for f in `find ./tests -iname 'processing.video.js' -print`; do 
	cp ./dist/processing.video.js $f; 
done
unset $IFS