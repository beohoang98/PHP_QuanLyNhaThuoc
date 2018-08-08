(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BangDonVi {
    constructor() {
        this._map = {};
        this._list = [];
        this._isConnect = false;
        this._connectStatus = "";
        this._isFetched = false;
        this._dbURL = "";
    }
    addDatabaseURL(url) {
        this._dbURL = url;
    }
    update(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch('/public/api/getDonvi.php', { credentials: 'include' });
            if (!res.ok) {
                this._isConnect = false;
                this._connectStatus = res.statusText;
                return;
            }
            this._isConnect = true;
            this._connectStatus = "";
            let json = yield res.json();
            if (!!json.err) {
                this._isFetched = false;
                this._connectStatus = json.msg;
                return;
            }
            this._isFetched = true;
            this._connectStatus = "OK";
            this._list = json.data;
            for (let row of json.data) {
                let id = row['id'];
                this._map[id] = {
                    data: row,
                    ten: row['ten'],
                    donvi_quydoi: null,
                    heso: null,
                    quydoiText: "đơn vị cơ bản",
                };
            }
            for (let id of Object.keys(this._map)) {
                let idCoban = this._map[id].data['id_quy_doi'];
                let heso = +this._map[id].data['he_so_quydoi'];
                if (idCoban == null) {
                    continue;
                }
                while (this._map[idCoban].data['id_quy_doi'] != null) {
                    heso *= +this._map[idCoban].data['he_so_quydoi'];
                    idCoban = this._map[idCoban].data['id_quy_doi'];
                }
                this._map[id]['donvi_quydoi'] = this._map[idCoban];
                this._map[id]['heso'] = heso;
                this._map[id]['quydoiText'] = "= " + heso + "x ["
                    + this._map[idCoban].ten + "]";
            }
        });
    }
    get table() {
        return this._map;
    }
    get list() {
        return this._list;
    }
}
exports.default = BangDonVi;

},{}],2:[function(require,module,exports){
const BangDonVi = require('../app/BangDonVi').default;

function fetchToTable(data) {
    $("#table-body").children().remove();
    $('.will-be-update').remove();

    for (let id of Object.keys(data)) {
        let ten = data[id]['ten'];
        let quydoiText = data[id]['quydoiText'];

        let row = $("<tr/>");
        row.append($('<td/>').text(id))
            .append($('<td/>').text(ten))
            .append($('<td/>').text(quydoiText));

        let opt = $('<option/>').val(id).text(ten).addClass('will-be-update');
        $("#id_quy_doi").append(opt);
        $('#table-body').append(row);
    }
}

$(document).ready(async ()=>{
    const bangDonvi = new BangDonVi();
    bangDonvi.addDatabaseURL('/public/api/getDonvi.php');
    await bangDonvi.update();
    fetchToTable(bangDonvi.table);

    const popup = new StatusPopup();
    popup.create();

    $("#form").on('submit', (e)=>{
        e.preventDefault();

        const tenDonVi = $('#ten_don_vi').val();
        const idQuyDoi = $('#id_quy_doi').val();
        const heSoQuyDoi = idQuyDoi == "null" ? 0 : $("#he_so_quydoi").val();

        $.ajax('/api/addDonvi.php', {
            method: 'post',
            xhrFields: {
                withCredentials: 'include',
            },
            data: `ten_don_vi=${tenDonVi}&id_quy_doi=${idQuyDoi}&he_so_quydoi=${heSoQuyDoi}`,
            success: function(json) {
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    return;
                }

                parent.postMessage({
                    msg: 'update',
                }, "*");

                popup.setStatus(true, json.msg);
                popup.show();
                setTimeout(()=>{
                    popup.hide();
                }, 1000);

                $("input").val("");
                $("#id_quy_doi").val("null");
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();

                return;
            },
        });
    });


    // on input quy doi don vi
    $('#id_quy_doi').on('change', function ChangeOnInputDonVi(e) {
        let val = $(this).val();
        $('#he_so_quydoi').prop('disabled', val == 'null');
    });

    // update data request
    window.addEventListener('message', async function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            await bangDonvi.update();
            fetchToTable(bangDonvi.table);
        }
    });
});

},{"../app/BangDonVi":1}]},{},[2]);
