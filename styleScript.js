let allAlignProperties = document.querySelectorAll(".align-options span");
let colorOptions = document.querySelectorAll(".color-options span");
let body = document.querySelector("body");
let boldItalianUnderline = document.querySelectorAll(".bold-italic-inderline span");

let backGroundColorPicker = colorOptions[0];
let fontColorPicker = colorOptions[1];

let leftAlign = allAlignProperties[0];
let centreAlign = allAlignProperties[1];
let rightAlign = allAlignProperties[2];

leftAlign.addEventListener("click", (e) =>{
    if(lastSelectedDiv){
        lastSelectedDiv.style.textAlign = "left";
        let address = lastSelectedDiv.getAttribute("data-address");
        dataOBJ[address].align = "left";
    }
})

centreAlign.addEventListener("click", (e) =>{
    if(lastSelectedDiv){
        lastSelectedDiv.style.textAlign = "center";
    }
    let address = lastSelectedDiv.getAttribute("data-address");
    dataOBJ[address].align = "center";
})

rightAlign.addEventListener("click", (e) =>{
    if(lastSelectedDiv){
        lastSelectedDiv.style.textAlign = "right";
    }
    let address = lastSelectedDiv.getAttribute("data-address");
    dataOBJ[address].align = "right";
})

// color implementation
backGroundColorPicker.addEventListener("click", () =>{
    let colorPickerEle = document.createElement("input");
    colorPickerEle.type = 'color';
    colorPickerEle.classList.add("colorpicker-properties");
    body.append(colorPickerEle);
    colorPickerEle.click();
    
    //input color
    colorPickerEle.addEventListener("input", (e) =>{
        // console.log(e.currentTarget.value);
        if(lastSelectedDiv){
            lastSelectedDiv.style.backgroundColor = e.currentTarget.value;
            let address = lastSelectedDiv.getAttribute("data-address");
            dataOBJ[address].bgColor = e.currentTarget.value;
        }
    })
})

fontColorPicker.addEventListener("click", () =>{
    let colorPickerEle = document.createElement("input");
    colorPickerEle.type = 'color';
    colorPickerEle.classList.add("colorpicker-properties");
    body.append(colorPickerEle);
    colorPickerEle.click();

    //input color
    colorPickerEle.addEventListener("input", (e) =>{
        // console.log(e.currentTarget.value);
        if(lastSelectedDiv){
            lastSelectedDiv.style.color = e.currentTarget.value;
            let address = lastSelectedDiv.getAttribute("data-address");
            dataOBJ[address].color = e.currentTarget.value;
        }
    })
})

// let bold = boldItalianUnderline[0];
// let italic = boldItalianUnderline[1];
// let underlined = boldItalianUnderline[2];

// body.addEventListener("clicl", (e) =>{
//     if(lastSelectedDiv){
//         lastSelectedDiv.style.fontWeight = "bold";
//     }
// })
