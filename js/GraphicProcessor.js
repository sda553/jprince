var GraphicProcessor = {
    drawlock:false,
    drawback: function(chtab_id,id,xh,xl,ybottom){
        GraphicProcessor.draw(chtab_id,id,xh,xl,ybottom,Game.backcxt)
    },
    drawbackanim: function(chtab_id,id,xh,xl,ybottom){
        GraphicProcessor.draw(chtab_id,id,xh,xl,ybottom,Game.backcxtanim)
    },
    drawfore: function(chtab_id,id,xh,xl,ybottom){
        GraphicProcessor.draw(chtab_id,id,xh,xl,ybottom,Game.frontcxt)
    },
    drawqueue:[],
    _timer:-1,
    _drawInterval:10,
    draw: function(chtab_id,id,xh,xl,ybottom,cxt)
    {
        if (id===0)
            return;
        let curindex;
        let addresser = GraphicProcessor.getContextAddresser(cxt);
        //console.log(Date.now()+"drawing "+addresser.logstr+":"+chtab_id+","+id+","+xh+","+xl+","+ybottom);
        curindex = GraphicProcessor.drawqueue[addresser.index].queue.length;
        GraphicProcessor.drawqueue[addresser.index].queue.push({callbackparams:{img:null,chtab_id:chtab_id,id:id,xh:xh,xl:xl,ybottom:ybottom},ready:false});        
        sourceLoader.sourcesPromice(chtab_id,id).then(function(cur_img){
            GraphicProcessor.drawqueue[addresser.index].queue[curindex].ready=true;
            GraphicProcessor.drawqueue[addresser.index].queue[curindex].callbackparams.img=cur_img.img;
            GraphicProcessor.start_processing_draw_queue();
        },function(){
            GraphicProcessor.drawqueue[addresser.index].queue[curindex].ready=true;
            GraphicProcessor.drawqueue[addresser.index].queue[curindex].callbackparams.img=null;
            GraphicProcessor.start_processing_draw_queue();
        });
    },
    
    getContextFromIndex: function(index)
    {
        switch(index)
        {
            case 0:return Game.backcxt;
            case 1:return Game.frontcxt;
            case 10:return Game.backcxtanim;
        }
    },
    getContextAddresser: function(cxt)
    {
        let res = {};
        switch(cxt)
        {
            case Game.backcxt:
                res= {
                    logstr:"back",
                    index:0,
                };break;
            case Game.frontcxt:
                res = {
                    logstr:"front",
                    index:1,
                };break;
            case Game.backcxtanim:
                res = {
                    logstr:"backanim",
                    index:10,
                };break;
        }

        if (GraphicProcessor.drawqueue[res.index]==null)
        {
            GraphicProcessor.drawqueue[res.index] = {_startindexer:0,queue:[]};
        }
        return res;
    },
    start_processing_draw_queue:function()
    {
        if (GraphicProcessor._timer===-1) {
            //console.log("sync drawing loop");
            GraphicProcessor.async_enqueued_draw(); //actually it's sync at this moment
            let unprocessed_elems=0;
            GraphicProcessor.drawqueue.forEach(function(item)
                {
                    unprocessed_elems+=item.queue.length;
                }
            );
            if (unprocessed_elems>0) //not all queue processed, start async
            {
                GraphicProcessor._timer = setInterval(GraphicProcessor.async_enqueued_draw, GraphicProcessor._drawInterval);
                //console.log("started async drawing loop");
            }
        }
    },
    async_enqueued_draw: function()
    {
        let finishedallqueues = true;
        GraphicProcessor.drawqueue.forEach(function(item,index) {
            ctx = GraphicProcessor.getContextFromIndex(index);
            for(;item._startindexer<item.queue.length &&
                 item.queue[item._startindexer].ready;item._startindexer++)
            {
                GraphicProcessor.async_enqueued_draw2(item.queue[item._startindexer].callbackparams,ctx);
                item.queue[item._startindexer]=null;
            }
            if (item._startindexer>=item.queue.length) //finished all queue
            {
                item.queue=[];
                item._startindexer=0;
            }
            else {
                finishedallqueues = false;
            }
        });
        if (finishedallqueues && GraphicProcessor._timer!==-1)
        {
            clearInterval(GraphicProcessor._timer);
            //console.log("stopped drawing loop");
            GraphicProcessor._timer=-1;
        }
    },
    async_enqueued_draw2:function(callbackparams,cxt)
    {
        let addresser = GraphicProcessor.getContextAddresser(cxt);
        if (callbackparams.img==null)
        {
            //console.log(Date.now()+"Could not load image:"+callbackparams.chtab_id+","+callbackparams.id+","+callbackparams.xh+","+callbackparams.xl+","+callbackparams.ybottom);
        }
        else
        {
            let xpos = callbackparams.xh * 8 +callbackparams.xl;
            let ypos = callbackparams.ybottom - callbackparams.img.height;
            //console.log(Date.now()+":Real draw "+addresser.logstr+":"+callbackparams.chtab_id+","+callbackparams.id+","+callbackparams.xh+","+callbackparams.xl+","+callbackparams.ybottom);
            cxt.drawImage(callbackparams.img,xpos,ypos,callbackparams.img.width,callbackparams.img.height);
        }
    },
    calc_screen_x_coord:
        function(logical_x) {
            return Math.floor(logical_x*320/280);
        },
    chtab_flip_clip : [1,0,1,1,1,1,0,0,0,0],
    drawmid: function(chtab_id,id,xh,xl,ybottom,cxt,obj)
    {
        if (cxt==null)
            cxt=Game.midcxt;
        sourceLoader.sourcesPromice(chtab_id,id).then(function(imgSrc){
            let xpos = xh * 8 +xl;
            let ypos = ybottom - imgSrc.img.height;
            if (GraphicProcessor.chtab_flip_clip[chtab_id]) {
                if (chtab_id !== Consts.chtabs.id_chtab_0_sword) {
                    xpos = GraphicProcessor.calc_screen_x_coord(xpos);
                }
            }
            if (obj.direction===Consts.dir_0_right && GraphicProcessor.chtab_flip_clip[chtab_id]!==0)
            {
                //xpos -= imgSrc.img.width;
                xpos=-xpos;
                cxt.scale(-1,1);
                cxt.drawImage(imgSrc.img,xpos,ypos,imgSrc.img.width,imgSrc.img.height);
                cxt.scale(-1,1);
            }
            else
                cxt.drawImage(imgSrc.img,xpos,ypos,imgSrc.img.width,imgSrc.img.height);
            //cxt.scale(1,1);
        });
    }
}
