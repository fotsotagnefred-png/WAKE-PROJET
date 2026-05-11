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

    // 2. Animation de la Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.padding = '5px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '0';
        }
    });

    // 3. Liens actifs
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
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

    // 4. Animations Reveal
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
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        question.style.cursor = 'pointer';
        question.innerHTML += '<span style="float:right; transition: transform 0.3s">+</span>';

        card.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight !== '0px';
            faqCards.forEach(other => {
                other.querySelector('p').style.maxHeight = '0';
                other.querySelector('h3 span').style.transform = 'rotate(0)';
            });
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.querySelector('span').style.transform = 'rotate(45deg)';
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
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // État de chargement
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            try {
                // REMPLACEZ L'URL CI-DESSOUS PAR VOTRE URL DE WEBHOOK MAKE
                const response = await fetch('VOTRE_URL_WEBHOOK_MAKE_ICI', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    // Message de succès
                    const successMsg = document.createElement('div');
                    successMsg.style.cssText = 'padding:1rem; margin-top:1rem; background:#d4edda; color:#155724; border-radius:0.5rem; text-align:center;';
                    successMsg.textContent = 'Merci ! Votre message a été envoyé. Vous allez recevoir un email de confirmation.';
                    
                    contactForm.appendChild(successMsg);
                    contactForm.reset();
                    
                    setTimeout(() => successMsg.remove(), 5000);
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                alert('Désolé, une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 7. Bouton Retour en haut
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = 'position:fixed; bottom:20px; right:20px; width:40px; height:40px; border-radius:50%; background:var(--primary); color:white; border:none; cursor:pointer; display:none; font-size:20px; z-index:1000; box-shadow:0 2px 10px rgba(0,0,0,0.2);';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});