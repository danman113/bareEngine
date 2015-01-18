var imageUrls=["http://danman113.vacau.com/4041.jpg","http://danman113.vacau.com/4042.jpg","http://danman113.vacau.com/4040.jpg"]
function disp(){
	c.clearRect(0,0,width,height);
	c.fillRect(10,10,10,10);
	c.fillText("Map data: ", 30,30);
	for(var i=0;i<mapdata.length;i++){
		c.fillText(mapdata[i],80+i*5,30);
	}
	for(var i=0;i<images.length;i++){
		c.drawImage(images[i],0+i*42,75,40,40);
	}
	
	disploop=requestAnimationFrame(disp);
}
