var DS2482 = require('ds2482'),
  cmds = require('./commands');



var DS2413 = function(options) {
  options = options || {};

  this.modules = [];
  this.wire = options.wire || new DS2482(options);
};

DS2413.FAMILY = 0x3A;

var Module = DS2413.Module = function(rom, options) {
  options = options || {};

  this.rom = rom;
  this.wire = options.wire || new DS2482(options);
};



/*
 * Main API
 */

DS2413.prototype.init = function(callback) {
  this.wire.init(callback);
};

DS2413.prototype.search = function(callback) {
  var that = this;

  this.wire.searchByFamily(DS2413.FAMILY, function(err, resp) {
    if (err) { return callback(err); }

    that.modules = resp.map(function(rom) {
      return new Module(rom, {wire: that.wire});
    });

    callback(null, that.modules);
  });
};

module.exports = DS2413;
