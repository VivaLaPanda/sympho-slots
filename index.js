let tokenList = [0, 0, 0, 0, 0, 0];
let selectedTokens = {};

const charaLookup = {
    0: "hibiki",
    1: "tsubasa",
    2: "chris",
    3: "maria",
    4: "shirabe",
    5: "kirika"
}

function genericWin() {
    var redeemButton = document.getElementById('redeem-token');

    for (let i = 0; i < tokenList.length; i++) {
        if (tokenList[i] > 3) {
            tokenList[i] = 3;
        }

        let currentTokenStack = tokenList[i];
        for (let j = 0; j < currentTokenStack; j++) {
            let token = document.querySelector("#tokens-" + i + " .token-" + j);
            token.setAttribute("style", "filter: none;");

            if (j == 2) {
                let tokenLink = document.querySelector("#tokens-" + i + " a");
                tokenLink.onclick = function() {
                    // Stack is complete
                    if (!selectedTokens[i]) {
                        selectedTokens[i] = true;
                        token.classList.add("glowing");
                        redeemButton.setAttribute("style", "filter: none;");
                    } else {
                        delete selectedTokens[i];
                        token.classList.remove("glowing");
                        redeemButton.setAttribute("style", "filter: greyscale();");
                    }
                }
            }
        }
    }
}

function redeemTokens() {
    if (selectedTokens.length == 0) {
        return;
    }

    for (token in selectedTokens) {
        // Set sprites
        let tokenStackDom = document.querySelector("#tokens-" + token);
        tokenStackDom.setAttribute("style", "display: none;");

        let sprite = document.querySelector("#sprite-" + token);
        sprite.setAttribute("src", sprite.getAttribute("src").replace("-grey", ""));
    }

    // TODO AHHH WE NEED TO MAKE SURE THAT WE PLAY THE RIGHT SONG BASED ON THE TOKEN

    if (selectedTokens.length == 1) {
        // Stop anything playing
        StopAndReset();

        // Play chant
        playChant(i);
        let chantAudio = document.getElementById("holy-chant");

        // Play video after chant
        chantAudio.onended = function() {
            let videobox = document.querySelector("#videobox");
            videobox.setAttribute("style", "display: flex;");
            let video = document.querySelector("#videobox video");
            video.setAttribute("src", "video/transforms/" + charaLookup[i] + ".mp4");
            video.load();
            video.play();
            video.onended = function() {
                videobox.setAttribute("style", "display: none;");
                playSolo(i);
            }
        }
    }
}

function solidToTransparent(colorString, opacity) {
    colorString = colorString.replace("rgb", "rgba");
    colorString = colorString.slice(0, -1) + opacity + ")";

    return colorString;
}

function playSong() {
    let audio = document.getElementById("music");
    audio.volume = .8;
    audio.load();
    audio.play();
    audio.onended = function() {
        StopAndReset();
    }
}

function playChant(charInt) {
    // Setup
    const holyChant = document.getElementById("holy-chant-src");

    // Girls in the image as indexes (* -677)
    // Hibiki: 0
    // Tsubasa: 1
    // Chris: 2
    // Maria: 3
    // Shirabe: 4
    // Kirika: 5
    switch (charInt) {
        case 0:
            // Play Hibiki
            holyChant.setAttribute("src", "audio/holy-chants/Gungnir_Holy_Chant_(Hibiki).oga");
            break;
        case 1:
            // Play Tsubasa
            holyChant.setAttribute("src", "audio/holy-chants/Ame_no_Habakiri_Holy_Chant.oga");
            break;
        case 2:
            // Play Chris
            holyChant.setAttribute("src", "audio/holy-chants/Ichaival_Holy_Chant.oga");
        case 3:
            // Play Maria
            holyChant.setAttribute("src", "audio/holy-chants/Airgetlam_Holy_Chant_(Maria).oga");
            break;
        case 4:
            // Play Shirabe
            holyChant.setAttribute("src", "audio/holy-chants/Shul_Shagana_Holy_Chant.oga");
            break;
        case 5:
            // Play Kirika
            holyChant.setAttribute("src", "audio/holy-chants/Igalima_Holy_Chant.oga");
            break;
    }

    let chantAudio = document.getElementById("holy-chant");
    chantAudio.volume = .8;
    chantAudio.load();
    chantAudio.play();
}

function playSolo(charInt) {
    // Setup
    const song = document.getElementById("music-src");

    // Girls in the image as indexes (* -677)
    // Hibiki: 0
    // Tsubasa: 1
    // Chris: 2
    // Maria: 3
    // Shirabe: 4
    // Kirika: 5
    switch (charInt) {
        case 0:
            // Play Hibiki
            song.setAttribute("src", "audio/songs/Seigi_wo_Shinjite,_Nigiri_Shimete.oga");
            color = () => "rgb(255, 103, 0)";
            bgColor = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgba(255, 103, 0, .8)";
                    case 1:
                        return "rgba(255, 103, 0, 0)";
                }
            };
            break;
        case 1:
            // Play Tsubasa
            song.setAttribute("src", "audio/songs/Gekkō_no_Tsurugi.oga");
            color = () => "rgb(30, 92, 188)";
            bgColor = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgba(30, 92, 188, .8)";
                    case 1:
                        return "rgba(30, 92, 188, 0)";
                }
            };
            break;
        case 2:
            // Play Chris
            song.setAttribute("src", "audio/songs/chris.ogg");
            color = () => "rgb(207, 5, 5)";
            bgColor = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgba(207, 5, 5, .8)";
                    case 1:
                        return "rgba(207, 5, 5, 0)";
                }
            };
            break;
        case 3:
            // Play Maria
            song.setAttribute("src", "audio/songs/Shirogane_no_Honō_-keep_the_faith-.ogg");
            color = () => "rgb(252, 179, 179)";
            bgColor = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgba(252, 179, 179, .8)";
                    case 1:
                        return "rgba(252, 179, 179, 0)";
                }
            };
            break;
        case 4:
            // Play Shirabe
            song.setAttribute("src", "audio/songs/Melodious_Moonlight.oga");
            color = () => "rgb(241, 97, 176)";
            bgColor = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgba(241, 97, 176, .8)";
                    case 1:
                        return "rgba(241, 97, 176, 0)";
                }
            };
            break;
        case 5:
            // Play Kirika
            song.setAttribute("src", "audio/songs/Mikansei_Ai_Mapputatsu!.ogg");
            color = () => "rgb(146, 230, 152)";
            bgColor = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgba(146, 230, 152, .8)";
                    case 1:
                        return "rgba(146, 230, 152, 0)";
                }
            };
            break;
    }

    playSong();

    window.setTimeout(()=>{
        audio = document.getElementById("music");
        startVisualizer(audio.captureStream(), color);
        startPulse(bgColor);
    }, 1000);
}

function handleWinner(slotValues) {
    // Setup
    const song = document.getElementById("music-src");

    // Handle all the solo songs
    // slotValues = [0,0,0,1,1,1];
    for (let i = 0; i < slotValues.length; i++) {
        let currentSlotValue = slotValues[i];
        if (currentSlotValue == 3) {
            tokenList[i] += 3;

            let smallWinAudio = document.getElementById("smallwin");
            smallWinAudio.play();

            genericWin();
            return true;
        }
    }

    // Tsubasa Duets
    if (slotValues[1]) {
        let xValue = slotValues[1];
        if (slotValues[2] + xValue == 3) {
            tokenList[1]++;
            tokenList[2]++;
            // Tsubasa and Chris
            song.setAttribute("src", "audio/songs/BAYONET_CHARGE.oga");
            color = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgb(30, 92, 188)"
                    case 1:
                        return "rgb(207, 5, 5)"
                }
            };

            genericWin();
            window.setTimeout(()=>{
                audio = document.getElementById("music");
                startVisualizer(audio.captureStream(), color);
            }, 1000);
            return true;
        } else if (slotValues[4] + xValue == 3) {
            tokenList[1]++;
            tokenList[4]++;
            // Tsubasa and Shirabe
            song.setAttribute("src", "audio/songs/Fūgetsu_no_Shissō.oga");
            color = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgb(30, 92, 188)"
                    case 1:
                        return "rgb(241, 97, 176)"
                }
            };
            genericWin();
            window.setTimeout(()=>{
                audio = document.getElementById("music");
                startVisualizer(audio.captureStream(), color);
            }, 1000);
            return true;
        } else if (slotValues[3] + xValue == 3) {
            tokenList[1]++;
            tokenList[3]++;
            // Tsubasa and Maria
            song.setAttribute("src", "audio/songs/Fushichou_no_Flamme.oga");
            color = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgb(30, 92, 188)"
                    case 1:
                        return "rgb(252, 179, 179)"
                }
            };
            genericWin();
            window.setTimeout(()=>{
                audio = document.getElementById("music");
                startVisualizer(audio.captureStream(), color);
            }, 1000);
            return true;
        }
    }

    // Chris Duets that don't include Tsuasa
    if (slotValues[2]) {
        let xValue = slotValues[2];
        if (slotValues[3] + xValue == 3) {
            tokenList[2]++;
            tokenList[3]++;
            // Chris and Maria
            song.setAttribute("src", "audio/songs/Change_the_Future.oga");
            color = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgb(207, 5, 5)"
                    case 1:
                        return "rgb(252, 179, 179)"
                }
            };
            genericWin();
            window.setTimeout(()=>{
                audio = document.getElementById("music");
                startVisualizer(audio.captureStream(), color);
            }, 1000);
            return true;
        }
    }

    // Shirabe Duets without Chris or Tsubasa
    if (slotValues[4]) {
        let xValue = slotValues[4];
        if (slotValues[5] + xValue == 3) {
            tokenList[4]++;
            tokenList[5]++;
            // Shirabe and Kirika
            song.setAttribute("src", "audio/songs/Cutting-Edge×2-Ready-go.ogg");
            color = (index) => {
                switch (index % 2) {
                    case 0:
                        return "rgb(241, 97, 176)"
                    case 1:
                        return "rgb(146, 230, 152)"
                }
            }
            genericWin();
            window.setTimeout(()=>{
                audio = document.getElementById("music");
                startVisualizer(audio.captureStream(), color);
            }, 1000);
            return true;
        }
    }

    // Truets? Songs with 3 symphogears
    if (slotValues[0] && slotValues[1]&& slotValues[2]) {
        tokenList[0]++;
        tokenList[1]++;
        tokenList[2]++;
        song.setAttribute("src", "audio/songs/RADIANT_FORCE_off_intro.mp3");
        color = (index) => {
            switch (index % 3) {
                case 0:
                    return "rgb(255, 103, 0)"
                case 1:
                    return "rgb(30, 92, 188)"
                case 2:
                    return "rgb(207, 5, 5)"
            }
        };
        bgColor = (index) => {
            return solidToTransparent(color(index), .8)
        };
        genericWin();
        window.setTimeout(()=>{
            audio = document.getElementById("music");
            startVisualizer(audio.captureStream(), color);
            startPulse(bgColor);
        }, 1000);
        return true;
    }

    if (slotValues[3] && slotValues[4]&& slotValues[5]) {
        tokenList[3]++;
        tokenList[4]++;
        tokenList[5]++;
        song.setAttribute("src", "audio/songs/Senritsu_Sorority.oga");
        color = (index) => {
            switch (index % 3) {
                case 0:
                    return "rgb(252, 179, 179)"
                case 1:
                    return "rgb(241, 97, 176)"
                case 2:
                    return "rgb(146, 230, 152)"
            }
        };
        bgColor = (index) => {
            return solidToTransparent(color(index), .8)
        };
        genericWin();
        window.setTimeout(()=>{
            audio = document.getElementById("music");
            startVisualizer(audio.captureStream(), color);
            startPulse(bgColor);
        }, 1000);
        return true;
    }

    return false;
}

function StopAndReset() {
    // Pause Music
    let audio = document.getElementById("music");
    audio.pause();
    audio.currentTime = 0;
    stopVisualizer();
    stopPulse();
}

function init(){
    var slotImg1 = new Image(477, 4062);
    var slotImg2 = new Image(477, 4062);
    var slotImg3 = new Image(477, 4062);
    slotImg1.src = 'img/slot1.png';
    slotImg2.src = 'img/slot1.png';
    slotImg3.src = 'img/slot1.png';

    var canvas = document.getElementById('slots');
    var slot1 = new Slot(canvas, slotImg1, {x: 0, y:0});
    var slot2 = new Slot(canvas, slotImg2, {x: slotImg1.width, y:0});
    var slot3 = new Slot(canvas, slotImg3, {x: slotImg2.width * 2, y:0})

    var slotMachine = new SlotMachine([slot1,slot2,slot3], canvas);
    var startButton = document.getElementById('start');

    slotImg3.onload = function(){
        slotMachine.drawFirstFrame();
    }

    startButton.addEventListener('click', function(){
        slotMachine.startSlots();
        startButton.disabled = true;
        window.setTimeout(function(){
            slotMachine.stopSlots();
            window.setTimeout(function(){ 
                startButton.disabled = false;
                slotMachine.stop = true;

                handleWinner(slotMachine.slotValues);
                slotMachine.slotValues = [0,0,0,0,0,0];

            }, 2350);
        }, 1900);
    });

    var redeemButton = document.getElementById('redeem-token');
    redeemButton.addEventListener('click', function() {
        redeemTokens();
    })
}



window.onload = function(){
    init();
}