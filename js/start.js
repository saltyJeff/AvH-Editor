/*
 * Start.js handles all the grey box functions and initializing of new projects
*/
var lastSelect = null;
var operation = "";
function setColor (obj) {
    if(lastSelect !== null) {
        lastSelect.style.backgroundColor = "lightgrey";
    }
    obj.parentElement.style.backgroundColor = "lightgreen";
    lastSelect = obj.parentElement;
}
function cont () {
    if(document.getElementById("startFile").parentElement.style.backgroundColor == "lightgreen") {
        operation = "load";
        load(document.getElementById("startFile").files[0]);
    }
    else {
        operation = "create";
        create(document.getElementById("newName").value);
    }
    document.getElementById("invisOverlay").parentElement.removeChild(document.getElementById("invisOverlay"));
    console.log("performed a "+operation +" operation");
}

function create(name) {
    if(name === "") {
        name = "An AvH Level";
    }
    data = new DOMParser().parseFromString("<level></level>", "text/xml");
    root = data.documentElement;
    var meta = newNode("meta");
    meta.appendChild(newNode("name", name));
    meta.appendChild(newNode("size", "30x30"));
    root.appendChild(meta);
    root.appendChild(newNode("defines"));
    var map = newNode("map");
    root.appendChild(map);
    root.appendChild(newNode("waves"));
    xml2map();
}

function load(file) {
    var reader = new FileReader();
    
    reader.onload = function() {
        data = new DOMParser().parseFromString(this.result, "text/xml");
        root = data.documentElement;
        xml2map();
    }
    reader.readAsText(file);
}