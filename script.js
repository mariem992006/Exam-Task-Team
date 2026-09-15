const urlParams = new URLSearchParams(window.location.search);
const selectedYear = urlParams.get("year");
const selectedSubject = urlParams.get("subject");

let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 10 * 60;
let timerInterval;

const examPage = document.getElementById("examPage");
const resultPage = document.getElementById("resultPage");

const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");
const restartBtn = document.getElementById("restartBtn");

const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const answersContainer = document.getElementById("answersContainer");

const timer = document.getElementById("timer");

const scoreText = document.getElementById("scoreText");
const percentageText = document.getElementById("percentageText");
const resultMessage = document.getElementById("resultMessage");

const startButtons = document.querySelectorAll(".start-btn");

let selectedPage = "";

function chooseYear(page, year) {

    selectedPage = page;

    document.getElementById("yearBtn").innerText = year;

}

function signUp() {

    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (fullName == "") {
        alert("Please enter your full name");
        return;
    }

    if (email == "") {
        alert("Please enter your email");
        return;
    }

    if (password == "") {
        alert("Please enter your password");
        return;
    }

    if (confirmPassword == "") {
        alert("Please confirm your password");
        return;
    }

    if (password != confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (selectedPage == "") {
        alert("Please select your academic year");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    for (let i = 0; i < users.length; i++) {

        if (users[i].email == email) {

            alert("This email already exists");
            return;

        }

    }

    let user = {

        fullName: fullName,
        email: email,
        password: password,
        academicYearPage: selectedPage

    };

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Registration Successful");

    window.location.href = selectedPage;

}

function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email == "") {
        alert("Please enter your email");
        return;
    }

    if (password == "") {
        alert("Please enter your password");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let currentUser = null;

    for (let i = 0; i < users.length; i++) {

        if (users[i].email == email && users[i].password == password) {

            currentUser = users[i];
            break;

        }

    }

    if (currentUser != null) {

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("Login Successful");

        window.location.href = currentUser.academicYearPage;

    } else {

        alert("Invalid Email or Password");

    }

}

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {

    let userName = document.getElementById("userName");
    let helloName = document.getElementById("helloName");

    if (userName) {
        userName.innerText = currentUser.fullName;
    }

    if (helloName) {
        helloName.innerText = currentUser.fullName;
    }

}
let logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = function () {

        localStorage.removeItem("currentUser");

        window.location.href = "login.html";

    };
}
let deleteBtn = document.getElementById("deleteBtn");

if (deleteBtn) {

    deleteBtn.onclick = function () {

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let currentUser = JSON.parse(localStorage.getItem("currentUser"));

        let newUsers = [];

        for (let i = 0; i < users.length; i++) {

            if (users[i].email != currentUser.email) {

                newUsers.push(users[i]);

            }

        }

        localStorage.setItem("users", JSON.stringify(newUsers));

        localStorage.removeItem("currentUser");

        alert("Profile Deleted");

        window.location.href = "Signup.html";

    };

}
startButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const year = button.dataset.year;
        const subject = button.dataset.subject;

        window.location.href =
            `exam.html?year=${encodeURIComponent(year)}&subject=${encodeURIComponent(subject)}`;

    });

});


if (
    examPage &&
    selectedYear &&
    selectedSubject
) {

    loadExam();

}


async function loadExam() {

    try {

        const response =
            await fetch("./questions.json");


        if (!response.ok) {

            throw new Error(
                "Could not load questions.json"
            );

        }


        const data =
            await response.json();


        console.log("JSON:", data);

        console.log("Year:", selectedYear);

        console.log("Subject:", selectedSubject);


        if (!data[selectedYear]) {

            throw new Error(
                "Year not found: " + selectedYear
            );

        }


        if (!data[selectedYear][selectedSubject]) {

            throw new Error(
                "Subject not found: " + selectedSubject
            );

        }

        questions =
            data[selectedYear][selectedSubject];


        console.log(
            "Questions:",
            questions
        );


        examPage.classList.remove("d-none");


        showQuestion();



        startTimer();

    }


    catch (error) {

        console.error(error);

        alert(
            "ERROR: " + error.message
        );

    }

}


function showQuestion() {

    const question =
        questions[currentQuestion];


    if (!question) {

        return;

    }

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    questionText.textContent =
        question.question;


    answersContainer.innerHTML = "";


    question.options.forEach(
        function (option, index) {

            const label =
                document.createElement("label");


            label.classList.add("answer");


            label.innerHTML = `

                <input
                    type="radio"
                    name="answer"
                    value="${index}"
                >

                ${option}

            `;


            answersContainer.appendChild(label);

        }
    );


    if (currentQuestion === 0) {

        previousBtn.disabled = true;

    }

    else {

        previousBtn.disabled = false;

    }


    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextBtn.innerHTML =
            'Finish <i class="bi bi-check-lg"></i>';

    }

    else {

        nextBtn.innerHTML =
            'Next <i class="bi bi-arrow-right"></i>';

    }

}


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            const selectedAnswer =
                document.querySelector(
                    'input[name="answer"]:checked'
                );


            if (!selectedAnswer) {

                alert(
                    "Please select an answer first!"
                );

                return;

            }

            const selectedIndex =
                Number(selectedAnswer.value);


            const selectedOption =
                questions[currentQuestion]
                    .options[selectedIndex];

            if (
                selectedOption ===
                questions[currentQuestion].answer
            ) {

                score++;

            }

            if (
                currentQuestion ===
                questions.length - 1
            ) {

                finishExam();

                return;

            }

            currentQuestion++;

            showQuestion();

        }
    );

}


if (previousBtn) {

    previousBtn.addEventListener(
        "click",
        function () {

            if (currentQuestion > 0) {

                currentQuestion--;

                showQuestion();

            }

        }
    );

}


function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 7 * 60;


    timerInterval =
        setInterval(
            function () {

                let minutes =
                    Math.floor(timeLeft / 60);


                let seconds =
                    timeLeft % 60;


                if (seconds < 10) {

                    seconds =
                        "0" + seconds;

                }


                timer.textContent =
                    `${minutes}:${seconds}`;


                timeLeft--;


                if (timeLeft < 0) {

                    clearInterval(timerInterval);

                    finishExam();

                }

            },
            1000
        );

}


// ==========================================
// FINISH EXAM
// ==========================================

function finishExam() {

    clearInterval(timerInterval);

    const percentage =
        Math.round(
            (score / questions.length) * 100
        );

    const wrongCount = questions.length - score;

    // Save this attempt's results so grade.html can show them
    localStorage.setItem("examName", selectedSubject);
    localStorage.setItem("selectedYear", selectedYear);
    localStorage.setItem("totalQuestions", questions.length);
    localStorage.setItem("correctAnswers", score);
    localStorage.setItem("wrongAnswers", wrongCount);
    localStorage.setItem("percentage", percentage);
    localStorage.setItem("studentName", currentUser ? currentUser.fullName : "Guest");

    // Add this attempt to the exam history log (used by history.html)
    let examHistory = JSON.parse(localStorage.getItem("examHistory")) || [];

    examHistory.push({
        examName: selectedSubject,
        date: new Date().toLocaleDateString(),
        totalQuestions: questions.length,
        score: score,
        percentage: percentage
    });

    localStorage.setItem("examHistory", JSON.stringify(examHistory));

    // Add this attempt to the ranking board (once per attempt, not per page view)
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({
        name: currentUser ? currentUser.fullName : "Guest",
        score: score,
        total: questions.length,
        percentage: percentage
    });

    localStorage.setItem("ranking", JSON.stringify(ranking));

    // Go to the full results page
    window.location.href = "grade.html";

}