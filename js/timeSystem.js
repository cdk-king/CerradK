Stopwatch = function(){
	this.startTime = 0;
	this.running = false;
	this.elapsed = undefined;
	this.paused = false;
	this.startPause = 0;
	this.totalPausedTime = 0;
}
//原型模式
Stopwatch.prototype = {
	start:function(now){
		this.startTime = now ? now : +new Date();
		//console.log(this.startTime);
		this.elapsedTime = undefined;
		this.running = true;
		this.totalPausedTime = 0;
		this.startPause = 0;
	},
	stop:function(now){
		if(this.paused){
			this.unpause();
		}
		this.elapsed = (now ? now : +new Date()) - this.startTime - this.totalPausedTime;
		this.running = false;
	},
	pause:function(now){
		this.startPause = now ? now : +new Date();
		this.paused = true;
	},
	unpause:function(now){
		if(!this.pause){
			return;
		}
		this.totalPausedTime += (now ? now : +new Date()) - this.startPause;
		this.startPause = 0;
		this.paused = false;
	},
	getElapsedTime:function(now){
		if(this.running){
			//暂停时无法获取当前停止时间
			return (now ? now : +new Date())-this.startTime-this.totalPausedTime;
		}else{
			return this.elapsed;
		}
	},
	isPaused:function(){
		return this.paused;
	},
	isRunning:function(){
		return this.running;
	},
	reset:function(now){
		this.elapsed = 0;
		this.startTime = now ? now : +new Date();
		this.running = false;
		this.totalPausedTime = 0;
		this.startPause = 0;
	}
}

var AnimationTimer = function(duration,easingFunction){
	this.easingFunction = easingFunction;
	if(duration !== undefined){
		this.duration = duration;
	}else{
		this.duration = 1000;
	}
	this.stopwatch = new Stopwatch();
}

AnimationTimer.prototype = {
	start:function(now){
		this.stopwatch.start(now);
	},
	stop:function(now){
		this.stopwatch.stop(now);
	},
	pause:function(now){
		this.stopwatch.pause(now);
	},
	unpause:function(now){
		this.stopwatch.unpause(now);
	},
	isPaused:function(){
		return this.stopwatch.isPaused();
	},
	isRunning:function(){
		return this.stopwatch.isRunning();
	},
	reset:function(now){
		this.stopwatch.reset(now);
	},
	isExpired:function(now){
		return this.stopwatch.getElapsedTime(now) > this.duration;
	},
	getElapsedTime:function(now){
		
		var elapsedTime = this.stopwatch.getElapsedTime(now);
		var percentComplete = elapsedTime / this.duration;
		
		if(this.easingFunction === undefined || percentComplete === 0 || percentComplete > 1) {
			return elapsedTime;
		}
		//等价return this.easingFunction(percentComplete) * this.duration;
		return elapsedTime * (this.easingFunction(percentComplete)/percentComplete);
	},
	getRealElapsedTime:function(now){
		return this.stopwatch.getElapsedTime(now);
	}
	
};

AnimationTimer.makeEaseOutEasingFunction = function(a) 
{ 
	return function(b) {
		return 1 - Math.pow(1 - b, a * 2) 
	}
};
AnimationTimer.makeEaseInEasingFunction = function(a) 
{
	return function(b) {
		return Math.pow(b, a * 2)
	}
};
AnimationTimer.makeEaseOutInEasingFunction = function() 
{ 
	return function(a) {
		//return a + Math.sin(a * 2 * Math.PI) / (2 * Math.PI)
		return a + Math.sin(a * 2 * Math.PI) / (2 * Math.PI)
	} 
};
AnimationTimer.makeEaseInOutEasingFunction = function() {
	return function(a) {
		return a - Math.sin(a * 2 * Math.PI) / (2 * Math.PI) 
	} 
};

var TimeSystem = function(){
	this.transducer = function(elapsedTime){
		return elapsedTime*1 ;
	};
	this.timer = new AnimationTimer();
	this.lastTimeTransducerWasSet = 0;
	this.gameTime = 0;
}

TimeSystem.prototype = {
	start:function(){
		this.timer.start();
	},
	reset:function(){
		this.timer.stop();
		this.timer.reset();
		this.timer.start();
		this.lastTimeTransducerWasSet = this.gameTime;
	},
	setTransducer:function(fn,duration){
		var lastTransducer = this.transducer;
		var self = this;
		
		this.calculateGameTime();
		this.reset();
		this.transducer = fn;
		
		if(duration){
			setTimeout(function(e){
				self.setTransducer(lastTransducer);
			},duration);
		}
	},
	calculateGameTime:function(){
		this.gameTime = this.lastTimeTransducerWasSet + 
		this.transducer(this.timer.getElapsedTime());
		this.reset();
		return this.gameTime;
	}
}