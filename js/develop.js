var develop = {
    grid:[],
    canvas:document.createElement("canvas"),
    init:function(){
        this.grid = game.currentMapTerrainGrid;
        //设置fog canvas的尺寸为地图大小
        this.canvas.width = game.canvasWidth;
        this.canvas.height = game.canvasWidth;

        this.context = this.canvas.getContext("2d");
    },
    drawTerrainGrid:function(){
        this.context.fillStyle = "rgba(0,0,0,0.7)";
        for(var i = -50;i<game.currentMapTerrainGrid.length;i++){
            var grid = game.currentMapTerrainGrid[i];
            for(var j = 0;j<grid.length;j++){
                if(game.currentMapTerrainGrid[i][j]==0){
                    //this.context.rect(i*game.gridSize,j*game.gridSize,game.gridSize,game.gridSize);
                }else{
                    this.context.rect(i*game.gridSize-game.offsetX,j*game.gridSize-game.offsetY,game.gridSize,game.gridSize);
                }
            }
        }
        this.context.fill();
    },
    drawHeroSight:function(){
        var item = game.hero[0];
        
        this.context.globalCompositeOperation = "destination-out";
        var rg = this.context.createRadialGradient(item.x*game.gridSize+item.pixelWidth/2,item.y*game.gridSize+item.pixelHeight/2, 0, item.x*game.gridSize+item.pixelWidth/2,item.y*game.gridSize+item.pixelHeight/2, item.sight*game.gridSize);      
        rg.addColorStop(0, 'rgba(0,0,0,128)');      
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        this.context.fillStyle = rg;
        //this.context.fillStyle = "rgba(255,255,255,0.5)";
        this.context.beginPath();
        this.context.arc(item.x*game.gridSize+item.pixelWidth/2,item.y*game.gridSize+item.pixelHeight/2,item.sight*game.gridSize,0,2*Math.PI,false);
        this.context.fill();
        this.context.globalCompositeOperation = "source-over";
    },
    animate:function(){
        this.context.clearRect(0,0,game.canvasWidth,game.canvasHeight);
        ////迷雾使用半透明的黑色填充
        //this.context.fillStyle = "rgba(0,0,0,0.5)";
        //this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.drawTerrainGrid();
        this.drawHeroSight();
        
    },
    draw:function(){
        game.foregroundContext.drawImage(this.canvas,0,0,
        game.canvasWidth,game.canvasHeight,0,0,game.canvasWidth,game.canvasHeight);
    }

}