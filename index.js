const ring1 = document.getElementById("ring1");
const ring2 = document.getElementById("ring2");
const ring3 = document.getElementById("ring3");
const boxes = document.querySelectorAll(".box");
const rings = document.querySelectorAll(".rings");
const ringBox = document.querySelectorAll(".ringBox");
const selectRings = document.getElementById("selectRings");
const minSteps = document.getElementById("minSteps");
const restart = document.getElementById("restart");
let count = 0;
let seconds = 0;
let minutes = 0;
let time = true;

// check moves
const checkSteps = () => {
    count++;
    document.getElementById("steps").innerText = `Steps: ${count}`;
}

// timer
const timer = () => {
    minutes = Math.floor(seconds / 60);
    //console.log(minutes);
    secondTime = Math.floor(seconds % 60);
    secondTime = secondTime.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    minutes = minutes.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
    document.getElementById("time").innerText = `Time: ${minutes}:${secondTime}`;
    seconds++;

    if (time) {
        setTimeout(timer, 1000);
    }
    else {
        seconds = 0;
        minutes = 0;

    }
}

//select rings

let options = document.querySelectorAll('option[selected="selected"]');
options.forEach(function (option) {
    option.selected = true;
});

selectRings.addEventListener("change", (e) => {
    // console.log(e.target.value);
    let selectValue = parseInt(e.target.value);
    for (let i = 4; i <= 8; i++) {
        let selectValueId = "ring" + i;
        let value = document.getElementById(selectValueId);
        if (i <= selectValue) {
            value.classList.remove("hide");
        }
        else {
            value.classList.add("hide");
        }
    }
    switch(selectValue){
        case 4: minSteps.innerText = "Minimum Steps: 15";
        break;
        case 5: minSteps.innerText = "Minimum Steps: 31";
        break;
        case 6: minSteps.innerText = "Minimum Steps: 63";
        break;
        case 7: minSteps.innerText = "Minimum Steps: 127";
        break;
        case 8: minSteps.innerText = "Minimum Steps: 255";
        break;
        default: minSteps.innerText = "Minimum Steps: 7";
    }
    restartGame();
})

//drag start
rings.forEach(element => {
    //console.log(element);
    element.addEventListener("dragstart", (e) => {
        //console.log(count);
        if (count == 0) {
            time = true;
            timer();
        }
        e.dataTransfer.setData('text/plain', e.target.id);
    });

});



//drag end
boxes.forEach(box => {
    box.addEventListener('dragenter', (e) => {
        //console.log(e);
        e.preventDefault();
        box.classList.add("drag-over");
    })
    box.addEventListener('dragover', (e) => {
        e.preventDefault();
        box.classList.add("drag-over");
    });
    box.addEventListener('dragleave', (e) => {
        e.preventDefault();
        box.classList.remove("drag-over");
    });
    box.addEventListener('drop', (e) => {
        checkSteps();
        e.preventDefault();
        box.classList.remove("drag-over");
        const id = e.dataTransfer.getData("text/plain");
        const draggable = document.getElementById(id);

        rings.forEach(r => {
            let firstIdNumber = parseInt(r.id.slice(4, 5));
            let secondIdNumber = (firstIdNumber - 1);

            //prevent from large ring placed on small ring
            for (let i = secondIdNumber; i > 0; i--) {
                let ringSecondId = "ring" + i;
                let secondRing = document.getElementById(ringSecondId);
                if (!box.contains(ring1) &&
                    !box.contains(ring2) &&
                    !box.contains(ring3)) {
                        console.log(box);
                    box.getElementsByClassName("ringBox")[0].appendChild(draggable);
                    checkDraggable();
                }
                else if (box.contains(secondRing)) {
                    checkDraggable();
                }
            }
            //allow small ring placed on large ring
            if (box.contains(r) && r.draggable) {
                for (let i = secondIdNumber; i > 0; i--) {
                    let ringSecondId = "ring" + i;
                    let secondRing = document.getElementById(ringSecondId);
                    if (draggable == secondRing) {
                        box.getElementsByClassName("ringBox")[0].appendChild(draggable);
                        checkDraggable();
                        checkWin();
                    }
                }
            }
        });

    });
});


// draggable true
function draggableOn(ring) {
    ring.draggable = true;
    ring.style.cursor = "pointer";
}
// draggable false
function draggableOff(ring) {
    ring.draggable = false;
    ring.style.removeProperty("cursor");
}

//check draggable or not
function checkDraggable() {
    boxes.forEach(box => {
        rings.forEach(r => {
            let ringFirstId = parseInt(r.id.slice(4, 5));
            let secondIdNumber = (parseInt(r.id.slice(4, 5)) - 1);
            if (box.contains(r)) {
                draggableOn(r);
                for (let i = secondIdNumber; i > 0; i--) {
                    let ringSecondId = "ring" + i;
                    let secondRing = document.getElementById(ringSecondId);
                    if (box.contains(secondRing)) {
                        draggableOff(r);
                    }
                }
            }
        });
    });
}

// check win
function checkWin() {
    let win = false;
    if (ringBox[2].contains(ring1)) {
        win = true;
    }
    else {
        win = false;
    }
    // console.log(win);
    for (let i = 8 - parseInt(selectRings.value); i < 8; i++) {
        //console.log(i);
        if (ringBox[2].contains(rings[i])) {
            win = win && true;
        }
        else {
            win = win && false;
        }
    }
    // console.log(win);
    if (win) {
        document.getElementById("win").innerText = "You Won!!";
        time = false;
        draggableOff(ring1);
    }
}

//restart
restart.addEventListener("click", restartGame);
function restartGame() {
    // console.log(typeof(selectRings.value));
    //console.log(rings);
    for (let i = 8 - parseInt(selectRings.value); i < 8; i++) {
        //console.log(i);
        ringBox[0].appendChild(rings[i]);
    }
    checkDraggable();
    count = 0;
    document.getElementById("steps").innerText = `Steps: ${count}`;
    document.getElementById("win").innerText = "";
    time = false;
    timer();
}