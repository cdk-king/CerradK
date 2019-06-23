var hero = {
    list:{
        "cdk":{
            name:"cdk",
            canAttack:true,
            canAttackLand:true,
            canAttackAir:true,
            weaponType:"赤手空拳",
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
            sight:5,
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
        behaviors:["runBehavior","fallBehavior"],
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

            for(var i = 0;i < this.behaviors.length;++i){
                hero[this.behaviors[i]].execute(this,new Date().getTime(),30,"",game.lastAnimationFrameTime);
            }
        },
        draw:function(){
            this.drawingX = this.x;
            this.drawingY = this.y;
            if(this.selected){
                //this.drawSelection();
                this.drawLifeBar();
            } 
            game.foregroundContext.drawImage(this.spriteSheet,this.imageOffset*this.pixelWidth,(this.direction+1)*this.pixelHeight,
                this.pixelWidth,this.pixelHeight,this.x*game.gridSize,this.y*game.gridSize,this.pixelWidth,this.pixelHeight);

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
    runBehavior:{
		lastAdvanceTime:0,
		execute:function(sprite,now,fps,context,lastAnimationFrameTime){
            //设置imageOffset
            if(sprite.lastAdvanceTime==0){
                sprite.lastAdvanceTime = now;
            }
            if(sprite.running){
                if(now-sprite.lastAdvanceTime > 100){
                    sprite.imageOffset++;
                    if(sprite.imageOffset>=sprite.spriteImages[0].count){
                        sprite.imageOffset=0;
                    }
                    //console.log(this.imageOffset);
                    sprite.lastAdvanceTime = now;
                }
                
            }else{
                sprite.imageOffset =  0;
            }
		}
    },
    equipFalling: function() {
        var runner = game.hero[0];
		runner.fallTimer = new AnimationTimer();
	    runner.falling = false;
		runner.fall = function(a) {
			this.falling = true;
			this.velocityY = a || 0;
            this.initialVelocityY = a || 0;
            //console.log(game.timeSystem.calculateGameTime());
            //this.fallTimer.start(game.timeSystem.calculateGameTime())
			this.fallTimer.start(new Date().getTime())
		};
	    runner.stopFalling = function() {
			this.falling = false;
            this.velocityY = 0;
            //this.fallTimer.stop(game.timeSystem.calculateGameTime())
			this.fallTimer.stop(new Date().getTime())
		}
	},
    fallBehavior:{
        GRAVITY_FORCE:9.81,
        CANVAS_WIDTH_IN_METERS:20,
	    PIXELS_PER_METER:game.canvasWidth / this.CANVAS_WIDTH_IN_METERS,
		pause: function(sprite, lastAnimationFrameTime) { c.fallTimer.pause(lastAnimationFrameTime) },
		unpause: function(sprite, lastAnimationFrameTime) { c.fallTimer.unpause(lastAnimationFrameTime) },
		setSpriteVelocity: function(sprite, lastAnimationFrameTime) {
            //PIXELS_PER_METERS(* pre)
            var pre = game.canvasWidth / this.CANVAS_WIDTH_IN_METERS;
            //console.log(pre);
			sprite.velocityY = sprite.initialVelocityY + this.GRAVITY_FORCE * (sprite.fallTimer.getElapsedTime(lastAnimationFrameTime) / 1000) * pre;
		},
		calculateVerticalDrop: function(sprite, now, lastAnimationFrameTime) {			
			return sprite.velocityY * (now - lastAnimationFrameTime) / 1000;
		},
        JudgeBelowHasObstacle:function(sprite){
            //todo
            //二维数组可以存item的id

            var x = Math.floor((sprite.x*game.gridSize+game.offsetX)/game.gridSize);
            //var y = Math.floor(sprite.y+sprite.pixelHeight/game.gridSize);
            var y = Math.floor(sprite.y+game.offsetY)+3;

            var re = game.currentMapTerrainGrid[x][y];
            var left = game.currentMapTerrainGrid[x-1][y];
            var right = game.currentMapTerrainGrid[x+1][y];

            if(right==0){
                //重新校准
                if(re!=0){
                    sprite.y = y-3;
                }

                return (re!=0);
            }

            return true; 

            //var item = game.getItemByUid(re);

            //console.log(item);

            //console.log(x);

            
        },
		//e sprite | d now | b last
		moveDown: function(sprite,now,lastAnimationFrameTime) {
			var c;
			this.setSpriteVelocity(sprite, lastAnimationFrameTime);
            c = this.calculateVerticalDrop(sprite,now,lastAnimationFrameTime);
            
            //console.log(sprite.velocityY)
            //console.log(c);

            if(this.JudgeBelowHasObstacle(sprite)) {
                sprite.stopFalling();
            } else {
                sprite.y += c/game.gridSize;
            }
        },
		execute: function(sprite,now,fps,context,lastAnimationFrameTime) {
			if(sprite.falling) {
                //判断是否下方无障碍物
				if(!this.JudgeBelowHasObstacle(sprite)) {
                    //下方无障碍物
					this.moveDown(sprite,now,lastAnimationFrameTime) 
				} else {
                    //有障碍物，停止下落
					sprite.stopFalling();
				}
			} else {
                //console.log(sprite.falling);
                //console.log(!this.JudgeBelowHasObstacle(sprite));
                //判断是否在跳跃过程中，或者是否下方无障碍物
				if(!sprite.jumping && !this.JudgeBelowHasObstacle(sprite)) {
                    sprite.fall(); 	
				} 
			}
		}
	},
}