import { KeyEvent } from "./KeyEvent";
import { Thuoc } from "./Model/Thuoc";
import { HoaDon } from "./Model/HoaDon";
import { DonVi } from "./Model/DonVi";
import { Ncc } from "./Model/Ncc";

class App {
    public page: string;
    public keyevent: KeyEvent;

    public thuoc: Thuoc;
    public hoaDon: HoaDon;
    public donVi: DonVi;
    public ncc: Ncc;

    public constructor() {
        this.switchToPage(this.getPageFromUrl());
        this.handleSwitchPage();
        this.keyevent = new KeyEvent();
        this.handleSetting();
        this.handleModal();

        this.thuoc = new Thuoc();
        this.donVi = new DonVi();
        this.ncc = new Ncc();
    }

    public getUsername() {
        const username = document.cookie.match(/username=([0-9a-zA-Z_]+)/i)[1];
        $("#username").text(username);
    }

    public onShortcutKey(combKey: string, page: string, func: (e: JQuery.Event) => any) {
        // f*king incredible scope things!
        this.keyevent.on(combKey, (e) => {
            if (this.page === page) {
                func(e);
            }
        });
    }

    private getPageFromUrl() {
        let page = new URL(window.location.toString()).searchParams.get("page");
        if (!page) {
            page = "page-nhap-hoa-don";
        }
        return page;
    }

    private handleSwitchPage() {
        const $this = this;
        $(".sidebar-switch-page").on("click", function() {
            const id = $(this).data("target");
            $this.switchToPage(id);
        });
    }

    private switchToPage(id) {
        this.page = id;
        window.history.replaceState(null, id, "/?page=" + id);
        const container = $(".frame-container");
        const page = $("#" + id);
        container.animate({
            scrollTop: page.offset().top - container.offset().top + container.scrollTop(),
        });
    }

    private handleSetting() {
        //
    }

    private handleModal() {
        $(".modal").on("shown.bs.modal", () => {
            this.keyevent.block();
        });
        $(".modal").on("hidden.bs.modal", () => {
            this.keyevent.unblock();
        });
    }
}

export {App};
