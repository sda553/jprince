createGameRoom = function(id, level) {
    let res =
        {
            tyles:[],
            trobs:[],
            id:id,
            level:level,
            room_links:null,
            modaltered:false,
            getRoomTyleFromPos: function(i)
            {
                if (this.tyles[i]==null)
                {
                    const col_xh = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36,];
                    this.tyles[i] = createGameTyle(this.level.fg((this.id-1)*30+i),this.level.bg((this.id-1)*30+i));
                    this.tyles[i].room = this;
                    this.tyles[i].row = (i- i % 10)/10;
                    this.tyles[i].column = i % 10;
                    this.tyles[i].draw_bottom_y = 63 * this.tyles[i].row + 65;
                    this.tyles[i].draw_main_y =  this.tyles[i].draw_bottom_y-3;
                    this.tyles[i].draw_xh = col_xh[i % 10];
                }
                return this.tyles[i];
            },
            curr_room_tiles:function(i)
            {

                return this.getRoomTyleFromPos(i).tiletype;
            },
            curr_room_modif:function(i)
            {
                if (!this.modaltered)
                {
                    this.load_alter_mod();
                }
                return this.getRoomTyleFromPos(i).getModifier();
            },
            get_room_links: function()
            {
                if (this.room_links==null)
                {
                     let room_L = this.level.getLeft(this);
                     let room_R = this.level.getRight(this);
                     let room_A = this.level.getUp(this);
                     let room_B = this.level.getBelow(this);
                     let room_AL;
                     let room_AR;
                    let room_BL;
                    let room_BR;

                    if (room_A!=null){
                        room_AL = this.level.getLeft(room_A);
                        room_AR = this.level.getRight(room_A);
                    }
                    else
                    {
                        if (room_L!=null){
                            room_AL = this.level.getUp(room_L);
                        }
                        if (room_R!=null){
                            room_AR = this.level.getUp(room_R);
                        }
                    }
                    if (room_B!=null){
                        room_BL = this.level.getLeft(room_B);
                        room_BR = this.level.getRight(room_B);
                    }
                    else
                    {
                        if (room_L!=null){
                            room_BL = this.level.getBelow(room_L);
                        }
                        if (room_R!=null){
                            room_BR = this.level.getBelow(room_R);
                        }
                    }
                    this.room_links = {
                        room_BR:room_BR,
                        room_BL:room_BL,
                        room_AR:room_AR,
                        room_AL:room_AL,
                        room_B:room_B,
                        room_L:room_L,
                        room_A:room_A,
                        room_R:room_R,
                    };
                }
                return this.room_links;
            },
            get_tile_to_draw:function(column,row,tile_room0)
            {
                const tbl_line = [0,10,20];
                let tile = null;
                let tilepos = tbl_line[row] + column;

                if (column===-1)
                {
                    let room_L;
                    let new_row = row;

                    if (row===3)
                    {
                        room_L = this.get_room_links().room_BL;
                        new_row=0;
                    }
                    else if (row===-1)
                    {
                        room_L = this.get_room_links().room_AL;
                        new_row=2;
                    }
                    else
                    {
                        room_L = this.get_room_links().room_L;
                    }
                    tile = room_L.get_tile_to_draw(9,new_row,tile_room0);
                }
                else if (column===10)
                {
                    let room_R;
                    let new_row = row;

                    if (row===3)
                    {
                        room_R = this.get_room_links().room_BR;
                        new_row=0;
                    }
                    else if (row===-1)
                    {
                        room_R = this.get_room_links().room_AR;
                        new_row=2;
                    }
                    else
                    {
                        room_R = this.get_room_links().room_R;
                    }

                    tile = room_R.get_tile_to_draw(0,new_row,tile_room0);
                }
                else if (row===3)
                {
                    let room_B = this.get_room_links().room_B;
                    tile = room_B.get_tile_to_draw(column,0,tile_room0);

                }
                else if (row===-1)
                {
                    let room_A = this.get_room_links().room_A;
                    tile = room_A.get_tile_to_draw(column,2,tile_room0);

                }
                else if (this.id)
                {
                    tile = this.getRoomTyleFromPos(tilepos);
                }
                return tile;
            },
            draw_room: function()
            {
                for (let drawn_row=3;drawn_row--;)
                {
                    for (let drawn_col = 0; drawn_col < 10; drawn_col++) {
                        this.get_tile_to_draw(drawn_col,drawn_row).draw_tile();
                    }
                }
            },
            draw_moving: function()
            {
                console.log("redrawing needed tyles");
                Game.backcxtanim.clearRect(0,0,Game.HBOUND,Game.VBOUND);
                this.redraw_needed_tiles();
            },
            redraw_needed_tiles: function()
            {
                for (let drawn_row=3;drawn_row--;)
                {
                    for (let drawn_col = 0; drawn_col < 10; drawn_col++) {
                        this.get_tile_to_draw(drawn_col,drawn_row).redraw_needed();
                    }
                }
            },
            anim_tile_modif: function()
            {
                for (let tilepos=0;tilepos<30;tilepos++) {
                    switch (this.getRoomTyleFromPos(tilepos).getTyleType()) {
                        case Consts.tyles.tiles_19_torch:
                        case Consts.tyles.tiles_30_torch_with_debris:
                            this.start_anim_torch(tilepos);
                            break;
                    }
                }
            },
            start_anim_torch:function(tylepos)
            {
                console.log("Start anim torch");
                this.getRoomTyleFromPos(tylepos).modifier =Game.getLocalPrandom(8);
                this.add_trob(this.id,tylepos,1);
            },
            find_trob:function(new_trob){
                for(let i=0;i<this.trobs.length;i++)
                    if (this.trobs[i].room_id === new_trob.room_id && this.trobs[i].tylepos === new_trob.tylepos)
                        return i;
                return -1;
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
            process_trobs: function(){
                for (let i=this.trobs.length-1;i>=0;i--)
                {
                    console.log("Processing trob "+i);
                    this.trobs[i].type = this.getRoomTyleFromPos(this.trobs[i].tylepos).animate_tyle();
                    if (this.trobs[i].type===-1)
                        this.trobs.splice(i,1);
                }
            },
            load_alter_mod: function()
            {
                if (this.id)
                {
                    for (let tilep = 0; tilep<30; tilep++)
                    {
                        let tileType = this.getRoomTyleFromPos(tilep).getTyleType();
                        if (tileType===Consts.tyles.tiles_20_wall)
                        {
                            let mod = this.getRoomTyleFromPos(tilep).modifier;
                            mod = mod<<4;
                            let adj_tile_left=null;
                            let adj_tile_right = null;
                            let room_links;
                            if (tilep % 10 ===0 || tilep% 10 ===9)
                            {
                                room_links = this.get_room_links();
                            }
                            if (tilep % 10 ===0)
                            {
                                if (room_links.room_L!=null)
                                {
                                    adj_tile_left = room_links.room_L.getRoomTyleFromPos(tilep+9);
                                }
                            }
                            else
                                adj_tile_left = this.getRoomTyleFromPos(tilep-1);
                            if (tilep % 10 ===9)
                            {
                                if (room_links.room_R!=null)
                                {
                                    adj_tile_right = room_links.room_R.getRoomTyleFromPos(tilep-9);
                                }
                            }
                            else
                                adj_tile_right = this.getRoomTyleFromPos(tilep+1);

                            let leftTileWall = (adj_tile_left!=null &&  (adj_tile_left.getTyleType() === Consts.tyles.tiles_20_wall));
                            let rightTileWall = (adj_tile_right!=null &&  (adj_tile_right.getTyleType() === Consts.tyles.tiles_20_wall));
                            if (leftTileWall && rightTileWall)
                            {
                                mod |= 3;
                            }
                            else if (leftTileWall)
                            {
                                mod |= 2;
                            }
                            else if (rightTileWall)
                            {
                                mod |= 1;
                            }
                            this.getRoomTyleFromPos(tilep).modifier = mod;
                        }
                    }
                    this.modaltered = true;
                }
            },
        };
    return res;
}
