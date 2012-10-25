var Movie = function(q, f) {
  var r, i = [], e, g, h, a, n, b, j, k = !1, s = 1, t, o = !1, u = -1, l = -1, m = 25, w = function() {
    var c = "";
    switch(a.networkState) {
      case a.NETWORK_EMPTY:
        c = "Loading did not start yet.";
        break;
      case a.NETWORK_IDLE:
        c = "Loading did not start yet.";
        break;
      case a.NETWORK_LOADING:
        c = "Loading has not finished yet.";
        break;
      case a.NETWORK_NO_SOURCE:
        c = "The source provided is missing. " + a.src;
        break;
      default:
        c = "Not sure what happened ... care to report it to fjenett@gmail.com ?"
    }
    alert(c)
  }, x = function() {
    a.setAttribute("width", a.videoWidth);
    a.setAttribute("height", a.videoHeight);
    e || p()
  }, p = function() {
    g = f.createElement("canvas");
    g.setAttribute("width", a.videoWidth);
    g.setAttribute("height", a.videoHeight);
    h = g.getContext("2d")
  }, y = function() {
    j || n.read();
    !e && !h && p()
  }, z = function() {
    k && r && a.currentTime === a.duration && (a.addEventListener("canplay", function() {
      a.playbackRate = s;
      a.volume = t;
      a.play();
      v()
    }), clearTimeout(l), a.src = a.currentSrc)
  }, v = function() {
    !e && !h && p();
    var c = function() {
      if(3 > a.readyState) {
        o = !1
      }else {
        var b = a.currentTime;
        if(o = u !== b) {
          for(var e = [n], d = 0, f = i.length;d < f;d++) {
            "movieEvent" in i[d] && i[d].movieEvent.apply(i[d], e)
          }
        }
        u = b
      }
      l = setTimeout(c, 1E3 / m)
    };
    c()
  }, d = function() {
    var c = {};
    if(1 == arguments.length && "object" == typeof arguments[0]) {
      c = arguments[0]
    }else {
      if(2 <= arguments.length) {
        var c = Array.prototype.slice.call(arguments), d = c.shift(), c = {sources:c, listener:d}
      }else {
        throw"Wrong number of args passed to Movie()!";
      }
    }
    a = c.element;
    if(!c.element && c.sources) {
      a = f.createElement("video");
      a.setAttribute("crossorigin", "anonymous");
      for(var d = 0, g = c.sources.length;d < g;d++) {
        var h = f.createElement("source");
        h.setAttribute("src", c.sources[d]);
        a.appendChild(h)
      }
      d = f.createElement("div");
      d.style.position = "absolute";
      d.style.left = "-10000px";
      d.style.top = "-10000px";
      d.appendChild(a);
      f.body.appendChild(d)
    }
    k = "loop" in a ? !0 : !1;
    if("poster" in a && a.poster || c.poster) {
      j = new Image, j.onload = function() {
        a.paused && (e ? (b = new e.PImage, b.fromHTMLImageData(j)) : b.src = j)
      }, j.src = a.poster
    }
    i = [];
    c.listener && (i.push(c.listener), "Processing" in q && (Processing && c.listener instanceof Processing) && (e = c.listener, b = new e.PImage));
    c.image && "src" in c.image && (b = c.image, c.listener || i.push({movieEvent:function(a) {
      a.read()
    }}));
    b || (b = new Image);
    a.addEventListener("error", w);
    a.addEventListener("loadedmetadata", x);
    a.addEventListener("timeupdate", z);
    a.addEventListener("canplay", y);
    r = 0 <= q.navigator.appVersion.toLowerCase().indexOf("chrome");
    n = this
  };
  d.prototype = {setSourceFrameRate:function(a) {
    m = a
  }, getElement:function() {
    return a
  }, volume:function(b) {
    t = a.volume = b
  }, read:function() {
    if(e) {
      b || (b = new e.PImage);
      try {
        b.fromHTMLImageData(a)
      }catch(c) {
        throw c;
      }
    }else {
      if(h) {
        h.drawImage(a, 0, 0), b.src = g.toDataURL()
      }else {
        throw"unable to read() no target given";
      }
    }
    return b
  }, available:function() {
    return o
  }, play:function() {
    a.play();
    v()
  }, isPlaying:function() {
    return!a.paused
  }, pause:function() {
    a.pause();
    clearTimeout(l)
  }, isPaused:function() {
    return a.paused
  }, stop:function() {
    a.pause();
    clearTimeout(l)
  }, loop:function() {
    k = !0;
    a.setAttribute("loop", "loop")
  }, noLoop:function() {
    k = !1;
    a.removeAttribute("loop")
  }, isLooping:function() {
    return k
  }, jump:function(b) {
    a.currentTime = b
  }, duration:function() {
    return a.duration
  }, time:function() {
    return a.currentTime
  }, speed:function(b) {
    0 !== b ? s = a.playbackRate = b : a.pause()
  }, frameRate:function(a) {
    this.speed(a / m)
  }, getSourceFrameRate:function() {
    return m
  }, goToBeginning:function() {
    this.jump(0)
  }, dispose:function() {
    this.stop();
    f.body.removeChild(a);
    delete a
  }, ready:function() {
    return 2 < a.readyState
  }, newFrame:function() {
    return this.available()
  }, getFilename:function() {
    return a.currentSrc
  }, get:function() {
    return b.get.apply(b, arguments)
  }, set:function() {
    return b.set.apply(b, arguments)
  }, copy:function() {
    return b.copy.apply(b, arguments)
  }, mask:function() {
    return b.mask.apply(b, arguments)
  }, blend:function() {
    return b.blend.apply(b, arguments)
  }, filter:function() {
    return b.filter.apply(b, arguments)
  }, save:function() {
    return b.save.apply(b, arguments)
  }, resize:function() {
    return b.resize.apply(b, arguments)
  }, loadPixels:function() {
    return b.loadPixels.apply(b, arguments)
  }, updatePixels:function() {
    return b.updatePixels.apply(b, arguments)
  }, toImageData:function() {
    return b.toImageData.apply(b, arguments)
  }, getCanvas:function() {
    return g
  }};
  d.prototype.__defineGetter__("width", function() {
    return b.width
  });
  d.prototype.__defineGetter__("height", function() {
    return b.height
  });
  d.prototype.__defineGetter__("pixels", function() {
    return b.pixels
  });
  d.prototype.__defineGetter__("isRemote", function() {
    return b.isRemote
  });
  d.prototype.__defineSetter__("isRemote", function(a) {
    b.isRemote = a
  });
  d.prototype.__defineGetter__("sourceImg", function() {
    return b.sourceImg
  });
  d.prototype.__defineSetter__("sourceImg", function(a) {
    b.sourceImg = a
  });
  return d
}(window, document);
