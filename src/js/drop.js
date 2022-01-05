$(document).ready(function(){
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
        var outerElem =  document.createElement("div");
            var elem = document.createElement("audio");
            var label = document.createElement("span");
            label.innerHTML = audio.name;
            elem.controls = 'controls';
            elem.src = audio.src;
            $(outerElem).addClass('draggable').append( elem).append(label);
            $('#sounds').append(outerElem);
    }
    
    });