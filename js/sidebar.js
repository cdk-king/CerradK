var sidebar = {
    canvas:document.createElement("canvas"),
    init:function(){
        //设置fog canvas的尺寸为地图大小
        this.canvas.width = game.canvasWidth;
        this.canvas.height = game.canvasWidth;

        this.context = this.canvas.getContext("2d");
    },
    animate:function(){
        
    },
    draw:function(){
        //这段代码会无限消耗资源，有bug
        this.context.clearRect(0,0,game.canvasWidth,game.canvasHeight);
        this.drawToolBar();
        game.foregroundContext.drawImage(this.canvas,0,0,
        game.canvasWidth,game.canvasHeight,0,0,game.canvasWidth,game.canvasHeight);
    },
    drawToolBar:function(){
        //
        this.context.fillStyle = "rgba(0,0,0,0.7)";
        this.context.beginPath();
        this.context.rect(100,100,100,100);
        this.context.fill();
    }
}