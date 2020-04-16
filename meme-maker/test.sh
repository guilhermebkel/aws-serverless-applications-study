gm identify -verbose ./app/resources/homer.jpg

gm convert -verbose \
	./app/resources/homer.jpg \
	-font ./app/resorces/impact.ttf \
	-pointsize 50 \
	-fill "#FFF" \
	-stroke "#000" \
	-strokewidth 1 \
	-draw "gravity center text 0,-155 \"Quando\"" \
	-draw "gravity center text 0,155 \"te chamam para a festa\"" \
	output.png
