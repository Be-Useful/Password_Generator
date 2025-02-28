const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector(".lengthNumber");
const passwordDisplay=document.querySelector("#data-passwordDisplay");
const copyBtn=document.querySelector(".copyButton");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolsvalue='%#$@*(!)~_+-:;,.{/|&^';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength cicrle color
setIndicator("#ccc");

//set passwordlength
function handleSlider() {
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
     //shadow 
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbolsvalue.length);
    return symbolsvalue.charAt(randNum);
}


function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum= false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
        copyMsg.style.color = "Yellow";
    }
    catch(e) {
        copyMsg.innnerText="failed";
    }
    // to make copied span visible
    copyMsg.classList.add("active");
    
    setTimeout ( function () {
        copyMsg.classList.remove("active");
    }, 2000);

}


inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleSlider();
})

function shufflePassword(array){
    //fisher Yates Method
    for (let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() *(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=> (str+=el));
    return str;
}

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected 
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // let's start the password generation
    password="";

    // let's put the stuff according to checker of chekbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(numberCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolCheck.checked)
        funcArr.push(generateSymbol);
    
    // compulsory addition
    for(let i=0;i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for (let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password=shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value=password;


    // calculate strength
    calcStrength();

});
