
function Leds (wan, lan, wlan) {

    var offColour = "#999";
    var greenColour = "#00FF00";
    var redColour = "#FF0000";
    
    var allLeds = $([wlan, lan, wan]);

    var systemBoot = [
        { e: wan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: wan, p: { fill: greenColour }, o: { duration: 999 } },
        
        { e: lan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: lan, p: { fill: greenColour }, o: { duration: 999 } },

        { e: wlan, p: { fill: redColour }, o: { duration: 1 } },
        { e: wlan, p: { fill: redColour }, o: { duration: 999 } },

        { e: wan, p: { fill: offColour }, o: { duration: 1 } },
        { e: wan, p: { fill: offColour }, o: { duration: 999 } },
        { e: lan, p: { fill: offColour }, o: { duration: 1 } },
        { e: lan, p: { fill: offColour }, o: { duration:999 } },
        { e: wlan, p: { fill: offColour }, o: { duration: 1 } },
        { e: wlan, p: { fill: offColour }, o: { duration: 999 } }
    ];

    var koalaSafeBoot =[
        { e: wlan, p: { fill: redColour }, o: { duration: 1 } },
        { e: wlan, p: { fill: redColour }, o: { duration: 999 } },
        
        { e: lan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: lan, p: { fill: greenColour }, o: { duration: 999 } },

        { e: wan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: wan, p: { fill: greenColour }, o: { duration: 999 } },

        { e: wlan, p: { fill: offColour }, o: { duration: 1 } },
        { e: wlan, p: { fill: offColour }, o: { duration: 999 } },
        { e: lan, p: { fill: offColour }, o: { duration: 1 } },
        { e: lan, p: { fill: offColour }, o: { duration:999 } },
        { e: wan, p: { fill: offColour }, o: { duration: 1 } },
        { e: wan, p: { fill: offColour }, o: { duration: 999 } }
    ];

    var upgrading = [
        { e: wan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: wan, p: { fill: greenColour }, o: { duration: 500 } },
        { e: wan, p: { fill: offColour }, o: { duration: 1 } },
        
        { e: lan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: lan, p: { fill: greenColour }, o: { duration: 500 } },
        { e: lan, p: { fill: offColour }, o: { duration: 1 } },

        { e: wlan, p: { fill: redColour }, o: { duration: 1 } },
        { e: wlan, p: { fill: redColour }, o: { duration: 500 } },
        { e: wlan, p: { fill: offColour }, o: { duration: 1 } }
    ];

    var offline = [
        { e: wan, p: { fill: greenColour }, o: { duration: 1 } },
        { e: lan, p: { fill: greenColour }, o: { duration: 1, sequenceQueue:false } },
        { e: wlan, p: { fill: redColour }, o: { duration: 1, sequenceQueue:false}},
        { e: wan, p: { fill: greenColour }, o: { duration: 500 } },
        { e: lan, p: { fill: greenColour }, o: { duration: 500, sequenceQueue:false } },
        { e: wlan, p: { fill: redColour }, o: { duration: 500, sequenceQueue:false}},

        { e: wan, p: { fill: offColour }, o: { duration: 1  }},
        { e: lan, p: { fill: offColour }, o: { duration: 1, sequenceQueue:false } },
        { e: wlan, p: { fill: offColour }, o: { duration: 1, sequenceQueue:false}},
        { e: wan, p: { fill: offColour }, o: { duration: 500 } },
        { e: lan, p: { fill: offColour }, o: { duration: 500, sequenceQueue:false } },
        { e: wlan, p: { fill: offColour }, o: { duration: 500, sequenceQueue:false}}
    ];

    var normal = [
        { e: wan, p: { fill: greenColour }, o: { duration: 50, complete: function(elements) {  $(elements).css({"fill": offColour}); } }},
        { e: lan, p: { fill: greenColour }, o: { duration: 90, sequenceQueue:false, complete: function(elements) {  $(elements).css({"fill": offColour}); } }},
        { e: wlan, p: { fill: redColour }, o: { duration: 120, sequenceQueue:false, complete: function(elements) {  $(elements).css({"fill": offColour}); } }}
    ];

    var states = [
        {name:"firmware boot", cmd:function(){ 
            wan.css({"fill":greenColour}); 
        }}, 
        {name:"system boot", sequence: systemBoot}, 
        {name:"KoalaSafe loading", sequence:koalaSafeBoot}, 
        {name:"normal", sequence:normal}, 
        {name:"offline", sequence:offline}, 
        {name:"upgrading", sequence:upgrading}
    ];

    this.reset = function (){
        $.each(allLeds, function(i, led){
            led.velocity("stop", true);
            led.css({ "fill":offColour });
        });
    }

     this.run = function(name, sequence){
        var self = this;
        console.log("Running sequence " + name);
        var completed = [{ e: this.wan, p:{opacity: 1}, o: {complete: function(){
            console.log("Completed sequence " + name);
            self.run(name, sequence);
        }}}];

        // repeating is not smooth, so manually duplicate the sequence
        var actual = sequence;
        for (var i =0; i <5; i++){
            actual = actual.concat(actual);
        }
        $.Velocity.RunSequence(actual.concat(completed));
    }

    this.runIndex = function(index){
        this.reset();
        var state = states[index];
        if ("cmd" in state){
            state.cmd();
        }else{
            this.run(state.name, state.sequence);
        }
    }

};