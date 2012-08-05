/**
 *    Classic "At the station" example showing usage of movieEvent callback.
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
     
     image( movie, 0, 0, width, height );
 }
 
 // movieEvent()
 // .. is being called whenever a new frame is available
 
 void movieEvent ( Movie m )
 {
     m.read();
 }
