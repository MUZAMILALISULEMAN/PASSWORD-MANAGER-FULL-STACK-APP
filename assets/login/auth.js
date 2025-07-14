  const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.width = `${Math.random() * 5 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particlesContainer.appendChild(particle);
    }
    
    // Flip card function
    function flipCard() {
      const card = document.getElementById('authCard');
      card.classList.toggle('flipped');
    }
 

    
    let PASSWORD = "";
    let EMAIL = "";
    let FULL_NAME = "";
    
    function clearVariables(){
      PASSWORD = "";
      EMAIL = "";
      FULL_NAME = "";
    }
    
    

// REGISTER
  let REG_PASSWORD = document.getElementById("registerPASS");
  let REG_PASSWORD_CONFIRM = document.getElementById("registerPASSCONFIRM");
  let REG_EMAIL = document.getElementById("registerEMAIL");
  let REG_FULL_NAME = document.getElementById("registerFNAME");

function regformClear(){
    REG_PASSWORD.value = "";
    REG_PASSWORD_CONFIRM.value = "";
    REG_EMAIL.value = "";
    REG_FULL_NAME.value = "";
    }

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}


document.getElementById("signupForm").onsubmit = async(e)=>{
  e.preventDefault();
  clearVariables();
if(REG_PASSWORD.value !== REG_PASSWORD_CONFIRM.value){
  console.log("PASSWORD DONT MATCH")
  return;
}
if(!isValidEmail(REG_EMAIL)){
  console.log("PLEASE ENTER VALID EMAIL"); 
}
if(REG_PASSWORD.value < 6){
  console.log("TOO SMALL, MINIMUM PASSWORD LENGTH IS 8");  

}

  PASSWORD = REG_PASSWORD.value;  
  EMAIL = REG_EMAIL.value;
  FULL_NAME = REG_FULL_NAME.value;



try {

          const response = await fetch('http://127.0.0.1:8000/submit', {
            method: "POST",
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                'Content-Type': 'application/json',
            },
            body :JSON.stringify({ email: EMAIL })
          });

          const result = await response.json();

          if(result.status === "success"){
              console.log(result.message);

          }else{
            console.log(result.message);
          }
          
  }
catch{
console.log("NETWORK ISSUE");
}


}


 