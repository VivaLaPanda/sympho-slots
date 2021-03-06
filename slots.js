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

let cheatMode = false;
// cheatMode = [1, 1, 1];
// Girls in the image as indexes (* -677)
// Hibiki: 0
// Tsubasa: 1
// Chris: 2
// Maria: 3
// Shirabe: 4
// Kirika: 5
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
        StopAndReset();

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
            if (cheatMode) {
                currentSlot.stopPosition = cheatMode[i] * -677;
            }
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