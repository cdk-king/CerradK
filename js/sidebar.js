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
        this.context.clearRect(0,0,game.canvasWidth,game.canvasHeight);
        if(sidebar.showToolBar){
            
            this.drawToolBar();
            game.foregroundContext.drawImage(this.canvas,0,0,
            game.canvasWidth,game.canvasHeight,0,0,game.canvasWidth,game.canvasHeight);
        }
    },
    showToolBar:true,
    toolBarX:180,
    toolBarY:440,
    toolBarWidth:280,
    toolBarHeight:32,
    drawToolBar:function(){
        //
        this.context.fillStyle = "rgba(255,255,255,0.5)";
        this.context.beginPath();
        this.context.rect(sidebar.toolBarX,sidebar.toolBarY,sidebar.toolBarWidth,sidebar.toolBarHeight);
        this.context.fill();
    },
    itemName:"soil2",
    createItem:function(x,y){
        var detail =  {"type":"terrain","name":sidebar.itemName,x:300,y:416,"life":10};
        detail.x = x;
        detail.y = y;
        var item = game.addItem(detail);
        game.currentMapTerrainGrid[x][y] = item.uid;
        resetAllTerrainStyle();
    }
}