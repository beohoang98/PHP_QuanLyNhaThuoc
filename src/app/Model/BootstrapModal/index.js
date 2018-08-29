"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BootstrapModal {
    constructor(id, title) {
        this.id = id;
        this.element = this._createModal(id);
        this.setTitle(title);
        document.body.appendChild(this.element[0]);
    }
    setTitle(text) {
        this.element.find(".modal-title").text(text);
    }
    setContent(html) {
        this.element.find(".modal-body").html(html);
    }
    show(title, content) {
        this.setTitle(title);
        this.setContent(content);
        this.open();
    }
    open() {
        this.element.modal("show");
    }
    close() {
        this.element.modal("hide");
    }
    _createModal(id) {
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
exports.BootstrapModal = BootstrapModal;
//# sourceMappingURL=index.js.map