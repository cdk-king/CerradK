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
    //地图平移偏移量
    offsetX:0,
    offsetY:0,
    start:function(){
        game.hideScreens();
        game.showScreen("gameinterfacescreen");

        game.running = true;
        game.refreshBackground = true;
        game.backgroundImage = loader.loadImage("images/background/bit24.png");

        //加载器加载完后才开始绘制
        loader.onload = function(){
            game.drawingLoop();
        }
        
    },
    drawingLoop:function(){

        if(game.refreshBackground){
            //绘制游戏背景
            
            game.backgroundContext.drawImage(game.backgroundImage,0,0,
            game.canvasWidth,game.canvasHeight,0,0,game.canvasWidth,game.canvasHeight);
            game.refreshBackground = false;
            
        }
        
        if(game.running){
            //游戏绘画循环
        }
    },
}