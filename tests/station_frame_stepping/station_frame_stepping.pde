/**
 *    Stepping through frames, as there is no way to read the fps
 *    from a web video file we need to provide it below.
 *    
 *    <p>This example might not work in Chrome as it depends on a 
 *    server being able to serve video with/as partial content ...</p>
 */
 
 import processing.video.Movie;
 
 Movie movie;
 float secPerFrame = 1.0 / 25.0;
 float currentSec = 0.0;
 
 void setup ()
 {
     size( 320, 240 );
     
     String m = "station";
     movie = new Movie( this, m+".mp4", m+".ogv", m+".webm" );
 }
 
 void draw ()
 {
     image( movie, 0, 0, width, height );
     
     fill( 255 );
     text( "Click to advance by 1 frame", 10, 20 );
 }
 
 void movieEvent ( Movie m )
 {
     m.read();
 }
 
 void mousePressed ()
 {
     currentSec += secPerFrame;
     if ( currentSec >= movie.duration() ) {
         currentSec = 0;
     }
     movie.jump(currentSec);
 }
