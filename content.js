var imageUrls=["http://danman113.vacau.com/4041.jpg","http://danman113.vacau.com/4042.jpg","http://danman113.vacau.com/4040.jpg"]
var bareEngine=new engine(400,300);

var c;
function init(){
	bareEngine.init();
	c=bareEngine.context;
}

function draw(){
	c.clearRect(0,0,bareEngine.width,bareEngine.height);
	c.fillRect(10,10,10,10);
	c.fillText("Map data: ", 30,30);
	for(var i=0;i<mapdata.length;i++){
		c.fillText(mapdata[i],80+i*5,30);
	}
	for(var i=0;i<bareEngine.images.length;i++){
		c.drawImage(bareEngine.images[i],0+i*42,75,40,40);
	}
	requestAnimationFrame(draw);
}