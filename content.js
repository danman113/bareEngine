/*
Current demo showcases:
Loading Music, images, and files seamlessly
Good input handling
Collision
Working music system
*/

var engine=new bareEngine(400,300);
engine.imageUrls=["http://danman113.vacau.com/4041.jpg","http://danman113.vacau.com/4042.jpg","http://danman113.vacau.com/4040.jpg","http://i.imgur.com/0owH9N2.png","http://www.mrsmacs.com.au/assets/main_ingredients/leek-af4d6dbef3b91aa7024c6b9215d768b9.png"]
engine.audioUrls=["http://neveronti.me/Rogue_Psycho/pickup.mp3","http://neveronti.me/Assault_Fury/Necro.mp3","miku.mp3"];
engine.defaultVolume=.25;
var c;
var fcount=0;
var miku={
	x:130,y:-10,w:50,h:50
}
var leeks=[];
function init(){
	engine.init(document.body);
	c=engine.context;
}

function disp(){
	fcount++;
	engine.mouseManager();
	switch(engine.currentScene){
		case -1:
			if(engine.imagesLoaded()+engine.audioLoaded()>=engine.totalImages+engine.totalAudio)
				engine.currentScene=0;
			c.fillStyle="grey";
			c.fillRect(10,50,100,40);
			c.fillStyle="red";
			c.fillRect(10,50,100*((engine.imagesLoaded()+engine.audioLoaded())/(engine.totalImages+engine.totalAudio)),40);
			c.fillStyle="black";
			c.fillText((engine.imagesLoaded()+engine.audioLoaded())+"/"+(engine.totalImages+engine.totalAudio)+" Assets Loaded",15,60);
		break;
		case 0:
			c.clearRect(0,0,engine.width,engine.height);
			engine.audio[1].element.paused?c.fillStyle="black":c.fillStyle="red";
			c.fillRect(10,10,10,10);
			c.fillStyle="black";
			c.fillText("< Click here for music",22,18);
			if(engine.rectCollision(engine.mouse.x,engine.mouse.y,1,1,10,10,10,10) && engine.mouse.mouseUp){
				if(engine.audio[1].element.paused)
					engine.audio[1].play();
				else
					engine.audio[1].stop();
			}
			c.fillText("Map data: ", 30,30);
			for(var i=0;i<mapdata.length;i++){
				c.fillText(mapdata[i],80+i*5,30);
			}
			for(var i=0;i<engine.images.length;i++){
				c.drawImage(engine.images[i],0+i*42,75,40,40);
			}
			
			if(engine.mouse.mouseUp){
				engine.audio[0].play();
			}
			if(38 in engine.keys)
				miku.y-=1;
			if(40 in engine.keys)
				miku.y+=1;
			if(37 in engine.keys)
				miku.x-=1;
			if(39 in engine.keys)
				miku.x+=1;
			if(!engine.mouse.up){
				if(fcount%20==0){
					var ydiff=engine.mouse.y-(miku.y+miku.h/2);
					var xdiff=engine.mouse.x-(miku.x+miku.w/2);
					var rot=Math.atan2(ydiff,xdiff)*(180/Math.PI);
					leeks.push([miku.x+miku.w/2,miku.y+miku.h/2,rot]);
				}
			}
			if(77 in engine.keys)
				audioMute();
			if(engine.rectCollision(engine.mouse.x,engine.mouse.y,1,1,miku.x,miku.y,miku.w,miku.h) && engine.mouse.mouseUp){
				if(engine.audio[2].element.paused)
					engine.audio[2].play();
				else
					engine.audio[2].stop();
			}
			updateLeeks();
			c.drawImage(engine.images[3],miku.x,miku.y,miku.w,miku.h);
			drawLeeks();
		break;
	}
	window.requestAnimationFrame(disp);
}

function audioMute(){
	for(var i=0;i<engine.audio.length;i++){
		engine.audio[i].stop();
	}
}

function drawLeeks(){
	for(var i=0;i<leeks.length;i++){
		c.drawImage(engine.images[4],leeks[i][0],leeks[i][1],20,20);
	}
}

function updateLeeks(){
	for(var i=0;i<leeks.length;i++){
		var speed=2;
		var rot=leeks[i][2];
		var xvel=Math.cos(degToRads(rot))*speed;
		var yvel=Math.sin(degToRads(rot))*speed;
		leeks[i][0]+=xvel;
		leeks[i][1]+=yvel;
	}
}

function degToRads(degs){
	return degs*Math.PI/180;
}