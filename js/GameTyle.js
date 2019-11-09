createGameTyle  = function(tiletype,modifier)
{
    res = {
        tiletype: tiletype & 0x1F,
        modifier: modifier,
        room: null,
        column: 0,
        row: 0,
        draw_xh:0,
        draw_bottom_y:0,
        redraw_frames_anim: 0,
        getModifier:function()
        {
            if (this.room!=null && !this.room.modaltered)
            {
                this.room.load_alter_mod();
            }
            return this.modifier;
        },
        getTyleType:function()
        {
            if (this.tiletype === Consts.tyles.tiles_11_loose) {
                if ((this.modifier & 0x7F) === 0) {
                    return Consts.tyles.tiles_1_floor;
                }
            }
            return this.tiletype;

        },
        belowleft:function()
        {
            return this.room.get_tile_to_draw(this.column-1,this.row+1);
        },
        left:function()
        {
            return this.room.get_tile_to_draw(this.column-1,this.row);
        },
        right:function()
        {
            return this.room.get_tile_to_draw(this.column+1,this.row);
        },
        draw_tile_topright: function()
        {
            if (this.belowleft().getTyleType()===Consts.tyles.tiles_7_doortop_with_floor ||
                this.belowleft().getTyleType()===Consts.tyles.tiles_12_doortop){}
            else if (this.belowleft().getTyleType()===Consts.tyles.tiles_20_wall)
                GraphicProcessor.drawback(Consts.chtabs.id_chtab_7_environmentwall, 2, this.draw_xh, 0, this.draw_bottom_y);
            else
                GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, Consts.tiletable[this.belowleft().getTyleType()].topright_id,
                    this.draw_xh, 0, this.draw_bottom_y);
        },
        can_see_bottomleft: function()
        {
            let curr_tile = this.getTyleType();
            return curr_tile === Consts.tyles.tiles_0_empty ||
                curr_tile === Consts.tyles.tiles_9_bigpillar_top ||
                curr_tile === Consts.tyles.tiles_12_doortop ||
                curr_tile === Consts.tyles.tiles_26_lattice_down;
        },
        draw_tile_floorright: function()
        {
            if (!this.can_see_bottomleft())
                return;
            this.draw_tile_topright();
            if (Consts.tiletable[this.left().getTyleType()].floor_right===0)
                return;
            GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, 42,
                this.draw_xh, 0,
                Consts.tiletable[Consts.tyles.tiles_1_floor].right_y + this.draw_main_y);
        },
        draw_tile_right: function()
        {
            let curr_tile = this.getTyleType();
            if (curr_tile === Consts.tyles.tiles_20_wall)
                return;
            let tile_left = this.left().getTyleType();
            const blueline_fram1 = [0, 124, 125, 126];
            const blueline_fram_y = [0, -20, -20, 0];
            const blueline_fram3 = [44, 44, 45, 45];
            const doortop_fram_bot = [78, 80, 82, 0];
            let modifier_left = this.left().getModifier();
            switch (tile_left) {
                default:
                    let id = Consts.tiletable[tile_left].right_id;
                    if (id) {
                        let blit;
                        if (tile_left === Consts.tyles.tiles_5_stuck) {
                            blit = 16;
                            if (curr_tile === Consts.tyles.tiles_0_empty || curr_tile === Consts.tyles.tiles_5_stuck) {
                                id = 42; /*floor B*/
                            }
                        } else {
                            blit = 2;
                        }
                        GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, id, this.draw_xh,
                            0, Consts.tiletable[tile_left].right_y + this.draw_main_y);
                    }
                    if (tile_left === Consts.tyles.tiles_19_torch || tile_left === Consts.tyles.tiles_30_torch_with_debris) {
                        GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, 146 /*torch base*/, this.draw_xh,
                            0, this.draw_bottom_y - 28);
                    }
                    break;
                case Consts.tyles.tiles_0_empty:
                    if ( modifier_left> 3) return;
                    GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, blueline_fram1[modifier_left], this.draw_xh,
                        0, blueline_fram_y[modifier_left] + this.draw_main_y);
                    break;
                case Consts.tyles.tiles_1_floor:
                    GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, 42 /*floor B*/, this.draw_xh,
                        0, Consts.tiletable[tile_left].right_y + this.draw_main_y);
                    let var_2 = modifier_left;
                    if (var_2 > 3) var_2 = 0;
                    if (var_2===0)
                        return;
                    GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, blueline_fram3[var_2], this.draw_xh,
                        0, this.draw_main_y-20, 0, 0);
                    break;
                case Consts.tyles.tiles_7_doortop_with_floor:
                case Consts.tyles.tiles_12_doortop:
                    return;
                case Consts.tyles.tiles_20_wall:
                    GraphicProcessor.drawback(Consts.chtabs.id_chtab_7_environmentwall, 1, this.draw_xh,
                        0, Consts.tiletable[tile_left].right_y + this.draw_main_y);
                    break;

            }

        },
        draw_right_mark: function(which_table,arg2,arg1) {
            let rv = 16;
            let cxt =  which_table===0 ? Game.backcxt : Game.frontcxt;
            const RPOS = [52, 42, 31, 21];
            if (arg2 % 2) {
                rv = 17;
            }
            if (arg2 < 2) {
                arg1 = 24;
            } else {
                arg1 -= 3;
            }
            GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, rv, this.draw_xh+(arg2>1),
                arg1, this.draw_bottom_y-RPOS[arg2],cxt);
        },
        draw_left_mark: function(which_table,arg3,arg2,arg1) {
            let lv1 = 14;
            let lv2 = 0;
            let cxt =  which_table===0 ? Game.backcxt : Game.frontcxt;
            const lpos = [58, 41, 37, 20, 16];
            if (arg3 % 2) {
                lv1 = 15;
            }
            if (arg3 > 3) {
                lv2 = arg1 + 6;
            } else if (arg3 > 1) {
                lv2 = arg2 + 6;
            }
            GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, lv1, this.draw_xh+(arg3 === 2 || arg3 === 3),
                lv2, this.draw_bottom_y-lpos[arg3],cxt);
        },

        wall_pattern: function(which_part,which_table)
        {
            let bg_modifier =this.getModifier() & 0x7f;
            const tbl_line = [0,10,20];
            let cxt =  which_table===0 ? Game.backcxt : Game.frontcxt;
            let random_seed = this.room.id + tbl_line[this.row] + this.column;
            let prandom = newprandom(random_seed);
            prandom.random(1);
            let v3 = prandom.random(1);
            let v5 = prandom.random(4);
            let v2 = prandom.random(1);
            let v4 = prandom.random(4);
            switch (bg_modifier) {
                case 3: if (which_part !== 0) {
                    if (prandom.random(4) === 0)
                    {
                        GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 13, this.draw_xh,
                            0, this.draw_bottom_y-42,cxt);
                    }
                    GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 11+v3, this.draw_xh+1,
                        v5, this.draw_bottom_y-21,cxt);
                }
                    GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 11+v2, this.draw_xh,
                        v4, this.draw_bottom_y,cxt);

                    if (which_part !== 0) {
                        if (prandom.random(4) === 0)
                        {
                            this.draw_right_mark(which_table,prandom.random(3),v5);
                        }
                        if (prandom.random(4) === 0)
                        {
                            this.draw_left_mark(which_table,prandom.random(4), v5 - v3, v4 - v2);
                        }

                    }
                    break;
                case 0:	if (which_part !== 0) {
                    if (prandom.random(6) === 0) {
                        this.draw_left_mark(which_table,prandom.random(1), v5 - v3, v4 - v2);
                        //draw_left_mark(prandom(1), v5 - v3, v4 - v2);
                    }
                }
                    break;
                case 1:if (which_part !== 0) {
                    if (prandom.random(4) === 0) {
                        GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 13, this.draw_xh,
                            0, this.draw_bottom_y-42,cxt);
                    }
                    GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 11+v3, this.draw_xh+1,
                        v5, this.draw_bottom_y-21,cxt);
                    if (prandom.random(4) === 0)
                    {
                        this.draw_right_mark(which_table,prandom.random(3),v5);
                    }
                    if (prandom.random(4) === 0)
                    {
                        this.draw_left_mark(which_table,prandom.random(3), v5 - v3, v4 - v2);
                    }
                }
                    break;
                case 2:if (which_part !== 0) {
                    GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 11+v3, this.draw_xh+1,
                        v5, this.draw_bottom_y-21,cxt);

                }
                    GraphicProcessor.draw(Consts.chtabs.id_chtab_7_environmentwall, 11+v2, this.draw_xh,
                        v4, this.draw_bottom_y,cxt);

                    if (which_part !== 0) {
                        if (prandom.random(4) === 0)
                        {
                            this.draw_right_mark(which_table,prandom.random(1)+2,v5);
                        }
                        if (prandom.random(4) === 0)
                        {
                            this.draw_left_mark(which_table,prandom.random(4), v5 - v3, v4 - v2);
                        }

                    }
                    break;
            }
        },
        get_loose_frame: function(modifier)
        {
            if ((modifier & 0x80)!==0) {
                modifier &= 0x7F;
                if (modifier > 10) {
                    return 1;
                }
            }
            return modifier;
        },
        draw_loose: function()
        {
            let id;
            const loose_fram_bottom = [43, 73, 43, 74, 74, 43, 43, 43, 74, 74, 74, 0];
            if (this.getTyleType() === Consts.tyles.tiles_11_loose) {
                id = loose_fram_bottom[this.get_loose_frame(this.getModifier())];
                GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, id, this.draw_xh,
                    0, this.draw_bottom_y);
                GraphicProcessor.drawfore(Consts.chtabs.id_chtab_6_environment, id, this.draw_xh,
                    0, this.draw_bottom_y);
            }
        },
        draw_tile_bottom: function()
        {
            let id = 0;
            let blit = 0;
            let chtab_id = Consts.chtabs.id_chtab_6_environment;
            let curr_tile = this.getTyleType();
            let curr_modifier = this.getModifier();
            const wall_fram_bottom = [7, 9, 5, 3];
            switch(curr_tile)
            {
                case Consts.tyles.tiles_20_wall:
                    chtab_id = Consts.chtabs.id_chtab_7_environmentwall;
                    id = wall_fram_bottom[curr_modifier & 0x7F];
                    break;
                case this.tiles_12_doortop:
                    blit = 2;
                default:
                    id = Consts.tiletable[curr_tile].bottom_id;
                    break;
            }
            GraphicProcessor.drawback(chtab_id, id, this.draw_xh,
                0, this.draw_bottom_y);
            if (chtab_id === Consts.chtabs.id_chtab_7_environmentwall) {
                this.wall_pattern(0, 0);
            }
        },
        draw_tile_base: function()
        {
            let ybottom;
            let id;
            ybottom = this.draw_main_y;
            const loose_fram_left = [41, 69, 41, 70, 70, 41, 41, 41, 70, 70, 70, 0];
            if (this.left().getTyleType() === Consts.tyles.tiles_26_lattice_down
                && this.getTyleType() === Consts.tyles.tiles_12_doortop) {
                id = 6; // Lattice + door A
                ybottom += 3;
            } else if (this.getTyleType() === Consts.tyles.tiles_11_loose) {
                id = loose_fram_left[this.get_loose_frame(this.getModifier())];
            } else if (this.getTyleType() === Consts.tyles.tiles_15_opener &&
                this.left().getTyleType() === Consts.tyles.tiles_0_empty) {
                id = 148; // left half of open button with no floor to the left
            } else {
                id = Consts.tiletable[this.getTyleType()].base_id;
            }
            GraphicProcessor.drawback(Consts.chtabs.id_chtab_6_environment, id, this.draw_xh,
                0, Consts.tiletable[this.getTyleType()].base_y+ybottom);
        },
        get_spike_frame: function(modifier) {
            if ((modifier & 0x80)!==0) {
                return 5;
            } else {
                return modifier;
            }
        },
        draw_tile_anim_right: function()
        {
            let tile_left = this.left().getTyleType();
            switch (tile_left) {
                case  Consts.tyles.tiles_19_torch:
                case  Consts.tyles.tiles_30_torch_with_debris:
                    let modifier_left = this.left().getModifier();
                    if (modifier_left < 9) {
                        // images 1..9 are the flames
                        GraphicProcessor.drawbackanim(Consts.chtabs.id_chtab_1_flameswordpotion, modifier_left+1, this.draw_xh+1,
                            0, this.draw_main_y-40);
                    }
                    break;
            }
        },
        animate_tyle: function()
        {
            switch (this.getTyleType()) {
                case  Consts.tyles.tiles_19_torch:
                case  Consts.tyles.tiles_30_torch_with_debris:
                    return this.animate_torch();
                default: return -1;
            }
        },
        animate_torch: function()
        {
          if (Game.curRoom.id===this.room.id)
          {
              console.log("Setting redraw_frames_anim");
              this.modifier = this.get_torch_frame(this.modifier);
              this.right().redraw_frames_anim=1;
          }
          return 1;
        },
        get_torch_frame: function(modifier)
        {
            let modif = Game.getLocalPrandom(8);
            if (modif===modifier)
                modif = (modif+1)%9;
            return modif;
        },
        draw_tile_fore: function()
        {
            const id_chtab_6_environment = Consts.chtabs.id_chtab_6_environment;
            const id_chtab_7_environmentwall = Consts.chtabs.id_chtab_7_environmentwall;
            let MIN = function(a,b)
            {
                return a>b?b:a;
            };
            const spikes_fram_fore = [0, 139, 140, 141, 142, 143, 142, 140, 139, 0];
            const chomper_fram_for = [106, 107, 108, 109, 110, 0];
            const wall_fram_main = [8, 10, 6, 4];
            const chomper_fram1 = [3, 2, 0, 1, 4, 3, 3, 0];
            switch (this.getTyleType()) {
                case Consts.tyles.tiles_2_spike:
                    GraphicProcessor.drawfore(id_chtab_6_environment, spikes_fram_fore[this.get_spike_frame(this.getModifier())], this.draw_xh, 0, this.draw_main_y - 2);
                    break;
                case Consts.tyles.tiles_18_chomper:
                    let var_2 = chomper_fram1[MIN(this.getModifier() & 0x7F, 6)];
                    GraphicProcessor.drawfore(id_chtab_6_environment, chomper_fram_for[var_2], this.draw_xh, 0, this.draw_main_y);
                    if ((this.getModifier() & 0x80)!==0) {
                        GraphicProcessor.drawfore(id_chtab_6_environment, var_2 + 119, this.draw_xh + 1, 4, this.draw_main_y - 6);
                    }
                    break;
                case Consts.tyles.tiles_20_wall:
                    GraphicProcessor.drawfore(id_chtab_7_environmentwall, wall_fram_main[this.getModifier() & 0x7F], this.draw_xh, 0, this.draw_main_y);
                    this.wall_pattern(1, 1);
                    break;
                default:
                    let id = Consts.tiletable[this.getTyleType()].fore_id;
                    if (id === 0) return;
                    /*if (this.tiletype == tiles_10_potion) {
                        // large pots are drawn for potion types 2, 3, 4
                        potion_type = (curr_modifier & 0xF8) >> 3;
                        if (potion_type < 5 && potion_type >= 2) id = 13; // small pot = 12, large pot = 13
                    }*/
                    let xh = Consts.tiletable[this.getTyleType()].fore_x + this.draw_xh;
                    let ybottom = Consts.tiletable[this.getTyleType()].fore_y + this.draw_main_y;
                    /*if (curr_tile == tiles_10_potion) {
                        // potions look different in the dungeon and the palace
                        if (custom->tbl_level_type[current_level] != 0) id += 2;
                        add_foretable(id_chtab_1_flameswordpotion, id, xh, 6, ybottom, blitters_10h_transp, 0);
                    } else {*/
                    if ((this.getTyleType() === Consts.tyles.tiles_3_pillar) ||
                        (this.getTyleType() >= Consts.tyles.tiles_27_lattice_small && this.getTyleType() < Consts.tyles.tiles_30_torch_with_debris)) {
                        GraphicProcessor.drawfore(id_chtab_6_environment, id, xh, 0, ybottom);
                    } else {
                        GraphicProcessor.drawfore(id_chtab_6_environment, id, xh, 0, ybottom);
                    }
                    //}
                    break;
            }
        },
        draw_tile: function()
        {
            this.draw_tile_floorright();
            this.draw_tile_right();
            this.draw_tile_anim_right();
            this.draw_tile_bottom();
            this.draw_loose();
            this.draw_tile_base();
            this.draw_tile_fore();
        },
        redraw_needed: function()
        {
            if (this.redraw_frames_anim>0) {
                console.log("Need to redraw tyle ...");
                --this.redraw_frames_anim;
                // draw_tile_anim_topright();
                this.draw_tile_anim_right();
                //draw_tile_anim();
            }
        },


    };
    return res;
}
