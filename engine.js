var c;
var canvas;
var width=400;
var height=300;
var loaded=false;
var disploop;
var images=[];
var imagesLoaded=0;
var totalImages;
function init(){
	document.body.innerHTML+="<canvas id='canvas' width='"+width+"' height='"+height+"'></canvas>";
	canvas=document.getElementById("canvas");
	c=canvas.getContext("2d");
	totalImages=imageUrls.length;
	disploop=requestAnimationFrame(disp);
	loadImages(imageUrls);
}

function loadImages(imageUrls){
	for(var i=0;i<imageUrls.length;i++){
		images.push(new Image);
		images[i].src=imageUrls[i];
		var name=imageUrls[i];
		images[i].onload=function(){onImageLoad(name)};
		
	}
}

function onImageLoad(name){
	console.log(name + " was loaded!");
	imagesLoaded++;
}