const accordions = [...document.querySelectorAll('.acc')] as HTMLDivElement[];

  const setAriaExpandedFalse = (btn: HTMLButtonElement) => {
    btn.setAttribute('aria-expanded', 'false');
  };

  const isAriaExpanded = (btn: HTMLButtonElement) =>
    JSON.parse(btn.getAttribute('aria-expanded') as string) as boolean;

  const toggleAriaExpanded = (btn: HTMLButtonElement) => {
    const isExpanded = isAriaExpanded(btn);
    btn.setAttribute('aria-expanded', `${!isExpanded}`);
  };

  accordions.forEach(acc => {
    // data for accordion
    const isFirstExpanded = acc.hasAttribute('data-isFirstExpanded');
    const isOnlyOneExpandable = acc.hasAttribute('data-isOnlyOneExpandable');

    // show first expanded if data-isFirstExpanded is present
    if (isFirstExpanded) {
      const firstBtn = acc.querySelector('.acc-question') as HTMLButtonElement;
      toggleAriaExpanded(firstBtn);
    }

    const accBtns = [
      ...acc.querySelectorAll('.acc-question')
    ] as HTMLButtonElement[];

    // set event listeners
    accBtns.forEach(btn =>
      btn.addEventListener('click', e => {
        // is the current button open?
        const isExpanded = isAriaExpanded(btn);

        // check if all others should close
        if (isOnlyOneExpandable) {
          accBtns.forEach(setAriaExpandedFalse);
        }

        // if already open do nothing
        if (isOnlyOneExpandable && isExpanded) {
        } else {
          // expand if it was previously closed
          toggleAriaExpanded(btn);
        }
      })
    );
    acc.addEventListener('keydown', e => {
      // is this a button?
      //@ts-expect-error
      const isBtn = [...e.target.classList].includes('acc-question');

      if (!isBtn) {
        return;
      }

      const currentButtonIndex = accBtns.indexOf(e.target as HTMLButtonElement);

      // only prevent default if these four buttons are pressed
      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'End' ||
        e.key === 'Home'
      ) {
        e.preventDefault();
      }

      // handle four keypress options for acc
      switch (e.key) {
        case 'ArrowDown':
          if (accBtns.length - 1 === currentButtonIndex) {
            accBtns[0].focus();
          } else {
            accBtns[currentButtonIndex + 1].focus();
          }
          break;
        case 'ArrowUp':
          if (currentButtonIndex === 0) {
            accBtns[accBtns.length - 1].focus();
          } else {
            accBtns[currentButtonIndex - 1].focus();
          }
          break;
        case 'End':
          accBtns[accBtns.length - 1].focus();
          break;
        case 'Home':
          accBtns[0].focus();
          break;
        default:
          break;
      }
    });
  });