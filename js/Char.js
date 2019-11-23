createChar = function(){
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
                        this.x = this.char_dx_forward(seqTbl.table(this.curr_seq++));
                        break;
                    case seqTbl.SEQ_DY:
                        this.y += seqTbl.table(this.curr_seq++);
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
        }
    }
}