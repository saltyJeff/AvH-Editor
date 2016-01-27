var tabs;
function tab(obj) {
    if(obj.classList.contains("selectTab")) {
        return;
    }
    if(tabs === undefined) {
        tabs = document.getElementsByClassName("tab");
    }
    for(var i = 0; i < tabs.length; i++) {
        var e = tabs[i];
        if(e == obj) {
            e.classList.remove("openTab");
            e.classList.add("selectTab");
            document.getElementById(e.textContent).hidden = false;
        }
        else {
            e.classList.remove("selectTab");
            e.classList.add("openTab");
            document.getElementById(e.textContent).hidden = true;
        }
        
        switch (obj.textContent) {
            case "XML":
                xmlDump();
                break;
            default :
                break;
        }
    }
    window.location = window.location.href.split('#')[0] + "#" + obj.textContent;
}