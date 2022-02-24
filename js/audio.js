

var sounds = new Array(
    new Audio("../Assets/Music/The Oh Hellos - Soldier, Poet, King (Piano Tutorial).mp3"),
    new Audio("../Assets/Music/Dirty Paws - Of Monsters And Men - Piano Cover.mp3"),
    //new Audio("../Assets/Music/Aviators - Traveler's Song (Instrumental) [Fantasy Rock].mp3"),
    //new Audio("../Assets/Music/Maw of the King (Instrumental).mp3"),
    new Audio("../Assets/Music/Of Monsters and Men - Little Talks [PIANO TUTORIAL + SHEET MUSIC].mp3"),
    new Audio("../Assets/Music/Tuba Knight Boss Battle Theme - Cinematic Orchestra Remix.mp3")

    );
var i = -1;


function playSnd() {
    i++;
    if (i == sounds.length) 
    {
        i = 0;
    }
    sounds[i].volume = 0.05;
    sounds[i].addEventListener('ended', playSnd);
    sounds[i].play();
}

var isMuted = false;
document.addEventListener('keydown', logKey);
var firstPlay = false;
function logKey(e) {
    console.log(e.code);
    console.log("He");

    if(e.code == "KeyM")
    {
        if(!firstPlay)
        {
            playSnd();
            firstPlay=true;
        }
        else{
            if(isMuted == false)    //mute
            {
                for(var i = 0 ; i < sounds.length;i++)
                {
                    sounds[i].muted = true;
                }  
                isMuted = true;
            }
            else                    //unmute
            {                   
                for(var i = 0 ; i < sounds.length;i++)
                {
                    sounds[i].muted = false;
                }  
                isMuted = false;
            }
        }

    }

  }
/*
$(document).ready(function(){

    $("#playerSource").attr("src", "../Assets/Music/Maw of the King (Instrumental).mp3");
    $('#player').prop("volume", 0.1);
    var audio = $("#player");      
    console.log(audio);
    audio[0].pause();
    audio[0].load();//suspends and restores all audio element
    audio[0].play();
});
*/