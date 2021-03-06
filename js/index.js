var buttons = 320,
	rows = 20;
	
var Beat1="[;7:2 ;8:1 ;3:1 ;4:1 ;3:1 ;19:1 ;1:1 ;2:2 ;2:1 ;1:1 ;21:1 ;8:1 ;9:4 ;7:3 ;8:3 ;1:1 ;14:1 ;1:1 ;12:1 ;3:1 ;10:1 ;5:1 ;8:1 ;7:1 ;6:1 ;9:1 ;4:1 ;11:1 ;2:1 ;13:2 ;7:3 ;3:2 ;1:2 ;9:1 ;7:1 ;19:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;3]";
var Beat2="[;9:1 ;1:1 ;16:1 ;3:1 ;1:1 ;1:1 ;1:1 ;1:1 ;2:1 ;2:1 ;11:1 ;1:1 ;3:1 ;8:1 ;4:1 ;3:1 ;1:1 ;1:1 ;1:1 ;3:1 ;2:2 ;19:1 ;63:1 ;25:1 ;3:1 ;3:1 ;2:2 ;4:2 ;10:1 ;1:1 ;14:1 ;3:1 ;2:1 ;1:1 ;1:1 ;1:1 ;1:1 ;2:2 ;1:1 ;2:1 ;7:3 ;21:1 ;2:1 ;1:1 ;2:3 ;1]";
var Beat3="[;4:1 ;14:1 ;1:1 ;12:1 ;10:1 ;3:1 ;5:1 ;1:1 ;1:2 ;1:3 ;7:1 ;11:1 ;6:1 ;8:1 ;6:1 ;10:4 ;6:6 ;4:6 ;30:1 ;3:1 ;9:2 ;2:1 ;1:1 ;8:2 ;2:2 ;1:1 ;6:2 ;4:2 ;5:1 ;1:1 ;13:1 ;9:1 ;3:2 ;2:1 ;3:3 ;5:1 ;7:2 ;1:1 ;20:1 ;7:1 ;1:1 ;1]";
var SpecialBeat="[;1:3 ;1:3 ;1:3 ;1:3 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;2:1 ;2:2 ;2:3 ;1:3 ;2:1 ;2:1 ;1:1 ;1:1 ;3:1 ;1:1 ;2:1 ;2:3 ;1:3 ;1:1 ;1:1 ;2:1 ;18:1 ;1:1 ;1:3 ;1:3 ;2:1 ;2:3 ;1:1 ;1:1 ;1:1 ;1:1 ;2:1 ;2:3 ;1:3 ;1:3 ;2:1 ;2:1 ;1:1 ;1:1 ;1:1 ;1:1 ;7:1 ;1:1 ;1:1 ;1:1 ;1:1 ;4:1 ;18:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:2 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;1:1 ;18:4 ;1:4 ;1:4 ;5:1 ;4:1 ;4:1 ;2:4 ;1:4 ;1:4 ;5:1 ;1:1 ;4:1 ;5:4 ;1:4 ;1:4 ;1]";
var EmptyPreset="[;320]";
var cols = rows;
var wLoaded = false,
	nLoaded = false;

$(document).ready(function() {
	var holder = $('#board .holder'),
		note = $('.note'),
		openHat= $('#board .openHat'),
		closedHat= $('#board .closedHat'),
		snare= $('#board .snare'),
		kick= $('#board .kick');
	var notes = [];
	var instrument = "";
	
	
	var sampleList = ['kick', 'snare', 'openHat', 'closedHat'];
	var sampleListCount = 0;

	for (var i = 0; i < rows; i++) {
			
		if(i<=15){
			notes[i] = new Howl({
				urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/380275/' + i + '.mp3',
					'https://s3-us-west-2.amazonaws.com/s.cdpn.io/380275/' + i + '.ogg'
				],
				onload: loadCount(i + 1)
			});
			instrument = "marimba";
		}else{
			notes[i] = new Howl({
				urls: ['https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav',
					'https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav'
				],
				onload: loadCount(i + 1)
				});
				sampleListCount++;
			}				
	}

	$(window).load(function() {
		bindUserActions();
		initControls();

		wLoaded = true;
		if (nLoaded)
		{
		$('#board').removeClass('loading').addClass('forward');
		
		}

		for (var i = 0; i < rows; i++) {
			bindNote(i);
		}
	});

	function loadCount(i) {
		if (i === rows) {
			nLoaded = true;
			if (wLoaded)
				$('#board').removeClass('loading').addClass('forward');
		}
	}

	function bindNote(currNote) {
		var idea =['holder','openHat', 'closedHat', 'snare', 'kick'];
		for(var i = 0; i<idea.length; i++){
			$('#board .'+idea[i]+':nth-child(' + cols + 'n + ' + currNote + ')')
			.on('webkitAnimationIteration mozAnimationIteration animationiteration', 
			function() {
				if ($(this).hasClass('active')) {
					var currNote = $(this).attr('data-note');
					notes[currNote].play();

					$(this).find('.ripple').addClass('huzzar').delay(500).queue(function() {
						$(this).removeClass('huzzar').dequeue();
					});
				}
			});
		}
	}

	function bindUserActions() {
		$(note).mousedown(function() {
			$(this).toggleClass("active");
			$(this).parent().toggleClass("active");
		});
		$(document).mousedown(function() {
			$(note).bind('mouseover', function() {
				$(this).toggleClass("active");
				$(this).parent().toggleClass("active");
			});
		}).mouseup(function() {
			$(note).unbind('mouseover');
		});
		$("#dialogSave").dialog({
			autoOpen: false,
			modal: true,
			closeText: "&otimes;",
			hide: 200
		});
		$("#dialogLoad").dialog({
			autoOpen: false,
			buttons: [{
				text: "Click to Play",
				click: function() {
					importLoop($(this));
				}
			}],
			modal: true,
			closeText: "&otimes;",
			hide: 200
		});		
		
	}

	function initControls() {
		$('#reset').on('click', function() {
			$('.active').removeClass('active');
		});
		$('#audio').on('click', function() {
			if ($(this).hasClass("mute"))
				Howler.unmute();
			else
				Howler.mute();
			$(this).toggleClass('mute');
			
			var cloneOfOriginalHtml= $(".align").clone();
		});
		$('#save').on('click', function() {
			if ($(".dialog").dialog("isOpen") !== true)
				exportLoop();
		});
		$('#load').on('click', function() {
			if ($(".dialog").dialog("isOpen") !== true)
				$("#dialogLoad").dialog("open");
		});
		$('#beatSelection').on('change',function(){			
			var noteCode = '',
			 noteState,
			 error = false,
			 note;

		var tempHolder=	 document.getElementById("beatSelection").value;
		noteCode = EmptyPreset;
		switch(tempHolder){
			case "Beat1": 
				noteCode=Beat1;
				break;
			case "Beat2":
				noteCode=Beat2;
				break;
			case "Beat3":
				noteCode=Beat3;
				break;
			case "SpecialBeat": 
				noteCode=SpecialBeat;
				break;
			case "EmptyPreset":
				noteCode=EmptyPreset;
				break;
		}
		
		
		
		

		noteCode = noteCode.replace("[", "");
		noteCode = noteCode.replace("]", "");

		if (noteCode.charAt(0) === ":")
			noteState = 1;
		else if (noteCode.charAt(0) === ";")
			noteState = 0;
		else {
			alert("Your note code wasn't recognised");
			error = true;
		}

		if (!error) {
			$('.active').removeClass('active');
			noteCode = noteCode.substr(1);
			var splitCode = noteCode.split(/:|;/g);
			var noteCounter = 0;

			for (i = 0; i < splitCode.length; i++) {
				var currNum = parseInt(splitCode[i]);

				if (noteState) {
					for (var n = 0; n < currNum; n++) {
						noteCounter++;
						note = $('#board span:nth-child(' + noteCounter + ')');
						note.addClass('active');
						note.children().addClass('active');
					}
				} else {
					noteCounter = noteCounter + currNum;
				}
				noteState = !noteState;
			}
		}
			
			
		});
		

		$('.ui-dialog').on('dialogopen', function(event) {
			$('body').addClass('no-overflow');
			Howler.volume(0.3);
			$('#ui-widget-overlay').addClass('visible');
		}).on('dialogclose', function(event) {
			$('body').removeClass('no-overflow');
			Howler.volume(1);
			$('textarea#saveCode').val('');
			$('#ui-widget-overlay').removeClass('visible');
		});
		
	}

		//:x represents ON //;x represents OFF
	function exportLoop() {
		var noteCode = "",
			offCount = 0,
			onCount = 0;

		holder.each(function() {
			if ($(this).hasClass('active')) {
				if (offCount > 0)
					noteCode = noteCode + ";" + offCount;
				onCount++;
				offCount = 0;
			} else {
				if (onCount > 0)
					noteCode = noteCode + ":" + onCount + " ";
				offCount++;
				onCount = 0;
			}
		});
		
		openHat.each(function() {
			if ($(this).hasClass('active')) {
				if (offCount > 0)
					noteCode = noteCode + ";" + offCount;
				onCount++;
				offCount = 0;
			} else {
				if (onCount > 0)
					noteCode = noteCode + ":" + onCount + " ";
				offCount++;
				onCount = 0;
			}
		}); 
		closedHat.each(function() {
			if ($(this).hasClass('active')) {
				if (offCount > 0)
					noteCode = noteCode + ";" + offCount;
				onCount++;
				offCount = 0;
			} else {
				if (onCount > 0)
					noteCode = noteCode + ":" + onCount + " ";
				offCount++;
				onCount = 0;
			}
		}); 
		snare.each(function() {
			if ($(this).hasClass('active')) {
				if (offCount > 0)
					noteCode = noteCode + ";" + offCount;
				onCount++;
				offCount = 0;
			} else {
				if (onCount > 0)
					noteCode = noteCode + ":" + onCount + " ";
				offCount++;
				onCount = 0;
			}
		}); 
		kick.each(function() {
			if ($(this).hasClass('active')) {
				if (offCount > 0)
					noteCode = noteCode + ";" + offCount;
				onCount++;
				offCount = 0;
			} else {
				if (onCount > 0)
					noteCode = noteCode + ":" + onCount + " ";
				offCount++;
				onCount = 0;
			}
		}); 

		if (offCount > 0)
			noteCode = noteCode + ";" + offCount;
		else if (onCount > 0)
			noteCode = noteCode + ":" + onCount;

		$("#saveCode").val("[" + noteCode + "]");
		$("#dialogSave").dialog("open");
	}

	function importLoop(dialog) {
		var noteCode = '',
			 noteState,
			 error = false,
			 note;

		noteCode = dialog.find('textarea#importCode').val();
		dialog.dialog("close");

		noteCode = noteCode.replace("[", "");
		noteCode = noteCode.replace("]", "");

		if (noteCode.charAt(0) === ":")
			noteState = 1;
		else if (noteCode.charAt(0) === ";")
			noteState = 0;
		else {
			alert("Your note code wasn't recognised");
			error = true;
		}

		if (!error) {
			$('.active').removeClass('active');
			noteCode = noteCode.substr(1);
			var splitCode = noteCode.split(/:|;/g);
			var noteCounter = 0;

			for (i = 0; i < splitCode.length; i++) {
				var currNum = parseInt(splitCode[i]);

				if (noteState) {
					for (var n = 0; n < currNum; n++) {
						noteCounter++;
						note = $('#board span:nth-child(' + noteCounter + ')');
						note.addClass('active');
						note.children().addClass('active');
					}
				} else {
					noteCounter = noteCounter + currNum;
				}
				noteState = !noteState;
			}
		}
	}
    

    $("#audio").click(function() {
        $(this).find('i').toggleClass('fa-volume-up fa-volume-off');
    });

    $("#toggle").click(function() {
    	var sampleList = ['kick', 'snare', 'openHat', 'closedHat'];
		var sampleListCount = 0;

    	if(instrument=="marimba"){
    		for (var i = 0; i < rows; i++) {			
				if(i<=15){
					notes[i] = new Howl({
						urls: ['./notes/' + i + '.wav'
						],
						onload: loadCount(i + 1)
					});
					instrument = "marimba";
				}else{
					notes[i] = new Howl({
						urls: ['https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav',
							'https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav'
						],
						onload: loadCount(i + 1)
						});
						sampleListCount++;
						console.log('https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav');
				}				
			}
			instrument="piano";
    	}
    	else if(instrument=="piano"){
    		for (var i = 0; i < rows; i++) {			
				if(i<=15){
					notes[i] = new Howl({
						urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/380275/' + i + '.mp3',
							'https://s3-us-west-2.amazonaws.com/s.cdpn.io/380275/' + i + '.ogg'
						],
						onload: loadCount(i + 1)
					});
					instrument = "marimba";
				}else{
					notes[i] = new Howl({
						urls: ['https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav',
							'https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav'
						],
						onload: loadCount(i + 1)
						});
						sampleListCount++;
						console.log('https://dl.dropboxusercontent.com/u/42386473/cp/samples/' + sampleList[sampleListCount] + '.wav');
				}				
			}
    		instrument = "marimba";
    	}
        
    });

});

/*function loadPresetBeat(){
	var noteCode = document.getElementById("beatSelection").value;
	
	window.alert(noteCode);
		noteCode = noteCode.replace("[", "");
		noteCode = noteCode.replace("]", "");

		if (noteCode.charAt(0) === ":")
			noteState = 1;
		else if (noteCode.charAt(0) === ";")
			noteState = 0;
		else {
			alert("Your note code wasn't recognised");
			error = true;
		}

		if (!error) {
			$('.active').removeClass('active');
			noteCode = noteCode.substr(1);
			var splitCode = noteCode.split(/:|;/g);
			var noteCounter = 0;

			for (i = 0; i < splitCode.length; i++) {
				var currNum = parseInt(splitCode[i]);

				if (noteState) {
					for (var n = 0; n < currNum; n++) {
						noteCounter++;
						note = $('#board span:nth-child(' + noteCounter + ')');
						note.addClass('active');
						note.children().addClass('active');
					}
				} else {
					noteCounter = noteCounter + currNum;
				}
				noteState = !noteState;
			}
		}
	
} */


