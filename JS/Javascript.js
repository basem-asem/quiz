console.log("Hello Basem");

let el = document.querySelector(".scroller");
let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
window.addEventListener("scroll", () => {
    let scrollTop = document.documentElement.scrollTop;
    let pes = ((scrollTop / height) * 100);
    el.style.width = `${pes}%` ;
});
// //currency exchange
// fetch("https://api.currencyfreaks.com/latest?apikey=8c223df06c874c298575f37ec5ef68e6")
// .then((result) => {
    //     let myData = result.json();
//     return myData;
// }).then((currency) => {
//     let amount = document.querySelector(".amount");
//     let egpPrice = document.querySelector(".egp span");
//     let sarPrice = document.querySelector(".sar span");
//     egpPrice.innerHTML = Math.round(amount.innerHTML * currency.rates["EGP"]);
//     sarPrice.innerHTML = Math.round(amount.innerHTML * currency.rates["SAR"]);
// })
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let Results = document.querySelector(".results");
let theCountdown = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestions() {
    let myrequest = new XMLHttpRequest();

    myrequest.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200) {
            //console.log(this.responseText);
            let questionObj = JSON.parse(this.responseText);
            let qCount = questionObj.length;
            // console.log(qCount);
            // console.log(questionObj);
            //create bullets + Set Question Count
            createBullets(qCount);
            //add question data
            addQuestionData(questionObj[currentIndex], qCount);
            //start countdown 
            countdown(5, qCount);
            //click on submit
            submitButton.onclick = () => {
                //get the correct answer
                let correctAnswer =  questionObj[currentIndex].right_answer;
                //increase index
                currentIndex++;
                //check the answer
                checkAnswer (correctAnswer, qCount);

                //remove quiz area + answer area
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                addQuestionData(questionObj[currentIndex], qCount);
                //handle Bullets class
                handleBullets();
                //start countdown 
                clearInterval(countdownInterval);
                countdown(5, qCount);
                //show results
                showResult(qCount);
            }
        }
    };
    
    myrequest.open("GET", "JS/htmlQ.json", true);
    myrequest.send();
    
}
getQuestions();
function createBullets(num) {
    countSpan.innerHTML = num;
    //create span
    for(let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        //che
        if (i === 0) {
            theBullet.className = "on"
        }
        //append bullets to main bullets container
        bulletSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
            //create h2 Question titles
    let questionTitle = document.createElement("h2");
    //create question text 
    let questionText = document.createTextNode(obj[`title`])//or(obj.title)
    //append text to h2
    questionTitle.appendChild(questionText);
    //append h2 to quiz-area
    quizArea.appendChild(questionTitle);
    //create the answers
    for (let i = 1; i<5;i++){
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";
        //create radio input
        let input = document.createElement("input");
        input.name = "question";
        input.type = "radio";
        input.id = `answer_${i}`;
        input.dataset.answer = obj[`answer_${i}`];
        //make first option checked
        if (i === 1) {
            input.checked = true;
        }
        // create label
        let labels = document.createElement("label");
        labels.htmlFor = `answer_${i}`;
        // create answer text
        let answersText = document.createTextNode(obj[`answer_${i}`]);
        //append answers to label
        labels.appendChild(answersText);
        //append input to mainDiv
        mainDiv.appendChild(input);
        mainDiv.appendChild(labels);
        answersArea.appendChild(mainDiv);
    }
    }
}
function checkAnswer (correct, count) {
    let answers =document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i< answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    // console.log(`Right Answer Is ${correct}`);
    // console.log(`choosen Answer Is ${theChoosenAnswer}`);
    if (correct === theChoosenAnswer) {
        rightAnswer++;
        // change bullet color if the answer is right

        // let bulletsSpans = document.querySelectorAll(".bullets .spans span")
        // let arrayOfSpans = Array.from(bulletsSpans); 
        // arrayOfSpans.forEach((span, index) => {
        //     if (currentIndex === index) {
        //         span.style.backgroundColor = "#009688"
        //     }
        // })
    }
}
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span") 
    let arrayOfSpans = Array.from(bulletsSpans); 
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResult(count) {
    let theResult;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswer > (count / 2) && rightAnswer < count) {
            theResult = `<span class="good">Good</span>, ${rightAnswer} From ${count} Is Good.`;
        } else if (rightAnswer === count){
            theResult = `<span class="perfect">Perfect</span>,All Answers Are Perfect.`;
        } else {
            theResult = `<span class="bad">Bad</span>, ${rightAnswer} From ${count} Is Not Good.`;
        }
        Results.innerHTML = theResult;
        Results.style.padding = "10px";
        Results.style.backgroundColor = "white";
        Results.style.marginTop = "10px";
    }
}
function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function (){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes<10 ? `0${minutes}` : minutes;
            seconds = seconds<10 ? `0${seconds}` : seconds;

            theCountdown.innerHTML = `${minutes}:${seconds}`

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
                
            }
        }, 1000)
    }
}