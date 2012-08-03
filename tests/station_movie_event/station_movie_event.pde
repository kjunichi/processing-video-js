/**
 *    Another stab at processing.video.Movie for js.
 */
 
 import processing.video.Movie;
 
 Movie movie;
 PImage frame;
 
 void setup ()
 {
     size( 320, 240 );
     
     String m = "http://asdasdasdasdasdasdasd.commondatastorage.googleapis.com/D01T08-C-Both-Sitting-Duet-Chicken-Yes-Come-01-640x360";
     m = "station";
     movie = new Movie( this, m+".mp4", m+".ogv", m+".webm" );
     movie.loop();
     movie.play();
 }
 
 void draw ()
 {
     background( 255 );
     
     image( movie.get(), 0, 0 );
 }
 
 void movieEvent ( Movie m )
 {
     m.read();
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
