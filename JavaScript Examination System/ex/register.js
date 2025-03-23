

function validateInput(field) {
    let value = document.getElementById(field).value.trim();
    let errorElement = document.getElementById(`${field}-error`);
    
    if (field === 'username') {
        errorElement.textContent = value === '' ? "Username is required!" : "";
    } else if (field === 'email') {
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errorElement.textContent = value === '' ? "Email is required!" : (!emailPattern.test(value) ? "Invalid email format!" : "");
    } else if (field === 'phone') {
        let phonePattern = /^[0-9]{10}$/;
        errorElement.textContent = value === '' ? "Phone number is required!" : (!phonePattern.test(value) ? "Phone number must be 10 digits!" : "");
    } else if (field === 'password') {
        errorElement.textContent = value === '' ? "Password is required!" : (value.length < 6 ? "Password must be at least 6 characters!" : "");
    }
    errorElement.style.display = errorElement.textContent ? "block" : "none";
}

function register() {
    let fields = ['username', 'email', 'phone', 'password'];
    let isValid = true;
    
    fields.forEach(field => {
        validateInput(field);
        if (document.getElementById(`${field}-error`).textContent) {
            isValid = false;
        }
    });
    
    if (!isValid) return; // up-to it => flase
    // true conds
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();
    
    let users = JSON.parse(localStorage.getItem("users")) || []; 
    if (users.some(user => user.email === email)) {
        document.getElementById("email-error").textContent = "Email is already registered!";
        document.getElementById("email-error").style.display = "block";
        return;
    }
    
    users.push({ username, email, phone, password });
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
}
