var sounds = {
    backgroundSound:true,
    currentAudioObject:null,
    stopPollMusicFlag:false,
    volume:0.5,
    list:{
        "bullet":["bullet1","bullet2"],
        "heatseeker":["heatseeker1","heatseeker2"],
        "fireball":["laser1","laser2"],
        "cannon-ball":["cannon1","cannon2"],
        "message-received":["message"],
        "acknowledge-attacking":["engaging"],
        "acknowledge-moving":["yup","roger1","roger2"],
        "background":["Overworld Day"],
    
    },
    loaded:{},
    init:function(){
        for(var soundName in this.list){
            var sound = {};
            sound.audioObjects = [];
            for(var i = 0;i<this.list[soundName].length;i++){
                sound.audioObjects.push(loader.loadSound("audio/"+this.list[soundName][i]));
            }
            this.loaded[soundName] = sound;
        }
    },
    play:function(soundName){
        if(sounds.backgroundSound){
            var sound = sounds.loaded[soundName];
            if(sound && sound.audioObjects && sound.audioObjects.length>0){
                if(!sound.counter || sound.counter>=sound.audioObjects.length){
                    sound.counter = 0;
                }
                var audioObject = sound.audioObjects[sound.counter];
                sound.counter++;
                audioObject.volume = sounds.volume;
                audioObject.play();
            }
        }
    },
    pause:function(soundName){
        var sound = sounds.loaded[soundName];
    },
    pollMusic:function(soundName){
        var POLL_INTERVAL = 1000;
		var SOUNDTRACK_LENGTH = 150;//单位秒
        var timerID;
        var sound = sounds.loaded[soundName];
        sounds.currentAudioObject = sound.audioObjects[0];
        sounds.currentAudioObject.play();
		sounds.timerID = setInterval(function(){   
            if(sounds.stopPollMusicFlag){
                sounds.currentAudioObject.currentTime=0;
                sounds.currentAudioObject.pause();
            }else{
                sounds.currentAudioObject.play();
            }
            
            //console.log(sounds.currentAudioObject.currentTime);
			if(sounds.currentAudioObject.currentTime > SOUNDTRACK_LENGTH){
				sounds.currentAudioObject.currentTime=0;
				sounds.currentAudioObject.play();
			}
		},POLL_INTERVAL);
    },
    stopPollMusic:function(){
        sounds.currentAudioObject.currentTime=0;
        sounds.currentAudioObject.pause();
        clearInterval(sounds.timerID);
    },
    restartMusic:function(){
		//重新加载音频元素。
		
	},
}