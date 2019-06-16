//JavaScript文档加载完成事件页面加载完成有两种事件：
//一是ready，表示文档结构已经加载完成（不包含图片等非文字媒体文件）；
//二是onload，指示页面包含图片等文件在内的所有元素都加载完成。
window.addEventListener("load", function() {
    //game.resize();
    game.init();
}, false);

// 随时调整窗口大小调整游戏大小
window.addEventListener("resize", function() {
    //game.resize();
});

var game = {
    init:function(){
        loader.init();
        keyboard.init();

        game.hideScreens();
        game.showScreen("gamestartscreen");
        game.initCanvases();
    },
    resize:function(){

    },
    hideScreens: function() {
        var screens = document.getElementsByClassName("gamelayer");
        for (var i = screens.length - 1; i >= 0; i--) {
            var screen = screens[i];
            screen.style.display = "none";
        }
    },
    hideScreen: function(id) {
        var screen = document.getElementById(id);

        screen.style.display = "none";
    },
    showScreen: function(id) {
        var screen = document.getElementById(id);

        screen.style.display = "block";
    },
    showMessageBox:function(message,onOk,onCancel){
        //设置消息框文本
        let messageBoxText = document.getElementById("messageboxtext");
        messageBoxText.style.display = ""; 
        messageBoxText.innerHTML = message.replace(/\n/g, "<br><br>");

        //设置消息框ok和cancel按钮处理函数，启用按钮
        if(!onOk){
            game.messageBoxOkCallback = undefined;
        }else{
            game.messageBoxOkCallback = onOk;
        }

        let cancelButton = document.getElementById("messageboxcancel");

        if(!onCancel){
            game.messageBoxCancelCallback = undefined;
            cancelButton.style.display = "none";
        }else{
            game.messageBoxCancelCallback = onCancel;
            // Hide the cancel button
            cancelButton.style.display = "";
        }
        //显示消息框并等待用户响应
        game.showScreen("messageboxscreen");
    },
    messageBoxOK:function(){
        let messageBoxText = document.getElementById("messageboxtext");
        messageBoxText.style.display = "none";

        if(game.messageBoxOkCallback){
            game.messageBoxOkCallback();
        }
    },
    messageBoxCancel:function(){
        let messageBoxText = document.getElementById("messageboxtext");
        messageBoxText.style.display = "none";

        if(game.messageBoxCancelCallback){
            game.messageBoxCancelCallback();
        }
    },
    initOffsets: function() {
		this.bgVelocity = 0;
		this.backgroundOffset = 0;
		this.platformOffset = 0;
		this.spriteOffset = 0
	},
    resetOffsets: function() {
		this.bgVelocity = 0;
		this.backgroundOffset = 0;
		this.platformOffset = 0;
		this.spriteOffset = 0
	},
    drawBackground: function() {
		//偏移坐标系
		game.backgroundContext.translate(-game.backgroundOffset, 0);
		game.backgroundContext.drawImage(game.backgroundImage, 0,0,game.backgroundWidth,game.canvasHeight);
		game.backgroundContext.drawImage(game.backgroundImage, game.backgroundWidth, 0,game.backgroundWidth,game.canvasHeight);
		//恢复坐标系
		game.backgroundContext.translate(game.backgroundOffset, 0);
    },
    setGameOffsetX:function(now){
        game.offsetX += game.bgVelocity * (now - game.lastAnimationFrameTime) / 1000;
    },
    setBackgroundOffset: function(now) {

		game.backgroundOffset += game.bgVelocity * (now - game.lastAnimationFrameTime) / 1000;
        //console.log(game.backgroundOffset);
		if(game.backgroundOffset < 0 || game.backgroundOffset > game.backgroundWidth) {
			
			if(game.backgroundOffset > game.backgroundWidth){
				game.backgroundOffset = 0;
			}
			if(game.backgroundOffset < 0){
				game.backgroundOffset = game.backgroundWidth;
			}
		}
    },
    setSpriteOffsets: function(now) {
        //game.spriteOffset += game.spriteVelocity * (now - game.lastAnimationFrameTime) / 1000;
        //game.spriteOffset
    },
	calculateFps: function(now) {
		game.fps = 1 / (now - game.lastAnimationFrameTime) * 1000 * game.timeRate;
		//console.log(now - this.lastAnimationFrameTime);
		if(now - game.lastFpsUpdateTime > 1000) {
			game.lastFpsUpdateTime = now;
			game.fpsElement.innerHTML = game.fps.toFixed(0) + ' fps';
			//console.log(fps.toFixed(0));
		}
		return game.fps;
    },
    resetArrays: function() {
        game.idCounter = 0;
        game.items = [];
        game.buildings = [];
        game.vehicles = [];
        game.aircraft = [];
        game.terrain = [];
        game.hero = [];

        game.selectedItems = [];

        game.triggeredEvents = [];
        game.sortedItems = [];
        game.bullets = [];
    },
    loadType:function(){
        game.resetArrays();
        for(var type in maps.singleplayer[0].requirements){
            var requirementArray = maps.singleplayer[0].requirements[type];
            for(var i = 0;i<requirementArray.length;i++){
                var name = requirementArray[i];
                if(window[type]){
                    //console.log(window[type]);
                    window[type].load(name);
                    console.log("加载完成"+type);
                }else{
                    console.log("找不到"+type);
                }
            }
        }
        game.addItems();
    },
    addItems:function(){
        for(var i =  maps.singleplayer[0].items.length-1;i>=0;i--){
            var itemDetails = maps.singleplayer[0].items[i];
            game.addItem(itemDetails);
        }
        console.log("item加载完毕");
    },
    addItem:function(itemDetails){
        //为每个单位项设置唯一的id
        if(!itemDetails.uid){   
            itemDetails.uid = ++game.idCounter;
        }
        //判断是否已添加
        if(itemDetails.isAdd){
            var item = itemDetails;
        }else{
            var item = window[itemDetails.type].add(itemDetails);
        }
        //将单位项加入items数组
        game.items.push(item);
        //将单位项加入指定的单位类型数组
        game[item.type].push(item);

        return item;
    },
    BACKGROUND_VELOCITY:50,
    turnLeft:function(){
        game.bgVelocity = -game.BACKGROUND_VELOCITY;
        game.hero[0].running = true;
		game.hero[0].direction = 0;
	},
	turnRight:function(){
        game.bgVelocity = this.BACKGROUND_VELOCITY;
        game.hero[0].running = true;
		game.hero[0].direction = 1;
    },
    turnStand:function(){
        game.bgVelocity = 0;
        game.hero[0].running = false;
    },
    canvasWidth: 640,
    canvasHeight: 480,
    initCanvases:function(){
        //获取canvas对面和上下文，并设置canvas的宽度和高度
        game.backgroundCanvas = document.getElementById("gamebackgroundcanvas");
        game.backgroundContext = game.backgroundCanvas.getContext("2d");

        game.foregroundCanvas = document.getElementById("gameforegroundcanvas");
        game.foregroundContext = game.foregroundCanvas.getContext("2d");

        game.foregroundCanvas.width = game.canvasWidth;
        game.backgroundCanvas.width = game.canvasWidth;

        game.foregroundCanvas.height = game.canvasHeight;
        game.backgroundCanvas.height = game.canvasHeight;
    },
    running:false,
    refreshBackground:false,
    //地图被分割成20像素*20像素的方向网格
    gridSize:16,
    currentMapPassableGrid:[],
    currentMapTerrainGrid:[],
    //地图平移偏移量
    offsetX:0,
    offsetY:0,
    start:function(){
        game.hideScreens();
        game.showScreen("gameinterfacescreen");

        game.running = true;
        game.refreshBackground = true;
        game.backgroundImage = loader.loadImage("images/background/Background_1.png");
        game.backgroundWidth = 1024;

        game.initOffsets();

        //加载关卡的预加载单位类型
        game.loadType();

        //加载地形
        maps.createFlatTerrain("soil",-10,26,50,4);

        //创建网格，将不可通过的网格单位赋值1，可通行的赋值0
        game.currentMapTerrainGrid = [];
        for(var y = 0;y<50;y++){
            game.currentMapTerrainGrid[y] = [];
            for(var x = 0;x<100;x++){
                game.currentMapTerrainGrid[y][x] = 0;
            }
        };

        for(var i= game.terrain.length-1;i>=0;i--){
            var item = game.terrain[i];
            game.currentMapTerrainGrid[item.y][item.x] = 1;
        };

        console.log(game.currentMapTerrainGrid);

        //加载器加载完后才开始绘制
        loader.onload = function(){
            game.lastAnimationFrameTime = new Date().getTime();
            game.drawingLoop();
        }
        
    },
    end:function(){
        game.running = false;
    },
    animationLoop:function(now){
        game.setBackgroundOffset(now);

        game.setGameOffsetX(now);

        for(var i = 0;i<=game.items.length-1;i++){
            game.items[i].animate();
        }
    },
    drawingLoop:function(){
        var now = new Date().getTime();
        //console.log(now - game.lastAnimationFrameTime);
        game.animationLoop(now);

        //清空前景
        game.foregroundContext.clearRect(0,0,game.canvasWidth,game.canvasHeight);

        game.backgroundContext.clearRect(0,0,game.canvasWidth,game.canvasHeight);

        if(game.refreshBackground){
            //绘制游戏背景
            
            // game.backgroundContext.drawImage(game.backgroundImage,game.offsetX,game.offsetY,
            // game.canvasWidth,game.canvasHeight,0,0,game.canvasWidth,game.canvasHeight);

            game.drawBackground();            

            //game.refreshBackground = false;
            
        }

        //开始绘制前景元素
        //深度排序确保近的物体遮挡远的物体
        for(var i = 0;i<=game.items.length-1;i++){
             game.items[i].draw();
        }
        
        game.lastAnimationFrameTime = new Date().getTime();

        if(game.running){
            //游戏绘画循环
            requestAnimationFrame(game.drawingLoop);
        }
    },
}