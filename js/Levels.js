var Levels = [];
init_level = function(ldata)
{
    var binary=window.atob(ldata);
    res = [];
    res.fg = [];
    var base=0;
    var i;
    for (i=base;i<base+720;i++)
    {
        res.fg[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.bg = [];
    for (;i<base+720;i++)
    {
        res.bg[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.doorlinks1 = [];
    for (;i<base+256;i++)
    {
        res.doorlinks1[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.doorlinks2 = [];
    for (;i<base+256;i++)
    {
        res.doorlinks2[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.roomlinks = [];
    for (;i<base+96;i+=4)
    {
        res.roomlinks[(i-base)/4] = {

            left:(binary.charCodeAt(i)),
            right:(binary.charCodeAt(i+1)),
            up:(binary.charCodeAt(i+2)),
            down:(binary.charCodeAt(i+3)),
        };
    }

    res.used_rooms = (binary.charCodeAt(i));
    i++;

    base = i;
    res.roomxs = [];
    for (;i<base+24;i++)
    {
        res.roomxs[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.roomys = [];
    for (;i<base+24;i++)
    {
        res.roomys[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.fill_1 = [];
    for (;i<base+15;i++)
    {
        res.fill_1[i-base] = (binary.charCodeAt(i));
    }

    res.start_room = (binary.charCodeAt(i));
    i++;

    res.start_pos = (binary.charCodeAt(i));
    i++;

    res.start_dir = (binary.charCodeAt(i));
    i++;
    if (res.start_dir>127)
        res.start_dir-=256;

    base = i;
    res.fill_2 = [];
    for (;i<base+4;i++)
    {
        res.fill_2[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.guards_tile = [];
    for (;i<base+24;i++)
    {
        res.guards_tile[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.guards_dir = [];
    for (;i<base+24;i++)
    {
        res.guards_dir[i-base] = (binary.charCodeAt(i));
    }
    base = i;
    res.guards_x = [];
    for (;i<base+24;i++)
    {
        res.guards_x[i-base] = (binary.charCodeAt(i));
    }
    base = i;
    res.guards_seq_lo = [];
    for (;i<base+24;i++)
    {
        res.guards_seq_lo[i-base] = (binary.charCodeAt(i));
    }
    base = i;
    res.guards_skill = [];
    for (;i<base+24;i++)
    {
        res.guards_skill[i-base] = (binary.charCodeAt(i));
    }
    base = i;
    res.guards_seq_hi = [];
    for (;i<base+24;i++)
    {
        res.guards_seq_hi[i-base] = (binary.charCodeAt(i));
    }
    base = i;
    res.guards_color = [];
    for (;i<base+24;i++)
    {
        res.guards_color[i-base] = (binary.charCodeAt(i));
    }

    base = i;
    res.fill_3 = [];
    for (;i<base+18;i++)
    {
        res.fill_3[i-base] = (binary.charCodeAt(i));
    }

    return res;
}

Levels.push(null);
Levels.push(init_level('AAAAIQEhISE0NDMzISMANBQUFDQUFDQ0LiMLASE0AAA0FBQ0AAA0FDMhIzMhIyEhIyEUFBQUFBQUFBQUNBQUFBQUFBQUNCMhITMhMyEhISMUFBQUFBQUFBQUNBQUNBQAFDQ0NCMzISMAAAA0NDQUFBQUAQEOFBQUIzMmMy8kLwAhJDQ0FBQUFCMANDQ0FBMKIQsDDhQ0MyEvACMhITMhIzQ0NAAUNDQ0NDQUFBQCAhQUFBQUAAAvASMLCyMzJDMhIwEjAAA0FDQ0NDQLIwEBAwE0AAAAAAAALwEBJDMzIQsAISMvITQ0NDQAADQ0NDQ0LwAAAAAAAAAANCMhMzAxMyEhITQUFBQUFBQUFBQUNAAAISEjLiMANDQAADQ0NDQ0LiMUAgIUFBQUFBQUNDQ0AAAUNDQ0NDQUNAAAADQ0NDQDFQMBDgEUFBQUIQsLLwAAISMhJCMhITQAADQ0NDQUNDQ0IgA0FBQUIyEzITMiMyEhIzQ0NDQ0NDQ0NDQUFBQUFBQUFBQUNDQ0ISMqMwAANDQ0NDQ0NCMAADQUFBQUFBQUAgIDIwAAAAAjAQEBISMAAAAAIxMzISM0ARYVDiMANDQ0IwA0FDQ0NDQ0NDQuIwA0FBQUFBQUFBQBAyITIQshNAAAACEBASEhIyMzMwEjCws0NDQUFAMKIwEBNBQUNDQ0NBQUFBQUNDQ0NDQhISEzISM0NDQ0FBQ0NDQ0NBQUFDQANBQUNCMzMyEjIiMzISMUFBQUFBQUFBQUAAAAAAAAAAAAADMhMyEmCyEvISE0NDQ0NAA0NDQ0IyEhMyEzISEhIzQ0NDQ0NDQ0NDQUFBQUFBQUFBQUNAAAAAAjKjMhISMAAAAANDQ0NDQDAAAAADQUFBQUNDQ0NBQUNBQUNDQUFDQAACMzISMDEwEDDg4UFBQUAAAAAAAAAAA0NDMhMyEhIiEhNDQUFBQUFBQUFBQU////AAEAAQAAAAAAAQAAAAAAAAAAAAAAAAAAAQAAAQAAAAAAAQAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAABAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAAAAAAAAAAAAQAAAAAAAAALAAkCCAEAAQAAAAAAAAAAAAAAAAABAQAAAAAAAAEHAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAQAAAAAAAgAAAAAAAQAAAAAAAAAAAAAAAAAAAQAAAAABBQEAAgAAAAAB/wAEAAAAAAAB/wAAAAAAAwD/AAACAAAAAAABAAAAAAABAQAAAAAAAAAAAAAAAAEAAAEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAAgEAAQAAAgAAAAABAAAAAAAAAAAAAAAAAAAAAAEAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wABAAH/AAAAAAAAAAAB/wAAAAAAAAAAAAAAAAACAAAAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAQAAAAEAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAA/wH/AP8A//8B/wABAAABAP8AAQEAAAAAAAAAAAAAAAEAAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAP8AAQABAAD/Af//AAAAAAAA/wH//wAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAAAAAAA//////8AAgAAAAABAAEAAAAAAAAAAAAAAAAAAAAAiYmJremJ6YmpKaWpqYmpKaWpk/HR0Tu5l+fnfNV81Xbtdu181bGxsQcDeWpta2cXEg4JCQcDeWpta2cXEg4JCQcDeWpta2cXEg4JCQcDeeoHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3nqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnFxIOCQkHA3lqbWtnF2BgYEAgQCBAICAgICBAICAgICCAAAAgAEAgIIAAgAAAAAAAgAAAAABgYAAAgICAgICAgGBgYAAAgICAgICAgGBgYAAAgICAgICAgGBgYAAAYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgICAgIBgYGAAAICAgIAFAAACBgMBAAIJAAATDhQAFQEABggCBQAUCBEOBwYVCwMAAAAAEw8ADgAIAA8UEBMWEAASBAsHAAAMFgoWFwAMFxUABw8MDRMKBAwADAcXBBEFAAgAEAAPEBEAFAkAAAAYEBARDA8PDQ4SCg4L/w0KCw3/CwwOCgz/DxAQEQ8QEBAQEREQ/xEQDw//ERAPDw//////////////////////AQD/AAAA/x4eER4eHh4eHh4eHh4eHh4eHh4eBh4eHv8A//8AAP8AAAAA/wAAAP8AAP8A//8AAP//////////////////////////////////////////////////////////////////AAH/////AAH//wEB//8B//8BAP//////////////////////////////////////Av//////////////////////Av////////////////////////8PCQ=='));
