let visualizerStopped = false;
function startVisualizer(stream, strokeColor) {
    visualizerStopped = false;
    //main block for doing the audio recording
    let chunks = [];
    const mediaRecorder = new MediaRecorder(stream);

    // visualiser setup - create web audio api context and canvas

    let audioCtx;
    const visCanvas = document.querySelector('#visualizer');
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
    const visCanvas = document.querySelector('#visualizer');
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

        container.setAttribute("style", "background-color: " + color(index) + ";background-blend-mode: multiply;")
        index ++;

        window.setTimeout(() => pulse((polarity + 1) % 2, index), 384 / 4)
    }

    pulse(0, 0);
}

function stopPulse() {
    pulseStopped = true;
    let container = document.querySelector(".container");
    container.setAttribute("style", "background-color: rgba(200,100,0, 0);background-blend-mode: multiply;")
}