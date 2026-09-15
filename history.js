let history = JSON.parse(localStorage.getItem("examHistory")) || [];

let historyBody = document.getElementById("historyBody");

let totalExamEl = document.getElementById("totalExam");
let averageScoreEl = document.getElementById("averageScore");
let highestScoreEl = document.getElementById("highestScore");
let lastExamEl = document.getElementById("lastExam");

function renderHistory(list) {

    let rows = "";

    list.forEach(function (exam) {

        let status;
        let statusClass;

        if (exam.percentage >= 90) {
            status = "Excellent";
            statusClass = "excellent";
        }

        else if (exam.percentage >= 50) {
            status = "Passed";
            statusClass = "passed";
        }

        else {
            status = "Failed";
            statusClass = "failed";
        }

        rows += `
        <tr>
            <td>${exam.examName}</td>
            <td>${exam.date}</td>
            <td>${exam.totalQuestions}</td>
            <td>${exam.score}/${exam.totalQuestions}</td>
            <td>
                <div class="progress-circle" style="--percent:${exam.percentage};">
                    <span>${exam.percentage}%</span>
                </div>
            </td>
            <td>
                <span class="${statusClass}">
                    <span class="dot"></span>
                    ${status}
                </span>
            </td>
        </tr>
        `;

    });

    historyBody.innerHTML = rows || `<tr><td colspan="7" class="text-center text-muted py-4">No exams taken yet</td></tr>`;

}

function renderStats() {

    totalExamEl.textContent = history.length;

    if (history.length === 0) {
        averageScoreEl.textContent = "0%";
        highestScoreEl.textContent = "0%";
        lastExamEl.textContent = "--";
        return;
    }

    let totalPercentage = 0;
    let highest = 0;

    history.forEach(function (exam) {
        totalPercentage += exam.percentage;
        if (exam.percentage > highest) {
            highest = exam.percentage;
        }
    });

    let average = Math.round(totalPercentage / history.length);

    averageScoreEl.textContent = `${average}%`;
    highestScoreEl.textContent = `${highest}%`;
    lastExamEl.textContent = history[history.length - 1].date;

}

renderStats();
renderHistory(history);

// ==========================================
// SEARCH & FILTER
// ==========================================

let searchInput = document.getElementById("searchInput");
let subjectFilter = document.getElementById("subjectFilter");

function applyFilters() {

    let text = searchInput ? searchInput.value.toLowerCase() : "";
    let subject = subjectFilter ? subjectFilter.value : "All Subjects";

    let filtered = history.filter(function (exam) {

        let matchesText = exam.examName.toLowerCase().includes(text);
        let matchesSubject = subject === "All Subjects" || exam.examName === subject;

        return matchesText && matchesSubject;

    });

    renderHistory(filtered);

}

if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}

if (subjectFilter) {

    // Populate the subject dropdown from the exams actually taken
    let subjects = [...new Set(history.map(function (exam) { return exam.examName; }))];

    subjects.forEach(function (subject) {
        let option = document.createElement("option");
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });

    subjectFilter.addEventListener("change", applyFilters);

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
