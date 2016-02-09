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
            wave();
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

function wave () {
    waveParent = document.getElementById("waves");
    waveTemp = document.getElementById("wave");
    stageTemp = waveTemp.content.getElementById("stage");
    waitTemp = waveTemp.content.getElementById("wait");
    
    for(var i = 0; i < waveParent.children.length; i++) {
        if(waveParent.children[i].tagName.toLowerCase() == "li") {
            waveParent.removeChild(waveParent.children[i]);
        }
    }
    var waveObj = data.getElementsByTagName("waves")[0];
    for(var i = 0; i < waveObj.childNodes.length; i++) {
        var thisWave = waveObj.childNodes[i];
        var thisWaveObj = waveTemp.content.cloneNode(true);
        thisWaveObj.children[0].getElementsByClassName("reward")[0].value = thisWave.getAttribute("cash");
        var stageList = thisWaveObj.children[0].getElementsByClassName("stages")[0];
        for(var j = 0; j < thisWave.childNodes.length; j++) {
            var thisStage = thisWave.childNodes[j];
            if(thisStage.tagName == "wait") {
                var thisWaitObj = waitTemp.content.cloneNode(true);
                thisWaitObj.children[0].getElementsByClassName("waitTime")[0].value = parseFloat(thisStage.getAttribute("time"));
            }
            else {
                var thisStageObj = stageTemp.content.cloneNode(true);
                thisStageObj.children[0].getElementsByClassName("type")[0].value = thisStage.tagName;
                thisStageObj.children[0].getElementsByClassName("amt")[0].value = parseInt(thisStage.getAttribute("amount"));
                thisStageObj.children[0].getElementsByClassName("speed")[0].value = parseFloat(thisStage.getAttribute("speed"));
            }
            stageList.appendChild(thisStageObj);
        }
        waveParent.appendChild(thisWaveObj);
    }
}

function addWave() {
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
    var list = obj.parentElement.parentElement.getElementsByTagName("ol")[0];
    list.appendChild(stageTemp.content.cloneNode(true));
}

function addWait (obj) {
    var list = obj.parentElement.parentElement.getElementsByTagName("ol")[0];
    list.appendChild(waitTemp.content.cloneNode(true));
}
