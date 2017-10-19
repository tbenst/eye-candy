var socket = io();

function resetButton() {
    const sid = localStorage.getItem("sid")
    socket.emit('reset', {sid: sid})
}

function targetButton() {
    socket.emit('target')
}

function loadButton() {
    const program = document.querySelector("select[name=program]").value
    const epl = document.querySelector("textarea[name=epl]").value
    const seed = document.querySelector("input[name=seed]").value
    const sid = localStorage.getItem("sid")
    socket.emit('load', {sid: sid, program: program, seed: seed, epl: epl})

    if (document.querySelector("input[name=sid]")==null) {
        var inputSid = document.createElement("input");
        inputSid.setAttribute("type", "hidden");
        inputSid.setAttribute("name", "sid");
        inputSid.setAttribute("value", sid);
        document.getElementById("stimulus").appendChild(inputSid);
    } else {
        document.querySelector("input[name=sid]").value = sid
    }
}

function toggleRequired() {
    
}

function startButton() {
    document.querySelector(
        "input[name=submitButton][value=start]").disabled = true
    fetch('/start-program', {
        method: 'post',
        body: new FormData(document.getElementById('programYAML')),
        credentials: 'include'
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


socket.on("enableStartButton", () => {
    console.log('enabling start button')
    document.querySelector(
        "input[name=submitButton][value=start]").disabled = false

})