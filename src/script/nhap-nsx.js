const {Nsx} = require('../app/Model/Nsx');

$(document).ready(()=>{
    const popup = new StatusPopup();
    const nsx = new Nsx();

    popup.create();
    updateNSX();

    function createTableRow(val) {
        let row = $("<tr/>");
        for (let key of Object.keys(val)) {
            row.append($('<td/>').text(val[key]));
        }
        return row;
    }

    function updateNSX() {
        $('#table-body').children().remove();
        nsx.get((err, data)=>{
            if (err) {
                throw new Error(err);
            }
            for (let row of data) {
                $("#table-body").append(createTableRow(row));
            }
        });
    }

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
        }
    });
});
