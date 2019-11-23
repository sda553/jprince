Consts =
    {        
        x_bump: [-12, 2, 16, 30, 44, 58, 72, 86, 100, 114, 128, 142, 156, 170, 184, 198, 212, 226, 240, 254],
        dir_0_right:0,
        y_land:[-8, 55, 118, 181, 244],
        charids: {
            charid_0_kid      : 0,
            charid_1_shadow   : 1,
            charid_2_guard    : 2,
            charid_3          : 3,
            charid_4_skeleton : 4,
            charid_5_princess : 5,
            charid_6_vizier   : 6,
            charid_24_mouse   : 0x18,
        },        
        sword_status: {
            sword_0_sheathed : 0,
            sword_2_drawn : 2
        },        
        tyles:
            {
                tiles_0_empty: 0,
                tiles_1_floor: 1,
                tiles_2_spike: 2,
                tiles_3_pillar: 3,
                tiles_4_gate: 4,
                tiles_5_stuck: 5,
                tiles_6_closer: 6, // a.k.a. drop button
                tiles_7_doortop_with_floor: 7, // a.k.a. tapestry
                tiles_8_bigpillar_bottom: 8,
                tiles_9_bigpillar_top: 9,
                tiles_10_potion: 10,
                tiles_11_loose: 11,
                tiles_12_doortop: 12, // a.k.a. tapestry top
                tiles_13_mirror: 13,
                tiles_14_debris: 14, // a.k.a. broken floor
                tiles_15_opener: 15, // a.k.a. raise button
                tiles_16_level_door_left: 16, // a.k.a. exit door
                tiles_17_level_door_right: 17,
                tiles_18_chomper: 18,
                tiles_19_torch: 19,
                tiles_20_wall: 20,
                tiles_21_skeleton: 21,
                tiles_22_sword: 22,
                tiles_23_balcony_left: 23,
                tiles_24_balcony_right: 24,
                tiles_25_lattice_pillar: 25,
                tiles_26_lattice_down: 26, // a.k.a. lattice support
                tiles_27_lattice_small: 27,
                tiles_28_lattice_left: 28,
                tiles_29_lattice_right: 29,
                tiles_30_torch_with_debris: 30,
            },
        chtabs:{
            id_chtab_0_sword : 0,
            id_chtab_1_flameswordpotion : 1,
            id_chtab_2_kid : 2,
            id_chtab_3_princessinstory : 3,
            id_chtab_4_jaffarinstory_princessincutscenes : 4,
            id_chtab_5_guard : 5,
            id_chtab_6_environment : 6,
            id_chtab_7_environmentwall : 7,
            id_chtab_8_princessroom : 8,
            id_chtab_9_princessbed : 9,
        },
        tiletable : function()
        {
            let piece =
                function(
                    base_id,
                    floor_left,
                    base_y,
                    right_id,
                    floor_right,
                    right_y,
                    stripe_id,
                    topright_id,
                    bottom_id,
                    fore_id,
                    fore_x,
                    fore_y
                )
                {
                    return {
                        base_id:base_id,
                        floor_left: floor_left,
                        base_y: base_y,
                        right_id:right_id,
                        floor_right:floor_right,
                        right_y:right_y,
                        stripe_id:stripe_id,
                        topright_id:topright_id,
                        bottom_id:bottom_id,
                        fore_id:fore_id,
                        fore_x:fore_x,
                        fore_y:fore_y,
                    };
                };

            return [
                piece(   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0),// 0x00 empty
                piece(  41,   1,   0,  42,   1,   2, 145,   0,  43,   0,   0,   0), // 0x01 floor
                piece( 127,   1,   0, 133,   1,   2, 145,   0,  43,   0,   0,   0), // 0x02 spike
                piece(  92,   1,   0,  93,   1,   2,   0,  94,  43,  95,   1,   0), // 0x03 pillar
                piece(  46,   1,   0,  47,   1,   2,   0,  48,  43,  49,   3,   0), // 0x04 door
                piece(  41,   1,   1,  35,   1,   3, 145,   0,  36,   0,   0,   0), // 0x05 stuck floor
                piece(  41,   1,   0,  42,   1,   2, 145,   0,  96,   0,   0,   0), // 0x06 close button
                piece(  46,   1,   0,   0,   0,   2,   0,   0,  43,  49,   3,   0), // 0x07 door top with floor
                piece(  86,   1,   0,  87,   1,   2,   0,   0,  43,  88,   1,   0), // 0x08 big pillar bottom
                piece(   0,   0,   0,  89,   0,   3,   0,  90,   0,  91,   1,   3), // 0x09 big pillar top
                piece(  41,   1,   0,  42,   1,   2, 145,   0,  43,  12,   2,  -3), // 0x0A potion
                piece(   0,   1,   0,   0,   0,   0, 145,   0,   0,   0,   0,   0), // 0x0B loose floor
                piece(   0,   0,   0,   0,   0,   2,   0,   0,  85,  49,   3,   0), // 0x0C door top
                piece(  75,   1,   0,  42,   1,   2,   0,   0,  43,  77,   0,   0), // 0x0D mirror
                piece(  97,   1,   0,  98,   1,   2, 145,   0,  43, 100,   0,   0), // 0x0E debris
                piece( 147,   1,   0,  42,   1,   1, 145,   0, 149,   0,   0,   0), // 0x0F open button
                piece(  41,   1,   0,  37,   0,   0,   0,  38,  43,   0,   0,   0), // 0x10 leveldoor left
                piece(   0,   0,   0,  39,   1,   2,   0,  40,  43,   0,   0,   0), // 0x11 leveldoor right
                piece(   0,   0,   0,  42,   1,   2, 145,   0,  43,   0,   0,   0), // 0x12 chomper
                piece(  41,   1,   0,  42,   1,   2,   0,   0,  43,   0,   0,   0), // 0x13 torch
                piece(   0,   0,   0,   1,   1,   2,   0,   2,   0,   0,   0,   0), // 0x14 wall
                piece(  30,   1,   0,  31,   1,   2,   0,   0,  43,   0,   0,   0), // 0x15 skeleton
                piece(  41,   1,   0,  42,   1,   2, 145,   0,  43,   0,   0,   0), // 0x16 sword
                piece(  41,   1,   0,  10,   0,   0,   0,  11,  43,   0,   0,   0), // 0x17 balcony left
                piece(   0,   0,   0,  12,   1,   2,   0,  13,  43,   0,   0,   0), // 0x18 balcony right
                piece(  92,   1,   0,  42,   1,   2, 145,   0,  43,  95,   1,   0), // 0x19 lattice pillar
                piece(   1,   0,   0,   0,   0,   0,   0,   0,   2,   9,   0, -53), // 0x1A lattice down
                piece(   3,   0, -10,   0,   0,   0,   0,   0,   0,   9,   0, -53), // 0x1B lattice small
                piece(   4,   0, -10,   0,   0,   0,   0,   0,   0,   9,   0, -53), // 0x1C lattice left
                piece(   5,   0, -10,   0,   0,   0,   0,   0,   0,   9,   0, -53), // 0x1D lattice right
                piece(  97,   1,   0,  98,   1,   2,   0,   0,  43, 100,   0,   0), // 0x1E debris with torch	*/

            ];

        }(),
    }
