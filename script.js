function switchTo(id) {
    let container = $('.frame-container');
    container.animate({
        scrollTop: $("#" + id).offset().top - container.offset().top + container.scrollTop(),
    });
}

function togglemenu() {
    $(".sidebar").toggleClass("hideSidebar");
}

function setSetting() {

}

function changeSetting(type, value) {
    switch (type) {
        case "theme": break;
        default: return;
    }

    $.cookie("setting:"+type, value, 3600*24*30);
}

$(document).ready(()=>{
    let username = document.cookie.match(/username=([0-9a-zA-Z_]+)/i)[1];
    $("#username").text(username);

    $("a[title]").attr('data-toggle', 'tooltip');

    $(".sidebar-switch-page").on("click", function() {
        const id = $(this).data('target');
        switchTo(id);
    });

    $(document).on("keydown", (e)=>{
        if (e.altKey) {
            e.preventDefault();
            togglemenu();
        } else if (e.keyCode === 38 | e.keyCode === 40) {
            if (e.keyCode == 40) ++choose;
            else --choose;

            if (choose < 2) choose = chooseLength;
            if (choose > chooseLength) choose = 2;

            let string = `.sidebar > a:nth-child(${choose})`;
            $(".isChoose").removeClass("isChoose");
            $(string).addClass("isChoose");
        }
    });

    switchTo("page-nhap-hoa-don");
});
