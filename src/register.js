const register = async () => {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await axios.post('http://localhost:8000/api/register', {
            email,
            password
        });

        // Check if registration was successful
        if (response.data.message === "Insert Success") {
            alert("Registration successful!");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert("Registration failed: " + response.data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
    }
};
