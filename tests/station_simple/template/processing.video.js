var Movie = function(o, f) {
  var g = [], j, b, l, a, h = !1, i = !1, m = -1, k = -1, p = function() {
    for(var c = "abort,canplay,canplaythrough,durationchange,emptied,ended,error,loadeddata,loadedmetadata,loadstart,mozaudioavailable,pause,play,playing,progress,ratechange,seeked,seeking,suspend,timeupdate,volumechange,waiting".split(","), a = 0;a < c.length;a++) {
      var g = "on" + c[a][0].toUpperCase() + c[a].substring(1);
      try {
        var e = eval(g);
        b.addEventListener(c[a], e)
      }catch(f) {
      }
    }
  }, q = function() {
    var a = function() {
      if(3 > b.readyState) {
        i = !1
      }else {
        var d = b.currentTime;
        if(i = m !== d) {
          for(var f = [l], e = 0, h = g.length;e < h;e++) {
            "movieEvent" in g[e] && g[e].movieEvent.apply(g[e], f)
          }
        }
        m = d
      }
      k = setTimeout(a, 40)
    };
    a()
  }, n = function() {
    var c = {};
    if(1 == arguments.length && "object" == typeof arguments[0]) {
      c = arguments[0]
    }else {
      if(2 <= arguments.length) {
        var c = Array.prototype.slice.call(arguments), d = c.shift(), c = {src:c, listener:d}
      }else {
        throw"Wrong number of args passed to Movie()!";
      }
    }
    b = c.element;
    if(!c.element && c.src) {
      b = f.createElement("video");
      b.setAttribute("crossorigin", "anonymous");
      for(var d = 0, i = c.src.length;d < i;d++) {
        var e = f.createElement("source");
        e.setAttribute("src", c.src[d]);
        b.appendChild(e)
      }
      d = f.createElement("div");
      d.style.position = "absolute";
      d.style.left = "0px";
      d.style.top = "0px";
      d.appendChild(b);
      f.body.appendChild(d)
    }
    h = "loop" in b;
    g = [];
    c.listener && (g.push(c.listener), j = c.listener, a = new j.PImage);
    p();
    o.navigator.appVersion.toLowerCase().indexOf("chrome");
    l = this
  };
  n.prototype = {volume:function(a) {
    return b.volume(a)
  }, read:function() {
    a = new j.PImage;
    a.fromHTMLImageData(b);
    console.log(a);
    return a
  }, available:function() {
    return i
  }, play:function() {
    b.play();
    q()
  }, isPlaying:function() {
    return!b.paused
  }, pause:function() {
    b.pause();
    clearTimeout(k)
  }, isPaused:function() {
    return b.paused
  }, stop:function() {
    b.stop();
    clearTimeout(k)
  }, loop:function() {
    h = !0;
    b.setAttribute("loop", "loop")
  }, noLoop:function() {
    h = !1;
    b.removeAttribute("loop")
  }, isLooping:function() {
    return h
  }, jump:function(a) {
    b.currentTime = a
  }, duration:function() {
    return b.duration
  }, time:function() {
    return b.currentTime
  }, speed:function(a) {
    0 !== a ? b.playbackRate = a : b.pause()
  }, frameRate:function() {
    throw"Please use speed() instead";
  }, ready:function() {
    return 2 < b.readyState
  }, dispose:function() {
    this.stop();
    f.body.removeChild(b);
    delete b
  }, newFrame:function() {
    return this.available()
  }, getFilename:function() {
    return b.currentSrc
  }, get:function() {
    return a.get.apply(a, arguments)
  }, set:function() {
    return a.set.apply(a, arguments)
  }, copy:function() {
    return a.copy.apply(a, arguments)
  }, mask:function() {
    return a.mask.apply(a, arguments)
  }, blend:function() {
    return a.blend.apply(a, arguments)
  }, filter:function() {
    return a.filter.apply(a, arguments)
  }, save:function() {
    return a.save.apply(a, arguments)
  }, resize:function() {
    return a.resize.apply(a, arguments)
  }, loadPixels:function() {
    return a.loadPixels.apply(a, arguments)
  }, updatePixels:function() {
    return a.updatePixels.apply(a, arguments)
  }};
  return n
}(window, document);
