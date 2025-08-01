class PresentationManager {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.currentSlideNum = document.getElementById('currentSlideNum');
        this.totalSlides = document.getElementById('totalSlides');
        this.dotsNav = document.getElementById('dotsNav');
        this.currentSlide = 0;
        this.totalSlidesCount = this.slides.length;

        this.init();
    }

    init() {
        this.createDots();
        this.updateSlideCounter();
        this.updateProgressBar();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.updateButtons();

        // Remove a classe 'loading' para exibir o slide após a inicialização
        setTimeout(() => {
            document.querySelector('.presentation-container').classList.remove('loading');
        }, 100);
    }

    createDots() {
        for (let i = 0; i < this.totalSlidesCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            this.dotsNav.appendChild(dot);
        }
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Suporte para touch/swipe
        let startX = 0;
        let endX = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });

        // Suporte para arrastar com o mouse
        let mouseStartX = 0;
        let mouseEndX = 0;
        let isDragging = false;

        document.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isDragging = true;
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                mouseEndX = e.clientX;
                this.handleMouseDrag(mouseStartX, mouseEndX);
                isDragging = false;
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlidesCount - 1);
                    break;
            }
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    handleMouseDrag(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i < index) slide.classList.add('prev');
        });
        this.slides[index].classList.add('active');
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalSlidesCount) {
            this.currentSlide = index;
            this.showSlide(this.currentSlide);
            this.updateSlideCounter();
            this.updateProgressBar();
            this.updateButtons();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlidesCount - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateSlideCounter() {
        this.currentSlideNum.textContent = this.currentSlide + 1;
        this.totalSlides.textContent = this.totalSlidesCount;
    }

    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.totalSlidesCount) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    updateButtons() {
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlidesCount - 1;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PresentationManager();
});

