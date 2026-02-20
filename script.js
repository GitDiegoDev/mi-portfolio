// ==================== CONFIGURACIÓN EMAILJS ====================
// REEMPLAZÁ estos valores con tus credenciales de EmailJS
const EMAILJS_CONFIG = {
    publicKey: 'mMWjGXJA_wru3zini',
    serviceID: 'service_8o60bsq',
    templateID: 'template_qt5eri1'
};

// ==================== SISTEMA DE PARTÍCULAS ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 120 };
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.setupEventListeners();
        this.createParticles();
        this.start();
    }
    
    setupEventListeners() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.resize(), 250);
        });
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', () => this.handleMouseLeave());
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        const area = window.innerWidth * window.innerHeight;
        const particleCount = Math.min(150, Math.max(50, Math.floor(area / 15000)));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.5
        };
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    handleMouseLeave() {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.fillStyle = '#09101d';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        this.updateParticles();
        this.drawParticles();
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const mouseRadius = this.mouse.radius;
        const mouseRadiusSq = mouseRadius * mouseRadius;
        
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x <= 0 || particle.x >= width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(width, particle.x));
            }
            if (particle.y <= 0 || particle.y >= height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(height, particle.y));
            }
            
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < mouseRadiusSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = (mouseRadius - dist) / mouseRadius;
                const forceX = (dx / dist) * force * 5;
                const forceY = (dy / dist) * force * 5;
                
                particle.vx += forceX;
                particle.vy += forceY;
            }
            
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 4) {
                particle.vx = (particle.vx / speed) * 4;
                particle.vy = (particle.vy / speed) * 4;
            }
        }
    }
    
    drawParticles() {
        for (let particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(107, 182, 255, ${particle.opacity})`;
            this.ctx.fill();
        }
    }
    
    drawConnections() {
        const maxDistance = 120;
        const maxDistanceSq = maxDistance * maxDistance;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < maxDistanceSq) {
                    const opacity = (1 - Math.sqrt(distSq) / maxDistance) * 0.4;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(107, 182, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

// ==================== UI MANAGER ====================
class UIManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.navLinks = document.querySelector('.nav-links');
        this.contactForm = document.getElementById('contactForm');
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.setupContactForm();
        this.setupSmoothScroll();
    }
    
    setupNavigation() {
        if (!this.toggleBtn || !this.navLinks) return;
        
        this.toggleBtn.addEventListener('click', () => {
            const isActive = this.navLinks.classList.toggle('active');
            this.toggleBtn.textContent = isActive ? '✕' : '☰';
            this.toggleBtn.setAttribute('aria-expanded', isActive);
        });
        
        this.navLinks.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
                this.toggleBtn.textContent = '☰';
                this.toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!this.navLinks.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                this.navLinks.classList.remove('active');
                this.toggleBtn.textContent = '☰';
            }
        });
    }
    
    setupScrollEffects() {
        if (!this.navbar) return;
        
        let lastScroll = 0;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            lastScroll = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateNavbar(lastScroll);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    updateNavbar(scrollY) {
        if (scrollY > 100) {
            this.navbar.style.background = 'rgba(9, 16, 29, 0.98)';
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            this.navbar.style.background = 'rgba(9, 16, 29, 0.9)';
            this.navbar.style.boxShadow = 'none';
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const elementsToAnimate = document.querySelectorAll(
            '.skill-card, .proyecto-card, .stat-card'
        );
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }
    
    setupContactForm() {
        if (!this.contactForm) return;
        
        const formMsg = document.getElementById('formMsg');
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        
        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nombre: document.getElementById('nombre')?.value.trim(),
                email: document.getElementById('email')?.value.trim(),
                asunto: document.getElementById('asunto')?.value.trim(),
                mensaje: document.getElementById('mensaje')?.value.trim()
            };
            
            // Validación
            if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
                this.showFormMessage('Por favor completá todos los campos.', 'error', formMsg);
                return;
            }
            
            if (!this.isValidEmail(formData.email)) {
                this.showFormMessage('Por favor ingresá un email válido.', 'error', formMsg);
                return;
            }
            
            // Deshabilitar botón y mostrar loading
            submitButton.disabled = true;
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Enviando...</span>';
            
            try {
                // Preparar datos para EmailJS (adaptado a tu template)
                const templateParams = {
                    name: formData.nombre,
                    from_name: formData.nombre,
                    from_email: formData.email,
                    subject: formData.asunto,
                    message: `Asunto: ${formData.asunto}\n\nEmail: ${formData.email}\n\n${formData.mensaje}`,
                    time: new Date().toLocaleString('es-AR')
                };
                
                // Enviar con EmailJS
                await emailjs.send(
                    EMAILJS_CONFIG.serviceID,
                    EMAILJS_CONFIG.templateID,
                    templateParams,
                    EMAILJS_CONFIG.publicKey
                );
                
                // Éxito
                this.showFormMessage('¡Mensaje enviado con éxito! Te responderé pronto.', 'success', formMsg);
                this.contactForm.reset();
                
                setTimeout(() => {
                    if (formMsg) formMsg.style.display = 'none';
                }, 5000);
                
            } catch (error) {
                console.error('Error al enviar:', error);
                this.showFormMessage('Hubo un error al enviar el mensaje. Por favor intentá de nuevo.', 'error', formMsg);
            } finally {
                // Rehabilitar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
        
        // Validación en tiempo real
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (emailInput.value && !this.isValidEmail(emailInput.value)) {
                    emailInput.style.borderColor = '#f44336';
                } else {
                    emailInput.style.borderColor = '';
                }
            });
        }
    }
    
    showFormMessage(message, type, formMsg) {
        if (!formMsg) return;
        
        formMsg.textContent = message;
        formMsg.className = `form-message ${type}`;
        formMsg.style.display = 'block';
        formMsg.style.padding = '15px';
        formMsg.style.borderRadius = '8px';
        formMsg.style.marginTop = '15px';
        formMsg.style.textAlign = 'center';
        
        if (type === 'success') {
            formMsg.style.background = 'rgba(76, 175, 80, 0.1)';
            formMsg.style.color = '#4caf50';
            formMsg.style.border = '2px solid #4caf50';
        } else {
            formMsg.style.background = 'rgba(244, 67, 54, 0.1)';
            formMsg.style.color = '#f44336';
            formMsg.style.border = '2px solid #f44336';
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ==================== INICIALIZACIÓN ====================
function init() {
    // Inicializar EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
    
    // Inicializar sistema de partículas
    const particleSystem = new ParticleSystem();
    
    // Inicializar gestión de UI
    const uiManager = new UIManager();
    
    // Pausar animaciones cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            particleSystem.stop();
        } else {
            particleSystem.start();
        }
    });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exportar para uso global
window.ParticleSystem = ParticleSystem;
window.UIManager = UIManager;