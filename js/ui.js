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
    }
    root = data.documentElement;
    switch (obj.textContent) {
        case "XML":
            xmlDump();
            break;
        case "Defines":
            define();
            break;
        case "Level":
            xml2map();
            break;
        default :
            break;
    }
    window.location = window.location.href.split('#')[0] + "#" + obj.textContent;
}

function xmlDump() {
    if(textArea === undefined) {
        textArea = document.getElementById("xmlTxt");
    }
    textArea.value = window.vkbeautify(new XMLSerializer().serializeToString(root), "xml");
}

function define () {
    if(metaParent === undefined) {
        defParent = document.getElementById("defs");
        metaParent = document.getElementById("metas");
        defTemp = document.getElementById("def");
        metaTemp = document.getElementById("meta");
    }
    deleteChildren(defParent);
    deleteChildren(metaParent);
    var metas = data.getElementsByTagName("meta")[0].children;
    for(var i = 0; i < metas.length; i++) {
        metaTemp.content.getElementById("variable").textContent = metas[i].tagName+": ";
        metaTemp.content.getElementById("val").value = metas[i].textContent;
        var cloneMeta = document.importNode(metaTemp.content, true);
        metaParent.appendChild(cloneMeta);
    }
    var defs = data.getElementsByTagName("defines")[0].children;
    for(var i = 0; i < defs.length; i++) {
        defTemp.content.getElementById("variable").value = defs[i].tagName;
        defTemp.content.getElementById("val").value = defs[i].textContent;
        defTemp.content.getElementById("removeButton").hidden = false;
        var cloneDef = document.importNode(defTemp.content, true);
        defParent.appendChild(cloneDef); 
    }
    defsSaved = true;
}

function newDefine () {
    defsSaved = false;
    if(metaParent === undefined) {
        defParent = document.getElementById("defs");
        metaParent = document.getElementById("metas");
        defTemp = document.getElementById("def");
        metaTemp = document.getElementById("meta");
    }
    var cloneDef = document.importNode(defTemp.content, true);
    defParent.appendChild(cloneDef);
}

function removeDefine (obj) {
    defParent.removeChild(obj.parentElement);
    defsSaved = false;
}
