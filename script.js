// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
    
    // Verificar se EmailJS está disponível
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS carregado com sucesso');
    } else {
        console.error('EmailJS não foi carregado!');
    }
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Animated counters
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation when stats section is visible
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const observeElements = () => {
        document.querySelectorAll(".service-item, .pricing-card, .testimonial-card, .stats").forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    };
    observeElements();

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Contact Form - VERSÃO CORRIGIDA
    const contactForm = document.querySelector('.contact-form');
    console.log('Procurando formulário:', contactForm);
    
    if (contactForm) {
        console.log('Formulário encontrado, adicionando event listener');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário submetido - evento capturado');
            
            // Verificar se EmailJS está disponível
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS não está carregado!');
                alert('Erro: EmailJS não está disponível. Verifique a conexão com a internet.');
                return;
            }
            
            console.log('EmailJS disponível, prosseguindo...');
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            const nome = formData.get('nome');
            const email = formData.get('email');
            const telefone = formData.get('telefone');
            const mensagem = formData.get('mensagem');
            
            console.log('Dados capturados:', { nome, email, telefone, mensagem });
            
            // Validar campos obrigatórios
            if (!nome || !email || !mensagem) {
                console.error('Campos obrigatórios não preenchidos');
                alert('Por favor, preencha todos os campos obrigatórios (Nome, Email e Mensagem).');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Get current date and time
            const now = new Date();
            const captureDate = now.toLocaleDateString('pt-BR');
            const captureTime = now.toLocaleTimeString('pt-BR');
            
            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: nome,
                from_email: email,
                phone: telefone || 'Não informado',
                message: mensagem,
                capture_date: captureDate,
                capture_time: captureTime
            };
            
            console.log('Parâmetros do template:', templateParams);
            console.log('Enviando para EmailJS com Service ID: service_7e11g2i, Template ID: template_9ykkg1h');
            
            // Send email via EmailJS
            emailjs.send('service_7e11g2i', 'template_9ykkg1h', templateParams)
                .then(function(response) {
                    console.log('Email enviado com sucesso!', response.status, response.text);
                    
                    // Show success message
                    alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Optional: Also redirect to WhatsApp after 2 seconds
                    setTimeout(() => {
                        const whatsappMessage = `Olá! Meu nome é ${nome}.%0A%0A${mensagem}%0A%0AContatos:%0AEmail: ${email}%0ATelefone: ${telefone || 'Não informado'}`;
                        const whatsappURL = `https://wa.me/5544999275821?text=${whatsappMessage}`;
                        console.log('Redirecionando para WhatsApp:', whatsappURL);
                        window.open(whatsappURL, '_blank');
                    }, 2000);
                    
                }, function(error) {
                    console.error('Erro detalhado ao enviar email:', error);
                    
                    // Show detailed error message
                    let errorMessage = 'Erro ao enviar mensagem';
                    if (error.text) {
                        errorMessage += ': ' + error.text;
                    } else if (error.message) {
                        errorMessage += ': ' + error.message;
                    }
                    
                    alert('❌ ' + errorMessage + '. Redirecionando para WhatsApp...');
                    
                    // Fallback to WhatsApp
                    const whatsappMessage = `Olá! Meu nome é ${nome}.%0A%0A${mensagem}%0A%0AContatos:%0AEmail: ${email}%0ATelefone: ${telefone || 'Não informado'}`;
                    const whatsappURL = `https://wa.me/5544999275821?text=${whatsappMessage}`;
                    window.open(whatsappURL, '_blank');
                })
                .finally(function() {
                    // Restore button state
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    console.log('Estado do botão restaurado');
                });
        });
    } else {
        console.error('❌ Formulário de contato não encontrado! Verificando seletores...');
        console.log('Formulários encontrados na página:', document.querySelectorAll('form'));
    }

    // Form validation
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remove previous error styling
        field.classList.remove('error');
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\(\)\-\+]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
            }
        }

        if (!isValid) {
            field.classList.add('error');
        }

        return isValid;
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Scroll to top button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add error styles to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
            background-color: #fef2f2;
        }
        
        .form-group input.error:focus,
        .form-group textarea.error:focus {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        body.loaded {
            opacity: 1;
        }
        
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .scroll-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #ea580c;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .scroll-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-top:hover {
            background: #c2410c;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
});

// Verificação adicional quando a página carrega completamente
window.addEventListener('load', function() {
    console.log('Página carregada completamente');
    console.log('EmailJS disponível?', typeof emailjs !== 'undefined');
    console.log('Formulário encontrado?', document.querySelector('.contact-form') !== null);
});

