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
            if (targetId === '#') return;

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

    // ===================== Modal PIX Jantar =====================
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoyBxYK0sOG4L0Xfb5C7EmO1vRg7lGLXsfJANfElOEDnLnDY-0RdGvpHQEmhmXPHJl/exec';
    const CHAVE_PIX = '116b8803-18bb-4dc9-b0a4-5f13d8f439e1';

    const modal = document.getElementById('modal-pix');
    const btnAbrirPix = document.getElementById('btn-pix-jantar');
    const btnFechar = document.getElementById('modal-pix-close');
    const formPix = document.getElementById('form-pix');
    const btnSubmit = document.getElementById('btn-pix-submit');

    if (btnAbrirPix && !btnAbrirPix.disabled) {
        // Abrir modal
        btnAbrirPix.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.getElementById('pix-nome').focus();
        });
    }

    // Fechar modal
    function fecharModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        formPix.reset();
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        // Resetar para o estado inicial (formulário visível, PIX oculto)
        formPix.style.display = '';
        document.getElementById('pix-reveal').style.display = 'none';
        document.getElementById('pix-copy-feedback').style.display = 'none';
    }
    btnFechar.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });

    // Máscara CPF
    document.getElementById('pix-cpf').addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = v;
    });

    // Máscara Telefone
    document.getElementById('pix-telefone').addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        if (v.length <= 10) {
            v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        this.value = v;
    });

    // Envio do formulário
    formPix.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('pix-nome').value.trim();
        const telefone = document.getElementById('pix-telefone').value.trim();
        const cpf = document.getElementById('pix-cpf').value.trim();
        const email = document.getElementById('pix-email').value.trim();

        // Validação simples
        let valido = true;
        [['pix-nome', nome], ['pix-telefone', telefone], ['pix-cpf', cpf], ['pix-email', email]].forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (!val) { el.classList.add('input-error'); valido = false; }
            else el.classList.remove('input-error');
        });
        if (!valido) return;

        // Feedback no botão
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;

        // Enviar para o Google Sheets (fire-and-forget)
        try {
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    telefone,
                    cpf,
                    email,
                    ingresso: 'Jantar de Networking: Contadoras na Liderança - Dia 24/09 | 18hs',
                    data: new Date().toLocaleString('pt-BR')
                })
            });
        } catch (_) {
            // Mesmo com erro, redireciona para não bloquear o usuário
        }

        // Exibir a chave PIX dentro do modal
        document.getElementById('pix-key-value').textContent = CHAVE_PIX;
        formPix.style.display = 'none';
        const pixReveal = document.getElementById('pix-reveal');
        pixReveal.style.display = 'block';
        lucide.createIcons(); // Reativa os ícones no novo conteúdo

        btnSubmit.textContent = 'Confirmar e ver a chave PIX';
        btnSubmit.disabled = false;

        // Botão copiar chave PIX
        document.getElementById('btn-copiar-pix').addEventListener('click', () => {
            navigator.clipboard.writeText(CHAVE_PIX).then(() => {
                const feedback = document.getElementById('pix-copy-feedback');
                feedback.style.display = 'block';
                setTimeout(() => { feedback.style.display = 'none'; }, 2500);
            });
        });
    });

    // ===================== Carrossel de Palestrantes =====================
    (function initCarousel() {
        const track      = document.getElementById('carousel-track');
        const viewport   = document.getElementById('speakers-carousel');
        const btnPrev    = document.getElementById('carousel-prev');
        const btnNext    = document.getElementById('carousel-next');
        const dotsWrap   = document.getElementById('carousel-dots');

        if (!track || !viewport || !btnPrev || !btnNext || !dotsWrap) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const GAP = 32; // deve bater com o gap do CSS
        let currentIndex = 0;
        let autoplayTimer = null;

        // Quantos slides cabem por vez (responsivo)
        function getSlidesPerView() {
            const vw = window.innerWidth;
            if (vw <= 640)  return 1;
            if (vw <= 1024) return 2;
            return 3;
        }

        // Define a largura de cada slide com base no viewport real
        function setSlideSizes() {
            const perView    = getSlidesPerView();
            const viewWidth  = viewport.clientWidth;
            const slideWidth = (viewWidth - GAP * (perView - 1)) / perView;
            slides.forEach(s => {
                s.style.width = slideWidth + 'px';
            });
        }

        // Gera as bolinhas
        function buildDots() {
            dotsWrap.innerHTML = '';
            const perView  = getSlidesPerView();
            const maxIndex = Math.max(0, slides.length - perView);
            const dotCount = maxIndex + 1;
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Palestrante ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        }

        // Atualiza estado visual
        function updateState() {
            const perView    = getSlidesPerView();
            const maxIndex   = Math.max(0, slides.length - perView);
            currentIndex     = Math.max(0, Math.min(currentIndex, maxIndex));

            const slideWidth = slides[0].offsetWidth;
            const offset     = (slideWidth + GAP) * currentIndex;
            track.style.transform = `translateX(-${offset}px)`;

            // Setas
            btnPrev.disabled = currentIndex === 0;
            btnNext.disabled = currentIndex >= maxIndex;

            // Bolinhas
            dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        function goTo(index) {
            currentIndex = index;
            updateState();
        }

        function next() {
            const perView  = getSlidesPerView();
            const maxIndex = Math.max(0, slides.length - perView);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateState();
            }
        }

        function prev() {
            if (currentIndex > 0) {
                currentIndex--;
                updateState();
            }
        }

        btnNext.addEventListener('click', () => { next(); resetAutoplay(); });
        btnPrev.addEventListener('click', () => { prev(); resetAutoplay(); });

        // Autoplay suave (avança de 4 em 4 segundos)
        function startAutoplay() {
            autoplayTimer = setInterval(() => {
                const perView  = getSlidesPerView();
                const maxIndex = Math.max(0, slides.length - perView);
                if (currentIndex >= maxIndex) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateState();
            }, 4000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        // Pausar autoplay ao hover
        viewport.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        viewport.addEventListener('mouseleave', startAutoplay);

        // Suporte a Touch / Swipe
        let touchStartX = 0;
        let touchEndX   = 0;
        const SWIPE_THRESHOLD = 50;

        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const delta = touchStartX - touchEndX;
            if (Math.abs(delta) > SWIPE_THRESHOLD) {
                delta > 0 ? next() : prev();
                resetAutoplay();
            }
        }, { passive: true });

        // Suporte a teclado (← →) quando o carrossel está em foco
        viewport.setAttribute('tabindex', '0');
        viewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
            if (e.key === 'ArrowLeft')  { prev(); resetAutoplay(); }
        });

        // Recalcular ao redimensionar
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0;
                setSlideSizes();
                buildDots();
                updateState();
            }, 200);
        });

        // Inicializar
        setSlideSizes();
        buildDots();
        updateState();
        startAutoplay();
    })();


});




