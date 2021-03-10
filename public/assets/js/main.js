(function () {

  /*
   *  BUBBLE ANIMATIONS
   */
  const scene = document.querySelector('.parallax');

  if(scene) {
    const parallaxInstance = new Parallax(scene);
    const bubbles = scene.querySelectorAll('.bubble');
  
    let supportDeviceMotion = false,
      supportMousemove = false;
  
    window.addEventListener("devicemotion", function (event) {
      if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) {
        if (!supportDeviceMotion) {
          supportDeviceMotion = true;
          updateAnimation();
        }
      }
    });
  
    window.addEventListener("mousemove", function (event) {
      if (!supportMousemove) {
        supportMousemove = true
        updateAnimation();
      }
    });
  
    updateAnimation();
  
    function updateAnimation() {
      if (supportMousemove || supportDeviceMotion) {
        bubbles.forEach((bubble) => {
          bubble.classList.add('notransition');
        })
      } else {
        bubbles.forEach((bubble) => {
          bubble.classList.remove('notransition');
        })
      }
    }
  }

   /*
   *  NAV
   */
  window.addEventListener('scroll', (e) => {
    if (window.scrollY > 0) {
      document.querySelector('nav').classList.add('scrolled')
    } else {
      document.querySelector('nav').classList.remove('scrolled')
    }
  })


  /*
   *  LINK
   */

  const anchorLinks = document.querySelectorAll('[data-target]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('scrolling');
      const target = document.querySelector(link.attributes.getNamedItem('data-target').value);
      console.log(target);
      console.log(Boolean(target));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        })
      }
    })
  });

  document.querySelectorAll('[data-target="#aboutme"]').forEach((link) => {
    link.addEventListener('click', () => {
      bubbles.forEach((bubble) => {
        bubble.addEventListener("animationend", function () {
          bubble.classList.remove('slidingout');
        }, {
          once: true
        });
        bubble.classList.add('slidingout');
      })
    })
  })

  /*
   *  MASONRY GRID
   */
  let grids = [...document.querySelectorAll('.grid--masonry')];

  if (grids.length && getComputedStyle(grids[0]).gridTemplateRows !== 'masonry') {
    grids = grids.map(grid => ({
      _el: grid,
      gap: parseFloat(getComputedStyle(grid).gridRowGap),
      items: [...grid.childNodes].filter(c => c.nodeType === 1),
      ncol: 0
    }));

    function layout() {
      grids.forEach(grid => {


        /* get the post relayout number of columns */
        let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;

        grid.ncol = ncol;

        /* revert to initial positioning, no margin */
        grid.items.forEach(c => c.style.removeProperty('margin-top'));

        /* if we have more than one column */
        if (grid.ncol > 1) {
          grid.items.slice(ncol).forEach((c, i) => {

            let prev_fin = grid.items[i].querySelector('img').getBoundingClientRect().bottom /* bottom edge of item above */ ,
              curr_ini = c.getBoundingClientRect().top /* top edge of current item */ ;

            console.log(c, `${prev_fin + grid.gap - curr_ini}px`);


            c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`
          })
        }
      })
    }

    addEventListener('load', e => {
      layout(); /* initial load */
      addEventListener('resize', layout, false) /* on resize */
    }, false);
  }


})();