const fs = require('fs');
const browserify = require('browserify')();
const INCLUDE_PATH = './src/script/';
const OUT_DIR = './public/static/js/';

const files = fs.readdirSync(INCLUDE_PATH);

(async ()=>{
    for (const file of files) {
        await new Promise((resolve, reject)=>{
            browserify.add(INCLUDE_PATH + file);
            browserify.bundle()
            .pipe(fs.createWriteStream(OUT_DIR + file))
            .on('error', (err)=>{
                reject(err);
            }).on('finish', ()=>{
                console.log(INCLUDE_PATH + file + " --> " + OUT_DIR + file);
                resolve();
                browserify.reset();
            });
        });
    }
})();
