//GLOBAL;
const URL = "http://127.0.0.1:8000";
let FULL_NAME;
let EMAIL;
let PASSWORD;
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
function clearFields(tab){
    if(tab==="login"){
        clearRegisterFields()
    }else if(tab === "register"){
        clearLoginFields();
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

function clearVariables(){
FULL_NAME = "";
EMAIL = "";
PASSWORD = "";
}
function showOTPForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('verify-otp-form').classList.add('active');
    startOTPTimer();  // Start the countdown
}

// Tab switching functionality
function initTabSwitching() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            clearFields(target)
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


// Form submission handlers
function initRegisterFormSubmission() {
    
    // Registration form
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        clearVariables();
        e.preventDefault();
        const confirmPassword = registerConfirm.value;
        
        if (!registerPassword.value || !registerEmail.value || !registerPassword.value || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (registerPassword.value !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (registerPassword.value.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }

        //SET GLOBALS
        FULL_NAME = registerName.value;
        EMAIL = registerEmail.value;
        PASSWORD = registerPassword.value;

        try {

          const response = await fetch(`${URL}/submit/`, {
            method: "POST",
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                'Content-Type': 'application/json',
            },
            body :JSON.stringify({ email: EMAIL })
          });
          let result;
try{

    result = await response.json();
}catch{
    showToast("NETWORK ISSUE!","error");
}
        showToast(result.message,result.status);
          if(result.status == "error"){
            return;
          }
          showOTPForm();

          
  }
catch{
showToast("NETWORK ISSUE!","error");
}

clearRegisterFields();
})

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

//OTP
// Add this to your existing auth.js file

// OTP Handling Functions
function initOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-digit');
    
    otpInputs.forEach((input, index) => {
        // Auto-tab between inputs
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        // Handle backspace/delete
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}

function initOTPFormSubmission() {
    const otpForm = document.getElementById('verify-otp-form');
    const otpInputs = document.querySelectorAll('.otp-digit');
    
    otpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect OTP digits   
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        
        if (otp.length !== 6) {
            showToast('Please enter a complete 6-digit code', 'error');
            return;
        }

        try {
            // Show loading state
            const submitBtn = otpForm.querySelector('.auth-button');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFYING...';
            submitBtn.disabled = true;
            
            // Simulate API call
            const response = await fetch(`${URL}/verify/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: EMAIL,
                    otp_code: otp,
                    password:PASSWORD,
                    name:FULL_NAME
                })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                // Add success animation
                otpInputs.forEach(input => input.classList.add('verified'));
                
                showToast('Account verified successfully!', 'success');
                
                // Redirect after delay
                setTimeout(() => {
                    // Switch to login form
                    document.querySelector('.auth-tab[data-tab="login"]').click();
                    clearVariables();
                }, 2000);
            } else {
                showToast(result.message || 'Verification failed', 'error');
                // Reset button state
                submitBtn.innerHTML = '<i class="fas fa-shield-check"></i> VERIFY ACCOUNT';
                submitBtn.disabled = false;
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
            // Reset button state
            const submitBtn = otpForm.querySelector('.auth-button');
            submitBtn.innerHTML = '<i class="fas fa-shield-check"></i> VERIFY ACCOUNT';
            submitBtn.disabled = false;
        }
        clearOTPFields();
    });
    
}

function initResendOTP() {
    document.getElementById('resend-otp').addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Disable link temporarily
        this.style.pointerEvents = 'none';
        this.style.opacity = '0.5';
        
        try {
            const response = await fetch(`${URL}/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: EMAIL })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                showToast('New OTP sent!', 'success');
                // Reset timer
                clearInterval(otpTimer);
                startOTPTimer();
            } else {
                showToast(result.message || 'Failed to resend OTP', 'error');
                // Re-enable link
                this.style.pointerEvents = 'auto';
                this.style.opacity = '1';
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
            // Re-enable link
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';
        }
    });
}

function clearOTPFields() {
    document.querySelectorAll('.otp-digit').forEach(input => {
        input.value = '';
        input.classList.remove('verified');
    });
}

// Update initAuthPage to include OTP functions
function initAuthPage() {
    initToastContainer();
    initTabSwitching();
    initPasswordToggle();
    initRegisterFormSubmission();
    initSecurityZaps();
    initOTPInputs();          // Initialize OTP inputs
    initOTPFormSubmission();  // Initialize OTP form submission
    initResendOTP();          // Initialize resend OTP
    
    // Add form switching for OTP
    document.getElementById('resend-otp').addEventListener('click', (e) => {
        e.preventDefault();
        // Re-send OTP logic will be handled elsewhere
    });
}

// Show OTP form after successful registration


// Initialize the page
initAuthPage();


 