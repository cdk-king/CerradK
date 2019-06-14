var loader = {
    loaded:true,//加载状态
    loadedCount:0,//已加载的资源数
    totalCount:0,//需要被加载的资源总数
    init:function(){
        
    },
    loadImage:function(url){
        this.totalCount++;
        this.loaded = false;
        game.showScreen("loadingscreen");
        var image = new Image();
        image.src = url;
        //默认回调
        image.onload = loader.itemLoaded;
        return image;
    },
    itemLoaded:function(ev){
        //console.log(ev.target.callback);
        if(ev.target.callback){
            ev.target.callback();
        }
        // 加载此项目后，停止侦听其事件类型，移除事件句柄
        ev.target.removeEventListener(ev.type, loader.itemLoaded, false);
        loader.loadedCount++;
        document.getElementById("loadingmessage").innerHTML = "已加载 " + loader.loadedCount + " 共 " + loader.totalCount;
        if(loader.loadedCount == loader.totalCount){
            //loader完成了资源加载
            loader.loaded = true;
            //防止太快导致屏幕闪烁
            setTimeout(function(){
                //隐藏加载页面
                game.hideScreen("loadingscreen");
                 //如果loader.onload事件有响应函数，调用
                if(loader.onload){
                    if(typeof loader.onload=="function"){
                        loader.onload();
                    }
                    loader.onload = undefined;
                }
            },500);
            
        }
    }
}