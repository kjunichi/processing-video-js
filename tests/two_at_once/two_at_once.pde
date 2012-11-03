/**
 *    Playing two videos at once.
 */
 
 import processing.video.Movie;
 
 Movie movie1, movie2;
 PImage frame, matte;
 
 void setup ()
 {
     size( 640, 360 );
     
     String m = "station";
     movie1 = new Movie( this, m+".mp4", m+".ogv", m+".webm" );
     movie1.loop();
     movie1.play();
     
     m = "charmy";
     movie2 = new Movie( this, m+".mp4", m+".ogv", m+".webm" );
     movie2.loop();
     movie2.play();
 }
 
 void draw ()
 {
     image( movie1, 0, 0, width, height );
     if ( frame ) image( frame, (width-frame.width)/2, 0 );
     
 }
 
 void movieEvent ( Movie m )
 {
     m.read();
     if ( m == movie2 )
     {
         frame = m.get(m.width/2,0,m.width/2,m.height);
         matte = m.get(0,0,m.width/2,m.height);
         
         frame.loadPixels(); matte.loadPixels();
         for ( int i = 0; i < frame.pixels.length; i++ )
         {
             frame.pixels[i] = (frame.pixels[i] & 0x00FFFFFF) + ((matte.pixels[i] & 0xFF) << 24);
         }
         frame.updatePixels();
     }
 }
