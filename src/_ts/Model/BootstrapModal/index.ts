class BootstrapModal {
    public id: string;
    public element: JQuery<HTMLElement>;

    public constructor(id, title?: string) {
        this.id = id;
        this.element = this._createModal(id);
        this.setTitle(title);
        document.body.appendChild(this.element[0]);
    }

    public setTitle(text: string) {
        this.element.find(".modal-title").text(text);
    }

    public setContent(html: any) {
        this.element.find(".modal-body").html(html);
    }

    public show(title, content) {
        this.setTitle(title);
        this.setContent(content);
        this.open();
    }

    public open() {
        this.element.modal("show");
    }
    public close() {
        this.element.modal("hide");
    }

    private _createModal(id) {
        const div = $("<div/>");
        div.attr("id", id);
        div.addClass("modal fade").data("toggle", "modal");
        div.html(`
        <div class="modal-dialog modal-lg modal-center">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title"></div>
                    <div class="close" data-dismiss="modal">
                        <i class="fa fa-times"></i>
                    </div>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button class="btn btn-primary">OK</button>
                </div>
            </div>
        </div>
        `);

        return div;
    }
}

export {BootstrapModal};
