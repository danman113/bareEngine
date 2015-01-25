/*
Current demo showcases:
Loading Music, images, and files seamlessly
Good input handling
Collision
Working music system
*/

var engine=new bareEngine(400,300);
engine.imageUrls=["http://danman113.vacau.com/4041.jpg","http://danman113.vacau.com/4042.jpg","http://danman113.vacau.com/4040.jpg"]
engine.audioUrls=["http://neveronti.me/Rogue_Psycho/pickup.mp3","http://neveronti.me/Assault_Fury/Necro.mp3"];
engine.defaultVolume=.25;
var c;
var fcount=0;
function init(){
	engine.init(document.body);
	c=engine.context;
}

function draw(){
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
			
		break;
	}
	requestAnimationFrame(draw);
}
