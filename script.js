let rowNumber = document.querySelector(".row-number-section");
let lastSelectedDiv; // variable for last selected cell or div
let selectedClassDiv = document.querySelector(".selected-cell-div");
let colummTagSection = document.querySelector(".column-tag-section");
let rowNumberSection = document.querySelector(".row-number-section");

let cellSection = document.querySelector(".cell-section");

let dataOBJ = {};

let formulaInputSection = document.querySelector(".formula-input-section");


formulaInputSection.addEventListener("keydown", (e) =>{
    if(e.key == "Enter"){
        let typedFormula = e.currentTarget.value;
        // console.log(typedFormula);

        if(!lastSelectedDiv){
            return;
        }

        let currCellAddress = lastSelectedDiv.getAttribute("data-address");
        let currCellObj = dataOBJ[currCellAddress];
        currCellObj.formula = typedFormula;

        let currCellUpstream = currCellObj.upStream;
        for(let k = 0; k < currCellUpstream.length; k++){
            // remove che kam kracyet aplyala
            removeOverselfFromDownStram(currCellUpstream[k], currCellAddress);
        }
        currCellObj.upStream = [];

        let formulaArray = typedFormula.split(" ");
        let upStream = [];
        // console.log(formulaArray);
        for(let key in formulaArray){
            // console.log(formulaArray[key]);
            let cellAdd = formulaArray[key];
            // console.log(cellAdd);
            if(cellAdd != '+' && cellAdd != '-' && cellAdd != '*' && cellAdd != '/' && isNaN(cellAdd)){
                upStream.push(cellAdd)
            }
        }
        currCellObj.upStream = upStream;
        // console.log(upStream);
        // ata cha jo upstram ahe tyahcya mdhy je ele update zaley tyanchya downstream mdhy aplyala add kra
        for(let  i = 0; i < upStream.length; i++){
            let parCell = upStream[i];
            // console.log(parCell);
            addCurrCellToDownStream(parCell, currCellAddress);
        }

        // evaluate the new value ny using new formula
        let valObj = {};
        for(let i = 0; i < upStream.length; i++){
            let key = upStream[i];
            valObj[key] = dataOBJ[key].value;
        }
        // console.log(valObj);
        for(let key in valObj){
            typedFormula = typedFormula.replace(key, valObj[key]);
        }
        let newVal = eval(typedFormula);
        console.log(newVal);
        currCellObj.value = newVal;

        // update new val on UI
        let currCellUI = document.querySelector(`[data-address = '${currCellAddress}']`);
        currCellUI.innerText = newVal;
        // console.log(currCellObj);

        // downstream cha array ahe tya mdhy je je ele ahet tyanchya values la update kru
        let downStream = currCellObj.downStream;
        for(let i = 0; i < downStream.length; i++){
            updateCell(downStream[i]);
        }
        dataOBJ[currCellAddress] = currCellObj;
        formulaInputSection.value = "";
    }
})


cellSection.addEventListener("scroll", (e) =>{
    // console.log(e.currentTarget.scrollLeft);
    colummTagSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
})

for(let i = 1; i <= 100; i++){
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("row-number");
    rowNumber.append(div);
}


for(let i = 0; i < 26; i++){
    let asciiValue = 65 + i;
    let reqAlphabet = String.fromCharCode(asciiValue);
    let div = document.createElement("div");
    div.innerText = reqAlphabet;
    div.classList.add("column-tag-prperty");
    colummTagSection.append(div);
}


for(let i = 1; i <= 100; i++){
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for(let j = 0; j < 26; j++){

        let asciiValue = 65 + j;
        let reqAlphabet = String.fromCharCode(asciiValue);

        let currAddress = reqAlphabet + i;

        // creating the object for curr cell
        dataOBJ[currAddress] = {
            value : undefined,
            formula : undefined,
            upStream : [],
            downStream : [],
            align : "left",
            color : "black",
            bgColor : "white",
        }

        let cellDiv = document.createElement("div");

        // ithe aplyala 1 add event listner lavaychey je ki direct cell vrun 
        // input collect krte and tya mdhy jya value apn type krtoy tya value
        // sglya obj chya values vr impact krte

        cellDiv.addEventListener("input", (e) =>{
            // 1 -> get the curr cell address by using getAttribute
            let currCellAddress = e.currentTarget.getAttribute("data-address");

            // 2 -> get currCellObject from data object by using that curr cell address
            let currCellObj = dataOBJ[currCellAddress];

            // 3 -> put what ever we are writing into that cell to current cell object's value
            currCellObj.value = e.currentTarget.innerText;

            // 4 ->ata ithe apla jo formula ahe na toh undefined houn jail tevha update it
            currCellObj.formula = undefined;

            // 5 -> ata ithe aplya la aplya (currCell) chya sglya upstram ele mdhy jaun tyanchya downstram mdhun
            // aplyala udvaychet

            let currCellUpstream = currCellObj.upStream;
            for(let k = 0; k < currCellUpstream.length; k++){
                // remove che kam kracyet aplyala
                removeOverselfFromDownStram(currCellUpstream[i], currCellAddress);
            }
            currCellObj.upStream = [];

            // 6 -> ata last cha jo object attribute ahe jo ki downstream tya mdhhya je je ele ahet tya ele chya
            // values update hotil bcz apli value update zaleli ahe nd apn tyanchya formula mdhy ahe

            let currCellDownStream = currCellObj.downStream;
            for(let i = 0; i < currCellDownStream.length; i++){
                // ithe apn generally updation che kam karnar ahe ki je ele mazya downstram mdhy ahet tyanchi
                // value he update cell change krun takel
                let dependantEle = currCellDownStream[i];
                updateCell(dependantEle);
            }
            // update current cell obj into super / data object
            dataOBJ[currCellAddress] = currCellObj;

            console.log(dataOBJ);
        })
        

        cellDiv.classList.add("cell");
        cellDiv.contentEditable = true;

        cellDiv.setAttribute("data-address", currAddress);

        cellDiv.addEventListener("click", (e) => {
            if(lastSelectedDiv){
                lastSelectedDiv.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");

            // console.log(e.currentTarget);

            lastSelectedDiv = e.currentTarget;

            let currentSelectedCellAddress = e.currentTarget.getAttribute("data-address");

            // console.log(currentSelectedCellAddress);
            selectedClassDiv.innerText = currentSelectedCellAddress;
        })

        rowDiv.append(cellDiv)
    }
    cellSection.append(rowDiv);
}

// fake
// dataOBJ["A1"].value = 20;
// dataOBJ["A1"].downStream = ["B1"];
// dataOBJ["B1"].formula = "2 * A1";
// dataOBJ["B1"].upStream = ["A1"]
// dataOBJ["B1"].value = 40;

// let a1Cell = document.querySelector("[data-address='A1']");
// let b1Cell = document.querySelector("[data-address='B1']");
// a1Cell.innerText = 20;
// b1Cell.innerText = 40;

// fake end

// hya function madhy apn childcell la parentchild chya downstream mdhun delete krayche
function removeOverselfFromDownStram(parentCell, childCell){
    // ithe parent che object get kru
    let parentDownStream = dataOBJ[parentCell].downStream;
    
    // ata ithe loop laun parent chya downstream vr traverse krun aplyala child cha cell jo ahe to udvaychay
    let filteredDownStream = [];
    for(let i = 0; i < parentDownStream.lenght; i++){
        if(parentDownStream[i] != childCell){
            filteredDownStream.push(parentDownStream[i]);
        }
    }
    // filter kelela downstram cha jo aaray ahe to punha dataObj chya parent cell la update krun dya
    dataOBJ[parentCell].downStream = filteredDownStream;
}

// hya function mdhy apn value update krtoy karn apn grid chya cell chi value update keleli ahe mhanun
// tyahcya child cell chi value change zali phij

function updateCell(cell){
    let currCellObj = dataOBJ[cell];
    let upStream = currCellObj.upStream;
    let formula = currCellObj.formula;

    // atachya cell chay upstream mdhy khi dusre cells pn present asu shaktat m tya cells chi curr value 
    // aplyala get kravi lagel jene krun apn je atta update krtoy formula mdhy tyaveles aplyala tyachi
    // grj bhasel
    let valObj = {};
    for(let i = 0; i < upStream.length; i++){
        let key = upStream[i];
        valObj[key] = dataOBJ[key].value;
    }
    // update the formula with the help of the valObj
    for(let key in valObj){
        formula = formula.replace(key, valObj[key]);
    }
    // calculate new Value
    let newVal = eval(formula);
    // reflect this on to the UI also
    let cellUi = document.querySelector(`[data-address='${cell}']`);

    // update that
    dataOBJ[cell].value = newVal;
    cellUi.innerText = newVal;
    // ata jashe ki apn value update keleliy tr hya cell la pn downstream asl nd m tyachya ele chi value
    // suddha update hoyla phij 
    // mhanun m apn tyachya downstram vr loop laun recursive call laun update krtoy

    let downStream = currCellObj.downStream;
    for(let i = 0; i < downStream.length; i++){
        // call updateCell function atachya downStream ele sathi
        updateCell(downStream[i]);
    }
}

function addCurrCellToDownStream(parCell, currCell){
    let parCellObj = dataOBJ[parCell];
    let downstram = parCellObj.downStream;
    let newDownStream = [];
    for(let i = 0; i < downstram.length; i++){
        if(downstram[i] != currCell){
            newDownStream.push(downstram[i]);
        }
    }
    newDownStream.push(currCell);
    dataOBJ[parCell].downStream = newDownStream;
}