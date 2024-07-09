convert -background black -fill white  -font DejaVu-Serif-Bold -size 375x500 -pointsize 36 -gravity South label:"$1\n\n\n" $2 
convert $2 -transparent black $2
composite -gravity center $2 nytimes.png $3