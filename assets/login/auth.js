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
    PASSWORD = null;
    EMAIL = null;
    FULL_NAME = null;

document.getElementById("registerBTN").onsubmit = async()=>{

  PASSWORD = document.getElementById("registerPASS").value;
  EMAIL = document.getElementById("registerEMAIL").value;
  FULL_NAME = document.getElementById("registerFNAME").value;


if(!PASSWORD || !EMAIL || !FULL_NAME){
  console.log("PLEASE FILL ALL FIELDS");
  // return;
}


 try {
          const response = await fetch('http://127.0.0.1:8000/submit', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: {'email': `${EMAIL}`}
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


 