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
                                game.running = false;
                                game.hideScreens();
                                game.showScreen("gamestartscreen");
                            },function(){
                                game.hideScreen("messageboxscreen");
                            });
                        }
                        break;
                    case "65":
                        //keyCode 65 = a A
                        //console.log("按 a");
                        if(game.running){
                            if(game.hero.length>0){
                                game.turnLeft();
                            }
                        }
                        break;
                    case "68":
                        //keyCode 68 = d D
                        //console.log("按 d");
                        if(game.running){
                            
                            if(game.hero.length>0){
                                game.turnRight();
                            }
                            
                        }
                        break;
                    case "83":
                        //keyCode 83 = s S
                        console.log("按 s");
                        if(game.running){
                            
                        }
                        break;
                    case "87":
                        //keyCode 87 = w W
                        console.log("按 w");
                        if(game.running){
                            
                        }
                        break;
                    
                }
            }
            
        }
        //
        document.onkeyup=function(event){
            
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var currKey=e.keyCode||e.which||e.charCode;
            //console.log("按下键盘");

            if(e){ 
                //console.log(currKey.toString());
                switch (currKey.toString()){
                    case "27":// 按 Esc
                        //console.log("按 esc");
                        
                        break;
                    case "65":
                        //keyCode 65 = a A
                        //console.log("按 a");
                        if(game.running){
                            if(game.hero.length>0){
                                game.turnStand();
                            }
                        }
                        break;
                    case "68":
                        //keyCode 68 = d D
                        //console.log("按 d");
                        if(game.running){
                            
                            if(game.hero.length>0){
                                game.turnStand();
                            }
                            
                        }
                        break;
                    case "83":
                        //keyCode 83 = s S
                        //console.log("按 s");
                        if(game.running){
                            
                        }
                        break;
                    case "87":
                        //keyCode 87 = w W
                        //console.log("按 w");
                        if(game.running){
                            
                        }
                        break;
                    
                }
            }
            
        }
    }
}