var data;
var root;

var textArea;
var serializer = new XMLSerializer();

function newNode (e, t) {
    var element = data.createElement(e);
    if(t != null) {
        var text = data.createTextNode(t);
        element.appendChild(text);
    }
    return element;
}

function xmlDump() {
    if(textArea === undefined) {
        textArea = document.getElementById("xmlTxt");
    }
    textArea.value = vkbeautify(serializer.serializeToString(root), "xml");
}