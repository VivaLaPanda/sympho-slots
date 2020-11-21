// Girls in the image as indexes (* -677)
// Hibiki: 0
// Tsubasa: 1
// Chris: 2
// Maria: 3
// Shirabe: 4
// Kirika: 5
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
    this.drawFirstFrame = function(){
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.drawFirstFrame();
        }
    }
    this.startSlots = function(){
        let audio = document.getElementById("music");
        audio.pause();

        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.stopPosition = randomChoice(0,-677, 6);
            this.slotValues[(currentSlot.stopPosition / - 677)]++;
            currentSlot.displacement = 100;
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
            nextTimeout += 500;
            let currentSlot = this.slots[i];
            window.setTimeout(function() {currentSlot.stop = true;}, nextTimeout);
        }
    }
    this.draw = function(){
        if(this.stop){
            return
        }
        this.drawSlotFrame();
    }

    this.calcWinner = function() {
        for (let i = 0; i < this.slotValues.length; i++) {
            let currentSlotValue = this.slotValues[i];
            if (currentSlotValue == 2) {
                this.slotValues = [0,0,0,0,0,0];
                return i;
            }
        }

        this.slotValues = [0,0,0,0,0,0];
        return -1;
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

function handleWinner(winInt) {
    let audio = document.getElementById("music");
    let song = document.getElementById("music-src");
    
    switch (winInt) {
        case 0:
            // Play Hibiki
            song.setAttribute("src", "ogg/Seigi_wo_Shinjite,_Nigiri_Shimete.oga");
            break;
        case 1:
            // Play Tsubasa
            song.setAttribute("src", "ogg/Gekkō_no_Tsurugi.oga");
            break;
        case 2:
            // Play Chris
            song.setAttribute("src", "ogg/TRUST_HEART_(IGNITED_arrangement).oga");
            break;
        case 3:
            // Play Maria
            song.setAttribute("src", "ogg/Shirogane_no_Honō_-keep_the_faith-.ogg");
            break;
        case 4:
            // Play Shirabe
            song.setAttribute("src", "ogg/Melodious_Moonlight.oga");
            break;
        case 5:
            // Play Kirika
            song.setAttribute("src", "ogg/Mikansei_Ai_Mapputatsu!.ogg");
            break;
    }
    audio.load();
    audio.play();
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

                let winner = slotMachine.calcWinner();
                if (winner != -1) {
                    handleWinner(winner);
                }

            }, 1550);
        }, 2000);
    });
}



window.onload = function(){
    init();
}