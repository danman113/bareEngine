/*
Todo:
Touch emulation
*/

var globalBare={
	imagesLoaded:0,audioLoaded:0,mouse:{x:0,y:0,up:true,hover:-1,mouseUp:false,mouseDown:false},keys:new Object,lastKey:0
}
function bareEngine(width,height){
	//Engine information
	this.version=0.75;
	//Options
	this.masterVolume=0.5;
	this.soundVolume=1;
	this.musicVolume=1;
	this.fontsize=10;
	this.font="arial";
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
		this.canvas.addEventListener('mouseout', this.mouseOut, false);
		
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
		this.keys=new Object;
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

	this.mouseOut=function(e){
		globalBare.mouse.up=true;
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
			this.audio[i].element.volume=this.masterVolume;
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

	//Audio Control
	this.defaultMusicVolume=function(){
		return (this.masterVolume*this.musicVolume);
	}

	this.defaultSoundVolume=function(){
		return (this.masterVolume*this.soundVolume);
	}

	this.setMusicVolume=function(x){
		this.musicVolume=x;
		for(var i=0;i<this.audio.length;i++){
			if(!this.audio[i].element.paused){
				this.audio[i].element.volume=this.musicVolume;
			}
		}
	}

	this.setSoundVolume=function(x){
		this.soundVolume=x;
	}

	//Scene stuff
	this.updateSceneInfo=function(engine){
		for(var i=0;i<this.scenes.length;i++){
			this.scenes[i].engine=engine;
			this.scenes[i].updateButtons();
		}
	}
	this.drawButtons=function(){
		if(this.hasScene(this.currentScene)>=0){
			this.scenes[this.currentScene].drawButtons(this.mouse.x,this.mouse.y,1,1);
		}
	}
	this.handleClicks=function(clickConditon){
		if(this.hasScene(this.currentScene)>=0){
			this.scenes[this.currentScene].handleClicks(this.mouse.x,this.mouse.y,1,1,clickConditon);
		}
	}
	this.hasScene=function(sceneNo){
		for(var i=0;i<this.scenes.length;i++){
			if(this.scenes[i].number==sceneNo)
				return i;
		}
		return -1;
	}

	this.back=function(){
		if(this.hasScene(engine.currentScene)>=0){
			engine.currentScene=this.scenes[this.hasScene(engine.currentScene)].parent;
		}
	}

	this.goto=function(sceneNo){
		if(this.hasScene(sceneNo)>=0){
			engine.currentScene=this.hasScene(sceneNo);
		}
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
		if(this.lastMouseUp && !globalBare.mouse.up){
			globalBare.mouse.mouseDown=true;
		} else {
			globalBare.mouse.mouseDown=false;
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

function rectButton(x,y,width,height,onClick,label,drawFunction,onHover){
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
	this.label=label;
	this.buttonColors=["#2E9AFE","#084B8A","white","black"];
	this.engine;
	if(drawFunction===undefined || drawFunction===null){
		drawFunction=function(){
			this.engine.context.fillStyle=this.buttonColors[0];
			this.engine.context.fillRect(this.x,this.y,this.width,this.height);
			this.engine.context.fillStyle=this.buttonColors[1];
			this.engine.context.fillRect(this.x,this.y+this.height-this.height/5,this.width,this.height/5);	
			if(!(this.label===undefined)){
				this.buttonColors[2]===undefined?this.buttonColors[2]="white":this.buttonColors[2]=this.buttonColors[2];
				this.buttonColors[3]===undefined?this.buttonColors[3]="black":this.buttonColors[3]=this.buttonColors[3];
				this.engine.context.fillStyle=this.buttonColors[2];
				this.engine.context.font=this.height/2+"px "+this.engine.font;
				this.engine.context.fillText(this.label,this.x+(this.width-this.engine.context.measureText(this.label).width)/2,this.y+(this.height*2/3));	
				this.engine.context.font=this.engine.fontsize+"px "+this.engine.font;
			}
		}
	}
	this.drawFunction=drawFunction;
	if(onHover===undefined || onHover===null){
		onHover=function(){
			this.engine.context.fillStyle=this.buttonColors[1];
			this.engine.context.fillRect(this.x,this.y,this.width,this.height);
			if(!(this.label===undefined)){
				this.buttonColors[2]===undefined?this.buttonColors[2]="white":this.buttonColors[2]=this.buttonColors[2];
				this.buttonColors[3]===undefined?this.buttonColors[3]="black":this.buttonColors[3]=this.buttonColors[3];
				this.engine.context.fillStyle=this.buttonColors[3];
				this.engine.context.font=this.height/2+"px "+this.engine.font;
				this.engine.context.fillText(this.label,this.x+2+(this.width-this.engine.context.measureText(this.label).width)/2,this.y+2+(this.height*2/3));	
				this.engine.context.fillStyle=this.buttonColors[2];
				this.engine.context.fillText(this.label,this.x+(this.width-this.engine.context.measureText(this.label).width)/2,this.y+(this.height*2/3));	
				this.engine.context.font=this.engine.fontsize+"px "+this.engine.font;
			}
		}
	}
	this.onHover=onHover;
	if(onClick===undefined || onClick===null){
		onClick=function(){
			console.log("Button Clicked");
		}
	}
	this.onClick=onClick;


	this.drawButton=function(x,y,w,h){
		if(x+w > this.x && x < (this.x + this.width) && y+h > this.y && y < (this.y + this.height)){
			this.onHover();
		} else {
			this.drawFunction();
		}
	}
}

function bareScene(sceneNumber,buttons,parent){
	this.number=sceneNumber;
	this.engine;
	this.buttons=buttons;
	if(parent===undefined || parent===null)
		parent=sceneNumber;
	this.parent=parent;
	this.updateButtons=function(){
		for(var i=0;i<this.buttons.length;i++){
			this.buttons[i].engine=this.engine;
		}
	}
	this.drawButtons=function(x,y,w,h){
		for(var i=0;i<this.buttons.length;i++){
			this.buttons[i].drawButton(x,y,w,h);
		}
	}

	this.handleClicks=function(x,y,w,h,Clicked){
		for(var i=this.buttons.length-1;i>-1;i--){
			if(x+w > this.buttons[i].x && x < (this.buttons[i].x + this.buttons[i].width) && y+h > this.buttons[i].y && y < (this.buttons[i].y + this.buttons[i].height) && Clicked){
				engine.scenes[engine.currentScene].buttons[i].onClick();
				return true;
			}
		}	
	}
}