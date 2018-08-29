const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    app.keyevent.on('F', (e) => {
        alert('key pressed');
    });

    require("../app/nhap-thuoc").init(app);
});
