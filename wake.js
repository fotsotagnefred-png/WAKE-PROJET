/**
 * WAKE - Le Réveil Olfactif
 * Fichier JavaScript pour l'interactivité et l'automatisation Make.com
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Gestion du Menu Mobile
    const navbarContent = document.querySelector('.navbar-content');
    const navLinks = document.querySelector('.nav-links');

    if (navbarContent && navLinks) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<span></span><span></span><span></span>';
        menuBtn.style.display = 'none';

        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: flex !important;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 30px;
                    height: 21px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    z-index: 100;
                }
                .mobile-menu-btn span {
                    display: block;
                    width: 100%;
                    height: 3px;
                    background-color: var(--primary);
                    transition: all 0.3s ease;
                }
                .nav-links.active {
                    display: flex !important;
                    flex-direction: column;
                    position: absolute;
                    top: 64px;
                    left: 0;
                    width: 100%;
                    background: white;
                    padding: 2rem;
                    border-bottom: 1px solid var(--border);
                    box-shadow: 0 10px 15px rgba(0,0,0,0.05);
                    gap: 1.5rem;
                }
                .mobile-menu-btn.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
                .mobile-menu-btn.open span:nth-child(2) { opacity: 0; }
                .mobile-menu-btn.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
            }
        `;
        document.head.appendChild(style);
        navbarContent.insertBefore(menuBtn, document.querySelector('.btn-primary'));

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('open');
            });
        });
    }

    // 2. Animation de la Navbar au scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                navbar.style.padding = '5px 0';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.padding = '0';
            }
        });
    }

    // 3. Liens de navigation actifs selon la section visible
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href').includes(current)) {
                link.style.color = 'var(--primary)';
                link.style.fontWeight = '700';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });
    });

    // 4. Animations d'apparition au scroll
    const revealElements = document.querySelectorAll('.feature-card, .scent-item, .article-card, .team-card, .value-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });

    // 5. FAQ Accordéon
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const question = card.querySelector('h3');
        const answer = card.querySelector('p');
        if (!question || !answer) return;

        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        question.style.cursor = 'pointer';
        question.innerHTML += '<span style="float:right; transition: transform 0.3s">+</span>';

        card.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight !== '0px';
            faqCards.forEach(other => {
                const otherAnswer = other.querySelector('p');
                const otherSpan = other.querySelector('h3 span');
                if (otherAnswer) otherAnswer.style.maxHeight = '0';
                if (otherSpan) otherSpan.style.transform = 'rotate(0)';
            });
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                const span = question.querySelector('span');
                if (span) span.style.transform = 'rotate(45deg)';
            }
        });
    });

    // 6. CONNEXION À MAKE.COM (WEBHOOK)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';

            try {
                const response = await fetch('https://hook.eu1.make.com/yqwy2bju3llv2urru2wcjtwo3pufoaaj', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const successMsg = document.createElement('div');
                    successMsg.style.cssText = 'padding:1rem; margin-top:1rem; background:#d4edda; color:#155724; border-radius:0.5rem; text-align:center; font-weight:600;';
                    successMsg.textContent = '✅ Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 24h.';
                    contactForm.appendChild(successMsg);
                    contactForm.reset();
                    setTimeout(() => successMsg.remove(), 6000);
                } else {
                    throw new Error('Erreur serveur : ' + response.status);
                }
            } catch (error) {
                console.error('Erreur webhook Make:', error);
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = 'padding:1rem; margin-top:1rem; background:#f8d7da; color:#721c24; border-radius:0.5rem; text-align:center;';
                errorMsg.textContent = '❌ Une erreur est survenue. Veuillez réessayer ou nous contacter à contact@wake.fr';
                contactForm.appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 6000);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 7. Bouton Retour en haut
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Retour en haut');
    backToTop.style.cssText = 'position:fixed; bottom:20px; right:20px; width:44px; height:44px; border-radius:50%; background:var(--primary); color:white; border:none; cursor:pointer; display:none; font-size:20px; z-index:1000; box-shadow:0 2px 10px rgba(0,0,0,0.2);';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});