# Development Guide
This document aims to provide a quick start to the development for this app.

- Since all the UI components are written in `React` and the main app functionality is embedded inside those components, the React code needs to be compiled into static JS which is done using [webpack](https://webpack.js.org/) here.

- `webpack-dev server` is used for quick UI development which hot reloads the UI components on changes.

## Installation
1. Clone this repo and cd into it.

2. Install dependencies
```
npm install
```
3. - Building static `src/build/bundle.js` from `src/index.js`
    - Rebuilding native dependencies for electron version.
    - Building native installer packages.
```
npm run build
```

#### For development
4. Building static `src/build/bundle.js` from `src/index.js` and starting `webpack-dev` server to update js (including UI components) without refresh via HMR for faster development. Serves at `localhost:1234`
```
npm run build-watch
``` 
5. Run electron app in dev mode which just runs page served by webpack server.
```
npm run start-dev
```
#### For distribution version
Start electron app from command line by 
```
npm start
```
 or install built executable.