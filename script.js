document.addEventListener('DOMContentLoaded', () => {
    
    // Animação de fade-in com IntersectionObserver (mais confiável no mobile)
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: mostra todos os elementos se IntersectionObserver não for suportado
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // Header fixo muda de estilo ao scrolar
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = 'rgba(253, 251, 247, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(253, 251, 247, 0.95)';
        }
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Considerar a altura do header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
