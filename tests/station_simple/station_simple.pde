/**
 *    Another stab at processing.video.Movie for js.
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
     background( 255 );
     
     if ( movie.available() )
     {
         movie.read();
     }
     
     image( movie.get(), 0, 0 );
 }
 
 void mousePressed ()
 {
     if ( movie.isPlaying() )
     {
         movie.pause();
     }
     else
     {
         movie.play();
     }
 }
