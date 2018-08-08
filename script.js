let frame = $("#frame");
let choose = 2;
let chooseLength = $(".sidebar > a").length;

function nhapHoaDon() {
    let container = $('.frame-container');
    container.animate({
        scrollTop: $("#frameNhapHoaDon").offset().top - container.offset().top + container.scrollTop() 
    });
    
}
function nhapThuoc() {
    let container = $('.frame-container');
    container.animate({
        scrollTop: $("#frameNhapThuoc").offset().top - container.offset().top + container.scrollTop() 
    });
}
function nhapNSX() {
    let container = $('.frame-container');
    container.animate({
        scrollTop: $("#frameNhapNSX").offset().top - container.offset().top + container.scrollTop() 
    });
}
function nhapDonVi() {
    let container = $('.frame-container');
    container.animate({
        scrollTop: $("#frameNhapDonVi").offset().top - container.offset().top + container.scrollTop() 
    });
}
function xemUser() {
    
}

function resizeiframe(frame) {
    frame.style.height = document.body.scrollHeight + 'px';
}

function logOut() {
    document.cookie = "session=;expires=1/1/2011;domain=/";
    window.open("./login.php", "_self");
}

function togglemenu() {
    $(".sidebar").toggleClass("hideSidebar");
}

$(document).ready(()=>{
    let username = document.cookie.match(/username=([0-9a-zA-Z_]+)/i)[1];
    $("#username").text(username);

    $("a[title]").tooltip({
        "content":$(this).attr("title"),
        "classes": {
            "ui-tooltip":"text-info ui-corner-all"
        }
    });

    $(document).on("keydown",(e)=>{
        if (e.altKey) {
            e.preventDefault();
            togglemenu();
        }
        else if (e.keyCode === 38 | e.keyCode === 40) {
            if (e.keyCode == 40) ++choose;
            else --choose;

            if (choose < 2) choose = chooseLength;
            if (choose > chooseLength) choose = 2;

            let string = `.sidebar > a:nth-child(${choose})`;
            $(".isChoose").removeClass("isChoose")
            $(string).addClass("isChoose");
        }
    });

    $(window).resize(function() {
        let list = document.querySelectorAll("iframe");
        for (let frame of list)
        {
            resizeiframe(frame);
        }
    });

    $("iframe").on("load", nhapHoaDon);

    window.onmessage = function(e) {
        let data = e.data;
        if (data.msg === 'shortcut_key')
            handleShortcutKey(data.shift, data.key);
        else if (data.msg === 'update')
        {
            $('iframe').each((i, frame)=>{
                frame.contentWindow.postMessage({
                    msg: 'update'
                }, '*');
            });
        }
    }
});

function handleShortcutKey(shift, key)
{
    if (!shift) return;
    if (key == 37) // key left
    {

    }
    else if (key == 38) // key up
    {

    }
    else if (key == 39) // key right
    {

    }
    else if (key == 40) // key down
    {

    }
}