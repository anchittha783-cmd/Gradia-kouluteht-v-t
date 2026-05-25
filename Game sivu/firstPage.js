const hero = document.querySelector('.hero');

for (let i = 0; i < 50; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animationDuration = (Math.random() * 5 + 3) + 's';

  hero.appendChild(particle);
}