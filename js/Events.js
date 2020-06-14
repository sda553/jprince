function Events(el) {
    var parent = el,
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
            detach:    detach
        };
    }  

    return Events();
}