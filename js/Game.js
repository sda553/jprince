var Game={
    multiplier:1,
    HBOUND:320,
    VBOUND:240,
    backcxt:document.getElementById("backframe").getContext('2d'),
    backcxtanim:document.getElementById("backframeanim").getContext('2d'),
    midcxt:document.getElementById("midframe").getContext('2d'),
    frontcxt:document.getElementById("frontframe").getContext('2d'),
    eventGamePlay:document.getElementById("GamePlay"),
    _frameInterval:830,//83,
    tileobjstack:[],
    _timer:-1,
    animation:function()
    {
        Game.animation.loop = function(){
            for(let tile;tile=Game.tileobjstack.pop();tile){
              tile.clearObjs();
            }            
            if (Game.curRoom.needRefresh)
            {
                Game.curRoom.draw_room();
                Game.curRoom.needRefresh=false;
            }
            else
            {
              Game.play_frame();
              Game.curRoom.draw_moving();
              /*  Game.curRoom.draw_moving()
                  .then(Game.play_frame());*/
            }
        };        
        Game.startAnimation();
    },
    startAnimation:function(){
       // console.log("startin animation");
      if (Game._timer===-1) Game._timer=setInterval(Game.animation.loop,Game._frameInterval);
    },
    start:function(){
      //this.backcxt.imageSmoothingEnabled = false;
      //this.frontcxt.imageSmoothingEnabled = false;
      //this.midcxt.imageSmoothingEnabled = false;
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
          Game.curLevel.draw_level_first().then(
            function(){
              Game.curRoom = Game.curLevel.start_room;
              Game.curRoom.needRefresh=false;            
              Game.animation();        
            });
      }
    },
    play_frame:function(){
        Game.curLevel.process_trobs();
        if (Game.curLevel.play_kid_frame()) return;
        Game.curLevel.check_the_end();
    },
    init:function()
    {
        Game.level=1;
        Events(this.eventGamePlay);
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
