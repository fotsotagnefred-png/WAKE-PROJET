/**
 * WAKE - Le Réveil Olfactif
 * Fichier JavaScript pour l'interactivité du site
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestion du Menu Mobile (Injection dynamique pour ne pas modifier le HTML)
    const navbarContent = document.querySelector('.navbar-content');
    const navLinks = document.querySelector('.nav-links');
    
    if (navbarContent && navLinks) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<span></span><span></span><span></span>';
        menuBtn.style.display = 'none'; // Caché par défaut, géré par CSS/JS
        
        // Ajout de styles pour le bouton mobile via JS pour respecter la consigne "ne pas modifier le CSS"
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

        // Fermer le menu quand on clique sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('open');
            });
        });
    }

    // 2. Animation de la Navbar au défilement
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

    // 3. Mise en évidence des liens actifs au défilement
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active-link');
                link.style.color = 'var(--primary)';
                link.style.fontWeight = '700';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });
    });

    // 4. Animations d'apparition (Reveal)
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

    // 5. FAQ Interactive (Accordéon)
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const question = card.querySelector('h3');
        const answer = card.querySelector('p');
        
        // Style initial
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        question.style.cursor = 'pointer';
        question.style.display = 'flex';
        question.style.justifyContent = 'space-between';
        question.style.alignItems = 'center';
        question.innerHTML += '<span style="transition: transform 0.3s">+</span>';

        card.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight !== '0px';
            const icon = question.querySelector('span');
            
            // Fermer les autres
            faqCards.forEach(other => {
                other.querySelector('p').style.maxHeight = '0';
                other.querySelector('h3 span').style.transform = 'rotate(0)';
            });

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });

    // 6. Validation et Simulation d'envoi du Formulaire
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Simulation d'envoi
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            setTimeout(() => {
                // Création d'un message de succès
                const successMsg = document.createElement('div');
                successMsg.style.padding = '1rem';
                successMsg.style.marginTop = '1rem';
                successMsg.style.backgroundColor = '#d4edda';
                successMsg.style.color = '#155724';
                successMsg.style.borderRadius = '0.5rem';
                successMsg.style.textAlign = 'center';
                successMsg.textContent = 'Merci ! Votre message a été envoyé avec succès.';
                
                contactForm.appendChild(successMsg);
                contactForm.reset();
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Supprimer le message après 5 secondes
                setTimeout(() => successMsg.remove(), 5000);
            }, 1500);
        });
    }

    // 7. Bouton "Retour en haut"
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        font-size: 20px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
