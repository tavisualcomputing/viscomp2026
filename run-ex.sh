#!/bin/bash

read -p "Enter exercise number: " ex_num

cd "./Exercises/W${ex_num}_ts/dist"

pwd

xdg-open "http://localhost:8080" &

echo "
Make sure to always run build.sh in the directory of the current exercise
"

python -m http.server 8080
