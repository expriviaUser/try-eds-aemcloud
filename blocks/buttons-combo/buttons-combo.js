// eslint-disable-next-line max-len
const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.199475 1.12574C0.0721472 1.00433 0 0.835567 0 0.659555C0 0.483109 0.0720637 0.31431 0.192656 0.199589C0.441759 -0.0579143 0.850875 -0.0675723 1.11184 0.178297L1.11368 0.180052L5.62651 4.52392C5.75297 4.65029 5.82418 4.82162 5.82418 5.00048C5.82418 5.17934 5.75297 5.35067 5.62333 5.48017L1.10715 9.82696C0.983216 9.93763 0.823632 9.99868 0.663358 9.9997C0.484775 10.0053 0.312563 9.93285 0.192194 9.80109C0.0693219 9.68016 0 9.51446 0 9.34141C0 9.16539 0.0721472 8.99663 0.198368 8.87628L4.21095 5.00048L0.199475 1.12574Z"/>
</svg>`;

function getField(block, name) {
  const row = [...block.querySelectorAll(':scope > div')].find(
    (r) => r.querySelector(':scope > div')?.textContent?.trim() === name
  );
  return row?.querySelectorAll(':scope > div')[1]?.textContent?.trim() || '';
}

function renderCTA(label, href, target, type, linkType, ariaLabel, titleText, id, csTrack, icon, iconPos, modalCheck) {
  if (!label && !href) return '';

  if (type === 'ctaLink') {
    const isTextLink = linkType === 'text-link';
    return `
      <a id="${id}" href="${href}" target="${target}" data-pln-atom="link"
         class="${linkType}" aria-label="${ariaLabel || titleText}"
         title="${titleText}" data-cs-override-id="${csTrack}"
         data-pln-template="${isTextLink ? 'text-link' : 'cta-link'}">
        <span>${label}</span>
        ${!isTextLink ? ARROW_SVG : ''}
      </a>`;
  }

  const iconHTML = icon ? `<img src="${icon}" class="button__icon button__icon--${iconPos || 'right'}" alt="" aria-hidden="true">` : '';
  return `
    <a id="${id}" href="${href}" target="${target}"
       class="button button--${type}" aria-label="${ariaLabel || titleText}"
       title="${titleText}" data-cs-override-id="${csTrack}"
       ${modalCheck ? `data-modal-id="${href}"` : ''}>
      ${iconPos === 'left' ? iconHTML : ''}
      <span>${label}</span>
      ${iconPos !== 'left' ? iconHTML : ''}
    </a>`;
}

function renderStore(path, title, imageRef, ariaLabel) {
  if (!path) return '';
  return `
    <a target="_blank" role="button" title="${title}" href="${path}" aria-label="${ariaLabel || title}">
      ${imageRef ? `<picture><img loading="lazy" alt="" aria-hidden="true" src="${imageRef}"></picture>` : ''}
    </a>`;
}

export default function decorate(block) {
  const f = (name) => getField(block, name);

  const templateFirst  = f('templateDropdownFirst');
  const templateSecond = f('templateDropdownSecond');
  const alignment      = f('alignmentDropdown') || 'center';
  const ctaSize        = f('ctaSize') || 'default';
  const isReverted     = f('isReverted') === 'true';
  const componentId    = f('componentId');
  const classObj       = f('classObj');

  // Determine molecule
  let molecule = '', moleculeVersion = '1.0', plnTemplate = '';
  if (['primary','secondary'].includes(templateFirst) || ['primary','secondary'].includes(templateSecond)) {
    molecule = 'cta-group'; moleculeVersion = '1.2';
  }
  if (templateFirst === 'stores' || templateSecond === 'stores') {
    molecule = 'store-group'; moleculeVersion = '1.1';
    plnTemplate = f('storeLogoSizeFirst') || f('storeLogoSizeSecond');
  }
  if (templateFirst === 'ctaLink' || templateSecond === 'ctaLink') {
    molecule = ''; moleculeVersion = '1.1';
  }

  // Render first slot
  let firstHTML = '';
  if (templateFirst === 'stores') {
    firstHTML = renderStore(f('storePathFirst'), f('storeTitleFirst'), f('storeImageFirstFileReference'), f('primaryCTAAriaLabel') || f('primaryTitleTextCTA'));
  } else {
    firstHTML = renderCTA(f('primaryCTALabel'), f('primaryCTALink'), f('primaryTargetCTA') || '_self',
      templateFirst, f('primaryLinkType'), f('primaryCTAAriaLabel'), f('primaryTitleTextCTA'),
      f('idButton1'), f('ctaCsTackCta1'), f('primaryIcon'), f('primaryIconPosition'), f('modalChekbox1'));
  }

  // Render second slot
  let secondHTML = '';
  if (templateSecond === 'stores') {
    secondHTML = renderStore(f('storePathSecond'), f('storeTitleSecond'), f('storeImageSecondFileReference'), f('secondaryCTAAriaLabel') || f('secondaryTitleTextCTA'));
  } else {
    secondHTML = renderCTA(f('secondaryCTALabel'), f('secondaryCTALink'), f('secondaryTargetCTA') || '_self',
      templateSecond, f('secondaryLinkType'), f('secondaryCTAAriaLabel'), f('secondaryTitleTextCTA'),
      f('idButton2'), f('ctaCsTackCta2'), f('secondaryIcon'), f('secondaryIconPosition'), f('modalChekbox2'));
  }

  block.innerHTML = `
    <div data-pln-component="buttons-combo" ${componentId ? `id="${componentId}"` : ''}
         data-pln-version="1.0" class="${classObj || ''} ${ctaSize} ${alignment}">
      <div class="wrapper">
        <div data-pln-molecule="${molecule}" data-pln-version="${moleculeVersion}"
             class="${alignment} ${isReverted ? 'reverse' : ''}"
             ${plnTemplate ? `data-pln-template="${plnTemplate}"` : ''}>
          ${firstHTML}
          ${secondHTML}
        </div>
      </div>
    </div>`;
}