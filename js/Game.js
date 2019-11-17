var Game={
    multiplier:1,
    HBOUND:320,
    VBOUND:240,
    backcxt:document.getElementById("backframe").getContext('2d'),
    backcxtanim:document.getElementById("backframeanim").getContext('2d'),
    midcxt:document.getElementById("midframe").getContext('2d'),
    frontcxt:document.getElementById("frontframe").getContext('2d'),
    _frameInterval:83,
    _timer:-1,
    animation:function()
    {
        Game.animation.loop = function(){
            Game.play_frame();
            if (Game.curRoom.needRefresh)
            {
                Game.curRoom.draw_room();
                Game.curRoom.needRefresh=false;
            }
            else
                Game.curRoom.draw_moving();
        };
        Game.startAnimation();
    },
    startAnimation:function(){
        console.log("startin animation");
      if (Game._timer===-1) Game._timer=setInterval(Game.animation.loop,Game._frameInterval);
    },
    start:function(){
      Game.play();
    },
    stop:function(){
      Game.stopAnimation();
    },
    stopAnimation:function(){
      if (Game._timer!==-1) clearInterval(Game._timer);
      Game._timer=-1;
    },
    play:function(){
      if(Levels[Game.level]!=null){
          Game.curLevel = createGameLevel(Game.level);
          Game.curLevel.do_startpos();
          Game.curRoom = Game.curLevel.start_room;
          Game.curRoom.needRefresh=true;
          Game.animation();
         // Game.stop();
          Game.animation.loop();
      }
    },
    play_frame:function(){
        Game.curLevel.process_trobs();
        Game.curLevel.check_the_end();
      /*  Game.curRoom.tyles.forEach(function(item){
            if (item.redraw_frames_anim>0)
                Game.curRoom.needRefresh=true;
        });*/
    },
    init:function()
    {
        Game.level=1;
        Game.start();
    },
    localrandom:null,
    getLocalPrandom: function(max)
    {
        if (Game.localrandom==null)
        {
            Game.localrandom = newprandom(314159);
        }
        return Game.localrandom.random(max);
    },

}
