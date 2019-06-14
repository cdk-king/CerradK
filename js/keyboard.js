var keyboard = {
    init:function(){
        var body = document.body;
        document.onkeydown=function(event){
            
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var currKey=e.keyCode||e.which||e.charCode;
            //console.log("按下键盘");

            if(e){ 
                //console.log(currKey.toString());
                switch (currKey.toString()){
                    case "27":// 按 Esc
                        console.log("按 esc");
                        if(game.running){
                            game.showMessageBox("是否退回菜单界面",function(){
                                //game.end();
                                game.hideScreens();
                                game.showScreen("gamestartscreen");
                            },function(){
                                game.hideScreen("messageboxscreen");
                            });
                        }
                        break;
                }
            }
            
        }
    }
}