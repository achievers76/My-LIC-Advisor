// मॉड्यूल नेविगेशन और मुख्य रेंडरर
function renderModule(mod) {
  const titleEl = document.getElementById('module-title');
  const bodyEl = document.getElementById('module-body');

  if (mod === 'calc') {
    titleEl.innerText = '🧮 प्रीमियम व साल-दर-साल कैलकुलेटर';
    renderCalculatorUI(bodyEl);
  } else if (mod === 'compare') {
    titleEl.innerText = '⚖️ LIC बनाम FD / पोस्ट ऑफिस / Govt तुलना';
    renderCompareUI(bodyEl);
  } else if (mod === 'combo') {
    titleEl.innerText = '🎁 कॉम्बो प्लान बिल्डर';
    renderComboUI(bodyEl);
  } else if (typeof renderExtraModule === 'function') {
    renderExtraModule(mod, titleEl, bodyEl);
  }
}

// 1. लाइव ऑटो-अपडेट प्रीमियम और साल-दर-साल कैलकुलेटर
function renderCalculatorUI(container) {
  let planOptions = LIC_PLANS.map(p => `<option value="${p.no}">${p.no} - ${p.name}</option>`).join('');
  let riderChecks = LIC_RIDERS.map(r => `
    <label class="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border">
      <input type="checkbox" value="${r.id}" onchange="calculateYearByYear()" class="calc-rider accent-blue-700" />
      <span>${r.name}</span>
    </label>`).join('');

  container.innerHTML = `
    <div class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
      <div>
        <label class="text-xs font-bold text-slate-600">ग्राहक का नाम</label>
        <input type="text" id="calc-client" value="श्री अमित वर्मा" oninput="calculateYearByYear()"
          class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-semibold" />
      </div>
      <div>
        <label class="text-xs font-bold text-slate-600">LIC प्लान चुनें (सभी 28 प्लान)</label>
        <select id="calc-plan" onchange="onCalcPlanChange()" class="w-full mt-1 px-3 py-2.5 border rounded-xl text-sm font-bold bg-blue-50 text-blue-900">
          ${planOptions}
        </select>
        <p id="calc-plan-desc" class="text-[11px] text-slate-500 mt-1"></p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-600">ग्राहक की उम्र (वर्ष)</label>
          <input type="number" id="calc-age" value="30" min="0" max="75" oninput="calculateYearByYear()"
            class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold bg-amber-50/50" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600">बीमा राशि (Sum Assured)</label>
          <input type="number" id="calc-sa" value="1000000" step="50000" oninput="calculateYearByYear()"
            class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-600">पॉलिसी अवधि (Term)</label>
          <input type="number" id="calc-term" value="25" min="5" max="60" oninput="calculateYearByYear()"
            class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600">प्रीमियम अवधि (PPT)</label>
          <input type="number" id="calc-ppt" value="16" min="1" max="50" oninput="calculateYearByYear()"
            class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-600 mb-1 block">अतिरिक्त सुरक्षा राइडर्स जोड़ें:</label>
        <div class="space-y-1.5">${riderChecks}</div>
      </div>
      <button onclick="calculateYearByYear()" class="w-full py-3 rounded-xl font-bold text-white royal-gradient shadow-md active:scale-95 transition">
        साल-दर-साल चार्ट रीफ्रेश करें 📊
      </button>
    </div>
    <div id="calc-result-area" class="mt-4"></div>
  `;
  onCalcPlanChange();
}

function onCalcPlanChange() {
  const no = document.getElementById('calc-plan').value;
  const plan = LIC_PLANS.find(p => p.no === no);
  if (!plan) return;
  document.getElementById('calc-term').value = plan.defaultTerm;
  document.getElementById('calc-ppt').value = plan.defaultPpt;
  document.getElementById('calc-plan-desc').innerText = plan.desc;
  calculateYearByYear(); // प्लान बदलते ही तुरंत कैलकुलेट करें
}

function calculateYearByYear() {
  const client = document.getElementById('calc-client').value || 'सम्मानित ग्राहक';
  const no = document.getElementById('calc-plan').value;
  const plan = LIC_PLANS.find(p => p.no === no);
  if (!plan) return;

  const age = Math.max(0, Math.min(75, parseInt(document.getElementById('calc-age').value) || 30));
  const sa = Math.max(50000, parseInt(document.getElementById('calc-sa').value) || 1000000);
  const term = Math.max(1, parseInt(document.getElementById('calc-term').value) || plan.defaultTerm);
  let ppt = Math.max(1, parseInt(document.getElementById('calc-ppt').value) || plan.defaultPpt);
  if (ppt > term && !plan.type.startsWith('wholelife')) ppt = term;

  // उम्र और अवधि (Term/PPT) के अनुसार डायनामिक प्रीमियम समायोजन
  const ageFactor = 1 + Math.max(0, (age - 25) * 0.014);
  const termFactor = (plan.type === 'single') ? 1 : (plan.defaultTerm / term) * 0.65 + 0.35;
  const pptFactor = (plan.type === 'single') ? 1 : (plan.defaultPpt / ppt) * 0.70 + 0.30;

  let riderRate = 0;
  document.querySelectorAll('.calc-rider:checked').forEach(cb => {
    const r = LIC_RIDERS.find(x => x.id === cb.value);
    if (r) riderRate += r.ratePerThousand * ageFactor;
  });

  const adjustedBaseRate = plan.rate * ageFactor * termFactor * pptFactor;
  const basePrem = (sa / 1000) * (adjustedBaseRate + riderRate);
  const gst = basePrem * 0.045;
  const firstYrPrem = Math.round(basePrem + gst);
  const totalPaid = firstYrPrem * ppt;

  let rowsHTML = '';
  let totalReturn = 0;
  const displayYears = plan.type.startsWith('wholelife') ? Math.max(term, 100 - age) : term;

  for (let yr = 1; yr <= displayYears; yr++) {
    const curAge = age + yr - 1;
    const premThisYr = (yr <= ppt) ? firstYrPrem : 0;
    const accBonus = (sa / 1000) * plan.bonus * Math.min(yr, term);
    const normalCover = (plan.type === 'term') ? sa : Math.round(sa + accBonus);
    let payout = 0;

    if (plan.type === 'wholelife_8' && yr > ppt) payout = Math.round(sa * 0.08);
    if (plan.type === 'wholelife_10' && yr > ppt) payout = Math.round(sa * 0.10);
    if (plan.type === 'moneyback' && [5, 10, 15].includes(yr) && yr < term) payout = Math.round(sa * 0.20);
    if (plan.type === 'child_mb' && [18, 20, 22].includes(curAge)) payout = Math.round(sa * 0.20);

    if (yr === displayYears && plan.type !== 'term') {
      const fabAmt = (sa / 1000) * plan.fab;
      const alreadyPaidMB = (plan.type === 'moneyback' || plan.type === 'child_mb') ? sa * 0.60 : 0;
      payout += Math.round((sa - alreadyPaidMB) + accBonus + fabAmt);
    }
    totalReturn += payout;

    rowsHTML += `
      <tr class="border-b text-[11px] ${payout > 0 ? 'bg-emerald-50 font-bold text-emerald-900' : 'bg-white'}">
        <td class="p-2 text-center">${yr}</td>
        <td class="p-2 text-center font-semibold">${curAge} वर्ष</td>
        <td class="p-2 text-right">${premThisYr > 0 ? formatINR(premThisYr) : '₹ 0'}</td>
        <td class="p-2 text-right text-blue-800">${formatINR(normalCover)}</td>
        <td class="p-2 text-right ${payout > 0 ? 'text-emerald-700' : 'text-slate-400'}">${payout > 0 ? formatINR(payout) : '-'}</td>
      </tr>`;
  }

  const shareText = `*LIC पॉलिसी कोटेशन - ${client}*\nउम्र: ${age} वर्ष | अवधि: ${term} वर्ष | PPT: ${ppt} वर्ष\nप्लान: ${plan.no} - ${plan.name}\nबीमा राशि: ${formatINR(sa)}\nसालाना प्रीमियम: ${formatINR(firstYrPrem)}\nकुल अनुमानित लाभ (टैक्स-फ्री): ${formatINR(totalReturn)}\n\nसंपर्क करें: ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('calc-result-area').innerHTML = `
    <div id="printable-quote" class="bg-white p-4 rounded-2xl shadow-md border border-blue-100 space-y-3">
      <div class="royal-gradient text-white p-3.5 rounded-xl">
        <div class="flex justify-between items-center text-xs text-amber-300 font-bold">
          <span>प्रस्ताव: ${client} (उम्र: ${age} वर्ष)</span>
          <span>अवधि: ${term}/${ppt} वर्ष</span>
        </div>
        <div class="text-base font-extrabold mt-0.5">${plan.no} - ${plan.name}</div>
        <div class="grid grid-cols-3 gap-2 mt-3 bg-white/10 p-2.5 rounded-lg text-center">
          <div><div class="text-[10px] text-blue-200">सालाना प्रीमियम</div><div class="text-xs font-bold">${formatINR(firstYrPrem)}</div></div>
          <div><div class="text-[10px] text-blue-200">कुल जमा (${ppt} वर्ष)</div><div class="text-xs font-bold">${formatINR(totalPaid)}</div></div>
          <div><div class="text-[10px] text-amber-200">कुल टैक्स-फ्री लाभ</div><div class="text-xs font-extrabold text-amber-300">${formatINR(totalReturn)}</div></div>
        </div>
      </div>

      <div class="overflow-x-auto max-h-80 border rounded-xl">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-800 text-white text-[10px] sticky top-0">
            <tr>
              <th class="p-2 text-center">वर्ष</th>
              <th class="p-2 text-center">उम्र</th>
              <th class="p-2 text-right">प्रीमियम</th>
              <th class="p-2 text-right">रिस्क कवर</th>
              <th class="p-2 text-right">रिटर्न/पेंशन</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>

      <div class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border text-xs">
        <div class="flex items-center gap-2">
          <img src="${currentAgent.photo}" class="w-9 h-9 rounded-full object-cover border" />
          <div><div class="font-bold">${currentAgent.name}</div><div class="text-[10px] text-slate-500">${currentAgent.club} • ${currentAgent.phone}</div></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2.5 pt-1">
        <button onclick="window.print()" class="py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">🖨️ PDF सेव / प्रिंट</button>
        <a href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" class="py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center">💬 व्हाट्सएप भेजें</a>
      </div>
    </div>`;
}

// 2. LIC बनाम अन्य LIC प्लान + बैंक FD + पोस्ट ऑफिस / सरकारी योजनाओं की तुलना
function renderCompareUI(container) {
  let planOptions = LIC_PLANS.map(p => `<option value="${p.no}">${p.no} - ${p.name}</option>`).join('');
  container.innerHTML = `
    <div class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
      <div class="grid grid-cols-2 gap-2.5">
        <div>
          <label class="text-[11px] font-bold text-blue-800">LIC प्लान 1 (मुख्य)</label>
          <select id="cmp-p1" onchange="runFullComparison()" class="w-full mt-1 p-2 border rounded-xl text-xs font-bold bg-blue-50">${planOptions}</select>
        </div>
        <div>
          <label class="text-[11px] font-bold text-indigo-800">LIC प्लान 2 (वैकल्पिक)</label>
          <select id="cmp-p2" onchange="runFullComparison()" class="w-full mt-1 p-2 border rounded-xl text-xs font-bold bg-indigo-50">${planOptions}</select>
        </div>
      </div>

      <div>
        <label class="text-[11px] font-bold text-amber-800">पोस्ट ऑफिस / सरकारी योजना चुनें (तुलना हेतु):</label>
        <select id="cmp-govt" onchange="runFullComparison()" class="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-amber-50 text-amber-900">
          <option value="ppf">पोस्ट ऑफिस / बैंक PPF (7.1% ब्याज • 15 वर्ष लॉक-इन • शून्य बीमा)</option>
          <option value="ssy">सुकन्या समृद्धि योजना SSY (8.2% ब्याज • केवल बेटी हेतु • शून्य बीमा)</option>
          <option value="nsc">पोस्ट ऑफिस NSC / टाइम डिपॉजिट (7.7% ब्याज • ब्याज पर टैक्स • शून्य बीमा)</option>
          <option value="kvp">किसान विकास पत्र KVP (7.5% ब्याज • 115 माह में दोगुना • शून्य बीमा)</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-[11px] font-bold text-slate-600">सालाना निवेश बजट (₹)</label>
          <input type="number" id="cmp-budget" value="50000" step="5000" oninput="runFullComparison()" class="w-full mt-1 p-2 border rounded-xl text-sm font-bold" />
        </div>
        <div>
          <label class="text-[11px] font-bold text-slate-600">अवधि (वर्ष)</label>
          <input type="number" id="cmp-term" value="20" min="5" max="40" oninput="runFullComparison()" class="w-full mt-1 p-2 border rounded-xl text-sm font-bold" />
        </div>
      </div>

      <button onclick="runFullComparison()" class="w-full py-3 rounded-xl font-bold text-white royal-gradient shadow active:scale-95 transition">
        4-तरफा लाइव तुलना देखें ⚖️
      </button>
    </div>
    <div id="cmp-result" class="mt-4"></div>
  `;
  document.getElementById('cmp-p2').selectedIndex = 12;
  runFullComparison();
}

function runFullComparison() {
  const p1 = LIC_PLANS.find(p => p.no === document.getElementById('cmp-p1').value);
  const p2 = LIC_PLANS.find(p => p.no === document.getElementById('cmp-p2').value);
  const govtType = document.getElementById('cmp-govt').value;
  const budget = Math.max(5000, parseInt(document.getElementById('cmp-budget').value) || 50000);
  const term = Math.max(5, parseInt(document.getElementById('cmp-term').value) || 20);

  const ppt = Math.min(term, 15);
  const totalInvested = budget * ppt;

  const sa1 = Math.round((budget / p1.rate) * 1000);
  const ret1 = Math.round(sa1 + (sa1 / 1000) * (p1.bonus * term + p1.fab));

  const sa2 = Math.round((budget / p2.rate) * 1000);
  const ret2 = Math.round(sa2 + (sa2 / 1000) * (p2.bonus * term + p2.fab));

  let fdCorpus = 0;
  for (let i = 0; i < term; i++) {
    if (i < ppt) fdCorpus += budget;
    fdCorpus = fdCorpus * 1.049;
  }

  const govtRates = {
    ppf: { name: 'पोस्ट ऑफिस PPF', rate: 0.071, tax: 'टैक्स-फ्री (EEE)' },
    ssy: { name: 'सुकन्या समृद्धि (SSY)', rate: 0.082, tax: 'टैक्स-फ्री (केवल बेटी)' },
    nsc: { name: 'पोस्ट ऑफिस NSC/TD', rate: 0.054, tax: 'ब्याज करयोग्य' },
    kvp: { name: 'किसान विकास पत्र', rate: 0.052, tax: 'ब्याज करयोग्य' }
  };
  const gInfo = govtRates[govtType];
  let govtCorpus = 0;
  for (let i = 0; i < term; i++) {
    if (i < ppt) govtCorpus += budget;
    govtCorpus = govtCorpus * (1 + gInfo.rate);
  }

  const shareMsg = `*निवेश तुलना रिपोर्ट (${term} वर्ष)*\nसालाना बचत: ${formatINR(budget)} (${ppt} वर्ष)\n\n1️⃣ *LIC ${p1.name}:* ${formatINR(ret1)} (टैक्स-फ्री + ${formatINR(sa1)} बीमा कवर)\n2️⃣ *LIC ${p2.name}:* ${formatINR(ret2)} (टैक्स-फ्री + ${formatINR(sa2)} बीमा कवर)\n3️⃣ *${gInfo.name}:* ${formatINR(govtCorpus)} (बीमा कवर: ₹ 0)\n4️⃣ *बैंक FD (टैक्स बाद):* ${formatINR(fdCorpus)} (बीमा कवर: ₹ 0)\n\n- ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('cmp-result').innerHTML = `
    <div class="bg-white p-3.5 rounded-2xl shadow-md space-y-3">
      <h4 class="font-bold text-sm text-slate-800 text-center">तुलनात्मक चार्ट (${term} वर्ष • बचत: ${formatINR(budget)}/वर्ष)</h4>
      <div class="overflow-x-auto border rounded-xl">
        <table class="w-full text-[11px] border-collapse">
          <thead class="bg-slate-900 text-white">
            <tr>
              <th class="p-2 text-left">मापदंड</th>
              <th class="p-2 text-right bg-blue-900">LIC ${p1.no}</th>
              <th class="p-2 text-right bg-indigo-900">LIC ${p2.no}</th>
              <th class="p-2 text-right bg-amber-900">${gInfo.name.split(' ')[0]}</th>
              <th class="p-2 text-right bg-slate-700">बैंक FD</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr>
              <td class="p-2 font-bold">कुल जमा</td>
              <td class="p-2 text-right">${formatINR(totalInvested)}</td>
              <td class="p-2 text-right">${formatINR(totalInvested)}</td>
              <td class="p-2 text-right">${formatINR(totalInvested)}</td>
              <td class="p-2 text-right">${formatINR(totalInvested)}</td>
            </tr>
            <tr class="bg-blue-50/60">
              <td class="p-2 font-bold text-blue-900">बीमा कवर</td>
              <td class="p-2 text-right font-extrabold text-blue-700">${formatINR(sa1)}</td>
              <td class="p-2 text-right font-extrabold text-indigo-700">${formatINR(sa2)}</td>
              <td class="p-2 text-right text-red-600 font-bold">₹ 0</td>
              <td class="p-2 text-right text-red-600 font-bold">₹ 0</td>
            </tr>
            <tr class="bg-emerald-50/70">
              <td class="p-2 font-bold text-emerald-900">मैच्योरिटी फंड</td>
              <td class="p-2 text-right font-extrabold text-emerald-700">${formatINR(ret1)}</td>
              <td class="p-2 text-right font-extrabold text-emerald-700">${formatINR(ret2)}</td>
              <td class="p-2 text-right font-bold">${formatINR(govtCorpus)}</td>
              <td class="p-2 text-right font-bold">${formatINR(fdCorpus)}</td>
            </tr>
            <tr>
              <td class="p-2 font-bold">टैक्स नियम</td>
              <td class="p-2 text-right text-emerald-700 font-bold">10(10D) फ्री</td>
              <td class="p-2 text-right text-emerald-700 font-bold">10(10D) फ्री</td>
              <td class="p-2 text-right text-amber-700">${gInfo.tax}</td>
              <td class="p-2 text-right text-red-600">TDS + टैक्स</td>
            </tr>
          </tbody>
        </table>
      </div>
      <a href="https://wa.me/?text=${encodeURIComponent(shareMsg)}" target="_blank" class="block w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center">
        💬 तुलना चार्ट व्हाट्सएप पर भेजें
      </a>
    </div>`;
}

// 3. कॉम्बो प्लान बिल्डर UI
function renderComboUI(container) {
  container.innerHTML = `
    <div class="space-y-3">
      <div class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
        <label class="text-xs font-bold text-slate-600">रेडीमेड सेल्स कॉन्सेप्ट चुनें:</label>
        <select id="combo-type" onchange="buildComboPlan()" class="w-full p-2.5 border rounded-xl text-sm font-bold bg-emerald-50 text-emerald-900">
          <option value="kanyadaan">👰 कन्यादान महा-कॉम्बो (जीवन लक्ष्य 733 + अमृतबाल 774)</option>
          <option value="pension">👴 आजीवन शाही पेंशन कॉम्बो (जीवन उत्सव 771 + जीवन उमंग 745)</option>
          <option value="education">🎓 चाइल्ड हायर एजुकेशन कॉम्बो (जीवन तरुण 734 + लाभ 736)</option>
          <option value="family">🛡️ संपूर्ण परिवार 3-पीढ़ी सुरक्षा कवच (आनंद 715 + बीमा कवच 887)</option>
        </select>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-slate-600">ग्राहक का नाम</label>
            <input type="text" id="combo-client" value="श्री मनोज गुप्ता" oninput="buildComboPlan()" class="w-full mt-1 p-2 border rounded-xl text-sm" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600">दैनिक बचत लक्ष्य (₹/दिन)</label>
            <input type="number" id="combo-daily" value="200" step="50" oninput="buildComboPlan()" class="w-full mt-1 p-2 border rounded-xl text-sm font-bold" />
          </div>
        </div>
        <button onclick="buildComboPlan()" class="w-full py-3 rounded-xl font-bold text-white gold-gradient shadow active:scale-95 transition">
          आकर्षक कॉम्बो पैकेज बनाएं 🎁
        </button>
      </div>
      <div id="combo-output"></div>
    </div>
  `;
  buildComboPlan();
}

function buildComboPlan() {
  const type = document.getElementById('combo-type').value;
  const client = document.getElementById('combo-client').value || 'सम्मानित ग्राहक';
  const daily = Math.max(20, parseInt(document.getElementById('combo-daily').value) || 200);
  const yearly = daily * 365;

  const combos = {
    kanyadaan: { title: 'कन्यादान महा-कॉम्बो पैकेज', plans: 'जीवन लक्ष्य (733) + अमृतबाल (774)', mult: 28, coverMult: 16, highlight: 'पिता के न रहने पर भी सारे प्रीमियम माफ + बेटी की शादी पर एकमुश्त टैक्स-फ्री फंड!' },
    pension: { title: 'आजीवन शाही पेंशन कॉम्बो', plans: 'जीवन उत्सव (771) + जीवन उमंग  (745)', mult: 34, coverMult: 14, highlight: '15 साल बचत करें और 100 वर्ष की आयु तक हर साल टैक्स-फ्री पेंशन पाएं!' },
    education: { title: 'चाइल्ड एजुकेशन गारंटी पैक', plans: 'जीवन तरुण (734) + जीवन लाभ (736)', mult: 26, coverMult: 15, highlight: 'बच्चे की 18 से 25 वर्ष की उम्र में हर साल कॉलेज फीस के लिए गारंटीड पैसा!' },
    family: { title: '3-पीढ़ी संपूर्ण सुरक्षा कवच', plans: 'न्यू जीवन आनंद (715) + बीमा कवच (887)', mult: 24, coverMult: 45, highlight: 'बड़ा टर्म कवर + मैच्योरिटी के बाद भी आजीवन फ्री रिस्क कवर!' }
  };

  const c = combos[type];
  const estReturn = Math.round(yearly * c.mult);
  const estCover = Math.round(yearly * c.coverMult);
  const msg = `*${c.title} - ${client}*\nकेवल ₹${daily}/दिन की बचत से:\n✅ शामिल प्लान: ${c.plans}\n🛡️ कुल सुरक्षा कवच: ${formatINR(estCover)}\n💰 अनुमानित टैक्स-फ्री लाभ: ${formatINR(estReturn)}\n✨ खासियत: ${c.highlight}\n\nसंपर्क: ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('combo-output').innerHTML = `
    <div class="bg-white p-4 rounded-2xl shadow-md border-2 border-amber-300 space-y-3">
      <div class="text-center">
        <span class="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">स्पेशल कॉम्बो प्रस्ताव</span>
        <h3 class="text-lg font-extrabold text-slate-900 mt-1">${c.title}</h3>
        <p class="text-xs text-slate-500">तैयार किया गया: <b>${client}</b> के लिए</p>
      </div>
      <div class="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-xl text-center">
        <div><div class="text-[10px] text-slate-500">दैनिक बचत</div><div class="text-sm font-extrabold text-blue-700">₹ ${daily} / दिन</div></div>
        <div><div class="text-[10px] text-slate-500">कुल सुरक्षा कवर</div><div class="text-sm font-extrabold text-rose-700">${formatINR(estCover)}</div></div>
      </div>
      <div class="bg-emerald-50 p-3 rounded-xl text-center border border-emerald-200">
        <div class="text-xs text-emerald-800 font-bold">कुल अनुमानित टैक्स-फ्री रिटर्न</div>
        <div class="text-2xl font-extrabold text-emerald-700 mt-0.5">${formatINR(estReturn)}</div>
      </div>
      <p class="text-xs text-slate-700 bg-blue-50 p-2.5 rounded-xl">⭐ <b>मुख्य लाभ:</b> ${c.highlight}</p>
      <a href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" class="block w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center shadow">
        💬 यह कॉम्बो ऑफर व्हाट्सएप पर भेजें
      </a>
    </div>`;
}
// 2. LIC बनाम अन्य LIC प्लान + बैंक FD + पोस्ट ऑफिस / सरकारी योजनाओं की तुलना
function renderCompareUI(container) {
  let planOptions = LIC_PLANS.map(p => `<option value="${p.no}">${p.no} - ${p.name}</option>`).join('');
  container.innerHTML = `
    <div class="bg-white p-5 rounded-3xl card-shadow border border-slate-100 space-y-4">
      <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span class="text-xl">⚖️</span>
        <h3 class="font-black text-base text-slate-800">स्मार्ट निवेश तुलना सेटअप</h3>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-blue-50/60 p-2.5 rounded-2xl border border-blue-100">
          <label class="text-xs font-extrabold text-blue-900">LIC प्लान 1 (मुख्य)</label>
          <select id="cmp-p1" onchange="runFullComparison()" class="w-full mt-1.5 p-2.5 border border-blue-200 rounded-xl text-xs font-extrabold bg-white text-blue-950">${planOptions}</select>
        </div>
        <div class="bg-indigo-50/60 p-2.5 rounded-2xl border border-indigo-100">
          <label class="text-xs font-extrabold text-indigo-900">LIC प्लान 2 (वैकल्पिक)</label>
          <select id="cmp-p2" onchange="runFullComparison()" class="w-full mt-1.5 p-2.5 border border-indigo-200 rounded-xl text-xs font-extrabold bg-white text-indigo-950">${planOptions}</select>
        </div>
      </div>

      <div class="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
        <label class="text-xs font-extrabold text-amber-950">पोस्ट ऑफिस / सरकारी योजना चुनें:</label>
        <select id="cmp-govt" onchange="runFullComparison()" class="w-full mt-1.5 p-2.5 border border-amber-300 rounded-xl text-xs font-extrabold bg-white text-amber-950">
          <option value="ppf">पोस्ट ऑफिस / बैंक PPF (7.1% ब्याज • 15 वर्ष लॉक-इन • शून्य बीमा)</option>
          <option value="ssy">सुकन्या समृद्धि योजना SSY (8.2% ब्याज • केवल बेटी हेतु • शून्य बीमा)</option>
          <option value="nsc">पोस्ट ऑफिस NSC / टाइम डिपॉजिट (7.7% ब्याज • ब्याज पर टैक्स • शून्य बीमा)</option>
          <option value="kvp">किसान विकास पत्र KVP (7.5% ब्याज • 115 माह में दोगुना • शून्य बीमा)</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <label class="text-xs font-extrabold text-slate-700">सालाना निवेश बजट (₹)</label>
          <input type="number" id="cmp-budget" value="50000" step="5000" oninput="runFullComparison()" class="w-full mt-1 p-2.5 border rounded-xl text-base font-black bg-white" />
        </div>
        <div class="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <label class="text-xs font-extrabold text-slate-700">अवधि (वर्ष)</label>
          <input type="number" id="cmp-term" value="20" min="5" max="40" oninput="runFullComparison()" class="w-full mt-1 p-2.5 border rounded-xl text-base font-black bg-white" />
        </div>
      </div>

      <button onclick="runFullComparison()" class="w-full py-3.5 rounded-2xl font-black text-white text-sm royal-gradient shadow-lg active:scale-95 transition">
        4-तरफा लाइव तुलना देखें ⚖️
      </button>
    </div>
    <div id="cmp-result" class="mt-4"></div>
  `;
  document.getElementById('cmp-p2').selectedIndex = 12;
  runFullComparison();
}

function runFullComparison() {
  const p1 = LIC_PLANS.find(p => p.no === document.getElementById('cmp-p1').value);
  const p2 = LIC_PLANS.find(p => p.no === document.getElementById('cmp-p2').value);
  const govtType = document.getElementById('cmp-govt').value;
  const budget = Math.max(5000, parseInt(document.getElementById('cmp-budget').value) || 50000);
  const term = Math.max(5, parseInt(document.getElementById('cmp-term').value) || 20);

  const ppt = Math.min(term, 15);
  const totalInvested = budget * ppt;

  const sa1 = Math.round((budget / p1.rate) * 1000);
  const ret1 = Math.round(sa1 + (sa1 / 1000) * (p1.bonus * term + p1.fab));

  const sa2 = Math.round((budget / p2.rate) * 1000);
  const ret2 = Math.round(sa2 + (sa2 / 1000) * (p2.bonus * term + p2.fab));

  let fdCorpus = 0;
  for (let i = 0; i < term; i++) {
    if (i < ppt) fdCorpus += budget;
    fdCorpus = fdCorpus * 1.049;
  }

  const govtRates = {
    ppf: { name: 'पोस्ट ऑफिस PPF', rate: 0.071, tax: 'टैक्स-फ्री (EEE)' },
    ssy: { name: 'सुकन्या समृद्धि (SSY)', rate: 0.082, tax: 'टैक्स-फ्री (केवल बेटी)' },
    nsc: { name: 'पोस्ट ऑफिस NSC/TD', rate: 0.054, tax: 'ब्याज करयोग्य' },
    kvp: { name: 'किसान विकास पत्र', rate: 0.052, tax: 'ब्याज करयोग्य' }
  };
  const gInfo = govtRates[govtType];
  let govtCorpus = 0;
  for (let i = 0; i < term; i++) {
    if (i < ppt) govtCorpus += budget;
    govtCorpus = govtCorpus * (1 + gInfo.rate);
  }

  const shareMsg = `*निवेश तुलना रिपोर्ट (${term} वर्ष)*\nसालाना बचत: ${formatINR(budget)} (${ppt} वर्ष)\n\n1️⃣ *LIC ${p1.name}:* ${formatINR(ret1)} (टैक्स-फ्री + ${formatINR(sa1)} बीमा कवर)\n2️⃣ *LIC ${p2.name}:* ${formatINR(ret2)} (टैक्स-फ्री + ${formatINR(sa2)} बीमा कवर)\n3️⃣ *${gInfo.name}:* ${formatINR(govtCorpus)} (बीमा कवर: ₹ 0)\n4️⃣ *बैंक FD (टैक्स बाद):* ${formatINR(fdCorpus)} (बीमा कवर: ₹ 0)\n\nनिष्कर्ष: अनहोनी की स्थिति में केवल LIC ही परिवार का पूरा लक्ष्य पूरा करती है!\n- ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('cmp-result').innerHTML = `
    <div class="bg-white p-4 rounded-3xl card-shadow border border-slate-100 space-y-3.5">
      <h4 class="font-black text-sm text-slate-900 text-center">📊 तुलनात्मक चार्ट (${term} वर्ष • बचत: ${formatINR(budget)}/वर्ष)</h4>
      <div class="overflow-x-auto border border-slate-200 rounded-2xl">
        <table class="w-full text-xs border-collapse">
          <thead class="bg-slate-900 text-white">
            <tr>
              <th class="p-2.5 text-left">मापदंड</th>
              <th class="p-2.5 text-right bg-blue-900">LIC ${p1.no}</th>
              <th class="p-2.5 text-right bg-indigo-900">LIC ${p2.no}</th>
              <th class="p-2.5 text-right bg-amber-900">${gInfo.name.split(' ')[0]}</th>
              <th class="p-2.5 text-right bg-slate-700">बैंक FD</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-2.5 font-extrabold">कुल जमा</td>
              <td class="p-2.5 text-right font-semibold">${formatINR(totalInvested)}</td>
              <td class="p-2.5 text-right font-semibold">${formatINR(totalInvested)}</td>
              <td class="p-2.5 text-right font-semibold">${formatINR(totalInvested)}</td>
              <td class="p-2.5 text-right font-semibold">${formatINR(totalInvested)}</td>
            </tr>
            <tr class="bg-blue-50/70">
              <td class="p-2.5 font-extrabold text-blue-950">बीमा कवर</td>
              <td class="p-2.5 text-right font-black text-blue-700">${formatINR(sa1)}</td>
              <td class="p-2.5 text-right font-black text-indigo-700">${formatINR(sa2)}</td>
              <td class="p-2.5 text-right text-red-600 font-black">₹ 0</td>
              <td class="p-2.5 text-right text-red-600 font-black">₹ 0</td>
            </tr>
            <tr class="bg-emerald-50/80">
              <td class="p-2.5 font-extrabold text-emerald-950">मैच्योरिटी फंड</td>
              <td class="p-2.5 text-right font-black text-emerald-700">${formatINR(ret1)}</td>
              <td class="p-2.5 text-right font-black text-emerald-700">${formatINR(ret2)}</td>
              <td class="p-2.5 text-right font-extrabold">${formatINR(govtCorpus)}</td>
              <td class="p-2.5 text-right font-extrabold">${formatINR(fdCorpus)}</td>
            </tr>
            <tr>
              <td class="p-2.5 font-extrabold">टैक्स नियम</td>
              <td class="p-2.5 text-right text-emerald-700 font-extrabold">10(10D) फ्री</td>
              <td class="p-2.5 text-right text-emerald-700 font-extrabold">10(10D) फ्री</td>
              <td class="p-2.5 text-right text-amber-800 font-bold">${gInfo.tax}</td>
              <td class="p-2.5 text-right text-red-600 font-bold">TDS + टैक्स</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 leading-relaxed">
        💡 <b>सेल्स पॉइंट:</b> FD या पोस्ट ऑफिस में केवल वही पैसा मिलता है जो आपने जमा किया है, जबकि LIC में पहले दिन से <b>${formatINR(sa1)}</b> का सुरक्षा कवच और टैक्स-फ्री रिटर्न मिलता है।
      </div>
      <a href="https://wa.me/?text=${encodeURIComponent(shareMsg)}" target="_blank" class="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black text-center shadow-md">
        💬 तुलना चार्ट व्हाट्सएप पर भेजें
      </a>
    </div>`;
}

// 3. कॉम्बो प्लान बिल्डर UI
function renderComboUI(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white p-5 rounded-3xl card-shadow border border-slate-100 space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span class="text-xl">🎁</span>
          <h3 class="font-black text-base text-slate-800">रेडीमेड कॉम्बो पैकेज बिल्डर</h3>
        </div>

        <div>
          <label class="text-xs font-extrabold text-slate-600">सेल्स कॉन्सेप्ट चुनें:</label>
          <select id="combo-type" onchange="buildComboPlan()" class="w-full mt-1.5 p-3 border-2 border-emerald-200 rounded-2xl text-sm font-black bg-emerald-50/70 text-emerald-950">
            <option value="kanyadaan">👰 कन्यादान महा-कॉम्बो (जीवन लक्ष्य 733 + अमृतबाल 774)</option>
            <option value="pension">👴 आजीवन शाही पेंशन कॉम्बो (जीवन उत्सव 771 + जीवन उमंग 745)</option>
            <option value="education">🎓 चाइल्ड हायर एजुकेशन कॉम्बो (जीवन तरुण 734 + लाभ 736)</option>
            <option value="family">🛡️ संपूर्ण परिवार 3-पीढ़ी सुरक्षा कवच (आनंद 715 + बीमा कवच 887)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-extrabold text-slate-600">ग्राहक का नाम</label>
            <input type="text" id="combo-client" value="श्री मनोज गुप्ता" oninput="buildComboPlan()" class="w-full mt-1 p-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold" />
          </div>
          <div>
            <label class="text-xs font-extrabold text-slate-600">दैनिक बचत (₹/दिन)</label>
            <input type="number" id="combo-daily" value="200" step="50" oninput="buildComboPlan()" class="w-full mt-1 p-2.5 border-2 border-slate-200 rounded-xl text-base font-black" />
          </div>
        </div>

        <button onclick="buildComboPlan()" class="w-full py-3.5 rounded-2xl font-black text-slate-950 text-sm gold-gradient shadow-lg active:scale-95 transition">
          आकर्षक कॉम्बो पैकेज बनाएं 🎁
        </button>
      </div>
      <div id="combo-output"></div>
    </div>
  `;
  buildComboPlan();
}

function buildComboPlan() {
  const type = document.getElementById('combo-type').value;
  const client = document.getElementById('combo-client').value || 'सम्मानित ग्राहक';
  const daily = Math.max(20, parseInt(document.getElementById('combo-daily').value) || 200);
  const yearly = daily * 365;

  const combos = {
    kanyadaan: { title: 'कन्यादान महा-कॉम्बो पैकेज', plans: 'जीवन लक्ष्य (733) + अमृतबाल (774)', mult: 28, coverMult: 16, highlight: 'पिता के न रहने पर भी सारे प्रीमियम माफ + बेटी की शादी पर एकमुश्त टैक्स-फ्री फंड!' },
    pension: { title: 'आजीवन शाही पेंशन कॉम्बो', plans: 'जीवन उत्सव (771) + जीवन उमंग (745)', mult: 34, coverMult: 14, highlight: '15 साल बचत करें और 100 वर्ष की आयु तक हर साल टैक्स-फ्री पेंशन पाएं!' },
    education: { title: 'चाइल्ड एजुकेशन गारंटी पैक', plans: 'जीवन तरुण (734) + जीवन लाभ (736)', mult: 26, coverMult: 15, highlight: 'बच्चे की 18 से 25 वर्ष की उम्र में हर साल कॉलेज फीस के लिए गारंटीड पैसा!' },
    family: { title: '3-पीढ़ी संपूर्ण सुरक्षा कवच', plans: 'न्यू जीवन आनंद (715) + बीमा कवच (887)', mult: 24, coverMult: 45, highlight: 'बड़ा टर्म कवर + मैच्योरिटी के बाद भी आजीवन फ्री रिस्क कवर!' }
  };

  const c = combos[type];
  const estReturn = Math.round(yearly * c.mult);
  const estCover = Math.round(yearly * c.coverMult);
  const msg = `*${c.title} - ${client}*\nकेवल ₹${daily}/दिन की बचत से:\n✅ शामिल प्लान: ${c.plans}\n🛡️ कुल सुरक्षा कवच: ${formatINR(estCover)}\n💰 अनुमानित टैक्स-फ्री लाभ: ${formatINR(estReturn)}\n✨ खासियत: ${c.highlight}\n\nसंपर्क: ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('combo-output').innerHTML = `
    <div class="bg-white p-5 rounded-3xl card-shadow border-2 border-amber-300 space-y-3.5">
      <div class="text-center">
        <span class="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">⭐ स्पेशल कॉम्बो प्रस्ताव</span>
        <h3 class="text-xl font-black text-slate-900 mt-1.5">${c.title}</h3>
        <p class="text-xs font-semibold text-slate-500">तैयार किया गया: <b class="text-slate-800">${client}</b> के लिए</p>
      </div>
      <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl text-center border border-slate-100">
        <div><div class="text-xs font-bold text-slate-500">दैनिक बचत</div><div class="text-base font-black text-blue-700 mt-0.5">₹ ${daily} / दिन</div></div>
        <div><div class="text-xs font-bold text-slate-500">कुल सुरक्षा कवर</div><div class="text-base font-black text-rose-700 mt-0.5">${formatINR(estCover)}</div></div>
      </div>
      <div class="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-200">
        <div class="text-xs text-emerald-900 font-extrabold">कुल अनुमानित टैक्स-फ्री रिटर्न</div>
        <div class="text-2xl font-black text-emerald-700 mt-0.5">${formatINR(estReturn)}</div>
      </div>
      <p class="text-xs text-slate-800 bg-blue-50 p-3 rounded-2xl leading-relaxed">✨ <b>मुख्य लाभ:</b> ${c.highlight}</p>
      <a href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" class="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black text-center shadow-md">
        💬 यह कॉम्बो ऑफर व्हाट्सएप पर भेजें
      </a>
    </div>`;
}
