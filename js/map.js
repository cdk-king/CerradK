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
                "terrain":[]
            },
            "cash":0,
            //预加载的单位项
            "items":[
                {"type":"hero","name":"cdk",x:100,y:180,"life":100},

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
    ]
}
