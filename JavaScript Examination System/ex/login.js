function login() {
    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();
    let errorMessage = document.getElementById("login-error-message");

    if (!username || !password) {
        errorMessage.textContent = "Both fields are required!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
    
        window.location.href = "exam.html";
    } else {
        errorMessage.textContent = "Invalid username or password!";
    }
}
