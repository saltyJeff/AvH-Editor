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
    var defines = newNode("defines");
    defines.appendChild(newNode("name", name));
    root.appendChild(defines);
    document.getElementsByTagName("h1")[0].textContent = data.getElementsByTagName("name")[0].textContent;
}

function load(file) {
    var reader = new FileReader();
    
    reader.onload = function() {
        data.xml = new DOMParser().parseFromString(this.result, "text/xml");
        root = data.documentElement;
        document.getElementsByTagName("h1")[0].textContent = data.getElementsByTagName("name")[0].textContent;
    }
    reader.readAsText(file);
}