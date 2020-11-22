let visualizerStopped = false;

function startVisualizer(stream, strokeColor) {
    visualizerStopped = false;
    //main block for doing the audio recording
    let chunks = [];
    const mediaRecorder = new MediaRecorder(stream);

    // visualiser setup - create web audio api context and canvas

    let audioCtx;
    const visCanvas = document.querySelector('.visualizer');
    const visCanvasCtx = visCanvas.getContext("2d");

    // Do the visualizer stuff
    visualize(stream);
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("recorder started");

    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    }

    function visualize(stream) {
        if(!audioCtx) {
            audioCtx = new AudioContext();
        }
    
        const source = audioCtx.createMediaStreamSource(stream);
    
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
    
        source.connect(analyser);
        //analyser.connect(audioCtx.destination);
    
        let index = 0;
        draw()
    
        function draw() {
            index++;
            if (visualizerStopped) {
                return;
            }

            const WIDTH = visCanvas.width
            const HEIGHT = visCanvas.height;
        
            requestAnimationFrame(draw);
        
            analyser.getByteTimeDomainData(dataArray);

            visCanvasCtx.clearRect(0,0, WIDTH, HEIGHT)
        
            visCanvasCtx.lineWidth = 20;
            visCanvasCtx.strokeStyle = strokeColor(index);
        
            visCanvasCtx.beginPath();
        
            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;
        
        
            for(let i = 0; i < bufferLength; i++) {
        
                let v = dataArray[i] / 128.0;
                let y = v * HEIGHT/2;
        
                if(i === 0) {
                visCanvasCtx.moveTo(x, y);
                } else {
                visCanvasCtx.lineTo(x, y);
                }
        
                x += sliceWidth;
            }
        
            visCanvasCtx.lineTo(visCanvas.width, visCanvas.height/2);
            visCanvasCtx.stroke();
        }
    }
}

function stopVisualizer() {
    visualizerStopped = true;
    const visCanvas = document.querySelector('.visualizer');
    const visCanvasCtx = visCanvas.getContext("2d");
    visCanvasCtx.clearRect(0,0, visCanvas.width, visCanvas.height)
}

let pulseStopped = false;
function startPulse(color) {
    pulseStopped = false;
    let container = document.querySelector(".container");

    function pulse(polarity, index) {
        if (pulseStopped) {
            return;
        }

        if (polarity == 0) {
            container.setAttribute("style", "background-color: " + color(index) + ";background-blend-mode: multiply;")
            index ++;
        } else {
            container.setAttribute("style", "background-color: rgba(200,100,0, 0);background-blend-mode: multiply;")
        }

        window.setTimeout(() => pulse((polarity + 1) % 2, index), 384 / 4)
    }

    pulse(0, 0);
}

function stopPulse() {
    pulseStopped = true;
    let container = document.querySelector(".container");
    container.setAttribute("style", "background-color: rgba(200,100,0, 0);background-blend-mode: multiply;")
}

function Slot(canvas, image, picturePositions){
    this.image = image;
    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext("2d");
    this.positionOnCanvas = picturePositions;
    this.refreshIntervalId;
    this.stop = false;
    this.slotPosY = 0;
    this.displacement = 300;
    this.stopPosition = randomChoice(0,-677, 6);

    this.drawFirstFrame = function(){
        this.canvasContext.drawImage(this.image, this.positionOnCanvas.x, 0, this.image.width, this.image.height);
    }
    this.drawSlotFrame = function(){
        if(this.slotPosY > this.canvas.height){
            this.slotPosY = (this.canvas.height - this.image.height);
        }
        if(this.slotPosY > (this.canvas.height - this.image.height)){
            this.canvasContext.drawImage(this.image, this.positionOnCanvas.x, this.slotPosY - this.image.height+1, this.image.width, this.image.height);
        }
        this.canvasContext.drawImage(this.image, this.positionOnCanvas.x, this.slotPosY, this.image.width, this.image.height);
        this.calculateSlotPosY();
    }

    this.calculateSlotPosY = function(){
        if(this.stop){
            if (this.slotPosY !== this.stopPosition ) {
                return this.slotPosY = this.stopPosition;
            }
            else{
                this.displacement = 0;
                return this.slotPosY;
            }
        }
        return this.slotPosY += this.displacement;
    }
}

function SlotMachine(slots, canvas){
    this.slots = slots;
    this.canvas = canvas;
    this.canvas.width = 3 * this.slots[0].image.width;
    this.stop = false;
    this.canvasContext = this.canvas.getContext("2d");
    this.slotValues = [0,0,0,0,0,0];
    this.spinnersAudio = [document.getElementById("spinner-1"), document.getElementById("spinner-2"), document.getElementById("spinner-3")];
    this.drawFirstFrame = function(){
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.drawFirstFrame();
        }
    }
    this.startSlots = function(){
        // Pause Music
        let audio = document.getElementById("music");
        audio.pause();
        stopVisualizer();
        stopPulse();

        // Start spinner noises
        var nextTimeout = 0;
        this.spinnersAudio.forEach((spinnerAudio) => {
            nextTimeout += 50;
            spinnerAudio.volume = .8;
            spinnerAudio.currentTime = 0;
            window.setTimeout(function() {spinnerAudio.play();}, nextTimeout);
        });

        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.stopPosition = randomChoice(0,-677, 6);
            this.slotValues[(currentSlot.stopPosition / - 677)]++;
            currentSlot.displacement = 150;
            currentSlot.stop = false;
        }
        this.stop = false;
        this.draw();
    }
    this.drawSlotFrame = function(){
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.drawSlotFrame();
        }

        window.requestAnimationFrame(this.draw.bind(this));
    }
    this.stopSlots = function(){
        var nextTimeout = 0;
        for(let i = 0; i < this.slots.length; i++){
            nextTimeout += 750;
            let currentSlot = this.slots[i];
            let currentSlotAudio = this.spinnersAudio[i];

            window.setTimeout(function() {currentSlot.stop = true; currentSlotAudio.pause();}, nextTimeout);
        }
    }
    this.draw = function(){
        if(this.stop){
            return
        }
        this.drawSlotFrame();
    }

    this.calcWinner = function() {
        
    }
}

function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function randomChoice(start, interval, choices){
    var rand = Math.floor(Math.random() * (choices - start)) + start;
    rand = rand + start;
    return rand * interval;
}

function handleWinner(slotValues, winFunc) {
    // Setup
    let song = document.getElementById("music-src");
    let holyChant = document.getElementById("holy-chant-src");


    // Girls in the image as indexes (* -677)
    // Hibiki: 0
    // Tsubasa: 1
    // Chris: 2
    // Maria: 3
    // Shirabe: 4
    // Kirika: 5

    // Handle all the solo songs
    // slotValues = [1,1,1,0,0,0];
    for (let i = 0; i < slotValues.length; i++) {
        let currentSlotValue = slotValues[i];
        let color = () => "rgba(0, 0, 0, 0)"
        if (currentSlotValue == 3) {
            switch (i) {
                case 0:
                    // Play Hibiki
                    song.setAttribute("src", "audio/songs/Seigi_wo_Shinjite,_Nigiri_Shimete.oga");
                    holyChant.setAttribute("src", "audio/holy-chants/Gungnir_Holy_Chant_(Hibiki).oga");
                    color = () => "rgb(255, 103, 0)"
                    break;
                case 1:
                    // Play Tsubasa
                    song.setAttribute("src", "audio/songs/Gekkō_no_Tsurugi.oga");
                    holyChant.setAttribute("src", "audio/holy-chants/Ame_no_Habakiri_Holy_Chant.oga");
                    color = () => "rgb(30, 92, 188)";
                    break;
                case 2:
                    // Play Chris
                    song.setAttribute("src", "audio/songs/TRUST_HEART_(IGNITED_arrangement).oga");
                    holyChant.setAttribute("src", "audio/holy-chants/Ichaival_Holy_Chant.oga");
                    color = () => "rgb(207, 5, 5)";
                    break;
                case 3:
                    // Play Maria
                    song.setAttribute("src", "audio/songs/Shirogane_no_Honō_-keep_the_faith-.ogg");
                    holyChant.setAttribute("src", "audio/holy-chants/Airgetlam_Holy_Chant_(Maria).oga");
                    color = () => "rgb(252, 179, 179)";
                    break;
                case 4:
                    // Play Shirabe
                    song.setAttribute("src", "audio/songs/Melodious_Moonlight.oga");
                    holyChant.setAttribute("src", "audio/holy-chants/Shul_Shagana_Holy_Chant.oga");
                    color = () => "rgb(241, 97, 176)";
                    break;
                case 5:
                    // Play Kirika
                    song.setAttribute("src", "audio/songs/Mikansei_Ai_Mapputatsu!.ogg");
                    holyChant.setAttribute("src", "audio/holy-chants/Igalima_Holy_Chant.oga");
                    color = () => "rgb(146, 230, 152)";
                    break;
            }

            let audio = document.getElementById("holy-chant");
            audio.volume = .8;
            audio.load();
            audio.play();

            window.setTimeout(()=>winFunc(color), 10000); // Delay playing the music until after the chant
            return true;
        }
    }

    // Tsubasa Duets
    if (slotValues[1]) {
        let xValue = slotValues[1];
        if (slotValues[2] + xValue == 3) {
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
            winFunc(color);
            return true;
        } else if (slotValues[4] + xValue == 3) {
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
            winFunc(color);
            return true;
        } else if (slotValues[3] + xValue == 3) {
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
            winFunc(color);
            return true;
        }
    }

    // Chris Duets that don't include Tsuasa
    if (slotValues[2]) {
        let xValue = slotValues[2];
        if (slotValues[3] + xValue == 3) {
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
            winFunc(color);
            return true;
        }
    }

    // Shirabe Duets without Chris or Tsubasa
    if (slotValues[4]) {
        let xValue = slotValues[4];
        if (slotValues[5] + xValue == 3) {
            // Shirabe and Kirika
            song.setAttribute("src", "audio/songs/Cutting-Edge×2-Ready-go.ogg");
            switch (index % 2) {
                case 0:
                    return "rgb(241, 97, 176)"
                case 1:
                    return "rgb(146, 230, 152)"
            }
            winFunc(color);
            return true;
        }
    }

    // Truets? Songs with 3 symphogears
    if (slotValues[0] && slotValues[1]&& slotValues[2]) {
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
            winFunc(color);
            return true;
    }

    if (slotValues[3] && slotValues[4]&& slotValues[5]) {
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
            winFunc(color);
            return true;
    }

    return false;
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

                handleWinner(slotMachine.slotValues, function(stokeColor) {
                    let smallWinAudio = document.getElementById("smallwin");
                    smallWinAudio.play();

                    let audio = document.getElementById("music");
                    audio.volume = .8;
                    audio.load();
                    audio.play();

                    window.setTimeout(()=>{
                        audio = document.getElementById("music");
                        startVisualizer(audio.captureStream(), stokeColor);
                        startPulse(stokeColor);
                    }, 1000);
                })
                slotMachine.slotValues = [0,0,0,0,0,0];

            }, 2350);
        }, 1900);
    });
}



window.onload = function(){
    init();
}