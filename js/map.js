var imgSizes = {
    "floor": 64
}
function xml2map () {
    //the meta data
    var metas = data.getElementsByTagName("meta")[0].children;
    for(var i = 0; i < metas.length; i++) {
        switch(metas[i].tagName) {
            case "size":
                var dimensions = metas[i].textContent.split("x");
                var floor = document.getElementById("floor");
                floor.style.width = parseFloat(dimensions[0])*imgSizes.floor+"px";
                floor.style.height = parseFloat(dimensions[1])*imgSizes.floor+"px";
                break;
            default:
                break;
        }
    }
    
}