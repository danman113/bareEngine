/*
Todo:
Touch emulation
Better onkeyup stuff
*/

var globalBare={
	imagesLoaded:0,audioLoaded:0,mouse:{x:0,y:0,up:true,hover:-1,mouseUp:false,mouseDown:false},keys:new Object,lastKey:0
}
function bareEngine(width,height){
	//Engine information
	this.version=0.85;
	//Options
	this.masterVolume=0.5;
	this.soundVolume=1;
	this.musicVolume=1;
	this.fontsize=10;
	this.font="arial";
	this.rightClick=false;
	this.preventKeyDefaults=true;
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
	this.keybindings=[];
	//Scene
	this.currentScene=-1;
	this.scenes=[];
	this.scrollbars=[];
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
		globalBare.keybindings=this.keybindings;
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		this.canvas.addEventListener('mouseout', this.mouseOut, false);
		if(!this.rightClick)
			document.addEventListener('contextmenu', this.onRightClick, false);
		window.addEventListener("keydown", this.onKeyDown, false);
		window.addEventListener("keyup", this.onKeyUp, false);
		if(this.preventKeyDefaults)
			window.addEventListener("keydown", this.prevent, false);
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
		if(typeof onMouseUp=="function")
			onMouseUp(e);
		this.keys=new Object();
	}

	this.mouseDown=function(e){
		globalBare.mouse.up=false;
		if(typeof onMouseDown=="function")
			onMouseDown(e);

	}

	this.onRightClick=function(e){
		if(typeof onRightClick=="function")
			onRightClick(e);
		e.preventDefault();
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
		if(typeof onMouseOut=="function")
			onMouseOut(e);
	}

	this.onKeyDown=function(e){
		globalBare.keys[e.keyCode] = true;
		globalBare.lastkey=e.keyCode;
		if(typeof onKeyDown=="function")
			onKeyDown(e);
	}
	this.prevent=function(e){
		var keys=[];
		for(var i=0;i<globalBare.keybindings.length;i++){
			keys.push(globalBare.keybindings[i].primary);
			keys.push(globalBare.keybindings[i].secondary);
		}
		if(keys.indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}

	this.onKeyUp=function(e){
		if(typeof onKeyUp=="function")
			onKeyUp(e);
		delete globalBare.keys[e.keyCode];
	}

	this.findKey=function(label){
		for(var i=0;i<this.keybindings.length;i++){
			if(this.keybindings[i].label==label)
				return i;
		}
		return -1;
	}

	this.rebind=function(label,primary,secondary){
		var k=this.findKey(label);
		if(k>=0){
			if(primary===undefined || primary===null)
				primary=this.keybindings[k].primary;
			if(secondary===undefined || secondary===null)
				secondary=this.keybindings[k].secondary;
			for(var i=0;i<this.keybindings.length;i++){
				if(i!=k && this.keybindings[i].primary==primary)
					this.keybindings[i].primary=this.keybindings[k].primary;
				if(i!=k && this.keybindings[i].secondary==secondary)
					this.keybindings[i].secondary=this.keybindings[k].secondary;
			}
			this.keybindings[k].primary=primary;
			this.keybindings[k].secondary=secondary;
		} 
	}
	this.addScrollbar=function(top,maxHeight,screenHeight,sideways){
		this.scrollbars.push(new bareScrollbar(top,maxHeight,screenHeight,sideways,this.context));
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
		console.error(this.errorMessage+message);
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
	this.child;
	this.play=function(volume,multiple){
		if(volume!==undefined && this.element.volume!=volume)
			this.element.volume=volume;
		if(multiple===undefined || multiple===null)
			multiple=false;
		if(multiple){
			if(this.element.paused)
				this.element.play();
			else{
				if(this.child===undefined){
					this.child=new audioFile(this.src);
					this.child.element=document.createElement('audio');
					this.child.element.src=this.child.src;
					this.child.element.volume=this.element.volume;
					console.log("Created new audio element " + this.src);
				}
				this.child.play(this.element.volume,multiple);
			}
		} else {
			this.element.play();
		}
		
		
	}
	this.stop=function(){
		this.element.pause();
		try{
		this.element.currentTime = 0;
		} catch(e){
			console.log(e);
		}
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
	this.offsetX=0;
	this.offsetY=0;
	if(drawFunction===undefined || drawFunction===null){
		drawFunction=function(){
			this.engine.context.fillStyle=this.buttonColors[0];
			this.engine.context.fillRect(this.x+this.offsetX,this.y+this.offsetY,this.width,this.height);
			this.engine.context.fillStyle=this.buttonColors[1];
			this.engine.context.fillRect(this.x+this.offsetX,this.y+this.offsetY+this.height-this.height/5,this.width,this.height/5);	
			if(!(this.label===undefined)){
				this.buttonColors[2]===undefined?this.buttonColors[2]="white":this.buttonColors[2]=this.buttonColors[2];
				this.buttonColors[3]===undefined?this.buttonColors[3]="black":this.buttonColors[3]=this.buttonColors[3];
				this.engine.context.fillStyle=this.buttonColors[2];
				this.engine.context.font=this.height/2+"px "+this.engine.font;
				this.engine.context.fillText(this.label,this.x+(this.width-this.engine.context.measureText(this.label).width)/2+this.offsetX,this.y+this.offsetY+(this.height*2/3));	
				this.engine.context.font=this.engine.fontsize+"px "+this.engine.font;
			}
		}
	}
	this.drawFunction=drawFunction;
	if(onHover===undefined || onHover===null){
		onHover=function(){
			this.engine.context.fillStyle=this.buttonColors[1];
			this.engine.context.fillRect(this.x+this.offsetX,this.y+this.offsetY,this.width,this.height);
			if(!(this.label===undefined)){
				this.buttonColors[2]===undefined?this.buttonColors[2]="white":this.buttonColors[2]=this.buttonColors[2];
				this.buttonColors[3]===undefined?this.buttonColors[3]="black":this.buttonColors[3]=this.buttonColors[3];
				this.engine.context.fillStyle=this.buttonColors[3];
				this.engine.context.font=this.height/2+"px "+this.engine.font;
				this.engine.context.fillText(this.label,this.x+this.offsetX+2+(this.width-this.engine.context.measureText(this.label).width)/2,this.y+2+(this.height*2/3)+this.offsetY);	
				this.engine.context.fillStyle=this.buttonColors[2];
				this.engine.context.fillText(this.label,this.x+this.offsetX+(this.width-this.engine.context.measureText(this.label).width)/2,this.y+(this.height*2/3)+this.offsetY);	
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
		if(x+w > this.x+this.offsetX && x < (this.x + this.width)+this.offsetX && y+h > this.y+this.offsetY && y < (this.y + this.height)+this.offsetY){
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
			if(x+w > (this.buttons[i].x + this.buttons[i].offsetX) && x < ((this.buttons[i].x + this.buttons[i].width) + this.buttons[i].offsetX) && y+h > this.buttons[i].y + this.buttons[i].offsetY && y < (this.buttons[i].y + this.buttons[i].height) + this.buttons[i].offsetY && Clicked){
				engine.scenes[engine.currentScene].buttons[i].onClick();
				return true;
			}
		}	
	}
}

function bareKey(label,primary,secondary){
	this.label=label;
	this.primary=primary;
	this.secondary=secondary;
}


function bareScrollbar(top,maxHeight,screenHeight,sideways,context2D){
	this.top=top;
	this.maxHeight=maxHeight;
	this.screenHeight=screenHeight;
	this.scrollbarHeight=this.screenHeight/this.maxHeight;
	this.scrollbarOffset=this.top/this.maxHeight;
	//Draggable scrollbar information
	this.lastX=-1;
	this.lastY=-1;
	this.lastTop=top;
	this.dragging=false;
	if(sideways===undefined || sideways===null)
		sideways=false
	if(context2D===undefined || context2D===null){
		if(typeof c =="object"){
			if(c.canvas!==undefined && c.canvas!==null)
			context2D=c;	
		}
		if((context2D===undefined || context2D===null) && typeof ctx =="object"){
			if(ctx.canvas!==undefined && ctx.canvas!==null)
			context2D=ctx;	
		}
		if((context2D===undefined || context2D===null) && typeof context =="object"){
			if(context.canvas!==undefined && context.canvas!==null)
			context2D=context;	
		}
		if((context2D===undefined || context2D===null)){
			console.error("Scrollbar: could not find context. Draw Method may not work.");
		}
		
	}
	this.context=context2D;
	this.sideways=sideways;
	this.draw=function(x,y,width,height,bgFuction,barFunction){
		this.context.fillStyle="grey";
		if(bgFuction===undefined || bgFuction===null)
			this.context.fillRect(x,y,this.sideways?height:width,this.sideways?width:height);
		else{
			if(typeof bgFuction=="function")
				bgFuction(x,y,this.sideways?height:width,this.sideways?width:height);
		}

		this.context.fillStyle="black";
		if(this.maxHeight<this.screenHeight){
			if(barFunction===undefined || barFunction===null)
			this.context.fillRect(x,y,this.sideways?1*height:width,this.sideways?width:1*height);
			else{
				if(typeof barFunction=="function")
					barFunction(x,y,this.sideways?height:width,this.sideways?width:height);
			}
		} else {
			if(barFunction===undefined || barFunction===null)
			this.context.fillRect(this.sideways?(x+(height*this.scrollbarOffset)):x,this.sideways?y:y+(height*this.scrollbarOffset),this.sideways?this.scrollbarHeight*height:width,this.sideways?width:this.scrollbarHeight*height);
			else{
				if(typeof barFunction=="function")
					barFunction(this.sideways?(x+(height*this.scrollbarOffset)):x,this.sideways?y:y+(height*this.scrollbarOffset),this.sideways?this.scrollbarHeight*height:width,this.sideways?width:this.scrollbarHeight*height);
			}
		}
	}
	this.update=function(top,maxHeight,screenHeight){
		if(screenHeight!==undefined && screenHeight!==null)
			this.screenHeight=screenHeight;
		if(maxHeight!==undefined && maxHeight!==null)
			this.maxHeight=maxHeight;
		if(top!==undefined && top!==null){
			if(top<0)
				this.top=0;
			else if(!(top>(this.maxHeight-this.screenHeight)))
				this.top=top;
			else 
				this.top=this.maxHeight-this.screenHeight
		}
		this.scrollbarHeight=this.screenHeight/this.maxHeight;
		this.scrollbarOffset=this.top/this.maxHeight
	}
	this.getOffset=function(){
		return (-1*this.scrollbarOffset*this.maxHeight);
	}

	this.scroll=function(mouseX,mouseY,clicked,x,y,width,height){
		var xbar=this.sideways?(x+(height*this.scrollbarOffset)):x;
		var ybar=this.sideways?y:y+(height*this.scrollbarOffset);
		var wbar=this.sideways?this.scrollbarHeight*height:width;
		var hbar=this.sideways?width:this.scrollbarHeight*height;
		var bgbarW=this.sideways?height:width
		var bgbarH=this.sideways?width:height
		if(clicked){
			if(collision(mouseX,mouseY,1,1,xbar,ybar,wbar,hbar)){
				this.dragging=true;	
			} else if (collision(mouseX,mouseY,1,1,x,y,((this.sideways?this.scrollbarOffset:1)*bgbarW),(this.sideways?1:this.scrollbarOffset)*bgbarH)){
				this.update(this.top - 2);
				this.lastTop=this.top;
				this.lastX=mouseX;
				this.lastY=mouseY;
			} else if (collision(mouseX,mouseY,1,1,x,y,bgbarW,bgbarH)){
				this.update(this.top + 2);
				this.lastTop=this.top;
				this.lastX=mouseX;
				this.lastY=mouseY;
			}
			if(this.dragging && !(this.maxHeight<this.screenHeight)){
				var dist=this.sideways?this.lastX-mouseX:this.lastY-mouseY;
				if(this.lastX>-1 && this.lastY>-1)
				this.update(this.lastTop+(((dist)/height)*(-1)*this.maxHeight));
			}
		} else {
			this.dragging=false;
			if(collision(mouseX,mouseY,1,1,xbar,ybar,wbar,hbar)){
				this.lastX=mouseX;
				this.lastY=mouseY;
				this.lastTop=this.top;
			}
		}
	}
	
	var collision=function (rect1x, rect1y, rect1w, rect1h, rect2x, rect2y, rect2w, rect2h){
		return rect1x+rect1w > rect2x && rect1x < (rect2x + rect2w) && rect1y+rect1h > rect2y && rect1y < (rect2y + rect2h);
	}
}
