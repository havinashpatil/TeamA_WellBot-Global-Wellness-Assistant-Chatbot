// Make sure JS is loaded
console.log("login.js loaded");

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - attaching login event listeners");

  // Login submit button
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", function () {
      console.log("Login submit button clicked");

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (!email || !password) {
        alert("❌ Please fill all fields");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("❌ Please enter a valid email");
        return;
      }

      const data = {
        email: email,
        password: password
      };

      console.log("Login data:", data);

      fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            alert("✅ Login successful! Welcome back, " + result.name);
            localStorage.setItem('token', result.token);
            localStorage.setItem('name', result.name);
            // Clear form
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
            // Redirect to home/chat page (adjust if needed)
            // window.location.href = "index.html"; 
          } else {
            alert("❌ Error: " + result.error);
          }
        })
        .catch(error => {
          console.error("Error:", error);
          alert("❌ Server error. Please try again later.");
        });
    });
  } else {
    console.error("Login submit button not found");
  }

  // Register link
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function () {
      console.log("Register link clicked");
      alert("✅ Redirecting to registration page...");
      window.location.href = "register.html";
    });
  } else {
    console.error("Register link not found");
  }

  // Google Login button
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", function () {
      console.log("Google Login button clicked");
      window.location.href = "http://localhost:5000/auth/google";
    });
  }

  // Check for URL parameters (from Google OAuth redirect)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const name = urlParams.get('name');

  if (token && name) {
    console.log("Found token and name in URL:", { token, name });
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    alert("✅ Google Login successful! Welcome, " + name);
    // Remove query params from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // Redirect to home/chat page
    // window.location.href = "index.html";
  }
});
