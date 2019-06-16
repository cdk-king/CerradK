var hero = {
    list:{
        "cdk":{
            name:"cdk",
            canAttack:true,
            canAttackLand:true,
            canAttackAir:true,
            weaponType:"赤手空拳",
            //weaponType:"rocket",

            isSheet:true,
            sheetName:"桐人",

            x:0,
            y:0,
            
            width:32,
            height:47,
            
            pixelWidth:32,
            pixelHeight:47,
            pixelOffsetX:0,
            pixelOffsetY:0,

            radius:18,
            sight:6,
            cost:900,
            hitPoints:100,
            speed:25,
            turnSpeed:4,
            pixelShadowHeight:40,
            spriteImages:[
                //{name:"stand",count:1,directions:2},
                //{name:"run",count:9,directions:2}
                {name:"run",count:4,directions:2} 
            ],
        },
    },
    defaults:{
        type:"hero",
        animationIndex:0,
        direction:1,
        directions:2,
        imageOffset:2,
        action:"stand",
        selected:false,
        selectable:true,
        visible:true,
        opacity:1,
        velocityX:0,
        velocityY:0,
        behaviors:[],
        lastAdvanceTime:0,
        orders:{
            type:"stand"
        },
        animate:function(){
            //生命值大于40%的单位
            if(this.life>this.hitPoints*0.4){
                this.lifeCode = "healthy";
            }else if(this.life<=0){
                this.lifeCode = "dead";
                game.remove(this);
                return;
            }else{
                this.lifeCode = "damaged";
            }

            //设置imageOffset
            if(this.lastAdvanceTime==0){
                this.lastAdvanceTime = new Date().getTime();
            }
            if(this.running){
                var now = new Date().getTime();
                if(now-this.lastAdvanceTime > 100){
                    this.imageOffset++;
                    if(this.imageOffset>=this.spriteImages[0].count){
                        this.imageOffset=0;
                    }
                    //console.log(this.imageOffset);
                    this.lastAdvanceTime = now;
                }
                
            }else{
                this.imageOffset =  0;
            }
        },
        draw:function(){
            var x = 300;
            var y = 370;

            this.drawingX = x;
            this.drawingY = y;
            if(this.selected){
                //this.drawSelection();
                this.drawLifeBar();
            }

            game.foregroundContext.drawImage(this.spriteSheet,this.imageOffset*this.pixelWidth,(this.direction+1)*this.pixelHeight,
                this.pixelWidth,this.pixelHeight,x,y,this.pixelWidth,this.pixelHeight);

            //绘制出现的光圈
            if(this.brightness){
                game.foregroundContext.beginPath();
                game.foregroundContext.arc(x+this.pixelOffsetX,y+this.pixelOffsetY,this.radius,0,Math.PI*2,false);
                game.foregroundContext.fillStyle = "rgba(255,255,255,"+this.brightness+")";
                game.foregroundContext.fill();
            }
        },
        drawLifeBar:function(){

        },
        moveTo:function(destination,distanceFromDestination){

        }
    },
    load:loadItem,
    add:addItem,
}