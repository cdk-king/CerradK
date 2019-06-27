var plant = {
    list:{
        "grass":{
            name:"grass",
            isSheet:true,
            sheetName:"Tiles_3",
            sheetX:0,
            sheetY:0,
            styleCount:6,
            x:0,
            y:0,
            width:16,
            height:16,
            pixelWidth:16,
            pixelHeight:16,
            baseWidth:16,
            baseHeight:16,
            pixelOffsetX:0,
            pixelOffsetY:0,
            buildableGrid:[
                [0]
            ],
            passableGrid:[
                [0]
            ],
            spriteImages:[
                {name:"default",count:1}
            ],
        },
        "flower":{
            name:"flower",
            isSheet:true,
            sheetName:"Tiles_3",
            sheetX:96,
            sheetY:0,
            styleCount:16,
            x:0,
            y:0,
            width:16,
            height:16,
            pixelWidth:16,
            pixelHeight:16,
            baseWidth:16,
            baseHeight:16,
            pixelOffsetX:0,
            pixelOffsetY:0,
            buildableGrid:[
                [0]
            ],
            passableGrid:[
                [0]
            ],
            spriteImages:[
                {name:"default",count:1}
            ],
        },
        
    },
    defaults:{
        type:"plant",
        animationIndex:0,
        action:"default",
        selected:false,
        selectable:false,
        visible:true,
        opacity:1,
        animate:function(){
            switch (this.action){
                case "default":
                    this.imageList = this.spriteArray["default"];
                    this.imageOffset = this.imageList.offset + this.animationIndex;
                    this.animationIndex++;
                    if(this.animationIndex>=this.imageList.count){
                        this.animationIndex = 0;
                    }
                    break;
            }
        },
        draw:function(){
            var x = (this.x*game.gridSize)-game.offsetX;
            var y = (this.y*game.gridSize)-game.offsetY;
            var colorOffset = 0;
            if(this.isSheet){
                game.foregroundContext.drawImage(this.spriteSheet,this.sheetX,this.sheetY,
                    this.pixelWidth,this.pixelHeight,x,y,this.pixelWidth,this.pixelHeight);
            }else{
                game.foregroundContext.drawImage(this.spriteSheet,this.imageOffset*this.pixelWidth,colorOffset,
                    this.pixelWidth,this.pixelHeight,x,y,this.pixelWidth,this.pixelHeight);
            }
            
        }
    },
    load:loadItem,
    add:addItem,
}