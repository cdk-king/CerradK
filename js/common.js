(function(){
    var lastTime = 0;
    var vendors = ["ms","moz","webkit","0"];
    for(var x = 0;x<vendors.length && !window.requestAnimationFrame;x++){
        window.requestAnimationFrame = window[vendors[x]+"RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x]+"CancelRequestAnimationFrame"] || window[vendors[x]+"CannelAnimationFrame"];
    }
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback,element){
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0,16-(currTime-lastTime));
            var id = window.setTimeout(function(){
                callback(currTime+timeToCall);
            },timeToCall);
            lastTime = currTime+timeToCall;
            return id;
        };
    }
    if(!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id){
            clearTimeout(id);
        }
    }
}());

// 默认的load()方法被游戏中的所有单位使用
function loadItem(name){
    //this指向的也只是它上一级的对象
    var item = this.list[name];
    //如果单位的子画面序列已经加载，就没必要在此加载了
    //this指向的也只是它上一级的对象
    if(item.spriteArray){
        return;
    }
    if(item.isSheet){
        item.spriteSheet = loader.loadImage("images/"+this.defaults.type+"/"+item.sheetName+".png");
    }else{
        item.spriteSheet = loader.loadImage("images/"+this.defaults.type+"/"+name+".png");
        console.log("images/"+this.defaults.type+"/"+name+".png");
    }
    
    item.spriteArray = [];
    item.spriteCount = 0;

    for(var i = 0;i<item.spriteImages.length;i++){
        var constructImageCount = item.spriteImages[i].count;
        var constructDirectionCount = item.spriteImages[i].directions;
        if(constructDirectionCount){
            for(var j = 0;j<constructDirectionCount;j++){
                var constructImageName = item.spriteImages[i].name+"-"+j;
                item.spriteArray[constructImageName] = {
                    name:constructImageName,
                    count:constructImageCount,
                    offset:item.spriteCount
                };
                item.spriteCount += constructImageCount;
            }
        }else{
            var constructImageName = item.spriteImages[i].name;
            item.spriteArray[constructImageName] = {
                name:constructImageName,
                count:constructImageCount,
                offset:item.spriteCount
            };
            item.spriteCount += constructImageCount;
        }
    };
}


////对于仍不支持object.assign的一些浏览器，polyfill
//Object.assign(target, ...sources)方法用来将源对象（source）的所有可枚举属性，复制到目标对象（target）。
//Object.assign() 只是一级属性复制，比浅拷贝多深拷贝了一层而已。用的时候，还是要注意这个问题的。
//发现一个可以简单实现深拷贝的方法，当然，有一定限制，如下：
//const obj1 = JSON.parse(JSON.stringify(obj));
//思路就是将一个对象转成json字符串，然后又将字符串转回对象。
if(typeof Object.assign!=="function"){
    //垫片
    Object.assign = function(target, varArgs) { 
        "use strict";//严格模式
        if (target === null) { // TypeError if undefined or null
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var to = Object(target);//new Object([value])

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    //判断一个属性是定义在对象本身而不是继承自原型链
                    //使用原型链上真正的 hasOwnProperty 方法
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }

        return to;
        
    }
}


// 默认的add()方法被游戏中所有的单位使用
function addItem(details){
    var item = {};
    var name = details.name;

    Object.assign(item, this.defaults);

    Object.assign(item, this.list[name]);

    item.life = item.hitPoints;

    item.isAdd = true;

    Object.assign(item, details);

    return item;
}