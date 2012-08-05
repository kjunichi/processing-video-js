/**
 *    Dance example masked, content provided by <a href="http://mint.gs">mint.gs</a> and used with permission.
 *
 *    Currently does not work in Safari for some reason ...
 */
 
 import processing.video.Movie;
 
 Movie movie;
 PImage frame, matte;
 
 void setup ()
 {
     size( 240, 360 );
     
     background( 255 );
     
     String m = "http://mintgs-public-clips.commondatastorage.googleapis.com/processing/dance/charmy";
     movie = new Movie( this, m+".mp4", m+".ogv", m+".webm" );
     movie.loop();
     movie.play();
 }
 
 void draw ()
 {
     colorMode( HSB );
     fill( (frameCount/10.0) % 255, 200, 200, 10 );
     rect( 0,0, width, height );
     
     if ( movie.available() )
     {
         movie.read();
         
         // right half of the movie
         frame = movie.get(movie.width/2,0,movie.width/2,movie.height);
         // left half of the movie
         matte = movie.get(0,0,movie.width/2,movie.height);
         
         frame.loadPixels(); matte.loadPixels();
         for ( int i = 0; i < frame.pixels.length; i++ )
         {
             frame.pixels[i] = (frame.pixels[i] & 0x00FFFFFF) + ((matte.pixels[i] & 0xFF) << 24);
         }
         frame.updatePixels();
     }
     
     if ( frame != null ) image( frame, 0, 0 );
 }
