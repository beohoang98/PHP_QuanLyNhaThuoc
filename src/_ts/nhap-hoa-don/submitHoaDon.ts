import { App } from "../App";

function submitHoaDonHandle(app: App) {
    $("#nhap_hoa_don--submit").on("click", (e: JQuery.Event) => {
        e.preventDefault();
        alert("just in testing");
    });
}

export {submitHoaDonHandle};
