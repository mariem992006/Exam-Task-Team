let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

ranking.sort(function (a, b) {
    return b.percentage - a.percentage;
});

let tbody = document.getElementById("rankingBody");

let rows = "";

for (let i = 0; i < ranking.length; i++) {

    rows += `
        <tr ${ranking[i].name === localStorage.getItem("studentName") ? 'class="highlight-row"' : ""}>
            <td>${i + 1}</td>
            <td>${ranking[i].name}</td>
            <td>${ranking[i].score} / ${ranking[i].total}</td>
            <td>${ranking[i].percentage}%</td>
        </tr>
    `;
}

tbody.innerHTML = rows;

let first = ranking[0];
let second = ranking[1];
let third = ranking[2];

let firstName = document.getElementById("firstName");
let firstScore = document.getElementById("firstScore");
let firstPercent = document.getElementById("firstPercentage");

let secondName = document.getElementById("secondName");
let secondScore = document.getElementById("secondScore");
let secondPercent = document.getElementById("secondPercentage");

let thirdName = document.getElementById("thirdName");
let thirdScore = document.getElementById("thirdScore");
let thirdPercent = document.getElementById("thirdPercentage");

if (first) {
    firstName.textContent = first.name;
    firstScore.textContent = `${first.score} / ${first.total}`;
    firstPercent.textContent = `${first.percentage}%`;
} else {
    firstName.textContent = "--";
    firstScore.textContent = "--";
    firstPercent.textContent = "--";
}

if (second) {
    secondName.textContent = second.name;
    secondScore.textContent = `${second.score} / ${second.total}`;
    secondPercent.textContent = `${second.percentage}%`;
} else {
    secondName.textContent = "--";
    secondScore.textContent = "--";
    secondPercent.textContent = "--";
}

if (third) {
    thirdName.textContent = third.name;
    thirdScore.textContent = `${third.score} / ${third.total}`;
    thirdPercent.textContent = `${third.percentage}%`;
} else {
    thirdName.textContent = "--";
    thirdScore.textContent = "--";
    thirdPercent.textContent = "--";
}
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
