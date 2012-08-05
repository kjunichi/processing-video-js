/**
 *    Dance example, content provided by mint.gs and used with permission:
 *    http://mint.gs
 */
 
 import processing.video.Movie;
 
 Movie movie;
 PImage frame;
 
 void setup ()
 {
     size( 240, 360 );
     
     String m = "http://mintgs-public-clips.commondatastorage.googleapis.com/processing/dance/charmy";
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
     
     image( movie, 0, 0 );
 }
