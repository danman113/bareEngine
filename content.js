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
			if(globalBare.imagesLoaded+globalBare.audioLoaded>=engine.totalImages+engine.totalAudio)
				engine.currentScene=0;
			c.fillStyle="grey";
			c.fillRect(10,50,100,40);
			c.fillStyle="red";
			c.fillRect(10,50,100*((globalBare.imagesLoaded+globalBare.audioLoaded)/(engine.totalImages+engine.totalAudio)),40);
			c.fillStyle="black";
			c.fillText((globalBare.imagesLoaded+globalBare.audioLoaded)+"/"+(engine.totalImages+engine.totalAudio)+" Assets Loaded",15,60);
		break;
		case 0:
			c.clearRect(0,0,engine.width,engine.height);
			engine.audio[1].element.paused?c.fillStyle="black":c.fillStyle="red";
			c.fillRect(10,10,10,10);
			c.fillStyle="black";
			c.fillText("< Click here for music",22,18);
			if(engine.rectCollision(globalBare.mouse.x,globalBare.mouse.y,1,1,10,10,10,10) && globalBare.mouseUp){
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
			
			if(!globalBare.mouse.up){
				engine.audio[0].play();
			}
			if(38 in globalBare.keys)
				miku.y-=1;
			if(40 in globalBare.keys)
				miku.y+=1;
			if(37 in globalBare.keys)
				miku.x-=1;
			if(39 in globalBare.keys)
				miku.x+=1;
			if(32 in globalBare.keys){
				if(fcount%20==0)
				leeks.push([miku.x+miku.w,miku.y+10]);
			}
			if(77 in globalBare.keys)
				audioMute();
			if(engine.rectCollision(globalBare.mouse.x,globalBare.mouse.y,1,1,miku.x,miku.y,miku.w,miku.h) && globalBare.mouseUp){
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
		c.drawImage(engine.images[4],leeks[i][0],leeks[i][1],30,30);
	}
}

function updateLeeks(){
	for(var i=0;i<leeks.length;i++){
		leeks[i][0]+=2;
	}
}