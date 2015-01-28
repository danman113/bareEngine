var globalBare={
	imagesLoaded:0,audioLoaded:0,mouse:{x:0,y:0,up:true,hover:-1,mouseUp:false},keys:new Object,lastKey:0
}
function bareEngine(width,height){
	//Engine information
	this.version=0.2;
	//Options
	this.defaultVolume=0.5;
	//Canvas
	this.width=width;
	this.height=height;
	this.canvas;
	this.context;
	this.displayLoop;
	this.target;
	//Media
	this.images=[];
	this.audio=[];
	this.imageUrls=[];
	this.audioUrls=[];
	this.totalImages=this.images.length;
	this.totalAudio=this.audio.length;
	//IO
	this.keys=globalBare.keys;
	this.mouse=globalBare.mouse;
	this.lastMouseUp=true;
	//Scene
	this.currentScene=-1;
	this.scenes=[];
	//Misc
	this.errorMessage="bareEngine error: ";

	this.init=function(target){
		//Creating the canvas
		this.target=target;
		this.target.innerHTML+="<canvas id='canvas' width='"+width+"' height='"+height+"'></canvas>";
		this.canvas=document.getElementById("canvas");
		this.context=canvas.getContext("2d");
		globalBare.canvas=this.canvas;
		//Input handling
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		window.addEventListener("keydown", this.onKeyDown, false);
		window.addEventListener("keyup", this.onKeyUp, false);
		//Initializing the draw loop
		if(typeof disp == "function")
			this.displayLoop=window.requestAnimationFrame(disp);
		else
			this.error("No draw function found. Add a draw function if you want a game loop.");
		//Loading assets
		this.totalImages=this.imageUrls.length;
		this.totalAudio=this.audioUrls.length;
		this.loadImages();
		this.loadAudio();
	}

	//Input
	this.mouseUp=function(e){
		globalBare.mouse.up=true;
		if(typeof globalBare.onMouseUp=="function")
			globalBare.onMouseUp();
	}

	this.mouseDown=function(e){
		globalBare.mouse.up=false;
		if(typeof globalBare.onMouseDown=="function")
			globalBare.onMouseDown();
	}

	this.mouseMove=function(e){
		if(e.offsetX) {
			globalBare.mouse.x = e.offsetX;
			globalBare.mouse.y = e.offsetY;
		} else if(e.layerX) {
		var box=globalBare.canvas.getBoundingClientRect();
			globalBare.mouse.x = e.layerX-box.left;
			globalBare.mouse.y = e.layerY-box.top;
		}
	}

	this.onKeyDown=function(e){
		globalBare.keys[e.keyCode] = true;
		globalBare.lastkey=e.keyCode;
	}

	this.onKeyUp=function(e){
		delete globalBare.keys[e.keyCode];
	}

	//Media Loading
	this.onImageLoad=function(){
		globalBare.imagesLoaded++;
		console.log("Image "+globalBare.imagesLoaded+" Loaded");
	}

	this.loadImages=function(){
		for(var i=0;i<this.imageUrls.length;i++){
			this.images.push(new Image);
			this.images[i].onload=this.onImageLoad;
			this.images[i].src=this.imageUrls[i];
			var name=this.imageUrls[i];
			this.context.drawImage(this.images[i],-1,-1,1,1);
		}
	}

	this.loadAudio=function(){
		for(var i=0;i<this.totalAudio;i++){
			this.audio.push(new audioFile(this.audioUrls[i]));
			this.audio[i].element=document.createElement('audio');
			this.audio[i].element.src=this.audio[i].src;
			this.audio[i].element.volume=this.defaultVolume;
			this.audio[i].element.oncanplaythrough=this.onAudioLoad;
			this.audio[i].element.play();
			this.audio[i].element.pause();
		}
		globalBare.audio=this.audio;
	}

	this.onAudioLoad=function(){
		if((globalBare.imagesLoaded+globalBare.audioLoaded)<engine.totalImages+engine.totalAudio){
			globalBare.audioLoaded++;
			for(var i=0;i<globalBare.audio.length;i++){
				globalBare.audio[i].element.play();
				globalBare.audio[i].element.pause();
			}
			console.log("Audio Loaded");
		}
	}

	this.audioLoaded=function(){
		return globalBare.audioLoaded;
	}

	this.imagesLoaded=function(){
		return globalBare.imagesLoaded;
	}

	//System functions
	this.error=function(message){
		throw this.errorMessage+message;
	}

	this.rectCollision=function(rect1x, rect1y, rect1w, rect1h, rect2x, rect2y, rect2w, rect2h){
		return rect1x+rect1w > rect2x && rect1x < (rect2x + rect2w) && rect1y+rect1h > rect2y && rect1y < (rect2y + rect2h);
	}

	this.mouseManager=function(){
		if(!this.lastMouseUp && globalBare.mouse.up){
			globalBare.mouse.mouseUp=true;
		} else {
			globalBare.mouse.mouseUp=false;
		}
		this.lastMouseUp=globalBare.mouse.up;
	}
}

function audioFile(src,defaultVolume){
	this.src=src;
	this.element;
	this.play=function(volume){
		if(volume!==undefined && this.element.volume!=volume)
			this.element.volume=volume;
		this.element.play();
	}
	this.stop=function(){
		this.element.pause();
		this.element.currentTime = 0;
	}
}