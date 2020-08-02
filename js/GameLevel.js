createGameLevel = function(index){
    return {
        level_number:index,
        next_room: null,
        drawn_room:{},
        rooms:[],
        trobs:[],
        need_level_music:false,
        start_room:null,
        kid:null,
        do_startpos: function()
        {
            this.start_room = this.getGameRoom(Levels[this.level_number].start_room);
            this.next_room = this.start_room;
            this.kid = createChar(0);
            this.kid.room = this.next_room;
            this.kid.curr_col = (this.getStartPos() % 10);
            this.kid.curr_row = (this.getStartPos() / 10);
            this.kid.x = Consts.x_bump[this.kid.curr_col+5]+14;
            this.kid.direction = ~this.getStartDir();
            if (this.level_number==1)
            {
                this.need_level_music = true;                
                let triggerRoom = this.getGameRoom(5);
                SoundProcessor.sound_25_presentation.alreadyPlayed = false;
                let triggertyle = triggerRoom.get_tile_to_draw(2,0);
                triggertyle.trigger_button(0,0,-1);
                this.kid.seqtbl_offset_char(seqTbl.seq_7_fall);
            }
            this.setStartPos();
        },
        setStartPos: function(){
            this.kid.y=Consts.y_land[this.kid.curr_row+1];
            this.kid.alive = -1;
            this.kid.charid = Consts.charids.char_id_0_kid;
            this.kid.fall_y = 0;
            this.kid.fall_x = 0;
            this.kid.sword = Consts.sword_status.sword_0_sheathed;
            this.kid.play_seq();
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
                //console.log("Checking the end");
                this.drawn_room = this.next_room;
                Game.curRoom =this.drawn_room;
                this.drawn_room.anim_tile_modif();
            }
        },
        getStartPos: function(){
            return Levels[this.level_number].start_pos;
        },
        getStartDir: function(){
            return Levels[this.level_number].start_dir;
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
        play_kid_frame:function(){
            return (function(context){
                return new Promise(function(resolve){
                    const kid = context.kid;
                    kid.cur_frame = Consts.frame_table_kid[context.kid.frame];
                    kid.determine_col();    
                    context.play_kid();
                    if (context.kid.room!=null){
                        kid.play_seq();
                        kid.fall_accel();
                        kid.fall_speed();
                        kid.load_frame_to_obj(); 
                        kid.determine_col();
                        kid.set_char_collision().then(function(){
                            kid.check_action();
                            resolve(false);
                        });                         
                    }
                    else 
                        resolve(false);        
                });
            })(this);
        },
        play_kid: function(){
            this.control_kid();
        },
        control_kid:function(){
            Game.EventController.do_paused();
            this.read_user_control();
            this.user_control();
        },
        read_user_control:function(){
            let evts = Game.EventController;
            if (this.kid.control_forward>=0){
                if (evts.control_x()<0){
                    if (this.kid.control_forward==0){
                        this.kid.control_forward = -1;
                    }
                } else {
                    this.kid.control_forward = 0;
                }
            }
            if (this.kid.control_backward>=0){
                if (evts.control_x()==1){
                    if (this.kid.control_backward==0){
                        this.kid.control_backward = -1;
                    }
                } else {
                    this.kid.control_backward = 0;
                }
            }
            if (this.kid.control_up>=0){
                if (evts.control_y()<0){
                    if (this.kid.control_up==0){
                        this.kid.control_up = -1;
                    }
                } else {
                    this.kid.control_up = 0;
                }
            }
            if (this.kid.control_down>=0){
                if (evts.control_y()==1){
                    if (this.kid.control_down==0){
                        this.kid.control_down = -1;
                    }
                } else {
                    this.kid.control_down = 0;
                }
            }
            if (this.kid.control_shift>=0){
                if (evts.control_shift()){
                    if (this.kid.control_shift==0){
                        this.kid.control_shift = -1;
                    }
                } else {
                    this.kid.control_shift = 0;
                }
            }
        },
        user_control:function(){
            if (this.kid.direction >= Consts.dir_0_right) {
                this.flip_control_x();
                this.kid.control();
                this.flip_control_x();
            } else {
                this.kid.control();
            }        
        },
        flip_control_x:function(){
            Game.EventController.control_x(-Game.EventController.control_x());
            let temp = this.kid.control_forward;
            this.kid.control_forward = this.kid.control_backward;
            this.kid.control_backward = temp;
        },
        play_level:function()
        {
            this.do_startpos();
            this.next_room = this.start_room;
        },
        draw_level_first:function(){
            return (function(context){
               return new Promise(function(resolve){
                    context.check_the_end();
                    for(let tile;tile=Game.tileobjstack.pop();tile){
                        tile.clearObjs();
                    }            
                    Game.curRoom.draw_room();
                    Game.curRoom.needRefresh=false;
                    Game.curRoom.draw_moving().then(
                        GraphicProcessor.wait_mid_ready().then(
                            function(){
                                GraphicProcessor.draw_mid_queue();
                                resolve();
                            }
                        ));    
               }); 
            })(this);
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
                //console.log("Processing trob "+i);
                let room = this.getGameRoom(this.trobs[i].room_id);
                this.trobs[i].type = room.getRoomTyleFromPos(this.trobs[i].tylepos).animate_tyle(this.trobs[i]);
                if (this.trobs[i].type===-1)
                    this.trobs.splice(i,1);
            }
        },
        draw_kid:function(){
            return (function(context){
               return new Promise(function(resolve){
                    if (context.kid.room != null && context.kid.room.id!=0 && context.kid.room.id == context.drawn_room.id) {
                        context.add_kid_to_objtable().then(resolve);
                    }    
               }); 
            })(this);
        },
        add_kid_to_objtable:function(){
            return (function(context){
                return new Promise(function(resolve){
                    const kid = context.kid;
                    kid.cur_frame = Consts.frame_table_kid[context.kid.frame];
                    kid.determine_col();
                    kid.load_frame_to_obj();
        
                    context.kid.set_char_collision().then(
                        function(){
                            kid.set_objtile_at_char();
                            kid.add_objtable();
                            resolve();
                        }
                    );        
                });
            })(this);
        },
    }
}
