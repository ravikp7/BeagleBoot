# BeagleBoot
A cross platform flasher/updater app for BeagleBone hardware.

## Installation
1. Dependencies install
```
npm install
```
2. This step is required to rebuild `usb` module binaries if node version installed doesn't match with electron's node version.
```
npm run electron-rebuild
```
3. Building static `build/bundle.js` from `src/` and starting `webpack-dev` server to see live code changes. Serves at `localhost:1234`
```
npm run build-test
``` 
4. Run electron app in dev mode which just runs page served by webpack server.
```
sudo npm start
```
4. Once, build is done, distribution version of app can be run which doesn't load server's served page but use the static files.
```
sudo npm run start-electron
```

