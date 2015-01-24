
function engine(width,height){
	this.version=0.1;
	this.width=width;
	this.height=height;
	this.images=[];
	this.imagesLoaded=0;
	this.totalImages=this.images.length;
	this.canvas;
	this.context;
	this.displayLoop;
	this.displayFunction;
	this.currentScreen=-1;
	this.scenes=[];
	this.loaded=false;
	this.errorMessage="bareEngine error: ";
	this.init=function(){
		document.body.innerHTML+="<canvas id='canvas' width='"+width+"' height='"+height+"'></canvas>";
		this.canvas=document.getElementById("canvas");
		this.context=canvas.getContext("2d");
		this.totalImages=imageUrls.length;
		if(typeof draw == "function")
			this.displayLoop=window.requestAnimationFrame(draw);
		else
			throw this.errorMessage+"No draw function found. Add a draw function if you want a game loop.";
		this.loadImages(imageUrls);
		this.loaded=true;
	}

	this.onImageLoad=function(name){
		console.log(name + " was loaded!");
		this.imagesLoaded++;
	}

	this.loadImages=function(imageUrls){
		for(var i=0;i<imageUrls.length;i++){
			this.images.push(new Image);
			this.images[i].src=imageUrls[i];
			var name=imageUrls[i];
			this.images[i].onload=this.onImageLoad(name);
		}
	}
}

