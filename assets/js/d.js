const lenis = new Lenis({
    duration: 1,
    direction: 'vertical',
    gestureDirection: 'vertical',
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 1,
    infinite: false,
  });
  
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  
  let isDragging = false;
  let startY = 0;
  let startScrollY = 0;
  let targetScrollY = 0;
  let lastScrollY = 0;
  let velocity = 0;
  let isAnimating = false;
  const friction = 0;
  const dragSensitivity = 1.2;
  
  function clampScroll(scrollY) {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(scrollY, maxScrollY));
  }
  
  document.addEventListener('mousedown', (event) => {
    // Only listen to left mouse button (button 0)
    if (event.button !== 0) return;
    
    isDragging = true;
    startY = event.clientY;
    startScrollY = lenis.scroll;
    lastScrollY = startScrollY;
    
    // Add class to indicate active dragging
    document.body.classList.add('is-actively-dragging');
  });
  
  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const deltaY = (event.clientY - startY) * dragSensitivity;
      targetScrollY = clampScroll(startScrollY - deltaY);
      if (!isAnimating) {
        animateScroll();
      }
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    
    isDragging = false;
    // Remove active dragging class immediately
    document.body.classList.remove('is-actively-dragging');
  
    if (Math.abs(velocity) > 0.1) {
      applyInertia();
    }
  });
  
  // Prevent link clicks ONLY during active mouse dragging
  document.addEventListener('click', (event) => {
    if (isDragging && event.target.closest('a')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true); // Use capture phase for better reliability
  
  document.addEventListener('selectstart', (event) => {
    if (isDragging) {
      event.preventDefault();
    }
  });
  
  document.addEventListener('contextmenu', (event) => {
    // Reset dragging state if context menu appears
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('is-actively-dragging');
    }
  });
  
  // Rest of your existing code (keydown, animateScroll, applyInertia, etc.) remains the same
  document.addEventListener('keydown', (event) => {
    const scrollAmount = 200; 
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      targetScrollY = clampScroll(lenis.scroll - scrollAmount);
      animateScroll();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      targetScrollY = clampScroll(lenis.scroll + scrollAmount);
      animateScroll();       
    } else if (event.key === ' ') {
      event.preventDefault(); 
      targetScrollY = clampScroll(lenis.scroll + window.innerHeight);
      animateScroll();
    }
  });
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  function animateScroll() {
    isAnimating = true;
    const currentScrollY = lenis.scroll;
    const distance = targetScrollY - currentScrollY;
    const easing = easeOutCubic(Math.min(1, Math.abs(distance) / 100));
    const newScrollY = currentScrollY + distance * easing;
    lenis.scrollTo(newScrollY);
  
    if (Math.abs(targetScrollY - newScrollY) > 0.5) {
      requestAnimationFrame(animateScroll);
    } else {
      isAnimating = false;
    }
  }
  
  function applyInertia() {
    const inertia = (targetScrollY - lastScrollY) * 0.3;
    function inertiaScroll() {
      velocity *= friction;
      const newScrollY = clampScroll(lenis.scroll + velocity);
      if (Math.abs(velocity) > 0.1 && newScrollY !== 0 && newScrollY !== document.documentElement.scrollHeight - window.innerHeight) {
        lenis.scroll = newScrollY;
        requestAnimationFrame(inertiaScroll);
      }
    }
    velocity = inertia;
    inertiaScroll();
  }
  
  document.querySelectorAll(".scroll-to-top").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      lenis.scrollTo(0);
    });
  });
  

  // Right-click prevention on images
document.addEventListener('contextmenu', function(e) {
    if (e.target?.tagName === 'IMG') {
        e.preventDefault();
    }
});

// First path animation
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('#path')?.forEach((path, index) => {
        if (!path) return;
        
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3,
            delay: index * 0.2,
            ease: "Expo.out",
            scrollTrigger: {
                trigger: ".bottom",
                start: "top bottom",
                once: true,
            },
            onComplete: () => {
                gsap.to(path, {
                    fillOpacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                });
            }
        });
    });
}

// First video animation
if (typeof gsap !== 'undefined') {
    const firstVideo = document.querySelector(".first video");
    if (firstVideo) {
        gsap.to(firstVideo, {
            yPercent: 190,
            ease: "none",
            scrollTrigger: {
                trigger: ".in-first",
                start: "bottom bottom",
                end: "+=10000",
                scrub: true,
            }
        });
    }
}

// Parallax image animation
if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.parallaxy')?.forEach((img) => {
        const imgElement = img?.querySelector("img");
        if (!imgElement) return;
        
        gsap.to(imgElement, {
            yPercent: 230,
            ease: "none",
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "+=10000",
                scrub: true,
            }
        });
    });
}

// First section and dark turn animation
if (typeof gsap !== 'undefined') {
    const firstSection = document.querySelector(".first");
    const inFirstSection = document.querySelector(".in-first");
    
    if (firstSection && inFirstSection) {
        gsap.to(firstSection, {
            yPercent: 230,
            ease: "none",
            scrollTrigger: {
                trigger: inFirstSection,
                start: "bottom bottom",
                end: "+=10000",
                scrub: true,
            }
        });
    }

    const turnDark = document.querySelector(".turn-dark");
    if (turnDark && inFirstSection) {
        gsap.to(turnDark, {
            opacity: 0.6,
            ease: "none",
            scrollTrigger: {
                trigger: inFirstSection,
                start: "bottom bottom",
                end: "bottom top",
                scrub: true,
            }
        });
    }
}

// Second path animation
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('#path2')?.forEach((path, index) => {
        if (!path) return;
        
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0,
            delay: index * 0,
            ease: "expo.out",
            onComplete: () => {
                gsap.to(path, {
                    fillOpacity: 1,
                    duration: 0,
                    ease: "power2.out",
                });
            }
        });
    });
});

// Loader animation
if (typeof gsap !== 'undefined') {
    const loadertxt = document.querySelector(".loadertxt");
    const centreLodr = document.querySelector(".centre-lodr svg");
    const cParagraph = document.querySelector(".c p");
    const box = document.querySelector(".box");
    const firstVideoLoader = document.querySelector(".first video");

    if (loadertxt) gsap.set(loadertxt, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" });

    const tl = gsap.timeline({ paused: true });
    
    if (loadertxt) {
        tl.to(loadertxt, {
            duration: 2.2,
            ease: 'expo.inOut',
            clipPath: "polygon(0 0%, 100% 0%, 100% 0%, 0 0%)",
        }, 1);
    }
    
    if (centreLodr) {
        tl.to(centreLodr, {
            y: -100,
            duration: 2.2,
            ease: 'expo.inOut',
        }, 1);
    }

    if (cParagraph) {
        tl.to(cParagraph, {
            y: -100,
            duration: 2.2,
            ease: 'expo.inOut',
        }, 1);
    }

    if (box) {
        tl.from(box, {
            opacity: 0.5,
            scale: '1.1',
            duration: 2.2,
            ease: 'expo.inOut',
        }, 1.05);
    }

    if (firstVideoLoader) {
        tl.from(firstVideoLoader, {
            opacity: 0.3,
            scale: '1.5',
            duration: 2.5,
            ease: 'expo.inOut',
        }, 1.05);
    }

    tl.play();
}


const dots = document.getElementById("dots");

if (dots) {
  let dotCount = 0;
  
  const intervalId = setInterval(() => {
    dotCount = (dotCount + 1) % 4; 
    dots.textContent = ".".repeat(dotCount);
  }, 400);

}