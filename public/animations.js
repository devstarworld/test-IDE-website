// Animation script to handle section animations
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section-animate');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.filter = 'blur(0px)';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  sections.forEach((section) => {
    observer.observe(section);
  });
});