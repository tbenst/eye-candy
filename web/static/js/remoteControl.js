var socket = io();
socket.heartbeatTimeout = 6000000;

function resetButton() {
    const sid = localStorage.getItem("sid")
    socket.emit('reset', {sid: sid})
    document.querySelector(
        "input[name=submitButton][value=start]").disabled = true
    document.querySelector(
        "input[name=submitButton][value=preview]").disabled = true
    document.querySelector(
        "input[name=submitButton][value=estimate-duration]").disabled = true
    document.querySelector(
        "input[name=submitButton][value=video]").disabled = true
    document.querySelector(
        "#load").disabled = false

}

function targetButton() {
    socket.emit('target')
}

function loadButton() {
    const program = document.querySelector("select[name=program]").value
    const video = document.querySelector("select[name=video]").value
    const epl = document.querySelector("textarea[name=epl]").value
    const seed = document.querySelector("input[name=seed]").value
    const sid = localStorage.getItem("sid")
    socket.emit('load', {sid: sid, program: program, seed: seed,
        epl: epl, video: video})

    if (document.querySelector("input[name=sid]")==null) {
        var inputSid = document.createElement("input");
        inputSid.setAttribute("type", "hidden");
        inputSid.setAttribute("name", "sid");
        inputSid.setAttribute("value", sid);
        document.getElementById("stimulus").appendChild(inputSid);
    } else {
        document.querySelector("input[name=sid]").value = sid
    }
    // ensure preRender finishes first
    document.querySelector(
        "input[name=submitButton][value=start]").disabled = true
    document.querySelector(
        "input[name=submitButton][value=preview]").disabled = true
    document.querySelector(
        "input[name=submitButton][value=estimate-duration]").disabled = true
    document.querySelector(
        "input[name=submitButton][value=video]").disabled = true

    document.querySelector(
        "#load").disabled = true

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

function programSelection() {
    let program = document.querySelector("select[name=program] option:checked").value;
    let showSource = true
    if (program=="custom") {
        document.querySelector("#customBox").hidden = false
        showSource = false
    } else {
        document.querySelector("#customBox").hidden = true
    }
    if (program=="video") {
        // show dropdown populated with videoSrc options
        document.querySelector("select[name=video]").hidden = false
    }
    document.querySelector(
        "button#load").disabled = false
    document.querySelector("select[name=save-video]").hidden = true
    if (showSource) {
        document.querySelector("input[value='view source code']").hidden = false
    }
}


socket.on("enableSubmitButton", () => {
    document.querySelector(
        "input[name=submitButton][value=start]").disabled = false
    document.querySelector(
        "input[name=submitButton][value=preview]").disabled = false
    document.querySelector(
        "input[name=submitButton][value=estimate-duration]").disabled = false
    document.querySelector(
        "input[name=submitButton][value=save-video]").disabled = false
    document.querySelector(
        "#load").disabled = false
})
