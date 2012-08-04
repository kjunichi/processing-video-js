/**
 *    Playback speeds, default is 1.0, this is running at 0.25.
 *
 *    <p>This is currently not available in FireFox.</p>
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
     movie.speed(0.25);
     movie.loop();
     movie.play();
 }
 
 void draw ()
 {
     image( movie, 0, 0, width, height );
 }
 
 void movieEvent ( Movie m )
 {
     m.read();
 }
