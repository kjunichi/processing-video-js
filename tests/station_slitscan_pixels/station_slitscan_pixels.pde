/**
 *    "At the station" slitscan example showing pixels array usage.
 */
 
 import processing.video.Movie;
 
 Movie movie;
 PImage frame;
 
 void setup ()
 {
     size( 320, 240 );
     
     String m = "station";
     movie = new Movie( this, m+".mp4", m+".ogv", m+".webm" );
     movie.loop();
     movie.play();
 }
 
 void draw ()
 {
     movie.loadPixels();
     
     // loop over left-most column of pixels, top to bottom
     for ( int i = 0; i < movie.height; i++ )
     {
         // set stoke color from pixel color
         stroke( movie.pixels[i*movie.width] );
         
         // draw a 1px line scaled up to match sketch size 
         // using frameCount with modulo as "motor"
         line( frameCount%width, i*2, frameCount%width, i*2+1 );
     }
 }
 
 void movieEvent ( Movie m )
 {
     m.read();
 }
