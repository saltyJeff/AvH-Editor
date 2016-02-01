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
        element.style.left = obj.getAttribute("x")+"px";
        element.style.top = obj.getAttribute("y")+"px";
        var xscale = parseInt(obj.getAttribute("xscale"));
        var yscale = parseInt(obj.getAttribute("yscale"));
        if(!Number.isNaN(xscale)) {
            var size = imgSizes[obj.tagName];
            element.style.width = xscale*size+"px";
            element.style.height = yscale*size+"px";
            element.style.left = (parseInt(obj.getAttribute("x"))-(xscale*size)/2)+"px";
            element.style.top = (parseInt(obj.getAttribute("y"))-(yscale*size)/2)+"px";
        }
        element.hidden = false;
        floor.appendChild(element);
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
            var leftSet = parseInt(obj.getAttribute("data-x"));
            var topSet = parseInt(obj.getAttribute("data-y"));
            var size = imgSizes[obj.getAttribute("data-obj")];
            if(leftSet == null || Number.isNaN(leftSet)|| topSet == null || Number.isNaN(topSet)) {
                leftSet = 0;
                topSet = 0;
            }
            var finalX = Math.round((parseInt(obj.style.left)+leftSet)+parseInt(obj.style.width)/2);
            var finalY = Math.round((parseInt(obj.style.top)+topSet)+parseInt(obj.style.height)/2);
            node.setAttribute("x", finalX);
            node.setAttribute("y", finalY);
            node.setAttribute("xscale", Math.round(parseInt(obj.style.width)/size));
            node.setAttribute("yscale", Math.round(parseInt(obj.style.height)/size));
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
            node.setAttribute("x", finalX);
            node.setAttribute("y", finalY);
        }
        
        mapObj.appendChild(node);
    }
    console.log("Map Saved");
}

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

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

interact('.resizable')
  .draggable({
    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: false,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
});

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
    
    console.log(e.dataTransfer.getData("text"));
    var element = document.getElementById("toolList").getElementsByClassName(e.dataTransfer.getData("text"))[0].cloneNode(false);
    element.hidden = false;
   
    element.style.left = getXY(e)[0]+"px";
    element.style.top = getXY(e)[1]+"px";
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