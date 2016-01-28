var data;
var root;

var textArea;
var metaParent;
var defParent;
var metaTemp;
var defTemp;

var defsSaved = true;
//creates a new XML node
function newNode (e, t) {
    var element = data.createElement(e);
    if(t != null) {
        var text = data.createTextNode(t);
        element.appendChild(text);
    }
    return element;
}
//removes all children from node
function deleteChildren (obj) {
    while(obj.firstChild) {
        obj.removeChild(obj.firstChild);
    }
}
//save the defines in the Defines page
function saveDefines () {
    if(defsSaved) {
        return;
    }
    var metas = data.getElementsByTagName("meta")[0];
    deleteChildren(metas);
    for(var i = 0; i < metaParent.children.length; i++) {
        metas.appendChild(newNode(metaParent.children[i].getElementsByClassName("variable")[0].textContent.split(":")[0], metaParent.children[i].getElementsByClassName("val")[0].value));
    }
    var defs = data.getElementsByTagName("defines")[0];
    deleteChildren(defs);
    for(var i = 0; i < defParent.children.length; i++) {
        defs.appendChild(newNode(defParent.children[i].getElementsByClassName("variable")[0].value, defParent.children[i].getElementsByClassName("val")[0].value));
    }
    defsSaved = true;
}
//save the xml in XML textarea
function saveXml () {
    data = new DOMParser().parseFromString(textArea.value, "text/xml");
}
//save all of it
function save() {
    var blob = new Blob([new XMLSerializer().serializeToString(data.documentElement)], {type: 'text/csv'});
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = "AvH Map.xml";        
    document.body.appendChild(elem);
    elem.click();        
    document.body.removeChild(elem);
}