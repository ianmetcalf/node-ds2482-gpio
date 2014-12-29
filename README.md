# DS2413 Onewire IO Module

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/ianmetcalf/node-ds2482?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Provides an interface for Dallas DS2413 IO modules over the DS2482 onewire bridge

# Install

```
$ npm install ds2482-io
```

# Usage

```js
var DS2413 = require('ds2482-io');

var io = new DS2413();

io.init(function(err) {
  if (err) { throw err; }
  
  io.search(function(err, modules) {
    if (err) { throw err; }
    
    console.log(modules); // Returns a list of found io modules
  });
});
```

# API

### new DS2413([options])
Creates an interface for Dallas DS2413 IO modules

- `options.wire` an instance of [wire](https://github.com/ianmetcalf/node-ds2482)

### new DS2413.Module(rom [, options])
Creates an io module instance

- `rom` the ROM address of the module as a 16 character hex encoded string
- `options.wire` an instance of [wire](https://github.com/ianmetcalf/node-ds2482)

### sense.init(callback)
Resets the bridge chip and any onewire devices connected to it

### sense.search(callback)
Searches the bus and returns a list of found io modules

```js
[
  <Sensor "3ae9f412000000a6">
]
```
