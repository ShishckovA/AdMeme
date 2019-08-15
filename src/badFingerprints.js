(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.badFingerprints = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var badFingerprints = ['/google/', 'optimize', '/widget.', 'load.php', '95d2-d38', 'googleta', 'storage.', 'callback', 'leclick.', 'default_', 'lacement', '/assets/', 's/skins/', '/themes/', '-loader-', '/header-', '/public/', 'default/', 'd/jsonp/', 'gallery-', 'k/widget', '-curve-m', 'eloader/', 'tooltip/', '/footer/', '/footer-', 'oogletag', 'google.c', 'uv_I-qM8', 'oogle.co', 'ogletags', 'bleclick', 'gletagse', 'letagser', 'eclick.n', 'click.ne', 'googlesy', 'ooglesyn', 'arousel/', 'm-0.0.12', 'gallery/', 'es-heade', '-header-', 'message.', 'Callback', 'channel=', 'onp/pid=', 'ayer.swf', 'include.', 'amazonaw', 'allback&', 's/client', 'article_', '79942%22', 'allback_', '_wrapper', 'wrapper.', 'm/tools/', 'takeover', '_bottom_', 'mponent/', 'ference/', 's/index.', 'ebottom.', '&domain=', 'atic/js/', 'ad_type=', 'u4eSmzTp', 'ign=null', 'aterial.', '/upload/', 'amazon.c', 'b50c29dd', 'dformat=', 'rvices.c', 'eywords=', '2n%22:0,', 'C&v=404&', 'mazon.co', 'vices.co', 's/views/', 'hardware', 'es-heade'];
  exports.badFingerprints = badFingerprints;
  var badSubstrings = ['com', 'net', 'http', 'image', 'www', 'img', '.js', 'oogl', 'min.', 'que', 'synd', 'dicat', 'templ', 'tube', 'page', 'home', 'mepa', 'mplat', 'tati', 'user', 'aws', 'omp', 'icros', 'espon', 'org', 'nalyti', 'acebo', 'lead', 'con', 'count', 'vers', 'pres', 'aff', 'atio', 'tent', 'ative', 'en_', 'fr_', 'es_', 'ha1', 'ha2', 'live', 'odu', 'esh', 'adm', 'crip', 'ect', 'tics', 'edia', 'ini', 'yala', 'ana', 'rac', 'trol', 'tern', 'card', 'yah', 'tion', 'erv', '.co', 'lug', 'eat', 'ugi', 'ates', 'loud', 'ner', 'earc', 'atd', 'fro', 'ruct', 'sour', 'news', 'ddr', 'htm', 'fram', 'dar', 'flas', 'lay', 'orig', 'uble', 'om/', 'ext', 'link', '.png', 'com/', 'tri', 'but', 'vity', 'spri'];
  exports.badSubstrings = badSubstrings;
});