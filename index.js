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



/*
 * Module API
 */

function parseStatus(resp, callback) {
  if ((~resp & 0x0F) !== (resp >> 4)) {
    return callback(new Error('Failed to read pin status'));
  }

  callback(null, {
    PIOA: {
      pin: !(resp & cmds.STATUS.PIOA_PIN),
      latch: !(resp & cmds.STATUS.PIOA_LATCH)
    },
    PIOB: {
      pin: !(resp & cmds.STATUS.PIOB_PIN),
      latch: !(resp & cmds.STATUS.PIOB_LATCH)
    }
  });
}

Module.prototype.read = function(callback) {
  var that = this;

  this.wire.sendCommand(cmds.PIO_ACCESS_READ, this.rom, function(err) {
    if (err) { return callback(err); }

    that.wire.readData(1, function(err, resp) {
      if (err) { return callback(err); }

      that.wire._resetWire(function(err) {
        if (err) { return callback(err); }

        parseStatus(resp.readUInt8(0), callback);
      });
    });
  });
};

Module.prototype.write = function(state, callback) {
  var data = 0xFF,
    that = this;

  if (state) {
    if (state.PIOA) { data &= ~(1<<0); }
    if (state.PIOB) { data &= ~(1<<1); }
  }

  this.wire.sendCommand(cmds.PIO_ACCESS_WRITE, this.rom, function(err) {
    if (err) { return callback(err); }

    that.wire.writeData( new Buffer([data, ~data]), function(err) {
      if (err) { return callback(err); }

      that.wire.readData(2, function(err, resp) {
        if (err) { return callback(err); }

        that.wire._resetWire(function(err) {
          if (err) { return callback(err); }

          if (resp.readUInt8(0) !== 0xAA) {
            callback(new Error('Failed to write pin state'));

          } else {
            parseStatus(resp.readUInt8(1), callback);
          }
        });
      });
    });
  });
};

module.exports = DS2413;
