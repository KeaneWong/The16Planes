

var sounds = new Array(
    new Audio("../Assets/Music/Of Monsters And Men - Little Talks (Instrumental Original).mp3"),
    new Audio("../Assets/Music/Aviators - Traveler's Song (Instrumental) [Fantasy Rock].mp3"),
    new Audio("../Assets/Music/Maw of the King (Instrumental).mp3"),
    new Audio("../Assets/Music/Of Monsters And Men - Dirty Paws Instrumental Cover.mp3"),
    new Audio("../Assets/Music/Tuba Knight Boss Battle Theme - Cinematic Orchestra Remix.mp3")

    );
var i = -1;
playSnd();

function playSnd() {
    i++;
    if (i == sounds.length) return;
    sounds[i].volume = 0.02;
    sounds[i].addEventListener('ended', playSnd);
    sounds[i].play();
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