var maps = {
    "singleplayer":[
        {
            "name":"cdkWorld",
            //简介
            "briefing":"",
            // 地图细节
            "mapImage":"images/maps/plains-debug.png",
            "startX":36,
            "startY":0,
            "mapGridWidth":60,
            "mapGridHeight":40,
            "mapObstructedTerrain": [],
            //预加载的单位类型
            "requirements":{
                "hero":["cdk"],
                "buildings":[],
                "vehicles":[],
                "aircraft":[],
                "terrain":["soil"]
            },
            "cash":0,
            //预加载的单位项
            "items":[
                {"type":"hero","name":"cdk",x:100,y:180,"life":100},
                // {"type":"terrain","name":"soil",x:300,y:416,"life":10},
                // {"type":"terrain","name":"soil",x:316,y:416,"life":10},
                // {"type":"terrain","name":"soil",x:332,y:416,"life":10},

            ],
            
            /* 条件和时间触发器事件 */
            "triggers":[
                /* 时间事件 */
                {
                    "type":"timed",
                    "time":3000,
                    "action":function(){
                        //game.showMessage("ai","");
                    }
                },
                
                /* 条件事件 */
                {
                    "type":"conditional",
                    "condition":function(){
                        //return (isItemDead(-1) || isItemDead(-2) || isItemDead(-3));
                    },
                    "action":function(){
                        game.end();
                    }
                },
            ]
        },
    ],
    createFlatTerrain:function(terrainName,x,y,widthNum,heightNum){
        var item = {"type":"terrain","name":terrainName,x:x,y:y,"life":10};
        for(var i = 0;i<widthNum;i++){
            for(var j = 0;j<heightNum;j++){
                var re = game.addItem(item);
                re.x  = x + i;
                re.y  = y + j;
            }
        }
    }
}
