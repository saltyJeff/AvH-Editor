//closing alert
window.onbeforeunload = function (e) {
    return "Make sure you've downloaded your document!";
};
/*
 * Tabbing System with #<link>
*/
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
        case "Waves":
            
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
/*
 * Defines Page
*/
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

/*
 * Waves Configure
*/
var waveTemp;
var stageTemp;
var waitTemp;

var waveParent;

function addWave() {
    if(waveParent === undefined) {
        waveParent = document.getElementById("waves");
        waveTemp = document.getElementById("wave");
        stageTemp = document.getElementById("stage");
        waitTemp = document.getElementById("wait");
    }
    waveParent.appendChild(waveTemp.content.cloneNode(true));
}

function removeWave (obj) {
    obj.parentElement.parentElement.removeChild(obj.parentElement);
}

function toggleWave(obj) {
    var list = obj.parentElement;
    var h3 = list.getElementsByTagName("h3")[0];
    if(h3.hidden) {
        h3.hidden = false;
        list.getElementsByTagName("ol")[0].hidden = false;
        obj.value = "Hide Stages";
    }
    else if(!h3.hidden) {
        h3.hidden = true;
        list.getElementsByTagName("ol")[0].hidden = true;
        obj.value = "Show Stages";
    }
}

function addStage (obj) {
    if(stageTemp === null) {
        stageTemp = document.getElementById("stage");
    }
    var list = obj.parentElement.parentElement.getElementsByTagName("ol")[0];
    list.appendChild(stageTemp.content.cloneNode(true));
}

function addWait (obj) {
    if(waitTemp === null) {
        waitTemp = document.getElementById("wait");
    }
    var list = obj.parentElement.parentElement.getElementsByTagName("ol")[0];
    list.appendChild(waitTemp.content.cloneNode(true));
}
