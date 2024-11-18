const login = async () => {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const response = await axios.post('http://localhost:8000/api/login', { email, password });
        if (response.status === 200 && response.data.token) {
            localStorage.setItem("token", response.data.token);
            window.location.href = "home.html";
        } else {
            console.log("Login failed: Invalid credentials");
            alert("Login failed. Please check your email and password.");
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Login failed. Please try again.");
    }
};
