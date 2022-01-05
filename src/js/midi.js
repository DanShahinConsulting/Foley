
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

    function onMIDISuccess(midiAccess) {
        for (var input of midiAccess.inputs.values()){
            input.onmidimessage = getMIDIMessage;
        }
        
    }
    
    function getMIDIMessage(message) {
        var command = message.data[0];
        var note = message.data[1];
        var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
    
        switch (command) {
            case 144: // noteOn
                if (velocity > 0) {
                    noteOn(note, velocity);
                } else {
                    noteOff(note);
                }
                break;
            case 128: // noteOff
                noteOff(note);
                break;
            // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
        }
    }

    function noteOn(note,velocity){
        console.log({note,velocity});
        let sounds = $('audio')
            numSounds = sounds.length;
        
        while (note   >= numSounds ){
            note = (numSounds - note) * -1;
        }
        sounds[note].volume = normalize(velocity,127,60);
        $(sounds[note]).addClass('pressed').trigger("play");
    }
    function noteOff(note){
        let sounds = $('audio')
        numSounds = sounds.length;
    
        while (note >= numSounds){
            note = (numSounds - note) * -1;
        }
        console.log({note});
        $(sounds[note]).removeClass('pressed').trigger("pause");
        sounds[note].currentTime = 0;

    }
    
    var normalize = function(val, max, min) { 
        let norm =  (val - min) / (max - min); 
        console.log(norm);
        return norm;
    }

    function onMIDIFailure() {
        console.log('Could not access your MIDI devices.');
    }

    
    
    