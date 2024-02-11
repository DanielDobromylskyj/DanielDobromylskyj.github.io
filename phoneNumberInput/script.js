function zfill(str, width) {
    var paddedString = str.toString();
    while (paddedString.length < width) {
        paddedString = '0' + paddedString;
    }
    return paddedString;
}

var slider = document.getElementById("mySlider");
var output = document.getElementById("sliderValue");

var rotation = 0;

var rotationVel = 0;
var sliderVel = 0;

var gravity = -0.1;
var mass = 5;

var force = mass * gravity;

output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = zfill(this.value, 10);
  sliderVel = 0
}




function update() {
    ballPos = (slider.value - 5000000000) / 5000000000;

    rotationVel += ballPos * force

    rotation += rotationVel * deltaTime

    if (rotation > 45) {
        rotation = 45;
        rotationVel = -rotationVel * 0.3;
    }
    if (rotation < -45) {
        rotation = -45;
        rotationVel = -rotationVel * 0.3;
    }

    slider.style.transform = "rotate(" + -rotation + "deg)";

    // The BALL
    radians = rotation * (Math.PI / 180);
    delta = Math.acos(radians) * force * Math.sign(rotation);;

    sliderVel += delta * deltaTime;

    if (sliderVel > 10) {
        sliderVel = 10
    }
    if (sliderVel < -10) {
        sliderVel = -10
    }


    sliderVal = parseInt(slider.value)
    if (sliderVal > 9999999999) {
        slider.value = 9999999999;
        sliderVel = 0;
    }

    if (sliderVal < 0) {
        slider.value = 0;
        sliderVel =  0;
    }

    slider.value = sliderVal + ((sliderVel * 50000000 + 50000000) * deltaTime);
    output.innerHTML = zfill(slider.value, 10);


}


var time = 0.01;
var deltaTime = 1 / ((time*1000));
setInterval(update, time*1000);
