var imgSizes = {
    "floor": 64,
    "wall": 64,
    "enemypass": 64
}
function switchSide(obj) {
    var header = obj.parentElement.parentElement;
    if(header.style.left === "auto") {
        header.style.right = "auto";
        header.style.left = "0px";
    }
    else {
        header.style.left = "auto";
        header.style.right = "0px";
    }
}
function xml2map () {
    document.getElementById("transforms").hidden = true;
    //the meta data
    var metas = data.getElementsByTagName("meta")[0].children;
    var floor;
    for(var i = 0; i < metas.length; i++) {
        switch(metas[i].tagName) {
            case "size":
                var dimensions = metas[i].textContent.split("x");
                floor = document.getElementById("floor");
                floor.style.width = parseInt(dimensions[0])*imgSizes.floor+"px";
                floor.style.height = parseInt(dimensions[1])*imgSizes.floor+"px";
                
                break;
            default:
                break;
        }
    }
    deleteChildren(floor);
    
    var map = data.getElementsByTagName("map")[0];
    var items = map.childNodes;
    var toolList = document.getElementById("toolList");
    for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        if(obj.nodeType != 1) {
            continue;
        }
        var element = toolList.getElementsByClassName("tool-"+obj.tagName)[0].cloneNode(false);
        element.style.left = parseFloat(obj.getAttribute("x"))*100+"px";
        element.style.top = parseFloat(obj.getAttribute("y"))*100+"px";
        var xscale = parseInt(obj.getAttribute("xscale"));
        var yscale = parseInt(obj.getAttribute("yscale"));
        if(!Number.isNaN(xscale)) {
            var size = imgSizes[obj.tagName];
            element.style.width = xscale*size+"px";
            element.style.height = yscale*size+"px";
            element.style.left = (parseFloat(obj.getAttribute("x"))*100-(xscale*size)/2)+"px";
            element.style.top = (parseFloat(obj.getAttribute("y"))*100-(yscale*size)/2)+"px";
        }
        element.hidden = false;
        floor.appendChild(element);
        $Transmute(element);
        element.transmute.setRotation(obj.getAttribute("rotation"));
        element.transmute.apply();
    }
}
function map2xml () {
    var mapObj = data.getElementsByTagName("map")[0];
    deleteChildren(mapObj);
    var floor = document.getElementById("floor");
    var items = floor.children;
    for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        var node = newNode(obj.getAttribute("data-obj"));
        if(obj.classList.contains("resizable")) {
            var leftSet = parseInt(obj.getAttribute("data-x")) || 0;
            var topSet = parseInt(obj.getAttribute("data-y")) || 0;
            var size = imgSizes[obj.getAttribute("data-obj")];
                        
            var finalX = Math.round((parseInt(obj.style.left)+leftSet)+(parseInt(obj.style.width)/2 || 0));
            var finalY = Math.round((parseInt(obj.style.top)+topSet)+(parseInt(obj.style.height)/2 || 0));
            node.setAttribute("x", finalX/100);
            node.setAttribute("y", finalY/100);
            node.setAttribute("xscale", Math.round((parseFloat(obj.style.width) || size)/size));
            node.setAttribute("yscale", Math.round((parseFloat(obj.style.height) || size)/size));
            node.setAttribute("rotation", obj.transmute.getRotation());
        }
        else {
            var leftSet = parseInt(obj.getAttribute("data-x"));
            var topSet = parseInt(obj.getAttribute("data-y"));
            
            if(leftSet == null || Number.isNaN(leftSet)|| topSet == null || Number.isNaN(topSet)) {
                leftSet = 0;
                topSet = 0;
            }
            var finalX = Math.round(parseInt(obj.style.left)+leftSet);
            var finalY = Math.round(parseInt(obj.style.top)+topSet);
            node.setAttribute("x", finalX/100);
            node.setAttribute("y", finalY/100);
            node.setAttribute("rotation", obj.transmute.getRotation());
        }
        
        mapObj.appendChild(node);
    }
    console.log("Map Saved");
}
//CRAZY BUGGY
function rescale (obj) {
    var scale = obj.value+"%";
    var floor = document.getElementById("floor");
}

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    
  });
interact('.resizable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.transmute.setTranslation(x,y);
    target.transmute.apply();
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

//toolbox drag n drop
function dragStart(e) {
    e.dataTransfer.setData("text", e.target.getAttribute("data-tool"));
}
function drag(e) {
    e.preventDefault();
}
function drop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var element = document.getElementById("toolList").getElementsByClassName(e.dataTransfer.getData("text"))[0].cloneNode(false);
    element.hidden = false;
   
    element.style.left = getXY(e)[0]+"px";
    element.style.top = getXY(e)[1]+"px";
    $Transmute(element);
    document.getElementById("floor").appendChild(element);
}
function getXY(evt) {
    var element = document.getElementById('floor');
    var rect = element.getBoundingClientRect();
    var scrollTop = document.documentElement.scrollTop?
                    document.documentElement.scrollTop:document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft?                   
                    document.documentElement.scrollLeft:document.body.scrollLeft;
    var elementLeft = rect.left+scrollLeft;  
    var elementTop = rect.top+scrollTop;

    return [evt.pageX-elementLeft,evt.pageY-elementTop];
}

function rotate(event, obj) {
    //return; //BUGGY
    event.preventDefault();
    obj.transmute.rotate(90);
    obj.transmute.apply();
}
var currentObj = null;
function mouse(e, obj) {
    if(e.which == 2) {
        e.preventDefault();
        obj.parentElement.removeChild(obj);
    }
}
function setSelected(e, obj) {
    e.preventDefault();
    e.stopPropagation();
    if(currentObj != null) {
        currentObj.classList.remove("selected");
    }
    document.getElementById("transforms").hidden = false;
    currentObj = obj;
    currentObj.classList.add("selected");
    document.getElementById("width").value = parseInt(currentObj.style.width)/imgSizes[currentObj.getAttribute("data-obj")] || 1;
    document.getElementById("height").value = parseInt(currentObj.style.height)/imgSizes[currentObj.getAttribute("data-obj")] || 1;
    document.getElementById("rotation").value = currentObj.transmute.getRotation();
}
function reTransform () {
    var width = parseInt(document.getElementById("width").value);
    var height = parseInt(document.getElementById("height").value);
    var rotation = parseInt(document.getElementById("rotation").value);
    if(currentObj.classList.contains("resizable")) {
        var newWidth = width*imgSizes[currentObj.getAttribute("data-obj")];
        var newHeight = height*imgSizes[currentObj.getAttribute("data-obj")];
        currentObj.style.width = newWidth+"px";
        currentObj.style.height = newHeight+"px";
    }
    currentObj.transmute.setRotation(rotation);
    currentObj.transmute.apply();
}
function hideTransforms(e) {
    e.preventDefault();
    document.getElementById("transforms").hidden = true;
    if(currentObj != null) {
        currentObj.classList.remove("selected");
        currentObj = null;
    }
}