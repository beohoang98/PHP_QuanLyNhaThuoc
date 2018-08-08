(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class inputPreview2 {
    constructor(target = document) {
        this._list = {};
        this._data = [];
        this._lookup = {};
        this._target = target;
        this._preview_div = null;
        this._currentPreviewData = Array();
        // constructor    
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.hasOwnProperty("preview-row"))
                this._deletePreview();
        });
    }
    /**
     * add lookup to json name
     * @param {JSON} arr object to lookup data name to element input name
     */
    addLookup(arr) {
        if (typeof arr != "object") {
            // console.log(Object.call(arr));
            throw new Error("parameter must be json obj");
            return;
        }
        for (let key of Object.keys(arr)) {
            this._lookup[key] = arr[key];
            let el = this._target.getElementById(key);
            if (!!el === false) {
                console.log(Error(`Cannot find #${key} element`));
            }
            else {
                this._list[key] = el;
            }
        }
    }
    ;
    /**
     * add host to fetch database
     * @param {string} url asd
     */
    addData(data) {
        if (typeof (data) != "object") {
            throw new Error("parameter must be json");
            return;
        }
        this._data = data;
    }
    ;
    listen(id, callback) {
        let element = document.getElementById(id);
        element.addEventListener("keydown", (e) => {
            let code = e.keyCode;
            if (code == 27) //esc
             {
                this._deletePreview();
            }
            else if (code == 38 || code == 40) //up -down
             {
                e.preventDefault();
                let cur = +this._preview_div.getAttribute('cur');
                this._preview_div.children[cur]
                    .classList.remove("preview-row-active");
                if (code == 38)
                    --cur;
                else
                    ++cur;
                let len = this._preview_div.children.length;
                if (cur < 0)
                    cur = len - 1;
                if (cur > len - 1)
                    cur = 0;
                this._preview_div.children[cur]
                    .classList.add("preview-row-active");
                this._preview_div.setAttribute("cur", cur + "");
            }
            else if (code == 13) {
                e.preventDefault();
                let cur = +this._preview_div.getAttribute("cur");
                callback(this._currentPreviewData[cur]);
                this._deletePreview();
            }
            else {
                this.fetchOn(id, callback);
            }
        });
    }
    /**
     *
     * fetch database and show in input
     * @param {string} id id of html element input need to fetch by value
     */
    fetchOn(id, callback) {
        this._deletePreview();
        this._currentPreviewData.length = 0; //clear current preview suggest name
        if (this._list.hasOwnProperty(id)) {
            let input = this._list[id];
            input.setAttribute('autocomplete', 'off');
            let input_preview = this._createFlyWrap(input);
            this._preview_div = input_preview;
            let value = input.value;
            for (const row of this._data) {
                if (!this._isLike(row[this._lookup[id]], value))
                    continue;
                this._currentPreviewData.push(row);
                let arr = [];
                for (const name in this._lookup) {
                    if (!this._lookup[name])
                        continue;
                    const field = this._lookup[name];
                    arr.push(row[field]);
                }
                let newRow = this._createFlyRow(arr);
                newRow.addEventListener("click", (e) => {
                    callback(row);
                    this._deletePreview();
                });
                input_preview.appendChild(newRow);
                document.body.appendChild(input_preview);
            }
        }
        else {
            console.log("cannot find id");
        }
    }
    ;
    /**
     * @param {HTMLDivElement} element
     * @param {string} value
     */
    _createFlyWrap(element) {
        if (!element)
            return null;
        let rect = element.getBoundingClientRect();
        let div = document.createElement("div");
        div.className = "preview-input";
        div.style.minWidth = rect.width + "px";
        div.style.top = +rect.top + rect.height + "px";
        div.style.left = +rect.left + "px";
        div.setAttribute("cur", "0");
        return div;
    }
    /**
     * @return {true} if str1 like str2
     * @param {String} str1
     * @param {String} str2
     */
    _isLike(str1, str2) {
        str1 = str1.trim();
        str2 = str2.trim();
        if (str1 == "" || str2 == "")
            return false;
        str1 = str1.normalize();
        str2 = str2.normalize();
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        let reg = new RegExp(`^.*${str2}.*$`);
        return str1.match(reg);
    }
    /**
     * @param {Array} arrValues
     */
    _createFlyRow(arrValues) {
        if (!Array.isArray(arrValues)) {
            return null;
        }
        let row = document.createElement("div");
        row.className = "preview-row";
        for (let value of arrValues) {
            let col = document.createElement("div");
            col.style.margin = "auto";
            col.textContent = value;
            row.appendChild(col);
        }
        return row;
    }
    _deletePreview() {
        document.querySelectorAll(".preview-input").forEach((val) => {
            val.remove();
        });
    }
}
exports.default = inputPreview2;

},{}],2:[function(require,module,exports){
const InputPreview2 = require('../app/inputPreview2.js').default;

$(document).ready(function() {
    let popup = new StatusPopup();
    popup.create();

    const preview = new InputPreview2();
    preview.addLookup({
        "ten_nsx": "ten",
    });
    preview.listen("ten_nsx", (data)=>{
        $("#ten_nsx").val(data["ten"]);
    });

    function updateNSX() {
        fetch("/public/api/getNsx.php", {credentials: "include"})
        .then((res)=>{
            return res.json();
        }).then((json)=>{
            preview.addData(json.data);
        });
    }

    function updateDonvi() {
        $("#don_vi").children().remove();
        fetch("/public/api/getDonvi.php", {credentials: "include"})
        .then((res)=>{
            return res.json();
        })
        .then((json)=>{
            if (!!json.err) console.log(json.msg);
            else {
                for (let row of json.data) {
                    let name = row['ten'];
                    let id = row['id'];
                    let newOpt = $("<option/>").val(id).text(name);

                    $("#don_vi").append(newOpt);
                }
                $("#don_vi").find("option:first-child").attr("selected", "");
            }
        });
    }

    $("#don_gia").moneyInput();
    updateNSX();
    updateDonvi();


    $("#form").on('submit', (e)=>{
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/public/api/addThuoc.php",
            data: $("#form").serialize(),
            dataType: "json",
            xhrFields: {
                withCredentials: true, // for session cookie
            },
            success: (json)=>{
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    console.log('Post failed: ', json.msg);
                } else {
                    popup.setStatus(true, 'Thêm thành công');
                    popup.show();
                    setTimeout(function() {
                        popup.hide();
                    }, 1000);

                    console.log('success');
                    $("input").val("");

                    parent.postMessage({
                        msg: 'update',
                    }, '*');
                }
            },
            error: (err)=>{
                console.log(err);
            },
        });
    });

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
            updateDonvi();
        }
    });

    // shortcut key event
    document.addEventListener('keydown', (e)=>{
        console.log("nhap thuoc: ", e.keyCode);
        parent.postMessage({
            msg: 'shortcut_key',
            key: e.keyCode,
            shift: e.shiftKey,
        }, "*");
    });
});

},{"../app/inputPreview2.js":1}]},{},[2]);
