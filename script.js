document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // --- DOM ELEMENT SELECTION ---
    const sections = gsap.utils.toArray(".panel");
    const sectionsWrapper = document.querySelector(".sections-wrapper");
    const headerIndicator = document.querySelector('.header-indicator');
    const indicatorSpans = gsap.utils.toArray('.header-indicator span');
    
    // Elements for micro-interactions
    const customCursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const ctaButton = document.querySelector('.cta-button');
    const ctaButtonText = document.querySelector('.cta-button .btn-text');
    const interactiveLinks = document.querySelectorAll('.interactive-link');
    
    // Elements for project preview & modal
    const projectItems = document.querySelectorAll('.project-item');
    const modal = document.querySelector('.project-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    // --- STATE VARIABLES ---
    let currentIndicator = indicatorSpans[0];
    let isHeaderAnimating = false; // Flag to prevent animation overlap


    // --- [NEW & IMPROVED] ROBUST HEADER INDICATOR LOGIC ---
    function updateHeaderIndicator(newSectionId) {
        if (isHeaderAnimating || currentIndicator.dataset.section === newSectionId) {
            return;
        }

        const newIndicator = headerIndicator.querySelector(`[data-section="${newSectionId}"]`);
        if (!newIndicator) return;

        isHeaderAnimating = true;
        const oldIndicator = currentIndicator;

        gsap.to(oldIndicator, {
            y: '-110%',
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => {
                oldIndicator.classList.add('hidden');
            }
        });

        newIndicator.classList.remove('hidden');
        gsap.fromTo(newIndicator, 
            { y: '110%' }, 
            { 
                y: '0%', 
                duration: 0.6, 
                ease: 'power3.inOut',
                onComplete: () => {
                    isHeaderAnimating = false;
                }
            }
        );
        
        currentIndicator = newIndicator;
    }


    // --- MICRO-INTERACTION LOGIC ---

  // In script.js

function setupCustomCursor() {
    if (window.matchMedia("(pointer: fine)").matches) {
        const customCursor = document.querySelector('.custom-cursor'); // Use the original single cursor
        const cursorDot = document.querySelector('.cursor-dot');

        const cursorX = gsap.quickSetter(customCursor, "x", "px");
        const cursorY = gsap.quickSetter(customCursor, "y", "px");

        window.addEventListener('mousemove', e => {
            cursorX(e.clientX);
            cursorY(e.clientY);
        });

        interactiveLinks.forEach(link => {
            link.addEventListener('mouseenter', () => customCursor.classList.add('link-hovered'));
            link.addEventListener('mouseleave', () => customCursor.classList.remove('link-hovered'));
        });

        projectItems.forEach(item => {
            const previewImg = item.dataset.previewImg;
            item.addEventListener('mouseenter', () => {
                // This is the key part: it adds .preview-active to the parent
                customCursor.querySelector('.cursor-preview').style.backgroundImage = `url(${previewImg})`;
                customCursor.classList.add('preview-active');
            });
            item.addEventListener('mouseleave', () => {
                customCursor.classList.remove('preview-active');
            });
        });
    }
}
    
    function setupMagneticButton() {
        if (window.matchMedia("(pointer: fine)").matches && ctaButton) {
            ctaButton.addEventListener('mousemove', function(e) {
                const { offsetX, offsetY, target } = e;
                const { clientWidth, clientHeight } = target;
                const x = (offsetX / clientWidth) * 2 - 1;
                const y = (offsetY / clientHeight) * 2 - 1;

                gsap.to(ctaButton, { x: x * 15, y: y * 15, duration: 0.5, ease: 'power3.out' });
                gsap.to(ctaButtonText, { x: x * 30, y: y * 30, duration: 0.5, ease: 'power3.out' });
            });

            ctaButton.addEventListener('mouseleave', function() {
                gsap.to([ctaButton, ctaButtonText], { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            });
        }
    }

    // --- CORE PAGE LOGIC ---

    function openModal(item) {
        document.body.classList.add('modal-open');
        modalImg.src = item.dataset.modalImg;
        modalTitle.textContent = item.dataset.modalTitle;
        modalText.textContent = item.dataset.modalText;
        
        gsap.set(modal, { display: 'flex' });
        gsap.fromTo([modalOverlay, modalContent], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.from(modalContent, { scale: 0.95, y: 10, duration: 0.4, ease: 'power2.out' });
    }

    function closeModal() {
        gsap.to([modalOverlay, modalContent], { 
            opacity: 0, 
            duration: 0.3, 
            ease: 'power2.in', 
            onComplete: () => {
                gsap.set(modal, { display: 'none' });
                document.body.classList.remove('modal-open');
            }
        });
    }

    projectItems.forEach(item => {
        item.addEventListener('click', (e) => { e.preventDefault(); openModal(item); });
    });
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && document.body.classList.contains('modal-open')) { closeModal(); }
    });

    // --- GSAP MAIN ANIMATION CONTEXT ---
    gsap.context(() => {
        
        setupCustomCursor();
        setupMagneticButton();
        
        // --- NEW HERO ANIMATIONS ---
        // 1. Text reveal animation on page load
        gsap.from("#landing-content .parallax-text span", {
            y: 60,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.5
        });

        // 2. Mouse move parallax effect
        if (window.matchMedia("(pointer: fine)").matches) {
            const landingSection = document.getElementById('landing-content');
            const heroImage = landingSection.querySelector('.hero-image-container');
            const parallaxTexts = landingSection.querySelectorAll('.parallax-text');

            landingSection.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * -1;
                const y = (clientY / window.innerHeight - 0.5) * -1;
                const rotationFactor = 10;

                // Animate the image with 3D rotation
                gsap.to(heroImage, {
                    x: x * 20,
                    y: y * 20,
                    rotationY: x * rotationFactor,
                    rotationX: -y * rotationFactor,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Animate the text layers
                gsap.to(parallaxTexts[0], { x: x * -35, y: y * -25, duration: 0.5, ease: 'power2.out' });
                gsap.to(parallaxTexts[1], { x: x * -15, y: y * -55, duration: 0.5, ease: 'power2.out' });
                gsap.to(parallaxTexts[2], { x: x * -50, y: y * -30, duration: 0.5, ease: 'power2.out' });
            });
        }
        // --- END NEW HERO ANIMATIONS ---


        // Responsive animations using ScrollTrigger.matchMedia
        ScrollTrigger.matchMedia({

            // DESKTOP: Horizontal Scroll
            "(min-width: 901px)": function() {
                let horizontalScroll = gsap.to(sectionsWrapper, {
                    x: () => `-${sectionsWrapper.scrollWidth - document.documentElement.clientWidth}px`,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".page-container",
                        pin: true,
                        scrub: 1,
                        end: () => `+=${sectionsWrapper.scrollWidth - document.documentElement.clientWidth}`,
                        onUpdate: (self) => {
                             gsap.to(".progress-bar", { width: self.progress * 100 + "%", ease: "none" });
                        },
                        invalidateOnRefresh: true
                    }
                });
                
                sections.forEach((section) => {
                    ScrollTrigger.create({
                        trigger: section,
                        containerAnimation: horizontalScroll,
                        start: "left center",
                        end: "right center",
                        onToggle: self => self.isActive && updateHeaderIndicator(section.id)
                    });

                    if (section.id === 'about-content') {
                        gsap.to(section.querySelector('.about-image'), { x: -80, ease: 'none', scrollTrigger: { containerAnimation: horizontalScroll, trigger: section, start: 'left right', end: 'right left', scrub: true } });
                        gsap.to(section.querySelector('.about-text'), { x: 80, ease: 'none', scrollTrigger: { containerAnimation: horizontalScroll, trigger: section, start: 'left right', end: 'right left', scrub: true } });
                    }
                    
                    if (section.id === 'work-content' || section.id === 'workflow-content') {
                         gsap.from(section.querySelectorAll('.project-item, .workflow-item'), { opacity: 0, y: 50, stagger: 0.1, scrollTrigger: { containerAnimation: horizontalScroll, trigger: section, start: 'left 70%' } });
                    }
                     if (section.id === 'cta-content') {
                         gsap.from(section.querySelector('h2'), { opacity: 0, y: 50, scrollTrigger: { containerAnimation: horizontalScroll, trigger: section, start: 'left 70%' } });
                         gsap.from(section.querySelector('.cta-button'), { opacity: 0, y: 50, delay: 0.2, scrollTrigger: { containerAnimation: horizontalScroll, trigger: section, start: 'left 70%' } });
                    }
                });
            },

            // MOBILE: Standard Vertical Scroll
            "(max-width: 900px)": function() {
                ScrollTrigger.create({ 
                    trigger: "body", 
                    start: "top top", 
                    end: "bottom bottom", 
                    onUpdate: self => gsap.to(".progress-bar", {width: self.progress * 100 + "%"}) 
                });
                
                sections.forEach(section => {
                    ScrollTrigger.create({ 
                        trigger: section, 
                        start: "top center", 
                        end: "bottom center", 
                        onToggle: self => self.isActive && updateHeaderIndicator(section.id) 
                    });
                    
                    gsap.from(section.querySelectorAll('.project-item, .workflow-item, #cta-content h2, #cta-content .cta-button'), { 
                        opacity: 0, 
                        y: 50, 
                        stagger: 0.1, 
                        scrollTrigger: { 
                            trigger: section, 
                            start: 'top 80%' 
                        } 
                    });
                });
            }
        });

    }); // End GSAP Context

});
