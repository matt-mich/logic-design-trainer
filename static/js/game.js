var g_width = 0
var g_height = 0

function set_height_width(){
    g_width = window.innerWidth-10
    g_height = window.innerHeight-200
    return [g_width, g_height]
}

function binary_add_one(bin_array){
    // For out binary arrays, the last bit is the LSB
    // So for this case, we may need to reverse our usual for loop
    var new_arr = [...bin_array]
    var arr_len = bin_array.length
    for(var i = 0; i < arr_len; i++){
        j = arr_len-i-1
        if(new_arr[j] == 0){
            new_arr[j] = 1
            break
        }else{
            new_arr[j] = 0
        }
    }
    // console.log(new_arr.toString().replaceAll(",",""))
    return new_arr
}

function binary_arr2str(bin_array){
    return bin_array.toString().replaceAll(",","")
}
var num_bits = 8
var text_input = null
var OneComp = null
var TwoComp = null


function calc_bin_arrs(bin_array){
    var in_binary_arr = [...bin_array]
            
    for(let i = 0; i < num_bits-bin_array.length; i++){
        in_binary_arr.unshift('0')
    }

    Ones_Comp_Arr = [...in_binary_arr]

    for(let i = 0; i < num_bits; i++){
        if(Ones_Comp_Arr[i] == '1'){
            Ones_Comp_Arr[i] = '0'
        }else{
            Ones_Comp_Arr[i] = '1'
        }
    }

    Twos_Comp_Arr = binary_add_one(Ones_Comp_Arr)
    
    text_input.text = binary_arr2str(in_binary_arr)
    OneComp.text = binary_arr2str(Ones_Comp_Arr)
    TwoComp.text = binary_arr2str(Twos_Comp_Arr)
}


class gameworld extends Phaser.Scene{
    constructor(){
        super({key:"gameworld"});
    }
    preload(){
        // graphics = this.add.graphics()
        // context = this
        // // this.load.image('test_smile','assets/smile_test.png')
       
        // Font from https://github.com/photonstorm/phaser-examples/tree/master/examples/assets/fonts/bitmapFonts
        this.load.bitmapFont('gem','assets/fonts/gem.png','assets/fonts/gem.xml')
    }

    create(){
        this.add.text(10, 10, 'Enter your binary number:', {font: "32px", fill: '#ffffff' });

        text_input = this.add.text(10, 50, '', {font: "32px", fill: '#ffff00' });
        OneComp = this.add.text(10, 150, '', {font: "32px", fill: '#ffff00' });
        TwoComp = this.add.text(10, 250, '', {font: "32px", fill: '#ffff00' });

        var binary_arr = []

        calc_bin_arrs(binary_arr)

        this.input.keyboard.on('keydown', function (event) {
    
            if (event.keyCode === 8 && text_input.text.length > 0)
            {
                text_input.text = text_input.text.substr(0, text_input.text.length - 1);
                if(binary_arr.length > 0){
                    binary_arr.pop()
                }
            }
            else if(event.keyCode == 48 || event.keyCode == 49){
                if(binary_arr.length < num_bits){
                    if(binary_arr.length == 0 && event.keyCode == 48){
                        // Do nothing
                    }else{
                        binary_arr.push(event.key)
                    }
                }
            }
            calc_bin_arrs(binary_arr)


        });

        this.add.text(10, 100, "1's Complement", {font: "32px", fill: '#ffffff' });


        this.add.text(10, 200, "2's Complement", {font: "32px", fill: '#ffffff' });

    }
    update(){

    }
}


window.addEventListener('resize', () => {
    let hw = set_height_width()
    game.scale.resize(hw[0], hw[1]);
   // scene.cameras.main.setViewport(0,0,w,h)
   // Useful trick from: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
   let vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`); 
});
