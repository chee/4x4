// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"25hCO":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "90112a522515caa3027757f230383938";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets;

function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}

function getPort() {
  return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare


var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"2aJdH":[function(require,module,exports) {
require('./bundle-manifest').register(JSON.parse("{\"4nQJR\":\"index.90112a52.js\",\"5AbI4\":\"1.b77669bc.flac\",\"xPpYE\":\"2.11ed8685.flac\",\"1OaYJ\":\"3.3b72bb27.flac\",\"6OlBD\":\"4.dfd2c2d7.flac\",\"Fa81n\":\"5.15d08339.flac\",\"3BBu5\":\"6.767fc4e8.flac\",\"16wGZ\":\"7.2450e557.flac\",\"28N9e\":\"8.465f97c5.flac\",\"3PDMY\":\"9.7df02676.flac\",\"3b5KY\":\"10.6873004d.flac\",\"iwwrO\":\"11.09d12c57.flac\",\"5Xk3K\":\"12.c3b90665.flac\",\"6bPXA\":\"13.cb6a2af7.flac\",\"78QoS\":\"14.eaaf7c21.flac\",\"7yNUE\":\"15.f8716257.flac\",\"uwMPY\":\"16.102dc17f.flac\",\"38YOw\":\"worker.67547996.js\"}"));
},{"./bundle-manifest":"5G1rV"}],"5G1rV":[function(require,module,exports) {
"use strict";

var mapping = {};

function register(pairs) {
  var keys = Object.keys(pairs);

  for (var i = 0; i < keys.length; i++) {
    mapping[keys[i]] = pairs[keys[i]];
  }
}

function resolve(id) {
  var resolved = mapping[id];

  if (resolved == null) {
    throw new Error('Could not resolve bundle with id ' + id);
  }

  return resolved;
}

module.exports.register = register;
module.exports.resolve = resolve;
},{}],"5T8Uc":[function(require,module,exports) {
"use strict";

var _preact = require("preact");

var _scheduler = _interopRequireDefault(require("./scheduler"));

var _audio = require("./audio");

var _classnames = _interopRequireDefault(require("classnames"));

var _jsxFileName = "/home/chee/projects/pockets/src/index.tsx";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function createStore(initialState) {
  let state = { ...initialState
  };
  let subs = new Set();
  return {
    get() {
      return state;
    },

    send(transformer) {
      let previous = state;
      state = { ...transformer({ ...state
        })
      };
      subs.forEach(sub => sub(previous));
      return this;
    },

    sub(fn) {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    }

  };
}

let store = createStore({
  step: 0,
  playing: false,
  mode: "normal",
  pattern: 0,
  sound: 0,
  pitch: 4,
  velocity: 15,
  bpm: 80,
  sounds: Array.from(Array(16), () => Array.from(Array(16), () => null))
});
store.sub(previous => {
  let state = store.get();

  if (previous.playing == state.playing) {
    return;
  }

  if (state.playing) {
    scheduler.play();
  } else {
    scheduler.pause();
  }
});
let sources = Array(16);

let togglePlay = () => state => {
  state.playing = !state.playing;

  if (state.playing) {
    state.step = 0;
  }

  return state;
};

let setSoundStep = step => state => {
  let sound = state.sounds[state.sound];
  let value;
  let soundStep = sound[step];

  if (soundStep && soundStep[0] == state.pitch) {
    value = null;
  } else {
    value = [state.pitch, state.velocity];
  }

  state.sounds[state.sound] = state.sounds[state.sound].map((n, index) => {
    return index == step ? value : n;
  });
  return state;
};

let setPitch = value => state => {
  state.pitch = value;
  return state;
};

let setSound = value => state => {
  state.sound = value;
  return state;
};

let setMode = value => state => {
  state.mode = state.mode == value ? "normal" : value;
  return state;
};

let makeHandleSequenceButtonClick = id => () => {
  let state = store.get();

  if (state.mode == "write") {
    // if (store.sounds[store.sound][step]) {
    //        store.send("clearSoundStep", step)
    // }
    store.send(setSoundStep(id));
  }

  if (state.mode == "normal") {
    store.send(setPitch(id));
    (0, _audio.playSound)(state.sound, id, _audio.context.currentTime);
  }

  if (state.mode == "sound") {
    store.send(setSound(id));
    store.send(setMode("normal"));
  }
};

function SequenceButton({
  id,
  steps,
  mode,
  step,
  playing
}) {
  let handleClick = makeHandleSequenceButtonClick(id); // TODO find out the type for file change event

  async function handleChange(event) {
    let file = event.target.files[0];
    let url = URL.createObjectURL(file);
    let buffer = await new Promise(async yay => {
      return _audio.context.decodeAudioData(await file.arrayBuffer(), yay);
    });

    _audio.loader.loadOne(url, id);

    store.send(setMode("normal"));
  }

  return (0, _preact.h)("label", {
    for: id,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 166,
      columnNumber: 3
    }
  }, (0, _preact.h)("input", {
    onMouseDown: handleClick,
    onChange: handleChange,
    id: id,
    type: mode == "record" ? "file" : "button",
    accept: "audio/*",
    capture: true,
    class: (0, _classnames.default)({
      button: true,
      control: true,
      "seq-button": true,
      "seq-button--scheduled": mode == "write" && steps[id],
      "seq-button--current": playing && step == id
    }),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 167,
      columnNumber: 4
    }
  }), String(id + 1));
}

let StoreContext = (0, _preact.createContext)("store");

let connect = map => WrappedComponent => {
  return ({ ...props
  }) => {
    return (0, _preact.h)(StoreContext.Consumer, {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 192,
        columnNumber: 4
      }
    }, state => (0, _preact.h)(WrappedComponent, _extends({}, props, map(state), {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 193,
        columnNumber: 24
      }
    })));
  };
};

let ConnectedSequenceButton = connect(state => {
  return {
    steps: state.sounds[state.sound],
    mode: state.mode,
    step: state.step,
    playing: state.playing
  };
})(SequenceButton);
let ModeButton = connect(({
  mode
}) => ({
  activeMode: mode
}))(function ModeButton({
  activeMode,
  mode
}) {
  let handleClick = () => store.send(setMode(mode));

  return (0, _preact.h)("label", {
    for: mode,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 220,
      columnNumber: 3
    }
  }, (0, _preact.h)("input", {
    onMouseDown: handleClick,
    id: mode,
    type: "button",
    class: (0, _classnames.default)({
      button: true,
      control: true,
      mode: true,
      "mode--active": mode == activeMode
    }),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 221,
      columnNumber: 4
    }
  }), mode);
});

function PlayButton({
  playing
}) {
  let handleClick = () => store.send(togglePlay());

  return (0, _preact.h)("label", {
    htmlFor: "play",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 245,
      columnNumber: 3
    }
  }, (0, _preact.h)("input", {
    onMouseDown: handleClick,
    id: "play",
    type: "button",
    class: "button control",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 246,
      columnNumber: 4
    }
  }), playing ? "pause" : "play");
}

let ConnectedPlayButton = connect(state => {
  return {
    playing: state.playing
  };
})(PlayButton);
let Screen = connect(({
  mode,
  playing,
  sound,
  pitch,
  bpm,
  step
}) => ({
  mode,
  playing,
  sound,
  pitch,
  bpm,
  step
}))(function Screen({
  mode,
  playing,
  sound,
  pitch,
  bpm,
  step
}) {
  return (0, _preact.h)("aside", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 270,
      columnNumber: 3
    }
  }, (0, _preact.h)("pre", {
    class: "screen",
    id: "screen",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 271,
      columnNumber: 4
    }
  }, "mode: ", mode, "\n", "playing: ", playing ? "yes" : "no", "\n", "sound: ", sound, "\n", "pitch: ", pitch, "\n", "bpm: ", bpm, "\n", "step: ", step));
});

class Pocket extends _preact.Component {
  constructor() {
    super();
    this.state = store.get();
  }

  componentDidMount() {
    store.sub(() => {
      this.setState(store.get());
    });
  }

  render() {
    return (0, _preact.h)(StoreContext.Provider, {
      value: this.state,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 303,
        columnNumber: 4
      }
    }, (0, _preact.h)(Screen, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 304,
        columnNumber: 5
      }
    }), (0, _preact.h)("form", {
      className: "controls",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 305,
        columnNumber: 5
      }
    }, (0, _preact.h)("fieldset", {
      class: "control-section top-row",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 306,
        columnNumber: 6
      }
    }, (0, _preact.h)(ModeButton, {
      mode: "sound",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 307,
        columnNumber: 7
      }
    }), (0, _preact.h)(ModeButton, {
      mode: "pattern",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 308,
        columnNumber: 7
      }
    }), (0, _preact.h)(ModeButton, {
      mode: "bpm",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 309,
        columnNumber: 7
      }
    }), (0, _preact.h)(ModeButton, {
      mode: "sound",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 311,
        columnNumber: 7
      }
    }), (0, _preact.h)(ModeButton, {
      mode: "pattern",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 312,
        columnNumber: 7
      }
    })), (0, _preact.h)("fieldset", {
      class: "control-section sequencer",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 314,
        columnNumber: 6
      }
    }, (0, _preact.h)(ConnectedSequenceButton, {
      id: 0,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 315,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 1,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 316,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 2,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 317,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 3,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 318,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 4,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 319,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 5,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 320,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 6,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 321,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 7,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 322,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 8,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 323,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 9,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 324,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 10,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 325,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 11,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 326,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 12,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 327,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 13,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 328,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 14,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 329,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedSequenceButton, {
      id: 15,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 330,
        columnNumber: 7
      }
    })), (0, _preact.h)("fieldset", {
      class: "control-section side-column",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 332,
        columnNumber: 6
      }
    }, (0, _preact.h)(ModeButton, {
      mode: "record",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 333,
        columnNumber: 7
      }
    }), (0, _preact.h)(ModeButton, {
      mode: "effects",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 334,
        columnNumber: 7
      }
    }), (0, _preact.h)(ConnectedPlayButton, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 335,
        columnNumber: 7
      }
    }), (0, _preact.h)(ModeButton, {
      mode: "write",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 336,
        columnNumber: 7
      }
    }))));
  }

}

let scheduler = new _scheduler.default(store, _audio.context);
(0, _preact.render)((0, _preact.h)(Pocket, {
  __self: void 0,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 346,
    columnNumber: 8
  }
}), document.getElementById("main"));
},{"preact":"4BgmU","./audio":"2DqUK","./scheduler":"3wUN7","classnames":"3YxEz"}],"4BgmU":[function(require,module,exports) {
var n,l,u,t,i,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function p(n,l,u){var t,i,o,r=arguments,f={};for(o in l)"key"==o?t=l[o]:"ref"==o?i=l[o]:f[o]=l[o];if(arguments.length>3)for(u=[u],o=3;o<arguments.length;o++)u.push(r[o]);if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps)for(o in n.defaultProps)void 0===f[o]&&(f[o]=n.defaultProps[o]);return v(n,f,t,i,null)}function v(l,u,t,i,o){var r={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),null!=n.vnode&&n.vnode(r),r}function h(n){return n.children}function y(n,l){this.props=n,this.context=l}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function w(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!x.__r++||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(x)}function x(){for(var n;x.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,t,i,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(t=s({},o)).__v=t,i=N(f,o,t,l.__n,void 0!==f.ownerSVGElement,null!=o.__h?[r]:null,u,null==r?d(o):r,o.__h),T(u,o),i!=r&&_(o)))})}function k(n,l,u,t,i,o,r,c,s,p){var y,_,w,x,k,m,b,A=t&&t.__k||e,P=A.length;for(s==f&&(s=null!=r?r[0]:P?d(t,0):null),u.__k=[],y=0;y<l.length;y++)if(null!=(x=u.__k[y]=null==(x=l[y])||"boolean"==typeof x?null:"string"==typeof x||"number"==typeof x?v(null,x,null,null,x):Array.isArray(x)?v(h,{children:x},null,null,null):null!=x.__e||null!=x.__c?v(x.type,x.props,x.key,null,x.__v):x)){if(x.__=u,x.__b=u.__b+1,null===(w=A[y])||w&&x.key==w.key&&x.type===w.type)A[y]=void 0;else for(_=0;_<P;_++){if((w=A[_])&&x.key==w.key&&x.type===w.type){A[_]=void 0;break}w=null}k=N(n,x,w=w||f,i,o,r,c,s,p),(_=x.ref)&&w.ref!=_&&(b||(b=[]),w.ref&&b.push(w.ref,null,x),b.push(_,x.__c||k,x)),null!=k?(null==m&&(m=k),s=g(n,x,w,A,r,k,s),p||"option"!=u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&w.__e==s&&s.parentNode!=n&&(s=d(w))}if(u.__e=m,null!=r&&"function"!=typeof u.type)for(y=r.length;y--;)null!=r[y]&&a(r[y]);for(y=P;y--;)null!=A[y]&&H(A[y],A[y]);if(b)for(y=0;y<b.length;y++)j(b[y],b[++y],b[++y])}function g(n,l,u,t,i,o,r){var f,e,c;if(void 0!==l.__d)f=l.__d,l.__d=void 0;else if(i==u||o!=r||null==o.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(o),f=null;else{for(e=r,c=0;(e=e.nextSibling)&&c<t.length;c+=2)if(e==o)break n;n.insertBefore(o,r),f=r}return void 0!==f?f:o.nextSibling}function m(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||A(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||A(n,o,l[o],u[o],t)}function b(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||c.test(l)?u:u+"px"}function A(n,l,u,t,i){var o,r,f;if(i&&"className"==l&&(l="class"),"style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||b(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||b(n.style,l,u[l])}else"o"===l[0]&&"n"===l[1]?(o=l!==(l=l.replace(/Capture$/,"")),(r=l.toLowerCase())in n&&(l=r),l=l.slice(2),n.l||(n.l={}),n.l[l+o]=u,f=o?C:P,u?t||n.addEventListener(l,f,o):n.removeEventListener(l,f,o)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&"href"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u))}function P(l){this.l[l.type+!1](n.event?n.event(l):l)}function C(l){this.l[l.type+!0](n.event?n.event(l):l)}function z(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,i.__e&&("function"==typeof i.type&&i.__k.length>1&&z(i,l,u),l=g(u,i,i,n.__k,null,i.__e,l),"function"==typeof n.type&&(n.__d=l)))}function N(l,u,t,i,o,r,f,e,c){var a,p,v,d,_,w,x,g,m,b,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,r=[e]),(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,m=(a=P.contextType)&&i[a.__c],b=a?m?m.props.value:a.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(g,b):(u.__c=p=new y(g,b),p.constructor=P,p.render=I),m&&m.sub(p),p.props=g,p.state||(p.state={}),p.context=b,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=s({},p.__s)),s(p.__s,P.getDerivedStateFromProps(g,p.__s))),d=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&g!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(g,b),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(g,p.__s,b)||u.__v===t.__v){p.props=g,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,p.__h.length&&f.push(p),z(u,e,l);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(g,p.__s,b),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,w)})}p.context=b,p.props=g,p.state=p.__s,(a=n.__r)&&a(u),p.__d=!1,p.__v=u,p.__P=l,a=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=s(s({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(w=p.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type==h&&null==a.key?a.props.children:a,k(l,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,u.__h=null,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=$(t.__e,u,t,i,o,r,f,c);(a=n.diffed)&&a(u)}catch(l){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),n.__e(l,u,t)}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function $(n,l,u,t,i,o,r,c){var s,a,p,v,h,y=u.props,d=l.props;if(i="svg"===l.type||i,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,c=!1}if(null===l.type)y===d||c&&n.data===d||(n.data=d);else{if(null!=o&&(o=e.slice.call(n.childNodes)),p=(y=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(null!=o)for(y={},h=0;h<n.attributes.length;h++)y[n.attributes[h].name]=n.attributes[h].value;(v||p)&&(v&&(p&&v.__html==p.__html||v.__html===n.innerHTML)||(n.innerHTML=v&&v.__html||""))}m(n,d,y,i,c),v?l.__k=[]:(s=l.props.children,k(n,Array.isArray(s)?s:[s],l,u,t,"foreignObject"!==l.type&&i,o,r,f,c)),c||("value"in d&&void 0!==(s=d.value)&&(s!==n.value||"progress"===l.type&&!s)&&A(n,"value",s,y.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&A(n,"checked",s,y.checked,!1))}return n}function j(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function H(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||j(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&H(i[r],u,t);null!=o&&a(o)}function I(n,l,u){return this.constructor(n,u)}function L(l,u,t){var i,r,c;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=p(h,null,[l]),c=[],N(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:u.childNodes.length?e.slice.call(u.childNodes):null,c,t||f,i),T(c,l)}n={__e:function(n,l){for(var u,t,i,o=l.__h;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return l.__h=o,u.__E=u}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},y.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(s({},u),this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},y.prototype.render=h,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,x.__r=0,o=f,r=0,exports.render=L,exports.hydrate=function(n,l){L(n,l,o)},exports.createElement=p,exports.h=p,exports.Fragment=h,exports.createRef=function(){return{current:null}},exports.isValidElement=l,exports.Component=y,exports.cloneElement=function(n,l,u){var t,i,o,r=arguments,f=s({},n.props);for(o in l)"key"==o?t=l[o]:"ref"==o?i=l[o]:f[o]=l[o];if(arguments.length>3)for(u=[u],o=3;o<arguments.length;o++)u.push(r[o]);return null!=u&&(f.children=u),v(n.type,f,t||n.key,i||n.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n,u,t){return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(w)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.__u=H,exports.options=n;

},{}],"2DqUK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playSound = playSound;
exports.loader = exports.context = void 0;

var _bufferLoader = _interopRequireDefault(require("./buffer-loader"));

var _ = _interopRequireDefault(require("url:./sounds/1.flac"));

var _2 = _interopRequireDefault(require("url:./sounds/2.flac"));

var _3 = _interopRequireDefault(require("url:./sounds/3.flac"));

var _4 = _interopRequireDefault(require("url:./sounds/4.flac"));

var _5 = _interopRequireDefault(require("url:./sounds/5.flac"));

var _6 = _interopRequireDefault(require("url:./sounds/6.flac"));

var _7 = _interopRequireDefault(require("url:./sounds/7.flac"));

var _8 = _interopRequireDefault(require("url:./sounds/8.flac"));

var _9 = _interopRequireDefault(require("url:./sounds/9.flac"));

var _10 = _interopRequireDefault(require("url:./sounds/10.flac"));

var _11 = _interopRequireDefault(require("url:./sounds/11.flac"));

var _12 = _interopRequireDefault(require("url:./sounds/12.flac"));

var _13 = _interopRequireDefault(require("url:./sounds/13.flac"));

var _14 = _interopRequireDefault(require("url:./sounds/14.flac"));

var _15 = _interopRequireDefault(require("url:./sounds/15.flac"));

var _16 = _interopRequireDefault(require("url:./sounds/16.flac"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let context = new AudioContext();
exports.context = context;
let loader = new _bufferLoader.default(context, [_.default, _2.default, _3.default, _4.default, _5.default, _6.default, _7.default, _8.default, _9.default, _10.default, _11.default, _12.default, _13.default, _14.default, _15.default, _16.default], () => {});
exports.loader = loader;
loader.load();
/** the detune (in cents) for each pitch */

let notes = [// 1
-1200, // 2
-1000, // 3
-900, // 4
-700, // 5
-500, // 6
-300, // 7
-100, // 8
0, // 9
200, // 10
300, // 11
500, // 12
700, // 13
900, // 14
1100, // 15
1200, // 16
21400];
let scale = [notes[12], notes[13], notes[14], notes[15], notes[8], notes[9], notes[10], notes[11], notes[4], notes[5], notes[6], notes[7], notes[0], notes[1], notes[2], notes[3]];
let sources = [];

function playSound(index, pitch, time) {
  let sample = loader.buffers[index];

  if (sample) {
    let old = sources[index];

    if (old) {
      old.stop(time);
    }

    let source = sources[index] = context.createBufferSource();
    source.buffer = sample;
    source.connect(context.destination);
    source.detune.setValueAtTime(scale[pitch], time);
    source.start(time);
  }
}
},{"./buffer-loader":"6Lruq","url:./sounds/1.flac":"1xvYh","url:./sounds/2.flac":"3YAdo","url:./sounds/3.flac":"6ls5i","url:./sounds/4.flac":"62M2h","url:./sounds/5.flac":"253Ls","url:./sounds/6.flac":"42aqS","url:./sounds/7.flac":"3hD3s","url:./sounds/8.flac":"4mxjY","url:./sounds/9.flac":"5mDA7","url:./sounds/10.flac":"3uBkc","url:./sounds/11.flac":"1GXC2","url:./sounds/12.flac":"20Q6R","url:./sounds/13.flac":"46CVC","url:./sounds/14.flac":"qM1iM","url:./sounds/15.flac":"6hYTH","url:./sounds/16.flac":"41ngA"}],"6Lruq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class BufferLoader {
  constructor(context, urls, onload) {
    this.context = context;
    this.urls = urls;
    this.onload = onload;
    this.buffers = new Array();
    this.count = 0;
  }

  loadOne(url, index) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      this.context.decodeAudioData(request.response, buffer => {
        if (!buffer) {
          throw new Error(`couldnt decode: ${url}`);
        }

        this.buffers[index] = buffer;

        if (++this.count == this.urls.length) {
          this.onload(this.buffers);
        }
      });
    };

    request.onerror = () => {
      throw new Error(`request fail: ${url}`);
    };

    request.send();
  }

  load() {
    let loadOne = this.loadOne.bind(this);
    this.urls.forEach(loadOne);
  }

}

exports.default = BufferLoader;
},{}],"1xvYh":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "5AbI4");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"10N7P":[function(require,module,exports) {
"use strict";

/* globals document:readonly */
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.


function getOrigin(url) {
  let matches = ('' + url).match(/(https?|file|ftp):\/\/[^/]+/);

  if (!matches) {
    throw new Error('Origin not found');
  }

  return matches[0];
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;
},{}],"Q4PMS":[function(require,module,exports) {
"use strict";

var resolve = require('./bundle-manifest').resolve;

module.exports = function (fromId, toId) {
  return relative(dirname(resolve(fromId)), resolve(toId));
};

function dirname(_filePath) {
  if (_filePath === '') {
    return '.';
  }

  var filePath = _filePath[_filePath.length - 1] === '/' ? _filePath.slice(0, _filePath.length - 1) : _filePath;
  var slashIndex = filePath.lastIndexOf('/');
  return slashIndex === -1 ? '.' : filePath.slice(0, slashIndex);
}

function relative(from, to) {
  if (from === to) {
    return '';
  }

  var fromParts = from.split('/');

  if (fromParts[0] === '.') {
    fromParts.shift();
  }

  var toParts = to.split('/');

  if (toParts[0] === '.') {
    toParts.shift();
  } // Find where path segments diverge.


  var i;
  var divergeIndex;

  for (i = 0; (i < toParts.length || i < fromParts.length) && divergeIndex == null; i++) {
    if (fromParts[i] !== toParts[i]) {
      divergeIndex = i;
    }
  } // If there are segments from "from" beyond the point of divergence,
  // return back up the path to that point using "..".


  var parts = [];

  for (i = 0; i < fromParts.length - divergeIndex; i++) {
    parts.push('..');
  } // If there are segments from "to" beyond the point of divergence,
  // continue using the remaining segments.


  if (toParts.length > divergeIndex) {
    parts.push.apply(parts, toParts.slice(divergeIndex));
  }

  return parts.join('/');
}

module.exports._dirname = dirname;
module.exports._relative = relative;
},{"./bundle-manifest":"5G1rV"}],"3YAdo":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "xPpYE");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"6ls5i":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "1OaYJ");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"62M2h":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "6OlBD");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"253Ls":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "Fa81n");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"42aqS":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "3BBu5");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"3hD3s":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "16wGZ");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"4mxjY":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "28N9e");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"5mDA7":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "3PDMY");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"3uBkc":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "3b5KY");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"1GXC2":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "iwwrO");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"20Q6R":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "5Xk3K");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"46CVC":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "6bPXA");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"qM1iM":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "78QoS");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"6hYTH":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "7yNUE");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"41ngA":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("4nQJR", "uwMPY");
},{"./bundle-url":"10N7P","./relative-path":"Q4PMS"}],"3wUN7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _audio = require("./audio");

require("url:./worker.js");

class Scheduler {
  constructor(store, context) {
    this.store = store;
    this.context = context;
    this.worker = new Worker(require("worker.js"));
    this.post({
      tick: 25
    });

    this.worker.onmessage = event => {
      if (event.data == "tick") {
        this.run();
      } else if (event.data == "step") {
        let t = this.context.currentTime;
        let closest = this.queue.slice(0, 32).reduce((p, c) => Math.abs(c.time - t) < Math.abs(p.time - t) ? c : p, {
          time: 0,
          step: 0
        }).step;
        this.store.send(state => {
          state.step = closest;
          return state;
        });
      } else {
        console.log("WORKER", event.data);
      }
    };

    this.currentTime = 0;
    this.step = 0;
    this.queue = [];
    this.reset();
    this.store.sub(() => this.updateBpm());
    this.bpm = this.store.get().bpm;
    this.scheduleTime = 60 / this.bpm;
    this.updateBpm();
  }

  post(message) {
    this.worker.postMessage(message);
  }

  play() {
    this.post("play");
    this.post({
      step: 60 / this.bpm / 4 * 1000
    });
  }

  pause() {
    this.pause();
  }

  updateBpm() {
    this.bpm = this.store.get().bpm;
    this.scheduleTime = 60 / this.bpm;
  }

  reset() {
    this.currentTime = 0;
    this.step = 0;
    this.queue = [];
  }

  next() {
    this.currentTime += 60 / this.bpm / 4;

    if (++this.step == 16) {
      this.step = 0;
    }
  }

  schedule() {
    let {
      sounds
    } = this.store.get();
    this.queue.unshift({
      step: this.step,
      time: this.currentTime
    });
    sounds.forEach((sound, index) => {
      let pv = sound[this.step];

      if (pv) {
        let [pitch] = pv;
        (0, _audio.playSound)(index, pitch, this.currentTime);
      }
    });
  }

  run() {
    while (this.currentTime < this.context.currentTime + this.scheduleTime) {
      this.schedule();
      this.next();
    }
  }

}

exports.default = Scheduler;
},{"./audio":"2DqUK","url:./worker.js":"1hnLq","worker.js":"5n8cv"}],"1hnLq":[function(require,module,exports) {
let tickInterval = null;
let tick = 100;
let stepInterval = null;
let step = 100000;

self.onmessage = function (event) {
  if (event.data == "play") {
    tickInterval = setInterval(() => {
      postMessage("tick");
    }, tick);
    stepInterval = setInterval(() => {
      postMessage("step");
    });
  } else if (event.data.tick) {
    tick = event.data.tick;

    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = setInterval(() => {
        postMessage("tick");
      }, tick);
    }
  } else if (event.data.step) {
    step = event.data.step;

    if (stepInterval) {
      clearInterval(stepInterval);
      stepInterval = setInterval(() => {
        postMessage("step");
      }, step);
    }
  } else if (event.data == "pause") {
    clearInterval(tickInterval);
    clearInterval(stepInterval);
    tickInterval = null;
    stepInterval = null;
  }
};

postMessage("im ready 4 u");
},{}],"5n8cv":[function(require,module,exports) {
module.exports = require('./get-worker-url')(require('./relative-path')("4nQJR", "38YOw"));
},{"./get-worker-url":"3jI9r","./relative-path":"Q4PMS"}],"3jI9r":[function(require,module,exports) {
"use strict";

/* global self, Blob */
var bundleUrl = require('./bundle-url');

module.exports = function (relativePath) {
  var workerUrl = bundleUrl.getBundleURL() + relativePath;

  if (bundleUrl.getOrigin(workerUrl) === self.location.origin) {
    // If the worker bundle's url is on the same origin as the document,
    // use the worker bundle's own url.
    return workerUrl;
  } else {
    // Otherwise, create a blob URL which loads the worker bundle with `importScripts`.
    return URL.createObjectURL(new Blob(['importScripts(' + JSON.stringify(workerUrl) + ');']));
  }
};
},{"./bundle-url":"10N7P"}],"3YxEz":[function(require,module,exports) {
var define;

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

/* global define */
(function () {
  'use strict';

  var hasOwn = {}.hasOwnProperty;

  function classNames() {
    var classes = [];

    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (!arg) continue;
      var argType = typeof arg;

      if (argType === 'string' || argType === 'number') {
        classes.push(arg);
      } else if (Array.isArray(arg) && arg.length) {
        var inner = classNames.apply(null, arg);

        if (inner) {
          classes.push(inner);
        }
      } else if (argType === 'object') {
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      }
    }

    return classes.join(' ');
  }

  if (typeof module !== 'undefined' && module.exports) {
    classNames.default = classNames;
    module.exports = classNames;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    // register as 'classnames', consistent with npm package name
    define('classnames', [], function () {
      return classNames;
    });
  } else {
    window.classNames = classNames;
  }
})();
},{}]},{},["25hCO","2aJdH","5T8Uc"], "5T8Uc", null)

//# sourceMappingURL=index.90112a52.js.map
