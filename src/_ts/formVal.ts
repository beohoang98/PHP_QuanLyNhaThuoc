function getFormValue(form: JQuery<HTMLElement>): any {
    const arr = form.serializeArray();
    const val = {};
    for (const input of arr) {
        val[input.name] = input.value;
    }

    return val;
}

export {getFormValue};
