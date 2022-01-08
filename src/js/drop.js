$(document).ready(function(){

    //document.addEventListener( 'keypress', onDocumentKeyPress );
	document.addEventListener( 'keydown', onDocumentKeyDown );
    document.addEventListener( 'keyup', onDocumentKeyUp );

    


    var // where files are dropped + file selector is opened
    $dropRegions = $('.drop-region').not('img'),
    dropRegion = $('.drop-region')[0];
    const userSounds = JSON.parse(localStorage.getItem('userSounds') )|| [];
    $('#clear').on('click', function(){
        localStorage.removeItem('userSounds' );
        $('#sounds').empty();
    })
    
    let containerType ;

    
    getSounds(userSounds);
    $dropRegions.each( function( index, element ) {
        console.log( $( this ).text() );
        let $dropRegion = $(this),
            containerType = $dropRegion.data('type') ;
    
        var fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.accept = "image/*";
        fakeInput.multiple = true;
        
        
        fakeInput.addEventListener("change", function() {
            var files = fakeInput.files;
            handleFiles(files);
        });
        $dropRegion.on('dragenter', preventDefault)
        $dropRegion.on('dragleave', preventDefault)
        $dropRegion.on('dragover', preventDefault)
        $dropRegion.on('drop', preventDefault)
        
        
        
    });
    $dropRegions.on('drop', handleDrop);
    $dropRegions.on('dragover', handleDragOver);
    $dropRegions.on('dragleave', handleDragLeave);
    
    function handleDragOver(e){
        $zone = $(e.target);
        $zone.addClass('drop-enter');
    }
    
    function handleDragLeave(e){
        $zone = $(e.target);
        $zone.removeClass('drop-enter');
    }
    
      
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    
    
    function handleDrop(e) {
        console.log('drop',e)
        var dt = e.originalEvent.dataTransfer,
            files = dt.files,
            fileType = $(e.currentTarget).data('type');
            $zone = $(e.target);
            $zone.removeClass('drop-enter');
    
        if (files.length) {
    
            handleFiles(files,fileType);
            
        } 
    
    }
    
    function handleFiles(files,fileType) {
        for (var i = 0, len = files.length; i < len; i++) {
            if (validateImage(files[i]))
                previewAnduploadImage(files[i],fileType);
        }
    }
    
    function validateImage(image) {
        // check the type
        console.log(image.type)
        var validTypes = ['audio/mpeg','audio/wav','audio/ogg'];
        if (validTypes.indexOf( image.type ) === -1) {
            console.error("Invalid File Type");
            return false;
        }
    
        // check the size
        var maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            console.error("File too large");
            return false;
        }
        
        return true;
    
    }
    
    function previewAnduploadImage(image,fileType) {
        console.log(fileType)
        console.log(image)
        // previewing image
        var audio = document.createElement("audio");
        
        audio.controls = 'controls';
        audio.className = fileType;
        audio.name = image.name;
        //$('#drop').append(audio);

        // read the image...
        var reader = new FileReader();
        reader.onload = function(e) {
            audio.src = e.target.result;
            
            userSounds.push({
                src: e.target.result,
                name: image.name
            })
            localStorage.setItem('userSounds', JSON.stringify(userSounds) );
            createSoundBox(audio);
        }
        reader.readAsDataURL(image);
        
        
    
  
        
    }

    function getSounds(){
        
        userSounds.forEach(createSoundBox);
        $( "#sounds" ).sortable();
    }

    function createSoundBox(audio){
        var outerElem =  document.createElement("li");
        // container =  document.createElement("container");
            var elem = document.createElement("audio");
            var label = document.createElement("span");
            var wave = document.createElement("div");
            var li = document.createElement("div");

            let r = 'x' + (Math.random() + 1).toString(36).substring(7);
            wave.id = r;
            $(wave).addClass('audio-player').addClass('waveform')
            label.innerHTML = audio.name ;

            $(outerElem).addClass('draggable').append(label).append(wave).dblclick(function(){
                if(confirm('really remove it?')){
                    $(this).remove()
                }
            });
            $('#sounds').append(outerElem);

            var wavesurfer = WaveSurfer.create({
                container: `#${r}`,
                vertical: false,
                waveColor: 'steelblue',
                progressColor: 'gray',
                backend: 'MediaElement',
                mediaControls : true,
                responsive : true,
                maxCanvasWidth : 500,
                height: 32,
                // width: 500,
                barWidth: 5,
                barHeight: 5, // the height of the wave
                barGap: 2 // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
            });

            wavesurfer.on('ready', function () {
                //wavesurfer.play();
            });

            $(label).click(function(){
                wavesurfer.playPause();
            });

            wavesurfer.load(audio.src);
    }

    function onDocumentKeyUp( event ) {

        var keyCode = event.keyCode;
        if ( keyCode == 9 ){
            return false;
        }
        //backspace
        if ( keyCode == 8 || keyCode == 9 || keyCode == 91 || keyCode == 32 ) {

            event.preventDefault();
            return false;

        }
        if(event.key >0 && event.key<= 9){
            keyCode = event.key - 1;
        }
        if(event.key == 0){
            keyCode = 10;
        }

        let sounds = $('audio')
        numSounds = sounds.length;
    
        while (keyCode >= numSounds){
            keyCode = (numSounds - keyCode) * -1;
        }
        // sounds[keyCode].currentTime = 0;
        $( `li:nth-child(${keyCode + 1})` ).removeClass('selected')
        $(sounds[keyCode]).removeClass('pressed').trigger("play").blur();
        
    }

    function onDocumentKeyDown( event ) {
        var keyCode = event.keyCode;
        if ( keyCode == 9 ){
            return false;
        }
        //backspace
        if ( keyCode == 8 || keyCode == 91 || keyCode  == 9) {

            event.preventDefault();
            return false;

        }
        let sounds = $('audio')
        if ( keyCode == 32 ) {
            sounds.trigger("pause")
            event.preventDefault();
            return false;

        }

        console.log(event.keyCode)
        
        if(event.key >0 && event.key<= 9){
            keyCode = event.key - 1;
        }
        if(event.key == 0){
            keyCode = 10;
        }


        
        numSounds = sounds.length;
    
        while (keyCode >= numSounds){
            keyCode = (numSounds - keyCode) * -1;
        }

        sounds[keyCode].currentTime = 0;
        $( `li:nth-child(${keyCode + 1})` ).addClass('selected')
        $(sounds[keyCode]).addClass('pressed').trigger("pause").focus();
        // backspace

        

    }

    // function onDocumentKeyPress( event ) {

    //     const keyCode = event.which;

    //     // backspace
    //     console.log(event.key)

    //     if ( keyCode == 8 ) {

    //         event.preventDefault();

    //     } else {

    //         const ch = String.fromCharCode( keyCode );
    //     }

    // }
    
    });