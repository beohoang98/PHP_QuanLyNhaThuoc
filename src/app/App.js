"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyEvent_1 = require("./KeyEvent");
const Thuoc_1 = require("./Model/Thuoc");
const DonVi_1 = require("./Model/DonVi");
class App {
    // public ncc:
    constructor() {
        this.switchToPage(this.getPageFromUrl());
        this.handleSwitchPage();
        this.keyevent = new KeyEvent_1.KeyEvent();
        this.handleSetting();
        this.handleModal();
        this.thuoc = new Thuoc_1.Thuoc();
        this.donVi = new DonVi_1.DonVi();
    }
    getUsername() {
        const username = document.cookie.match(/username=([0-9a-zA-Z_]+)/i)[1];
        $("#username").text(username);
    }
    onShortcutKey(combKey, page, func) {
        // f*king incredible scope things!
        this.keyevent.on(combKey, (e) => {
            if (this.page === page) {
                func(e);
            }
        });
    }
    getPageFromUrl() {
        let page = new URL(window.location.toString()).searchParams.get("page");
        if (!page) {
            page = "page-nhap-hoa-don";
        }
        return page;
    }
    handleSwitchPage() {
        const $this = this;
        $(".sidebar-switch-page").on("click", function () {
            const id = $(this).data("target");
            $this.switchToPage(id);
        });
    }
    switchToPage(id) {
        this.page = id;
        window.history.replaceState(null, id, "/?page=" + id);
        const container = $(".frame-container");
        const page = $("#" + id);
        container.animate({
            scrollTop: page.offset().top - container.offset().top + container.scrollTop(),
        });
    }
    handleSetting() {
        //
    }
    handleModal() {
        $(".modal").on("shown.bs.modal", () => {
            this.keyevent.block();
        });
        $(".modal").on("hidden.bs.modal", () => {
            this.keyevent.unblock();
        });
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map