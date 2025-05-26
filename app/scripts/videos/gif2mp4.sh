#!/bin/bash

from=./src
to=./src
List=(
"ilico_cheers" 
"ilico_election" 
"ilico_filter" 
"ilico_friends" 
"ilico_hush_2" 
"ilico_liberty" 
"ilico_mail" 
"ilico_neutrality" 
"ilico_over" 
"ilico_spy_2" 
"ilico_spy_3" 
"ilico_spy" 
"ilio_fai" 
)

for FILE in ${List[@]}; 
  do
    ffmpeg -y -i $from/$FILE.gif -c:v libx264 -c:a aac $to/$FILE.mp4
  done

