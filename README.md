# BeagleBoot
A cross platform flasher/updater app for BeagleBone hardware.

### Currently Supported Platrforms: Linux, OSX

## Installation
1. Install dependencies
```
npm install
```
2. This step is required to rebuild `usb` module binaries if node version installed doesn't match with electron's node version.
```
npm run electron-rebuild
```
#### For development
3. Building static `src/build/bundle.js` from `src/index.js` and starting `webpack-dev` server to update js (including UI components) without refresh via HMR for faster development. Serves at `localhost:1234`
```
npm run build-watch
``` 
4. Run electron app in dev mode which just runs page served by webpack server.
```
npm run start-dev
```
#### For distribution version
3. Building static `src/build/bundle.js` from `src/index.js`
```
npm run build
```
4. Start electron app.
```
npm start
```

