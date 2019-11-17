createGameLevel = function(index){
    return {
        level_number:index,
        next_room: null,
        drawn_room:{},
        rooms:[],
        trobs:[],
        start_room:null,
        do_startpos: function()
        {
            this.start_room = this.getGameRoom(Levels[this.level_number].start_room);
            this.next_room = this.start_room;
            if (this.level_number==1)
            {
                let triggerRoom = this.getGameRoom(5);
                let triggertyle = triggerRoom.get_tile_to_draw(2,0);
                triggertyle.trigger_button(0,0,-1);
            }
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
            if (Levels[this.level_number].roomlinks[room.id-1])
                return this.getGameRoom(Levels[this.level_number].roomlinks[room.id-1].left);
            return null;
        },
        getRight: function(room)
        {
            if (Levels[this.level_number].roomlinks[room.id-1])
                return this.getGameRoom(Levels[this.level_number].roomlinks[room.id-1].right);
            return null;
        },
        getUp: function(room)
        {
            if (Levels[this.level_number].roomlinks[room.id-1])
                return this.getGameRoom(Levels[this.level_number].roomlinks[room.id-1].up);
            return null;
        },
        getBelow: function(room)
        {
            if (Levels[this.level_number].roomlinks[room.id-1])
                return this.getGameRoom(Levels[this.level_number].roomlinks[room.id-1].down);
            return null;
        },
        get_doorlink_timer: function(index){
            return Levels[this.level_number].doorlinks2[index] & 0x1F;
        },
        set_doorlink_timer: function(index, value){
            Levels[this.level_number].doorlinks2[index] &= 0xE0;
            Levels[this.level_number].doorlinks2[index] |= value & 0x1F;
            return Levels[this.level_number].doorlinks2[index];
        },
        do_trigger_list:function(index,buttontype){
            while (true) {  // Same as the above but just a little faster and no compiler warning.
                let room = this.get_doorlink_room(index);
                let tilepos = this.get_doorlink_tile(index);
                let tile = room.getRoomTyleFromPos(tilepos);
                let trigger_result = tile.trigger_1(buttontype);
                if (trigger_result >= 0) {
                    this.add_trob(room, tilepos, trigger_result);
                }
                if (this.get_doorlink_next(index++) == 0) break;
            }            
        },
        get_doorlink_room:function(index){
            let room_id = ((Levels[this.level_number].doorlinks1[index] & 0x60) >> 5) +
            ((Levels[this.level_number].doorlinks2[index] & 0xE0) >> 3);
            return this.getGameRoom(room_id);
        },
        get_doorlink_tile:function(index){
            return Levels[this.level_number].doorlinks1[index] & 0x1F;
        },
        get_doorlink_next:function(index){
            return !(Levels[this.level_number].doorlinks1[index] & 0x80);
        },
        add_trob:function(room,tylepos,type){
            new_trob = {
                room_id:room.id,
                tylepos:tylepos,
                type:type,
            };
            let i = this.find_trob(new_trob);
            if (i===-1)
                this.trobs.push(new_trob);
            else
                this.trobs[i].type = type;

        },
        find_trob:function(new_trob){
            for(let i=0;i<this.trobs.length;i++)
                if (this.trobs[i].room_id === new_trob.room_id && this.trobs[i].tylepos === new_trob.tylepos)
                    return i;
            return -1;
        },
        process_trobs: function(){
            for (let i=this.trobs.length-1;i>=0;i--)
            {
                console.log("Processing trob "+i);
                let room = this.getGameRoom(this.trobs[i].room_id);
                this.trobs[i].type = room.getRoomTyleFromPos(this.trobs[i].tylepos).animate_tyle(this.trobs[i]);
                if (this.trobs[i].type===-1)
                    this.trobs.splice(i,1);
            }
        },
    }
}
