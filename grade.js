let examName = localStorage.getItem("examName");
let total = localStorage.getItem("totalQuestions");
let correct = localStorage.getItem("correctAnswers");
let wrong = localStorage.getItem("wrongAnswers");
let percentage = localStorage.getItem("percentage");

const exam = document.getElementById("examName");
const submitDate = document.getElementById("submitDate");
const totalQ = document.getElementById("totalQuestions");
const correctQ = document.getElementById("correctAnswers");
const wrongQ = document.getElementById("wrongAnswers");
const score = document.getElementById("score");
const percent = document.getElementById("percentage");

exam.textContent = examName;
submitDate.textContent = new Date().toLocaleString();
totalQ.textContent = total;
correctQ.textContent = correct;
wrongQ.textContent = wrong;
score.textContent = `${correct} / ${total}`;
percent.textContent = `${percentage}%`;

const degree = percentage * 3.6;

const circle = document.querySelector(".score-circle");

circle.style.background =
`conic-gradient(#6C63FF ${degree}deg,
#E5E7EB ${degree}deg)`;


let dashboardBtn = document.getElementById("dashboardBtn");

dashboardBtn.onclick = function () {

    let year = localStorage.getItem("selectedYear");

    if (year == "First Year") {
        window.location.href = "year1.html";
    }
    else if (year == "Second Year") {
        window.location.href = "year2.html";
    }
    else if (year == "Third Year") {
        window.location.href = "year3.html";
    }
    else if (year == "Fourth Year") {
        window.location.href = "year4.html";
    }

};
// ==========================================
// SIDEBAR: LOGOUT & DELETE PROFILE
// ==========================================

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
        let newUsers = users.filter(function (u) { return u.email !== currentUser.email; });
        localStorage.setItem("users", JSON.stringify(newUsers));
        localStorage.removeItem("currentUser");
        alert("Profile Deleted");
        window.location.href = "Signup.html";
    };
}
