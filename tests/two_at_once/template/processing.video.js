var Movie = function(r, f) {
  return function() {
    var x = function() {
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
    }, y = function() {
      a.setAttribute("width", a.videoWidth);
      a.setAttribute("height", a.videoHeight);
      d || o()
    }, o = function() {
      g = f.createElement("canvas");
      g.setAttribute("width", a.videoWidth);
      g.setAttribute("height", a.videoHeight);
      k = g.getContext("2d")
    }, z = function() {
      j || p.read();
      !d && !k && o()
    }, A = function() {
      l && s && a.currentTime === a.duration && (a.addEventListener("canplay", function() {
        a.playbackRate = t;
        a.volume = u;
        a.play();
        v()
      }), clearTimeout(m), a.src = a.currentSrc)
    }, v = function() {
      !d && !k && o();
      var c = function() {
        if(3 > a.readyState) {
          q = !1
        }else {
          var b = a.currentTime;
          if(q = w !== b) {
            for(var d = [p], h = 0, f = i.length;h < f;h++) {
              "movieEvent" in i[h] && i[h].movieEvent.apply(i[h], d)
            }
          }
          w = b
        }
        m = setTimeout(c, 1E3 / n)
      };
      c()
    }, s, i = [], d, g, k, a, p, b, j, l = !1, t = 1, u, q = !1, w = -1, m = -1, n = 25;
    (function() {
      var c = {};
      if(1 == arguments.length && "object" == typeof arguments[0]) {
        c = arguments[0]
      }else {
        if(2 <= arguments.length) {
          var c = Array.prototype.slice.call(arguments), e = c.shift(), c = {sources:c, listener:e}
        }else {
          throw"Wrong number of args passed to Movie()!";
        }
      }
      a = c.element;
      if(!c.element && c.sources) {
        a = f.createElement("video");
        a.setAttribute("crossorigin", "anonymous");
        for(var e = 0, g = c.sources.length;e < g;e++) {
          var h = f.createElement("source");
          h.setAttribute("src", c.sources[e]);
          a.appendChild(h)
        }
        e = f.createElement("div");
        e.style.position = "absolute";
        e.style.left = "-10000px";
        e.style.top = "-10000px";
        e.appendChild(a);
        f.body.appendChild(e)
      }
      l = "loop" in a ? !0 : !1;
      if("poster" in a && a.poster || c.poster) {
        j = new Image, j.onload = function() {
          a.paused && (d ? (b = new d.PImage, b.fromHTMLImageData(j)) : b.src = j)
        }, j.src = a.poster
      }
      i = [];
      c.listener && (i.push(c.listener), "Processing" in r && (Processing && c.listener instanceof Processing) && (d = c.listener, b = new d.PImage));
      c.image && "src" in c.image && (b = c.image, c.listener || i.push({movieEvent:function(a) {
        a.read()
      }}));
      b || (b = new Image);
      a.addEventListener("error", x);
      a.addEventListener("loadedmetadata", y);
      a.addEventListener("timeupdate", A);
      a.addEventListener("canplay", z);
      s = 0 <= r.navigator.appVersion.toLowerCase().indexOf("chrome");
      p = this
    }).apply(this, arguments);
    this.setSourceFrameRate = function(a) {
      n = a
    };
    this.getElement = function() {
      return a
    };
    this.volume = function(b) {
      u = a.volume = b
    };
    this.read = function() {
      if(d) {
        b || (b = new d.PImage);
        try {
          b.fromHTMLImageData(a)
        }catch(c) {
          throw c;
        }
      }else {
        if(k) {
          k.drawImage(a, 0, 0), b.src = g.toDataURL()
        }else {
          throw"unable to read() no target given";
        }
      }
      return b
    };
    this.available = function() {
      return q
    };
    this.play = function() {
      a.play();
      v()
    };
    this.isPlaying = function() {
      return!a.paused
    };
    this.pause = function() {
      a.pause();
      clearTimeout(m)
    };
    this.isPaused = function() {
      return a.paused
    };
    this.stop = function() {
      a.pause();
      clearTimeout(m)
    };
    this.loop = function() {
      l = !0;
      a.setAttribute("loop", "loop")
    };
    this.noLoop = function() {
      l = !1;
      a.removeAttribute("loop")
    };
    this.isLooping = function() {
      return l
    };
    this.jump = function(b) {
      a.currentTime = b
    };
    this.duration = function() {
      return a.duration
    };
    this.time = function() {
      return a.currentTime
    };
    this.speed = function(b) {
      0 !== b ? t = a.playbackRate = b : a.pause()
    };
    this.frameRate = function(a) {
      this.speed(a / n)
    };
    this.getSourceFrameRate = function() {
      return n
    };
    this.goToBeginning = function() {
      this.jump(0)
    };
    this.dispose = function() {
      this.stop();
      f.body.removeChild(a);
      delete a
    };
    this.ready = function() {
      return 2 < a.readyState
    };
    this.newFrame = function() {
      return this.available()
    };
    this.getFilename = function() {
      return a.currentSrc
    };
    this.get = function() {
      return b.get.apply(b, arguments)
    };
    this.set = function() {
      return b.set.apply(b, arguments)
    };
    this.copy = function() {
      return b.copy.apply(b, arguments)
    };
    this.mask = function() {
      return b.mask.apply(b, arguments)
    };
    this.blend = function() {
      return b.blend.apply(b, arguments)
    };
    this.filter = function() {
      return b.filter.apply(b, arguments)
    };
    this.save = function() {
      return b.save.apply(b, arguments)
    };
    this.resize = function() {
      return b.resize.apply(b, arguments)
    };
    this.loadPixels = function() {
      return b.loadPixels.apply(b, arguments)
    };
    this.updatePixels = function() {
      return b.updatePixels.apply(b, arguments)
    };
    this.toImageData = function() {
      return b.toImageData.apply(b, arguments)
    };
    this.getCanvas = function() {
      return g
    };
    this.__defineGetter__("width", function() {
      return b.width
    });
    this.__defineGetter__("height", function() {
      return b.height
    });
    this.__defineGetter__("pixels", function() {
      return b.pixels
    });
    this.__defineGetter__("isRemote", function() {
      return b.isRemote
    });
    this.__defineSetter__("isRemote", function(a) {
      b.isRemote = a
    });
    this.__defineGetter__("sourceImg", function() {
      return b.sourceImg
    });
    this.__defineSetter__("sourceImg", function(a) {
      b.sourceImg = a
    })
  }
}(window, document);
