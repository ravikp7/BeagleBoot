# ARCHITECTURE
This document aims to provides the insights of the app working and a What and Why?
___

- BeagleBoot app is based on the [Electron Framework](https://electron.atom.io/)

- UI (including state) of the app is created and managed using [React Library](https://facebook.github.io/react/)

#### The major modules used in app are:
- [node-beagle-boot](https://github.com/ravikp7/node-beagle-boot) : This usb bootloader server module is responsible for booting the BeagleBone into usb mass storage mode for flashing.

- [drivelist](https://github.com/resin-io-modules/drivelist) : This module lists the properties of usb mass storage device exposed by bootloader running in BeagleBone.

- [etcher-image-stream](https://github.com/resin-io-modules/etcher-image-stream) : This module provides a readable stream for the OS images (.xz, .img).

- [etcher-image-write](https://github.com/resin-io-modules/etcher-image-write) : This module is used to write the image readable stream to the device.

- [node-ipc](https://github.com/RIAEvangelist/node-ipc) : This module provides way to communicate between the main app process and an elevated process as we don't want the whole app running as an elevated process.

- [sudo-prompt](https://github.com/jorangreef/sudo-prompt) : This module is used to elevate a script which then forks usbMassStorage or imageWrite scripts as per requirement.

#### Basic working of the app:
- The app is loaded, an `IPC server` is started in the main app process.
- User clicks the `USB Mass Storage` button, this forks a script `lib/elevate.js` which then self elevates itself using `sudo-prompt` and runs an `IPC client` in the elevated process.
- After `IPC client` starts running, it informs same to the `IPC server`.
- The `IPC server` then requests client to run `lib/usbMassStorage.js` script which boots board into usb mass storage mode.
- Then, user clicks `Select Image` button and selects OS image for flashing.
- Then, user clicks `Flash` button. The `IPC server` now requests the `IPC client` to run `lib/imageWrite.js` in the elvated process to perform the image writing. 