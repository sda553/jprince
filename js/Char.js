createChar = function(lobj_type){
    return {
        frame:-1,
        x:-1,
        y:-1,
        direction:0,
        curr_col:-1,
        curr_row:-1,
        action:-1,
        fall_x:0,
        fall_y:0,
        room:null,
        repeat:0,
        charid:0,
        sword:0,
        alive:false,
        obj_type:lobj_type,
        curr_seq:-1,
        is_feather_fall:false,
        seqtbl_offset_char: function(seq_index) {
            this.curr_seq = seqTbl.seqtbl_offsets[seq_index];
        },
        char_dx_forward: function(delta_x) {
            if (this.direction < Consts.dir_0_right) {
                delta_x = -delta_x;
            }
            return delta_x + this.x;
        },        
        play_seq: function()
        {
            while (true){
                let item = seqTbl.table(this.curr_seq++);
                switch (item){
                    case seqTbl.SEQ_DX:
                        let dx = seqTbl.table(this.curr_seq++);
                        dx = (dx & 127) - (dx & 128);
                        this.x = this.char_dx_forward(dx);
                        break;
                    case seqTbl.SEQ_DY:
                        let dy = seqTbl.table(this.curr_seq++);
                        dy = (dy & 127) - (dy & 128);
                        this.y += dy;
                        break;
                    case seqTbl.SEQ_FLIP:
                        this.direction = ~this.direction;
                        break;
                    case seqTbl.SEQ_JMP_IF_FEATHER: // jump if feather
                        if (!this.is_feather_fall) {
                            ++this.curr_seq;
                            ++this.curr_seq;
                            break;
                        }        
                    case seqTbl.SEQ_JMP:
                        this.curr_seq = seqTbl.table(this.curr_seq) | (seqTbl.table(this.curr_seq+1)<<8);
                        break;
                    case seqTbl.SEQ_UP:
                        --this.curr_row;
                        //start_chompers                    
                        break;
                    case seqTbl.SEQ_ACTION: // action
                        this.action = seqTbl.table(this.curr_seq++);
                        break;
                    case seqTbl.SEQ_SET_FALL: // set fall
                        this.fall_x = seqTbl.table(this.curr_seq++);
                        this.fall_y = seqTbl.table(this.curr_seq++);
                        break;
                    case seqTbl.SEQ_KNOCK_UP: // knock up
                        //knock = 1;
                        break;
                    case seqTbl.SEQ_KNOCK_DOWN: // knock down
                        //knock = -1;
                        break;
                    case seqTbl.SEQ_SOUND: // sound
                        this.curr_seq++;
                        //do sounds;
                    default:
                        this.frame = item;
                        return;
                }                           
            }
        },
        fall_accel:function(){
            if (this.action == Consts.actions.actions_4_in_freefall) {
                    this.fall_y += 3;
                    if (this.fall_y > 33) this.fall_y = 33;
            }
        
        },
        check_action:function(){
            if (this.action==Consts.actions.actions_4_in_freefall){
                this.do_fall();
            }
        },
        do_fall:function(){
            if (Consts.y_land[this.curr_row + 1] > this.y) {

            } else {
                let tileAtChar = this.get_tile_at_char();
                if (tileAtChar.tile_is_floor()){
                    this.land();
                } else {
                    ++this.curr_row;
                }
            }
        },
        land:function(){
            this.y = Consts.y_land[this.curr_row + 1];
            let seq_id=0;
            if (this.get_tile_at_char().getTyleType() != Consts.tyles.tiles_2_spike) {
                //start_chompers();
            }
            if (this.alive<0){
                //alive
                if (this.fall_y < 22){
                    seq_id = seqTbl.seq_17_soft_land;
                    if(this.charid == Consts.charids.char_id_0_kid){
                        //play_sound
                    }
                }
            }
            this.seqtbl_offset_char(seq_id);
            this.play_seq();
            this.fall_y = 0;
        },
        get_tile_at_char:function(){
            return this.room.get_tile_to_draw(this.curr_col,this.curr_row);
        },
        fall_speed:function() {
            this.y += this.fall_y;
            if (this.action == Consts.actions.actions_4_in_freefall) {
                this.x = this.char_dx_forward(this.fall_x);  
                this.determine_col();                  
            }
        },        
        get_tile_div_mod:function(xpos){
            let x = xpos - 58;
            let xl = x % 14;
            let xh = Math.floor(x / 14);
            if (xl < 0) {
                // Integer division rounds towards zero, but we want to round down.
                --xh;
                // Modulo returns a negative number if x is negative, but we want 0 <= xl < 14.
                xl += 14;
            }
            this.obj_xl = xl;
            return xh;        
        },
        get_tile_div_mod_m7:function(xpos) {
            return this.get_tile_div_mod(xpos - 7);
        },        
        determine_col:function() {
            this.curr_col = this.get_tile_div_mod_m7(this.dx_weight());
        },
        dx_weight:function() {           
            let var_2 = this.cur_frame.dx - (this.cur_frame.flags & Consts.FRAME_WEIGHT_X);
            return this.char_dx_forward(var_2);
        },
        load_frame_to_obj:function() {
            let chtab_base = Consts.chtabs.id_chtab_2_kid;
            this.obj_direction = this.direction;
            this.obj_id = this.cur_frame.image;
            this.obj_chtab = chtab_base+(this.cur_frame.sword>>6);
            this.obj_x = (this.char_dx_forward(this.cur_frame.dx) << 1) - 116;
            this.obj_y = this.cur_frame.dy + this.y;
            this.x_to_xh_and_xl();
            if ((this.cur_frame.flags ^ this.obj_direction) < 128) {
                // 0x80: even/odd pixel
                ++this.obj_x;
            }        
        },  
        x_to_xh_and_xl:function(){
            if (this.obj_x<0){
                this.entry_obj_xh = -((-this.obj_x) >> 3);
                this.entry_obj_xl = -((-this.obj_x-1) % 8-7);
            }
            else {
                this.entry_obj_xh = this.obj_x >> 3;
                this.entry_obj_xl = this.obj_x % 8;
            }
        },
        draw_objtable_item:function() {
            switch(this.obj_type){
                case 0: // Kid
                    if (this.obj_id == 0xFF) return;
                    GraphicProcessor.drawmid(this.obj_chtab,this.obj_id+1,this.entry_obj_xh,this.entry_obj_xl,this.obj_y,null,this);
            }
        },        
      /*  set_char_collision:function(){
            return  (function(context){
                return new Promise(function(resolve){
                    context.set_char_collision_async(context).then(resolve);        
                });
            })(this);
        },*/
           //this.set_char_collision_async(this).then(callback);

        //},
        set_char_collision:function(){
            return (function(context){
                return new Promise(function(resolve){
                    sourceLoader.sourcesPromice(context.obj_chtab,context.obj_id).then(
                        function(imgSrc){
                            let char_width_half = 0;
                            let char_height = 0;        
                            if (imgSrc!=null)
                            {
                                char_width_half = Math.floor((imgSrc.img.width+1)/2);
                                char_height = imgSrc.img.height;            
                            }
                            context.char_x_left=Math.floor(context.obj_x/2+58);
                            if (context.direction>=Consts.dir_0_right)
                                context.char_x_left-=char_width_half;
                            context.char_x_left_coll = context.char_x_left;
                            context.char_x_right_coll = context.char_x_left+char_width_half;
                            context.char_x_right = context.char_x_right_coll;
                            let char_top_y = context.obj_y - char_height + 1;
                            if (char_top_y >= 192) {
                                char_top_y = 0;
                            }
                            context.char_top_row = context.y_to_row_mod4(char_top_y);
                            context.char_bottom_row = context.y_to_row_mod4(context.obj_y);
                            if (context.char_bottom_row == -1) {
                                context.char_bottom_row = 3;
                            }
                            context.char_col_left = Utils.MAX(context.get_tile_div_mod(context.char_x_left), 0);
                            context.char_col_right = Utils.MIN(context.get_tile_div_mod(context.char_x_right), 9);
                            if (context.cur_frame.flags & Consts.FRAME_THIN) {
                                // "thin" this frame for collision detection
                                context.char_x_left_coll += 4;
                                context.char_x_right_coll -= 4;
                            } 
                            resolve(context);
                        }
                        //(result)=>(context.set_char_collision_async(cb,context))(result)
                    );                
                });
            })(this);
        },
        set_objtile_at_char:function(){
            let char_frame = this.frame;
            let char_action = this.action;
            if (char_action == Consts.actions.actions_1_run_jump){
                this.tile_row = this.char_bottom_row;
                this.tile_col = this.char_col_left;
            }
            else {
                this.tile_row = this.curr_row;
                this.tile_col = this.curr_col;
            }
            if ((char_frame>=Consts.frameids.frame_135_climbing_1 && char_frame<Consts.frameids.frame_149_climbing_15) ||
                char_action == Consts.actions.actions_2_hang_climb ||
                char_action == Consts.actions.actions_3_in_midair ||
                char_action == Consts.actions.actions_4_in_freefall ||
                char_action == Consts.actions.actions_6_hang_straight)
                {
                    --this.tile_col;
                }
            this.obj_tilepos = this.get_tilepos_nominus(this.tile_col,this.tile_row);
        },
        add_objtable:function(){  
            let tile = null;      
            if (this.obj_tilepos<30){
                tile = this.room.getRoomTyleFromPos(this.obj_tilepos);
                tile.tile_object_redraw = 1;
            }
            else if (this.obj_tilepos==30){
                tile = this.room.get_tile_to_draw(-1,0);                
            }
            if (tile){
                tile.curr_objs.push(this);
                Game.tileobjstack.push(tile);
            }
        },
        get_tilepos_nominus:function(col,row){
            let var_2 = this.get_tilepos(col,row);
            if (var_2<0) 
                return 30;
            else
                return var_2;
        },
        get_tilepos:function(col,row){
            let tbl_line = [0,10,20];
            if (row < 0) {
                return -(col + 1);
            } else if (row >= 3 || col >= 10 || col < 0) {
                return 30;
            } else {
                return tbl_line[row] + col;
            }        
        },
        y_to_row_mod4: function(ypos){
            return Math.floor((ypos+60) / 63) % 4 - 1;
        },
    }
}