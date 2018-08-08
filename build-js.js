const fs = require('fs');
const browserify = require('browserify')({
    "debug": true,
});
const INCLUDE_PATH = './src/script/';
const OUT_DIR = './public/static/js/';

const files = fs.readdirSync(INCLUDE_PATH);

for (const file of files) {
    browserify.add(INCLUDE_PATH + file);
}

browserify.bundle()
.pipe(fs.createWriteStream(OUT_DIR + "bundle.js"))
.on('error', (err)=>{
    throw err;
}).on('finish', ()=>{
    console.log("success --> " + OUT_DIR + "bundle.js");
    browserify.reset();
});
