class BootstrapModal {
    private _element: JQuery<HTMLElement>;
    public id: string;

    public constructor(id) {
        this.id = id;
        this._element = this._createModal(id);
        document.body.appendChild(this._element[0]);
    }

    public setTitle(text: string) {
        this._element.find('.modal-title').text(text);
    }

    public setContent(html: any) {
        this._element.find('.modal-body').html(html);
    }

    public show(title, content) {
        this.setTitle(title);
        this.setContent(content);
        this.open();
    }

    public open() {
        this._element.modal('show');
    }
    public close() {
        this._element.modal('hide');
    }

    private _createModal(id) {
        const div = $("<div/>");
        div.attr('id', id);
        div.addClass('modal fade').data('toggle', 'modal');
        div.html(`
        <div class='modal-dialog modal-lg modal-center'>
            <div class='modal-content'>
                <div class='modal-header'>
                    <div class='modal-title'></div>
                    <div class='close' data-dismiss='modal'>
                        <i class='fa fa-times'></i>
                    </div>
                </div>
                <div class='modal-body'>
                </div>
                <div class='modal-footer'>
                    <button class='btn btn-secondary' data-dismiss='modal'>Close</button>
                    <button class='btn btn-primary'>OK</button>
                </div>
            </div>
        </div>
        `);

        return div;
    }
}

export {BootstrapModal};
