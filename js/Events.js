function Events(el) {
    var parent = el,
    private_control_shift=false,
    private_control_y=0,
    private_control_x=0,
    key_states={};  
    
    
    function ev_kdown(ev)
    {
        key_states[ev.key] = true;
        ev.preventDefault();
        console.log("keydn='"+ev.key+"'");
        return;
    }

    function ev_kup(ev)
    {
        key_states[ev.key] = false;
        console.log("keyup='"+ev.key+"'");
        ev.preventDefault();
        return;
    }

    function attach()
    {
        parent.addEventListener("keydown", ev_kdown);
        parent.addEventListener("keyup", ev_kup);
    }

    function detach()
    {
        parent.removeEventListener("keydown", ev_kdown);
        parent.removeEventListener("keyup", ev_kup);
    }    

    function Events(){
        attach();
        return {
            detach:    detach,
            control_shift: control_shift,
            control_x: control_x,
            control_y: control_y,
            do_paused:do_paused,
        };
    }  

    function read_keyb_control(){
        if (key_states['ArrowUp'])
            private_control_y = -1;
        else if (key_states['ArrowDown'])
            private_control_y = 1;
        if (key_states['ArrowLeft'])
            private_control_x = -1;
        else if (key_states['ArrowRight'])
            private_control_x = 1;
        if (key_states['Shift'])
            private_control_shift = true;
    }

    function control_x(new_val){
        if (new_val!==undefined)
            private_control_x = new_val;
        return private_control_x;
    }
    function control_y(new_val){
        if (new_val!==undefined)
            private_control_y = new_val;
        return private_control_y;
    }
    function control_shift(new_val){
        if (new_val!==undefined)
            private_control_shift = new_val;
        return private_control_shift;
    }

    function do_paused(){
        Game.curLevel.next_room = null;
        private_control_shift = false;
        private_control_y = 0;
        private_control_x = 0;
        read_keyb_control();
    }

    return Events();
}