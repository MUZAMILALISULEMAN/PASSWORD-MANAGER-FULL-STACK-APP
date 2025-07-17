// Global variables for input fields
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
              type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
              '<i class="fas fa-info-circle"></i>'}
        </div>
        <div class="toast-message">${message}</div>
        <div class="toast-close"><i class="fas fa-times"></i></div>
    `;
    
    // Add to container
    const container = document.querySelector('.toast-container');
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
    
    // Close button event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
}

// Create toast container if it doesn't exist
function initToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

// Clear login form fields
function clearLoginFields() {
    loginEmail.value = '';
    loginPassword.value = '';
}

// Clear registration form fields
function clearRegisterFields() {
    registerName.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
    registerConfirm.value = '';
}

// Tab switching functionality
function initTabSwitching() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${target}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Switch between forms
    document.getElementById('switch-to-register').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.auth-tab[data-tab="register"]').click();
    });
    
    document.getElementById('switch-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.auth-tab[data-tab="login"]').click();
    });
}

// Password visibility toggle
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye-slash');
            icon.classList.toggle('fa-eye');
        });
    });
}

let otpTimer;
let otpCode = "";
let userEmail = "";

// Generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Start OTP timer
function startOTPTimer() {
    let timeLeft = 300;
    
    document.getElementById('timer').textContent = "05:00";
    
    otpTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            document.getElementById('resend-otp').style.opacity = "1";
            document.getElementById('resend-otp').style.pointerEvents = "auto";
        }
    }, 1000);
}

// Send OTP to email (simulated)
// function sendOTP(email) {
//     userEmail = email;
//     otpCode = generateOTP();
    
//     // Simulate API call to send OTP
//     showToast(`OTP sent to ${email}`, 'info');
    
//     // Show OTP form
//     document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
//     document.getElementById('verify-otp-form').classList.add('active');
    
//     // Start timer
//     startOTPTimer();
    
//     // Disable resend button temporarily
//     document.getElementById('resend-otp').style.opacity = "0.5";
//     document.getElementById('resend-otp').style.pointerEvents = "none";
// }

// Verify OTP
function verifyOTP() {
    const enteredOTP = Array.from({length: 6}, (_, i) => 
        document.getElementById(`otp${i+1}`).value
    ).join('');
    
    if (!enteredOTP || enteredOTP.length !== 6) {
        showToast('Please enter the complete OTP code', 'error');
        return false;
    }
    
    if (enteredOTP === otpCode) {
        // Clear timer
        clearInterval(otpTimer);
        
        // Show success
        document.querySelector('.auth-container').classList.add('verified');
        showToast('Account verified successfully!', 'success');
        
        // Redirect to login after delay
        setTimeout(() => {
            document.querySelector('.auth-container').classList.remove('verified');
            document.querySelector('.auth-tab[data-tab="login"]').click();
            showToast('Your account is now active. Please login.', 'success');
        }, 3000);
        
        return true;
    } else {
        showToast('Invalid OTP code. Please try again.', 'error');
        return false;
    }
}

// Initialize OTP functionality
function initOTP() {
    // Setup OTP input navigation
    const otpInputs = document.querySelectorAll('.otp-digit');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    // OTP form submission
    document.getElementById('verify-otp-form').addEventListener('submit', function(e) {
        e.preventDefault();
        verifyOTP();
    });
    
    // Resend OTP
    document.getElementById('resend-otp').addEventListener('click', function(e) {
        e.preventDefault();
        if (userEmail) {
            sendOTP(userEmail);
        }
    });
}



// Form submission handlers
function initRegisterFormSubmission() {

    // Registration form
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = registerName.value;
        const email = registerEmail.value;
        const password = registerPassword.value;
        const confirmPassword = registerConfirm.value;
        
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Simulate registration
        showToast('Creating account...', 'info');
        
        // In a real app, you would make an API call here
        showToast('Account created! Verifying email...', 'success');
        
        // Send OTP to email
        setTimeout(() => {
            sendOTP(email);
        }, 1500);
    });
}
const zapContainer = document.createElement('div');
zapContainer.id = 'zap-container';
document.body.appendChild(zapContainer);

// Add styles to prevent scrollbar issues
const styleFix = document.createElement('style');
styleFix.textContent = `
  #zap-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  
  body {
    overflow: hidden;
  }
  
  .neon-zap {
    position: absolute;
    width: 2px;
    height: 100px;
    background: rgba(255, 20, 147, 0.9);
    box-shadow:
      0 0 6px rgba(255, 20, 147, 0.9),
      0 0 12px rgba(255, 20, 147, 0.8),
      0 0 24px rgba(255, 20, 147, 0.6);
    transform: rotate(var(--angle)) scaleY(1.2);
    animation: zapFlash 0.8s ease-out forwards;
    opacity: 0;
  }
  
  @keyframes zapFlash {
    0% {
      opacity: 0;
      transform: scaleY(0.6) rotate(var(--angle));
      filter: blur(0.5px);
    }
    25% {
      opacity: 1;
      transform: scaleY(1.2) rotate(var(--angle));
      filter: blur(1px);
    }
    50% {
      opacity: 0.8;
      filter: blur(2px);
    }
    100% {
      opacity: 0;
      transform: scaleY(1) rotate(var(--angle));
      filter: blur(3px);
    }
  }
`;
document.head.appendChild(styleFix);
// Security zap animations
function initSecurityZaps() {
    function createZap() {
        const zap = document.createElement('div');
        zap.className = 'neon-zap';
        
        // Get viewport dimensions
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        // Calculate safe position (within viewport)
        const left = Math.random() * (vw - 20) + 10; // 10px padding
        const top = Math.random() * (vh - 120) + 10; // 120px is zap height + padding
        
        zap.style.setProperty('--angle', `${Math.random() * 360}deg`);
        zap.style.left = `${left}px`;
        zap.style.top = `${top}px`;
        
        zapContainer.appendChild(zap);
        
        setTimeout(() => {
            zap.remove();
        }, 1000);
    }
    
    setInterval(createZap, 2000);
    createZap();
}
// Initialize everything
function initAuthPage() {
    initToastContainer();
    initTabSwitching();
    initPasswordToggle();
    initRegisterFormSubmission();
    initSecurityZaps();
    initOTP();
}

// Initialize the page
initAuthPage();
    
//     let PASSWORD = "";
//     let EMAIL = "";
//     let FULL_NAME = "";
    
//     function clearVariables(){
//       PASSWORD = "";
//       EMAIL = "";
//       FULL_NAME = "";
//     }
    
    

// // REGISTER
//   let REG_PASSWORD = document.getElementById("registerPASS");
//   let REG_PASSWORD_CONFIRM = document.getElementById("registerPASSCONFIRM");
//   let REG_EMAIL = document.getElementById("registerEMAIL");
//   let REG_FULL_NAME = document.getElementById("registerFNAME");

// function regformClear(){
//     REG_PASSWORD.value = "";
//     REG_PASSWORD_CONFIRM.value = "";
//     REG_EMAIL.value = "";
//     REG_FULL_NAME.value = "";
//     }

// function isValidEmail(email) {
//   const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return pattern.test(email);
// }


// document.getElementById("signupForm").onsubmit = async(e)=>{
//   e.preventDefault();
//   clearVariables();
// if(REG_PASSWORD.value !== REG_PASSWORD_CONFIRM.value){
//   console.log("PASSWORD DONT MATCH")
//   return;
// }
// if(!isValidEmail(REG_EMAIL)){
//   console.log("PLEASE ENTER VALID EMAIL"); 
//   return;
// }
// if(REG_PASSWORD.value < 6){
//   console.log("TOO SMALL, MINIMUM PASSWORD LENGTH IS 8");  
//   return;
// }

//   PASSWORD = REG_PASSWORD.value;  
//   EMAIL = REG_EMAIL.value;
//   FULL_NAME = REG_FULL_NAME.value;



// try {

//           const response = await fetch('http://127.0.0.1:8000/submit', {
//             method: "POST",
//             headers: {
//                 "Cache-Control": "no-cache",
//                 "Pragma": "no-cache",
//                 'Content-Type': 'application/json',
//             },
//             body :JSON.stringify({ email: EMAIL })
//           });

//           const result = await response.json();

//           if(result.status === "success"){
//               console.log(result.message);

//           }else{
//             console.log(result.message);
//           }
          
//   }
// catch{
// console.log("NETWORK ISSUE");
// }


// }


 