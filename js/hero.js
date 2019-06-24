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
        },
		//e sprite | d now | b last
		moveDown: function(sprite,now,lastAnimationFrameTime) {
			var c;
			this.setSpriteVelocity(sprite, lastAnimationFrameTime);
            c = this.calculateVerticalDrop(sprite,now,lastAnimationFrameTime);

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
                //判断是否在跳跃过程中，或者是否下方无障碍物
				if(!sprite.jumping && !this.JudgeBelowHasObstacle(sprite)) {
                    sprite.fall(); 	
				} 
			}
		}
    },
    equipRunnerForJumping:function(){
		var INITIAL_TRACK = 0;
		
		this.runner.JUMP_HEIGHT = 120;
		this.runner.JUMP_DURATION = 1400;
		
		this.runner.jumping = false;
		this.runner.track = INITIAL_TRACK;
		//上升
		//this.runner.ascendTimer = new Stopwatch();
		//下降
		//this.runner.descendTimer = new Stopwatch();
		
		
		this.runner.ascendTimer = new AnimationTimer(this.runner.JUMP_DURATION / 2, AnimationTimer.makeEaseOutEasingFunction(1.15));
		this.runner.descendTimer = new AnimationTimer(this.runner.JUMP_DURATION / 2, AnimationTimer.makeEaseInEasingFunction(1.15));
		
		
		this.runner.jump = function(){
			//nb，膜拜中
			if(this.jumping){
				return;
			}
			this.jumping = true;
			
			this.runAnimationRate = 0;
			this.verticalLaunchPosition = this.top;
			this.ascendTimer.start(snailBait.timeSystem.calculateGameTime());
			//console.log(snailBait.timeSystem.calculateGameTime());
			//console.log(+new Date());
		};
		this.runner.stopJumping = function(){
			this.ascendTimer.stop(snailBait.timeSystem.calculateGameTime());
			this.descendTimer.stop(snailBait.timeSystem.calculateGameTime());
			this.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
			this.jumping = false;
		}
	},
    jumpBehavior:{
		isAscending:function(sprite){
			return sprite.ascendTimer.isRunning();
		},
		ascend:function(sprite,now){
			var elapsed = sprite.ascendTimer.getElapsedTime(now);
			var deltaY = elapsed / (sprite.JUMP_DURATION / 2) * sprite.JUMP_HEIGHT;
			sprite.top = sprite.verticalLaunchPosition - deltaY;//向上
			
		},
		isDoneAscending:function(sprite,now){
			//console.log(sprite.type+now);
			//console.log(sprite.ascendTimer.getElapsedTime(now)+"/"+sprite.JUMP_DURATION / 2);
			
			return sprite.ascendTimer.getElapsedTime(now) > sprite.JUMP_DURATION / 2;
		},
		finishAscent:function(sprite,now){
			sprite.jumpApex = sprite.top;
			sprite.ascendTimer.stop(now);
			sprite.descendTimer.start(now);
		},
		isDescending:function(sprite){
			return sprite.descendTimer.isRunning();
		},
		descend:function(sprite,now){
			var elapsed = sprite.descendTimer.getElapsedTime(now);
			var deltaY = elapsed / (sprite.JUMP_DURATION / 2) * sprite.JUMP_HEIGHT;
			sprite.top = sprite.jumpApex + deltaY;//向下
		},
		isDoneDescending:function(sprite,now){
			return sprite.descendTimer.getElapsedTime(now) > sprite.JUMP_DURATION/2;
		},
		finishDescent:function(sprite,now){
			sprite.stopJumping();
			//如果在平台上
			if(snailBait.platformUnderneath(sprite) || sprite.track === 0 ){
				//verticalLaunchPosition初始高度
				sprite.top = sprite.verticalLaunchPosition;
				
			}else{
				//sprite.top = sprite.verticalLaunchPosition;
				sprite.fall(snailBait.GRAVITY_FORCE * 
					(sprite.descendTimer.getElapsedTime(now) / 1000) *
					snailBait.PIXELS_PER_METER);
			}
		},
		pause:function(sprite){
			if(sprite.ascendTimer.isRunning()){
				sprite.ascendTimer.pause();
			}else if(sprite.descendTimer.isRunning()){
				sprite.descendTimer.pause();
			}
		},
		unpause:function(sprite){
			if(sprite.ascendTimer.isRunning()){
				sprite.ascendTimer.unpause();
			}else if(sprite.descendTimer.isRunning()){
				sprite.descendTimer.unpause();
			}
		},
		execute:function(sprite,now,fps,context,lastAnimationFrameTime){
			if(!sprite.jumping || sprite.track === 4){
				return;
			}
			//console.log(sprite.ascendTimer.stopwatch.getElapsedTime(now));
			//console.log(sprite.ascendTimer.stopwatch.running);
			//console.log(this.isAscending(sprite));

			if(this.isAscending(sprite)){
				//上升阶段
				if(!this.isDoneAscending(sprite,now)){	
					//console.log(sprite.ascendTimer.getElapsedTime(now) > sprite.JUMP_DURATION / 2);
					//判断上升是否结束
					this.ascend(sprite,now);				//上升
				}else{

					this.finishAscent(sprite,now);		//结束上升
				}
			}else if(this.isDescending(sprite)){
				//下降阶段
				if(! this.isDoneDescending(sprite,now)){	//判断下降是否结束
					this.descend(sprite,now);				//下降
				}else{
					this.finishDescent(sprite,now);			//下降结束
				}
			}
		}
	}
}