## antman 🐜




### Features
* koa
* webpack(support amd/CommonJS)
* sass (css extracted from js)
* uglify when build
* auto refresh(but not hot module replacement, it's a problem to be solved..)
* bundle third-party packages into vendor.js and vendor.css, so you needn't require them in your file. Third-party packages included:
    * jquery
    * bootstrap([darkly-ui](http://bootswatch.com/darkly/))




### Notes
* the static assets folders under the front folder should be named in the format `static-*`





### Usage

install nodemon to automatically restart the server - perfect for development

```bash
sudo npm install -g nodemon
```

install the third-party packages

```bash
bower install
npm install
```

start the webpack-dev-server

```bash
npm run dev
```

start the node server

```bash
nodemon start
```

open `http://localhost:3000/` in the browser


build the static assets

```bash
npm run build
```




### Debug

install node-inspector

```bash
npm install -g node-inspector
```

start debug

```bash
npm run start:debuglocal
```

open http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858 in the browser to debug




###  Reference
* [generator-koa](https://github.com/peter-vilja/generator-koa)
