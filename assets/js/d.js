const lenis = new Lenis({
    duration: 0.5,
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
  
  document.querySelectorAll(".location-mini2").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      lenis.scrollTo(600);
    });
  });
  

  // Right-click prevention on images
document.addEventListener('contextmenu', function(e) {
    if (e.target?.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('contextmenu', function(e) {
  if (e.target?.tagName === 'VIDEO') {
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
            yPercent: 250,
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
            opacity: 0.1,
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


//hover parallax

const container = document.querySelector('.inside-this');

if (container) {
    const inner = container.querySelector('.this-inner');
    const text = container.querySelector('.r-c-t');

    const innerImages = inner ? inner.querySelectorAll('img') : [];

    // Exclude images inside `.this-inner`
    const containerImages = Array.from(container.querySelectorAll('img')).filter(img => !inner || !inner.contains(img));

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let containerTargetX = 0, containerTargetY = 0;
    let containerCurrentX = 0, containerCurrentY = 0;
    let textTargetX = 0, textTargetY = 0;
    let textCurrentX = 0, textCurrentY = 0;

    let innerImageTargets = [];
    let innerImageCurrents = [];

    let containerImageTargets = [];
    let containerImageCurrents = [];

    innerImages.forEach(() => {
        innerImageTargets.push({ x: 0, y: 0 });
        innerImageCurrents.push({ x: 0, y: 0 });
    });

    containerImages.forEach(() => {
        containerImageTargets.push({ x: 0, y: 0 });
        containerImageCurrents.push({ x: 0, y: 0 });
    });

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const offsetX = (x / rect.width - 0.5);
        const offsetY = (y / rect.height - 0.5);

        targetX = offsetX * 40;
        targetY = offsetY * 40;
        containerTargetX = offsetX * -10;
        containerTargetY = offsetY * -10;
        textTargetX = offsetX * 20;
        textTargetY = offsetY * 20;

        innerImageTargets = innerImageTargets.map(() => ({
            x: offsetX * -8,
            y: offsetY * -8
        }));

        containerImageTargets = containerImageTargets.map(() => ({
            x: offsetX * -6,
            y: offsetY * -6
        }));
    });

    container.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        containerTargetX = 0;
        containerTargetY = 0;
        textTargetX = 0;
        textTargetY = 0;

        innerImageTargets = innerImageTargets.map(() => ({ x: 0, y: 0 }));
        containerImageTargets = containerImageTargets.map(() => ({ x: 0, y: 0 }));
    });

    function animate() {
        if (inner) {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            inner.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px)`;
        }

        containerCurrentX += (containerTargetX - containerCurrentX) * 0.05;
        containerCurrentY += (containerTargetY - containerCurrentY) * 0.05;
        container.style.transform = `translate(${containerCurrentX}px, ${containerCurrentY}px)`;

        if (text) {
            textCurrentX += (textTargetX - textCurrentX) * 0.08;
            textCurrentY += (textTargetY - textCurrentY) * 0.08;
            text.style.transform = `translate(-50%, -50%) translate(${textCurrentX}px, ${textCurrentY}px)`;
        }

        innerImages.forEach((img, i) => {
            const target = innerImageTargets[i];
            const current = innerImageCurrents[i];
            current.x += (target.x - current.x) * 0.1;
            current.y += (target.y - current.y) * 0.1;
            img.style.transform = `translate(${current.x}px, ${current.y}px)`;
        });

        containerImages.forEach((img, i) => {
            const target = containerImageTargets[i];
            const current = containerImageCurrents[i];
            current.x += (target.x - current.x) * 0.1;
            current.y += (target.y - current.y) * 0.1;
            img.style.transform = `translate(${current.x}px, ${current.y}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
}



document.addEventListener("DOMContentLoaded", function() {
  // Color and Size Box Selection
  function setupBoxSelection(selector, activeClass) {
      const boxes = document.querySelectorAll(selector);
      if (!boxes.length) return;

      boxes.forEach(box => {
          box.addEventListener('click', () => {
              document.querySelectorAll(selector).forEach(b => b.classList.remove(activeClass));
              box.classList.add(activeClass);
          });
      });
  }

  setupBoxSelection('.color-box', 'active');
  setupBoxSelection('.sizes-box', 'active');

  // Dropdown and Box Sync Logic
  function setupDropdownSync() {
      const colorSelect = document.querySelector('.dropdown-select');
      const sizeSelect = document.querySelectorAll('.dropdown-select')[1];
      
      if (!colorSelect || !sizeSelect) return;

      const colorDisplay = colorSelect.nextElementSibling;
      const sizeDisplay = sizeSelect?.nextElementSibling;
      const colorBoxes = document.querySelectorAll('.color-box-wrapper');
      const sizeBoxes = document.querySelectorAll('.sizes-box-wrapper');

      function createOptionsFromElements(select, display, elements, getValue) {
          if (!select || !display || !elements.length) return;
          
          select.innerHTML = '';
          elements.forEach((el) => {
              const value = getValue(el);
              if (value) {
                  const option = document.createElement('option');
                  option.value = value;
                  option.textContent = value;
                  select.appendChild(option);
              }
          });
          if (select.options.length) {
              display.textContent = select.value;
          }
      }

      // Initialize dropdowns
      if (colorBoxes.length) {
          createOptionsFromElements(
              colorSelect, 
              colorDisplay, 
              colorBoxes, 
              el => el.querySelector('.color-name')?.textContent?.trim()
          );
      }

      if (sizeBoxes.length) {
          createOptionsFromElements(
              sizeSelect, 
              sizeDisplay, 
              sizeBoxes, 
              el => el.querySelector('.sizes-box')?.textContent?.trim()
          );
      }

      // Handle dropdown changes
      function handleSelectChange(select, display, boxes, boxSelector, isColor) {
          if (!select || !display || !boxes.length) return;
          
          select.addEventListener('change', function() {
              const value = this.value;
              display.textContent = value;

              boxes.forEach(box => {
                  const content = isColor 
                      ? box.querySelector('.color-name')?.textContent?.trim()
                      : box.querySelector('.sizes-box')?.textContent?.trim();
                  
                  if (content === value) {
                      box.querySelector(boxSelector)?.classList.add('active');
                  } else {
                      box.querySelector(boxSelector)?.classList.remove('active');
                  }
              });
          });
      }

      handleSelectChange(colorSelect, colorDisplay, colorBoxes, '.color-box', true);
      handleSelectChange(sizeSelect, sizeDisplay, sizeBoxes, '.sizes-box', false);

      // Sync box clicks to dropdowns
      function syncBoxToDropdown(boxes, boxSelector, select, display, getValue) {
          boxes.forEach(box => {
              const boxElement = box.querySelector(boxSelector);
              if (!boxElement) return;

              const value = getValue(box);
              if (!value) return;

              boxElement.addEventListener('click', () => {
                  if (select && display) {
                      select.value = value;
                      display.textContent = value;
                  }
              });
          });
      }

      syncBoxToDropdown(
          colorBoxes, 
          '.color-box', 
          colorSelect, 
          colorDisplay, 
          el => el.querySelector('.color-name')?.textContent?.trim()
      );

      syncBoxToDropdown(
          sizeBoxes, 
          '.sizes-box', 
          sizeSelect, 
          sizeDisplay, 
          el => el.querySelector('.sizes-box')?.textContent?.trim()
      );
  }
  setupDropdownSync();

  // Quantity Logic
  function setupQuantityControls() {
      const desktopQuantity = document.getElementById('quantity');
      const mobileQuantity = document.querySelector('.styled-input');
      const decreaseBtn = document.getElementById('decrease');
      const increaseBtn = document.getElementById('increase');

      if (!desktopQuantity && !mobileQuantity) return;

      function updateButtons(value) {
          if (decreaseBtn) {
              decreaseBtn.classList.toggle('disabled', value <= 1);
          }
      }

      function setQuantity(value) {
          value = isNaN(value) || value < 1 ? 1 : value;
          if (desktopQuantity) desktopQuantity.value = value;
          if (mobileQuantity) mobileQuantity.value = value;
          updateButtons(value);
      }

      if (increaseBtn) {
          increaseBtn.addEventListener('click', () => {
              const currentValue = desktopQuantity ? parseInt(desktopQuantity.value) : 
                                mobileQuantity ? parseInt(mobileQuantity.value) : 1;
              setQuantity(currentValue + 1);
          });
      }

      if (decreaseBtn) {
          decreaseBtn.addEventListener('click', () => {
              const currentValue = desktopQuantity ? parseInt(desktopQuantity.value) : 
                                mobileQuantity ? parseInt(mobileQuantity.value) : 1;
              setQuantity(currentValue - 1);
          });
      }

      if (desktopQuantity) {
          desktopQuantity.addEventListener('input', () => {
              setQuantity(parseInt(desktopQuantity.value));
          });
          desktopQuantity.addEventListener('wheel', (e) => e.preventDefault());
      }

      if (mobileQuantity) {
          mobileQuantity.addEventListener('input', () => {
              setQuantity(parseInt(mobileQuantity.value));
          });
          mobileQuantity.addEventListener('wheel', (e) => e.preventDefault());
      }

      // Initial sync
      const initialValue = desktopQuantity ? parseInt(desktopQuantity.value) : 
                        mobileQuantity ? parseInt(mobileQuantity.value) : 1;
      setQuantity(initialValue);
  }
  setupQuantityControls();

  // Image Scroller
  function setupImageScroller() {
      const scroller = document.querySelector('.image-scroller');
      const currentImageEl = document.getElementById('current-image');
      const totalImageEl = document.getElementById('total-images');
      const sourceImages = document.querySelectorAll('.product-pics .product-pic img');

      if (!scroller || !sourceImages.length) return;

      // Clear existing images
      scroller.innerHTML = '';

      // Clone each image and append to scroller
      sourceImages.forEach(img => {
          const clone = img.cloneNode(true);
          scroller.appendChild(clone);
      });

      // Update total image count
      if (totalImageEl) {
          totalImageEl.textContent = sourceImages.length;
      }

      function updateCurrentImage() {
          if (!scroller || !currentImageEl) return;
          const scrollLeft = scroller.scrollLeft;
          const width = scroller.clientWidth;
          const index = Math.round(scrollLeft / width);
          currentImageEl.textContent = index + 1;
      }

      // Initialize current image index
      updateCurrentImage();

      // Listen to scroll
      scroller.addEventListener('scroll', () => {
          window.requestAnimationFrame(updateCurrentImage);
      });
  }
  setupImageScroller();

  // Mobile Title Sync
  function syncMobileTitle() {
      const sourceName = document.getElementById('name-of-selected-product');
      const mobileTitle = document.querySelector('.clothes-title-mobile p');

      if (sourceName && mobileTitle) {
          mobileTitle.textContent = sourceName.textContent.trim();
      }
  }
  syncMobileTitle();

  // Cart Functionality
  function setupCart() {
      function updateCartCount() {
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
          
          document.querySelectorAll('#in-cart, #in-cart-mobile').forEach(el => {
              if (el) el.textContent = count;
          });
      }

      function addToCart() {
          document.querySelectorAll('#add-to-cart').forEach(button => {
              button.addEventListener('click', () => {
                  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

                  const productName = document.getElementById('name-of-selected-product')?.textContent?.trim();
                  const priceElement = document.querySelector('#price-word p');
                  const productPrice = priceElement?.textContent?.trim().replace('NGN ', '').replace(/,/g, '');
                  const productImage = document.querySelector('.product-pic img')?.src;

                  if (!productName || !productPrice || !productImage) {
                      console.error('Missing product information');
                      return;
                  }

                  let selectedColor = '';
                  const activeColorBox = document.querySelector('.color-box.active');
                  if (activeColorBox) {
                      selectedColor = activeColorBox.closest('.color-box-wrapper')?.querySelector('.color-name')?.textContent?.trim();
                  } else {
                      selectedColor = document.querySelector('.dropdown-display')?.textContent?.trim();
                  }

                  let selectedSize = '';
                  const activeSizeBox = document.querySelector('.sizes-box.active');
                  if (activeSizeBox) {
                      selectedSize = activeSizeBox.textContent.trim();
                  } else {
                      const sizeDisplays = document.querySelectorAll('.dropdown-display');
                      selectedSize = sizeDisplays[1]?.textContent?.trim();
                  }

                  const quantityInput = document.getElementById('quantity') || document.querySelector('.styled-input');
                  const quantity = parseInt(quantityInput?.value) || 1;

                  const cartItem = {
                      name: productName,
                      size: selectedSize || 'One Size',
                      color: selectedColor || 'Default',
                      quantity: quantity,
                      price: productPrice,
                      image: productImage
                  };

                  const existingItemIndex = cart.findIndex(item =>
                      item.name === cartItem.name &&
                      item.size === cartItem.size &&
                      item.color === cartItem.color
                  );

                  if (existingItemIndex >= 0) {
                      cart[existingItemIndex] = cartItem;
                  } else {
                      cart.push(cartItem);
                  }

                  localStorage.setItem('cart', JSON.stringify(cart));
                  updateCartCount();
                  alert('Item added to cart!');
              });
          });
      }

      addToCart();
      updateCartCount();
  }
  setupCart();
});