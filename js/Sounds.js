function sound(src) {
  let res_sound = document.createElement("audio");
  res_sound.src = src;
  res_sound.setAttribute("preload", "auto");
  res_sound.setAttribute("controls", "none");
  res_sound.setAttribute("muted",true);
  res_sound.className = "wav_sound";
  res_sound.style.display = "none";
  document.body.appendChild(res_sound);        
  return {
    res_sound: res_sound,
    isPlaying:false,
    play: function (){
      this.isPlaying = true;
      this.res_sound.addEventListener('ended', (function(ctx){
        return function(event) {
          ctx.isPlaying = false;
        };
      })(this));  
      this.res_sound.play();        
    },
    stop:function(){
      this.res_sound.pause();
    },   
  }
}

var SoundProcessor = {
    sound_6_gate_closing_fast : sound("audio/sound_6.wav"),
    sound_8_bumped : sound("audio/sound_8.wav"),
    sound_17_soft_land : sound("audio/sound_17.wav"),
    sound_18_drink : sound("audio/sound_18.wav"),
    sound_23_footstep: sound("audio/sound_23.wav"),
    sound_25_presentation : sound("audio/sound_25.wav"),
    sound_32_shadow_music : sound("audio/sound_32.wav"),
    sound_41_end_level_music : sound("audio/sound_41.wav"),    
}