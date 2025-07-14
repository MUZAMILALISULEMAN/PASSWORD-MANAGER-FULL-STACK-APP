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
    
  