var sourceLoader = {
    chtab_indexes:[700,150,0,0,0,0, 200, 360],
    loaded_chtabs:[],
    sources: function(chtab_id,id, callback){
        let loaded_chtabs = sourceLoader.loaded_chtabs;
        if (loaded_chtabs[chtab_id]==null || loaded_chtabs[chtab_id][id]==null) {
            if (loaded_chtabs[chtab_id]==null)
                loaded_chtabs[chtab_id] = [];
            let resind = sourceLoader.chtab_indexes[chtab_id] + id;
            let img = new Image();
            loaded_chtabs[chtab_id][id] = img;
            img.onload = function(){
                //loaded_chtabs[chtab_id][id] = img;
                callback({img:img,result:true});
            }
            img.onerror = function()
            {
                loaded_chtabs[chtab_id][id] = null;
                callback({img:null,result:false});
            }
            img.src = "images/res"+resind+".png";
        }
        else
            callback({img:loaded_chtabs[chtab_id][id],result:true});
    }
}
