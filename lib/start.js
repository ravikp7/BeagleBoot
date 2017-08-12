if (process.env.ELECTRON_RUN_AS_NODE) require('./usbMassStorage');
else require('../main');