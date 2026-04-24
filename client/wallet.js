const isEmbedded = new URLSearchParams(window.location.search).get('embedded') === '1';
if (isEmbedded) {
  document.body.classList.add('embedded');
}

const QUICK_AMOUNTS = [20, 50, 100, 150, 200, 500];

let currentStep = 1;
let selectedMethod = null;
let selectedAmount = null;

const fmt = (n) => Number(n).toLocaleString('fr-TN', { minimumFractionDigits: 0 }) + ' DT';

function getEl(id) {
  return document.getElementById(id);
}

(function buildQuickGrid() {
  const grid = getEl('quick-grid');
  QUICK_AMOUNTS.forEach((val) => {
    const btn = document.createElement('button');
    btn.className = 'rm-quick-btn';
    btn.dataset.val = val;
    btn.innerHTML = `<strong>${val}</strong><span>DT</span>`;
    btn.onclick = () => pickQuickAmt(val, btn);
    grid.appendChild(btn);
  });
})();

function selectMethod(label, hint) {
  selectedMethod = { label, hint };
  getEl('header-subtitle').textContent = label;
  getEl('step2-subtitle').textContent = label + ' - Choisissez le montant';
  goStep(2);
}

function pickQuickAmt(val, btn) {
  document.querySelectorAll('.rm-quick-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  selectedAmount = val;
  getEl('custom-amount').value = '';
  updateSummary();
  updateStep2Btn();
}

function onCustomAmt() {
  const v = parseFloat(getEl('custom-amount').value);
  document.querySelectorAll('.rm-quick-btn').forEach((b) => b.classList.remove('active'));
  selectedAmount = v && v >= 10 ? v : null;
  updateSummary();
  updateStep2Btn();
}

function updateSummary() {
  const summary = getEl('amount-summary');
  if (selectedAmount && selectedAmount >= 10) {
    getEl('sum-method').textContent = selectedMethod?.label ?? '-';
    getEl('sum-amount').textContent = fmt(selectedAmount);
    getEl('sum-total').textContent = fmt(selectedAmount);
    summary.style.display = 'block';
  } else {
    summary.style.display = 'none';
  }
}

function updateStep2Btn() {
  const btn = getEl('btn-step2');
  if (selectedAmount && selectedAmount >= 10) {
    btn.disabled = false;
    btn.textContent = `Continuer - ${fmt(selectedAmount)}`;
  } else {
    btn.disabled = true;
    btn.textContent = 'Continuer';
  }
}

function fmtCardNum() {
  const v = getEl('card-num').value.replace(/\D/g, '').slice(0, 16);
  getEl('card-num').value = v.match(/.{1,4}/g)?.join(' ') ?? v;
  updateCard();
}

function fmtExpiry() {
  let v = getEl('card-expiry').value.replace(/\D/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  getEl('card-expiry').value = v;
  updateCard();
}

function updateCard() {
  const num = getEl('card-num').value || '**** **** **** ****';
  const name = getEl('card-name').value.toUpperCase() || 'VOTRE NOM';
  const expiry = getEl('card-expiry').value || 'MM/AA';
  const cvv = getEl('card-cvv').value || '***';
  getEl('card-num-disp').textContent = num;
  getEl('card-name-disp').textContent = name;
  getEl('card-exp-disp').textContent = expiry;
  getEl('card-cvv-disp').textContent = cvv;

  const filled = getEl('card-num').value.replace(/\s/g, '').length === 16
    && getEl('card-name').value.trim().length > 1
    && getEl('card-expiry').value.length === 5
    && getEl('card-cvv').value.length === 3;

  const btn = getEl('btn-confirm');
  btn.disabled = !filled;
  btn.textContent = filled ? `Confirmer ${fmt(selectedAmount)}` : 'Confirmer';
}

function flipCard(flipped) {
  getEl('card-preview').classList.toggle('flipped', flipped);
}

function handleConfirmPayment() {
  const btn = getEl('btn-confirm');
  btn.classList.add('loading');
  btn.textContent = 'Traitement...';
  btn.disabled = true;
  setTimeout(() => {
    getEl('success-amount').textContent = fmt(selectedAmount);
    getEl('success-method').textContent = selectedMethod?.label ?? '';
    goStep(4);
  }, 1800);
}

function goStep(n) {
  currentStep = n;
  [1, 2, 3, 4].forEach((i) => {
    getEl('step-' + i).style.display = i === n ? '' : 'none';
  });
  getEl('progress-bar').style.display = n === 4 ? 'none' : '';
  updateProgress(n);
}

function updateProgress(n) {
  [1, 2, 3].forEach((i) => {
    const dot = getEl('step-dot-' + i);
    dot.classList.toggle('active', n === i);
    dot.classList.toggle('done', n > i);
    const dotEl = dot.querySelector('.rm-progress-dot');
    dotEl.textContent = n > i ? 'OK' : i;
  });
  [1, 2].forEach((i) => {
    const line = getEl('line-' + i);
    if (line) line.classList.toggle('done', n > i + 1);
  });
}

function closeModal() {
  if (isEmbedded && window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'citydrive-wallet-close' }, '*');
    return;
  }
  getEl('overlay').style.display = 'none';
}

getEl('overlay').addEventListener('click', function closeOnBackdrop(e) {
  if (e.target === this) closeModal();
});
