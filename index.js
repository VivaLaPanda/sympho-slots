function Slot(canvas, image, picturePositions){
    this.image = image;
    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext("2d"); 
    this.positionOnCanvas = picturePositions;
    this.refreshIntervalId;
    this.stop = false;
    this.slotPosY = 0;
    this.displacement = 100;
    this.stopPosition = randomChoice([0,-677, -1354]);

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
    this.drawFirstFrame = function(){
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.drawFirstFrame();
        }
    }
    this.startSlots = function(){
        for(let i = 0; i < this.slots.length; i++){
            let currentSlot = this.slots[i];
            currentSlot.stopPosition = randomChoice([0,-677, -1354]);
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
}


function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function randomChoice(array){
    var rand = Math.random();
    rand *= array.length;
    return array[Math.floor(rand)];
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
            }, 1550);
        }, 2000);
    });
}



window.onload = function(){
    init();
}