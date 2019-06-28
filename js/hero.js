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
        behaviors:["runBehavior","fallBehavior","jumpBehavior"],
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
                hero[this.behaviors[i]].execute(this,game.timeSystem.calculateGameTime(),30,"",game.lastAnimationFrameTime);
            }
        },
        draw:function(){
            this.drawingX = this.x-(game.offsetX/game.gridSize);
            this.drawingY = this.y-(game.offsetY/game.gridSize);
            if(this.selected){
                //this.drawSelection();
                this.drawLifeBar();
            } 
            game.foregroundContext.drawImage(this.spriteSheet,this.imageOffset*this.pixelWidth,(this.direction+1)*this.pixelHeight,
                this.pixelWidth,this.pixelHeight,this.x*game.gridSize,this.drawingY*game.gridSize,this.pixelWidth,this.pixelHeight);

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
    GRAVITY_FORCE:9.81,
    RUN_ANIMATION_RATE:30,
    CANVAS_WIDTH_IN_METERS:10,
    JudgeBelowHasObstacle:function(sprite){
        //todo
        //二维数组可以存item的id

        var x = Math.floor((sprite.x*game.gridSize+game.offsetX)/game.gridSize);
        //var y = Math.floor(sprite.y+sprite.pixelHeight/game.gridSize);
        var y = Math.floor(sprite.y)+3;

        var re = game.currentMapTerrainGrid[x][y];
        var left = game.currentMapTerrainGrid[x-1][y];
        var right = game.currentMapTerrainGrid[x+1][y];
        var top = game.currentMapTerrainGrid[x][y-1];
        var topRight = game.currentMapTerrainGrid[x+1][y-1];
        var bottom = game.currentMapTerrainGrid[x][y+1];


        //超出数组
        if(re==undefined || right == undefined){
            return false; 
        }

        if(right==0){
            //重新校准
            if(re!=0 && top==0 && topRight==0){
                sprite.y = y-3;
            }

            return (re!=0 && top==0 && topRight==0);
        }else if(right!=0 && top==0 && topRight==0){
            //重新校准
            sprite.y = y-3;
            return true;
        }else{
            return false;
        }

        //var item = game.getItemByUid(re);
    },
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
		runner.fall = function(a,b) {
			this.falling = true;
			this.velocityY = a || 0;
            this.initialVelocityY = a || 0;
            this.initStartTime = b || 0;
            //console.log(this.initStartTime);
            //console.log(game.timeSystem.calculateGameTime())
            //this.fallTimer.start(game.timeSystem.calculateGameTime())
			this.fallTimer.start(game.timeSystem.calculateGameTime()-this.initStartTime);
		};
	    runner.stopFalling = function() {
			this.falling = false;
            this.velocityY = 0;
            //this.fallTimer.stop(game.timeSystem.calculateGameTime())
			this.fallTimer.stop(game.timeSystem.calculateGameTime())
		}
	},
    fallBehavior:{
	    //PIXELS_PER_METER:game.canvasWidth / hero.CANVAS_WIDTH_IN_METERS,
		pause: function(sprite, lastAnimationFrameTime) { c.fallTimer.pause(lastAnimationFrameTime) },
		unpause: function(sprite, lastAnimationFrameTime) { c.fallTimer.unpause(lastAnimationFrameTime) },
		setSpriteVelocity: function(sprite, now,lastAnimationFrameTime) {
            //PIXELS_PER_METERS(* pre)
            var pre = game.canvasWidth / hero.CANVAS_WIDTH_IN_METERS;
            //console.log(pre);

            //console.log(sprite.initialVelocityY);
			sprite.velocityY = sprite.initialVelocityY + hero.GRAVITY_FORCE * (sprite.fallTimer.getElapsedTime(now) / 1000) * pre;
            //console.log(sprite.velocityY );
        },
		calculateVerticalDrop: function(sprite, now, lastAnimationFrameTime) {			
			return sprite.velocityY * (now - lastAnimationFrameTime) / 1000;
		},
        
		//e sprite | d now | b last
		moveDown: function(sprite,now,lastAnimationFrameTime) {
            
			var c;
			this.setSpriteVelocity(sprite,now, lastAnimationFrameTime);
            c = this.calculateVerticalDrop(sprite,now,lastAnimationFrameTime);

            if(hero.JudgeBelowHasObstacle(sprite)) {
                sprite.stopFalling();
            } else {
                sprite.y += c/game.gridSize;
                game.offsetY += c;
            }
        },
		execute: function(sprite,now,fps,context,lastAnimationFrameTime) {
			if(sprite.falling) {
                //判断是否下方无障碍物
                //console.log(!hero.JudgeBelowHasObstacle(sprite));
				if(!hero.JudgeBelowHasObstacle(sprite)) {
                    //下方无障碍物
					this.moveDown(sprite,now,lastAnimationFrameTime) 
				} else {
                    //有障碍物，停止下落
					sprite.stopFalling();
				}
			} else {
                //判断是否在跳跃过程中，或者是否下方无障碍物
				if(!sprite.jumping && !hero.JudgeBelowHasObstacle(sprite)) {
                    sprite.fall(); 	
				} 
			}
		}
    },
    equipRunnerForJumping:function(){

        var runner = game.hero[0];
        
		var INITIAL_TRACK = 0;
		
		runner.JUMP_HEIGHT = 100;
		runner.JUMP_DURATION = 1000;
		
		runner.jumping = false;
		runner.track = INITIAL_TRACK;
		//上升
		//this.runner.ascendTimer = new Stopwatch();
		//下降
		//this.runner.descendTimer = new Stopwatch();
		
        //配合下落时间和高度手动模拟短时重力
		runner.ascendTimer = new AnimationTimer(runner.JUMP_DURATION / 2, AnimationTimer.makeEaseOutEasingFunction(1.13));
		runner.descendTimer = new AnimationTimer(runner.JUMP_DURATION / 2, AnimationTimer.makeEaseInEasingFunction(1.13));
		
		runner.jump = function(){
			//nb，膜拜中
			if(this.jumping){
				return;
			}
			this.jumping = true;
			
			this.runAnimationRate = 0;
            this.verticalLaunchPosition = this.y;
            //console.log(game.timeSystem.calculateGameTime());
			this.ascendTimer.start(game.timeSystem.calculateGameTime());

		};
		runner.stopJumping = function(){
			this.ascendTimer.stop(game.timeSystem.calculateGameTime());
			this.descendTimer.stop(game.timeSystem.calculateGameTime());
			this.runAnimationRate = hero.RUN_ANIMATION_RATE;
			this.jumping = false;
		}
	},
    jumpBehavior:{
		isAscending:function(sprite){
			return sprite.ascendTimer.isRunning();
		},
		ascend:function(sprite,now){
			var elapsed = sprite.ascendTimer.getElapsedTime(now);
			var deltaY = (elapsed / (sprite.JUMP_DURATION / 2) * sprite.JUMP_HEIGHT)/game.gridSize;
            sprite.y = sprite.verticalLaunchPosition - deltaY;//向上
			game.offsetY = (sprite.y - sprite.oy)*game.gridSize;
		},
		isDoneAscending:function(sprite,now){
			
			return sprite.ascendTimer.getElapsedTime(now) > sprite.JUMP_DURATION / 2;
		},
		finishAscent:function(sprite,now){
			sprite.jumpApex = sprite.y;
			sprite.ascendTimer.stop(now);
			sprite.descendTimer.start(now);
		},
		isDescending:function(sprite){
			return sprite.descendTimer.isRunning();
		},
		descend:function(sprite,now){
			var elapsed = sprite.descendTimer.getElapsedTime(now);
			var deltaY = (elapsed / (sprite.JUMP_DURATION / 2) * sprite.JUMP_HEIGHT)/game.gridSize;
            sprite.y = sprite.jumpApex + deltaY;//向下
            game.offsetY = (sprite.y - sprite.oy)*game.gridSize;
            //console.log(hero.GRAVITY_FORCE * (sprite.descendTimer.getElapsedTime(now) / 1000) *32);
		},
		isDoneDescending:function(sprite,now){
			return sprite.descendTimer.getElapsedTime(now) > sprite.JUMP_DURATION/2;
		},
		finishDescent:function(sprite,now){
            var PIXELS_PER_METER = game.canvasWidth / hero.CANVAS_WIDTH_IN_METERS;
			sprite.stopJumping();
			//如果在平台上
			if(hero.JudgeBelowHasObstacle(sprite)){
				//verticalLaunchPosition初始高度
				//sprite.y = sprite.verticalLaunchPosition;
				game.offsetY = (sprite.y - sprite.oy)*game.gridSize;
			}else{
                //console.log(hero.GRAVITY_FORCE * (sprite.descendTimer.getElapsedTime(now) / 1000) *32);
				sprite.fall(hero.GRAVITY_FORCE * 
					(sprite.descendTimer.getElapsedTime(now) / 1000) *
					PIXELS_PER_METER,sprite.descendTimer.getElapsedTime(now));
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
			if(!sprite.jumping){
				return;
            }

			if(this.isAscending(sprite)){
                //上升阶段
				if(!this.isDoneAscending(sprite,now)){	
					//判断上升是否结束
					this.ascend(sprite,now);				//上升
				}else{

					this.finishAscent(sprite,now);		//结束上升
				}
			}else if(this.isDescending(sprite)){
				//下降阶段
                if(! this.isDoneDescending(sprite,now)){	//判断下降是否结束
                    
                    if(hero.JudgeBelowHasObstacle(sprite)) {
                        this.finishDescent(sprite,now);			//下降结束
                    }else{
                        this.descend(sprite,now);				//下降
                    }
					
				}else{
					this.finishDescent(sprite,now);			//下降结束
				}
			}
		}
	}
}