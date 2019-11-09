createGameLevel = function(index){
    return {
        level_number:index,
        next_room: null,
        drawn_room:{},
        rooms:[],
        start_room:null,
        do_startpos: function()
        {
            this.start_room = this.getGameRoom(Levels[this.level_number].start_room);
            this.next_room = this.start_room;
        },
        getGameRoom: function(id)
        {
            if (this.rooms[id]==null) {
                this.rooms[id] = createGameRoom(id, this);
            }
            return this.rooms[id];
        },
        check_the_end: function()
        {
            if (this.next_room!=null && this.next_room.id!==this.drawn_room.id)
            {
                console.log("Checking the end");
                this.drawn_room = this.next_room;
                Game.curRoom =this.drawn_room;
                this.drawn_room.anim_tile_modif();
            }
        },
        fg:function(index)
        {
            return Levels[this.level_number].fg[index];
        },
        bg:function(index)
        {
            return Levels[this.level_number].bg[index];
        },
        draw_room: function()
        {
            this.drawn_room.draw_room();
        },
        play_level:function()
        {
            this.do_startpos();
            this.next_room = this.start_room;
        },
        getLeft: function(room)
        {
            return this.getGameRoom(Levels[this.level_number].roomlinks[room.id].left);
        },
        getRight: function(room)
        {
            return this.getGameRoom(Levels[this.level_number].roomlinks[room.id].right);
        },
        getUp: function(room)
        {
            return this.getGameRoom(Levels[this.level_number].roomlinks[room.id].up);
        },
        getBelow: function(room)
        {
            return this.getGameRoom(Levels[this.level_number].roomlinks[room.id].down);
        },
    }
}
