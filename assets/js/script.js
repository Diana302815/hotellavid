// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== CARRUSEL DE INICIO (autoplay + flechas) =====
document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.querySelector('.carrusel-container');
    if (carrusel) {
        const slidesContainer = carrusel.querySelector('.carrusel-slides');
        const slides = carrusel.querySelectorAll('.carrusel-slide');
        const prevBtn = carrusel.querySelector('.carrusel-prev');
        const nextBtn = carrusel.querySelector('.carrusel-next');
        let currentIndex = 0;
        const total = slides.length;

        function goToSlide(index) {
            currentIndex = (index + total) % total;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        let interval = setInterval(nextSlide, 5000);

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(interval);
                goToSlide(currentIndex - 1);
                interval = setInterval(nextSlide, 5000);
            });
            nextBtn.addEventListener('click', () => {
                clearInterval(interval);
                goToSlide(currentIndex + 1);
                interval = setInterval(nextSlide, 5000);
            });
        }
    }

    // ===== MODALES DE SERVICIOS (para la página de reservas) =====
    const tarjetas = document.querySelectorAll('.servicio-card');
    const modalesServicios = {};

    tarjetas.forEach(tarjeta => {
        const modalId = tarjeta.getAttribute('data-modal');
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modalesServicios[modalId] = modal;
            tarjeta.addEventListener('click', () => {
                if (modal) {
                    modal.style.display = 'flex';
                    iniciarSlider(modal);
                }
            });
        }
    });

    document.querySelectorAll('.modal-servicio-cerrar').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-servicio');
            if (modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-servicio')) {
            e.target.style.display = 'none';
        }
    });

    // ===== SLIDER DENTRO DE MODALES =====
    function iniciarSlider(modal) {
        const imagenesContainer = modal.querySelector('.slider-imagenes');
        const imagenes = modal.querySelectorAll('.slider-imagenes img');
        const prevBtn = modal.querySelector('.slider-prev');
        const nextBtn = modal.querySelector('.slider-next');
        const dotsContainer = modal.querySelector('.slider-dots');

        if (!imagenes.length) return;

        let currentIndex = 0;
        const total = imagenes.length;

        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        function updateDots() {
            const dots = modal.querySelectorAll('.slider-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + total) % total;
            imagenesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        goToSlide(0);
    }

    // ===== FORMULARIO DE CONTACTO (envío a webhook de GHL) =====
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Recoger datos
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const nacionalidad = document.getElementById('nacionalidad').value;
            const cumpleanos = document.getElementById('cumpleanos').value;
            const comentarios = document.getElementById('comentarios').value;

            // Validación
            if (!nombre || !email || !telefono || !nacionalidad || !cumpleanos) {
                alert('Por favor completa todos los campos.');
                return;
            }

            // Preparar datos para GHL
            const data = {
                nombre,
                email,
                telefono,
                nacionalidad,
                cumpleanos,
                comentarios,
                origen: 'web_contacto',
                timestamp: new Date().toISOString()
            };

            // 🔁 CAMBIA ESTA URL POR LA DE TU WEBHOOK DE GHL
            const webhookURL = 'https://services.leadconnectorhq.com/hooks/HFgqPVifwNR2SxrzGwEG/webhook-trigger/6zy2NEEBsOQ3mLAkw0tr';

            // Enviar datos
            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    alert('¡Mensaje enviado! Te contactaremos pronto.');
                    window.location.href = 'agradecimiento.html';
                } else {
                    alert('Hubo un error al enviar. Por favor intenta de nuevo.');
                }
            })
            .catch(error => {
                console.error('Error al enviar:', error);
                alert('Error de conexión. Por favor verifica tu internet e intenta de nuevo.');
            });
        });
    }
});