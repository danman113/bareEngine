/*
Current demo showcases:
Loading Music, images, and files seamlessly
Good input handling
Collision
Working music system
Button Engine
*/
var engine=new bareEngine(400,300);
engine.imageUrls=["http://danman113.vacau.com/4041.jpg",
				"http://danman113.vacau.com/4042.jpg",
				"http://danman113.vacau.com/4040.jpg",
				"http://fc08.deviantart.net/fs71/f/2010/017/a/d/Hatsune_Miku_Icon_by_KagamineStar.gif",
				"http://www.mrsmacs.com.au/assets/main_ingredients/leek-af4d6dbef3b91aa7024c6b9215d768b9.png"
				];

engine.audioUrls=["http://neveronti.me/Rogue_Psycho/click.mp3",
					"http://neveronti.me/HS15/modal.mp3",
					"http://neveronti.me/HS15/miku.mp3"
					];

engine.masterVolume=.25;
var c;
var fcount=0;
var miku={
	x:130,y:-10,w:50,h:50
}
var leeks=[];
function init(){
	engine.init(document.body);
	c=engine.context;
	canvas.style.border="1px solid black"
	engine.scenes=[new bareScene(0,[new rectButton(20,20,50,40,function(){
				if(engine.audio[1].element.paused){
					engine.audio[1].play(engine.defaultMusicVolume());
					engine.scenes[0].buttons[0].buttonColors=["red","darkred"];
				} else{
					engine.audio[1].stop();
					engine.scenes[0].buttons[0].buttonColors=["#2E9AFE","#084B8A"];
				}},String.fromCharCode(parseInt("266A",16)))
								,new rectButton(200,20,120,100,function(){engine.goto(1);},String.fromCharCode(parseInt("262F",16)))])

				,new bareScene(1,[new rectButton((engine.width-200)/2,50,200,60,function(){engine.goto(0)},"Play Game"),
								new rectButton((engine.width-200)/2,150,200,60,function(){engine.goto(2);},"Options")
								],0)

				, new bareScene(2,[new rectButton((engine.width-200)/2,20,200,60,function(){engine.masterVolume=(engine.mouse.x-this.x)/this.width;engine.masterVolume>.94?engine.masterVolume=1:engine.masterVolume=engine.masterVolume;},"Volume",function(){bar(this.x,this.y,this.width,this.height,engine.masterVolume,1);},function(){bar(this.x,this.y,this.width,this.height,engine.masterVolume,1);c.fillStyle="white",c.fillRect(this.x+this.width*engine.masterVolume-2,this.y,4,this.height)})
								,new rectButton((engine.width-200)/2,100,200,60,function(){engine.musicVolume=(engine.mouse.x-this.x)/this.width;engine.musicVolume>.94?engine.musicVolume=1:engine.musicVolume=engine.musicVolume;},"Volume",function(){bar(this.x,this.y,this.width,this.height,engine.musicVolume,1);},function(){bar(this.x,this.y,this.width,this.height,engine.musicVolume,1);c.fillStyle="white",c.fillRect(this.x+this.width*engine.musicVolume-2,this.y,4,this.height)})
								,new rectButton((engine.width-200)/2,180,200,60,function(){engine.soundVolume=(engine.mouse.x-this.x)/this.width;engine.soundVolume>.94?engine.soundVolume=1:engine.soundVolume=engine.soundVolume;},"Volume",function(){bar(this.x,this.y,this.width,this.height,engine.soundVolume,1);},function(){bar(this.x,this.y,this.width,this.height,engine.soundVolume,1);c.fillStyle="white",c.fillRect(this.x+this.width*engine.soundVolume-2,this.y,4,this.height)})
								,new rectButton((engine.width-200)/2+50,250,100,40,function(){engine.goto(1);},"Back")

									],1)
				];
	engine.updateSceneInfo(engine);
	engine.addScrollbar(0,500,300,null);
}

function bar(x,y,w,h,u1,u2,color,bgcolor){
	if(color==undefined)
		color='red';
	if(bgcolor==undefined)
		bgcolor='grey'
	c.fillStyle=bgcolor;
	c.fillRect(x,y,w,h);
	c.fillStyle=color;
	c.fillRect(x,y,w*(u1/u2),h);
}

function disp(){
	update();
	draw();
	window.requestAnimationFrame(disp);
}
function draw(){
	fcount++;
	switch(engine.currentScene){
		case -1:
			c.fillStyle="grey";
			c.fillRect(10,50,100,40);
			c.fillStyle="red";
			c.fillRect(10,50,100*((engine.imagesLoaded()+engine.audioLoaded())/(engine.totalImages+engine.totalAudio)),40);
			c.fillStyle="black";
			c.fillText((engine.imagesLoaded()+engine.audioLoaded())+"/"+(engine.totalImages+engine.totalAudio)+" Assets Loaded",15,60);
		break;
		case 0:
			c.clearRect(0,0,engine.width,engine.height);
			c.fillStyle="black";
			c.fillText("\\/ Click here for music",22,18);
			c.fillText("Map data: ", 30,130);
			for(var i=0;i<mapdata.length;i++){
				c.fillText(mapdata[i],80+i*5,130);
			}
			for(var i=0;i<engine.images.length;i++){
				c.drawImage(engine.images[i],0+i*42,75,40,40);
			}

			engine.drawButtons();
			
			//c.fillRect(miku.x,miku.y,miku.w,miku.h);
			
			c.drawImage(engine.images[3],miku.x,miku.y,miku.w,miku.h);
			
			drawLeeks();
			engine.scrollbars[0].scroll(engine.mouse.x,engine.mouse.y,!engine.mouse.up,0,0,10,300)
			engine.scrollbars[0].draw(0,0,10,300);
			
		break;
		case 1:
			c.clearRect(0,0,engine.width,engine.height);
			engine.drawButtons();
		break;
		case 2:
			c.clearRect(0,0,engine.width,engine.height);
			c.fillStyle="black";
			c.font=(engine.fontsize*1.2)+"px "+engine.font;
			c.fillText("Master Volume",10,55);
			c.fillText("Music Volume",10,135);
			c.fillText("Sound Volume",10,215);
			engine.drawButtons();
		break;
	}
}
function hi(){
	console.log(this.label);
}
function update(){
	engine.mouseManager();
	switch(engine.currentScene){
	case -1:
		if(engine.imagesLoaded()+engine.audioLoaded()>=engine.totalImages+engine.totalAudio)
				engine.currentScene=0;
	break;
	case 0:
		engine.audio[1].element.volume=soundDist(engine.scenes[0].buttons[0].x+engine.scenes[0].buttons[0].width/2,engine.scenes[0].buttons[0].y+engine.scenes[0].buttons[0].height/2);
		if(engine.mouse.mouseUp){
			engine.audio[0].play(engine.defaultSoundVolume());
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
				engine.audio[2].play(engine.defaultMusicVolume());
			else
				engine.audio[2].stop();
		}
		updateLeeks();
		engine.handleClicks(engine.mouse.mouseUp);
	break;
	case 1:
		engine.handleClicks(engine.mouse.mouseUp);
		if(engine.mouse.mouseUp)
			engine.audio[0].play(engine.defaultSoundVolume());
	break;
	case 2:
		engine.handleClicks(!engine.mouse.up);
		if(engine.mouse.mouseUp)
			engine.audio[0].play(engine.defaultSoundVolume());

	break;
	}
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

function soundDist(x,y,distance,dampener){
	if(distance===undefined)
		distance=400;
	if(dampener===undefined)
		dampener=(1/10);
	var dist=1-Math.abs(Math.sqrt((x-miku.x)*(x-miku.x)+(y-miku.y)*(y-miku.y))/distance);
	dist*=dampener;
	if(dist<0)
		dist=0;
	return dist;
}