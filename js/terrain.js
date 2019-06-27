var terrain = {
    list:{
        "soil":{
            name:"soil",
            isSheet:true,
            sheetName:"ground",
            sheetX:16,
            sheetY:16,
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
                [1]
            ],
            passableGrid:[
                [1]
            ],
            spriteImages:[
                {name:"default",count:1}
            ],
        },
        "soil0":{
            name:"soil0",
            isSheet:true,
            sheetName:"Tiles_0",
            sheetX:0,
            sheetY:0,
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
                [1]
            ],
            passableGrid:[
                [1]
            ],
            spriteImages:[
                {name:"default",count:1}
            ],
        },
        "soil1":{
            name:"soil1",
            isSheet:true,
            sheetName:"Tiles_1",
            sheetX:0,
            sheetY:0,
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
                [1]
            ],
            passableGrid:[
                [1]
            ],
            spriteImages:[
                {name:"default",count:1}
            ],
        },
        "soil2":{
            name:"soil2",
            isSheet:true,
            sheetName:"Tiles_2",
            sheetX:0,
            sheetY:0,
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
                [1]
            ],
            passableGrid:[
                [1]
            ],
            spriteImages:[
                {name:"default",count:1}
            ],
        },
    },
    defaults:{
        type:"terrain",
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
    justTopHasTerrainItem:function(item){
        var x = item.x;
        var y = item.y-1;
        for(var i = 0;i<game.terrain.length;i++){
            var item = game.terrain[i];
            if(item.x==x && item.y==y){
                return item;
            }
        }
        return null;
    },
    justLeftHasTerrainItem:function(item){
        var x = item.x-1;
        var y = item.y;
        for(var i = 0;i<game.terrain.length;i++){
            var item = game.terrain[i];
            if(item.x==x && item.y==y){
                return item;
            }
        }
        return null;
    },
    justRightHasTerrainItem:function(item){
        var x = item.x+1;
        var y = item.y;
        for(var i = 0;i<game.terrain.length;i++){
            var item = game.terrain[i];
            if(item.x==x && item.y==y){
                return item;
            }
        }
        return null;
    },
    justBottomHasTerrainItem:function(item){
        var x = item.x;
        var y = item.y+1;
        for(var i = 0;i<game.terrain.length;i++){
            var item = game.terrain[i];
            if(item.x==x && item.y==y){
                return item;
            }
        }
        return null;
    },
}