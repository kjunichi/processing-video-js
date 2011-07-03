
// NOTE:
// as this needs to run from the PDE JS server which can't find the
// Movie.js from "src" (out of it's root) you need to copy it manually!

// these are ignored by Processing.js
import processing.video.*;
import codeanticode.gsvideo.*;


Movie mov;
boolean playing = true;


void setup ()
{
    size( 320, 240 );
    
    mov = new Movie(this, "station.mp4;station.ogv"); // ACHTUNG: this allows to set two sources at once!
    mov.loop();
    mov.play();
}

void draw ()
{
    image( mov, 0, 0, width, height );
}

void movieEvent ( Movie m )
{
    m.read();
}

void mousePressed ()
{
    if ( playing ) mov.pause();
    else mov.play();
    
    playing = !playing;
}
