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

// 1. प्रीमियम और साल-दर-साल कैलकुलेटर UI
function renderCalculatorUI(container) {
  let planOptions = LIC_PLANS.map(p => `<option value="${p.no}">${p.no} - ${p.name}</option>`).join('');
  let riderChecks = LIC_RIDERS.map(r => `
    <label class="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border">
      <input type="checkbox" value="${r.id}" class="calc-rider accent-blue-700" />
      <span>${r.name}</span>
    </label>`).join('');

  container.innerHTML = `
    <div class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
      <div>
        <label class="text-xs font-bold text-slate-600">ग्राहक का नाम</label>
        <input type="text" id="calc-client" value="श्री अमित वर्मा" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-semibold" />
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
          <input type="number" id="calc-age" value="30" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600">बीमा राशि (Sum Assured)</label>
          <input type="number" id="calc-sa" value="1000000" step="50000" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-600">पॉलिसी अवधि (Term)</label>
          <input type="number" id="calc-term" value="25" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600">प्रीमियम अवधि (PPT)</label>
          <input type="number" id="calc-ppt" value="16" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-600 mb-1 block">अतिरिक्त सुरक्षा राइडर्स जोड़ें:</label>
        <div class="space-y-1.5">${riderChecks}</div>
      </div>
      <button onclick="calculateYearByYear()" class="w-full py-3.5 rounded-xl font-bold text-white royal-gradient shadow-md active:scale-95 transition">
        साल-दर-साल चार्ट देखें 📊
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
}

function calculateYearByYear() {
  const client = document.getElementById('calc-client').value || 'सम्मानित ग्राहक';
  const no = document.getElementById('calc-plan').value;
  const plan = LIC_PLANS.find(p => p.no === no);
  const age = parseInt(document.getElementById('calc-age').value) || 30;
  const sa = parseInt(document.getElementById('calc-sa').value) || 1000000;
  const term = parseInt(document.getElementById('calc-term').value) || plan.defaultTerm;
  const ppt = parseInt(document.getElementById('calc-ppt').value) || plan.defaultPpt;

  let riderRate = 0;
  document.querySelectorAll('.calc-rider:checked').forEach(cb => {
    const r = LIC_RIDERS.find(x => x.id === cb.value);
    if (r) riderRate += r.ratePerThousand;
  });

  const basePrem = (sa / 1000) * (plan.rate + riderRate);
  const gst = basePrem * 0.045;
  const firstYrPrem = Math.round(basePrem + gst);
  const totalPaid = firstYrPrem * ppt;

  let rowsHTML = '';
  let totalReturn = 0;
  const displayYears = (plan.type.startsWith('wholelife')) ? Math.max(term, 100 - age) : term;

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
        <td class="p-2 text-center">${curAge}</td>
        <td class="p-2 text-right">${premThisYr > 0 ? formatINR(premThisYr) : '₹ 0'}</td>
        <td class="p-2 text-right text-blue-800">${formatINR(normalCover)}</td>
        <td class="p-2 text-right ${payout > 0 ? 'text-emerald-700' : 'text-slate-400'}">${payout > 0 ? formatINR(payout) : '-'}</td>
      </tr>`;
  }

  const shareText = `*LIC पॉलिसी कोटेशन - ${client}*\nप्लान: ${plan.no} - ${plan.name}\nबीमा राशि: ${formatINR(sa)}\nसालाना प्रीमियम: ${formatINR(firstYrPrem)} (${ppt} वर्ष)\nकुल अनुमानित लाभ (टैक्स-फ्री): ${formatINR(totalReturn)}\n\nसंपर्क करें: ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('calc-result-area').innerHTML = `
    <div id="printable-quote" class="bg-white p-4 rounded-2xl shadow-md border border-blue-100 space-y-3">
      <div class="royal-gradient text-white p-3.5 rounded-xl">
        <div class="text-xs text-amber-300 font-bold">व्यक्तिगत बीमा प्रस्ताव: ${client}</div>
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
// 2. पॉलिसी बनाम बैंक FD / पोस्ट ऑफिस / सरकारी योजना तुलना UI
function renderCompareUI(container) {
  let planOptions = LIC_PLANS.map(p => `<option value="${p.no}">${p.no} - ${p.name}</option>`).join('');
  let plan2Options = `<option value="NONE">-- कोई नहीं (सिर्फ LIC बनाम FD/PO देखें) --</option>` + planOptions;

  container.innerHTML = `
    <div class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
      <div>
        <label class="text-xs font-bold text-slate-600">1. मुख्य LIC प्लान चुनें</label>
        <select id="cmp-plan1" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold bg-blue-50 text-blue-900">
          ${planOptions}
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-600">2. दूसरा LIC प्लान (वैकल्पिक तुलना हेतु)</label>
        <select id="cmp-plan2" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm bg-slate-50">
          ${plan2Options}
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-600">3. तुलना करने के लिए सरकारी / बैंक विकल्प चुनें</label>
        <select id="cmp-govt" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold bg-amber-50 text-amber-900">
          <option value="FD">बैंक FD (7.0% ब्याज - 30% टैक्स स्लैब के बाद 4.9%)</option>
          <option value="PPF">पोस्ट ऑफिस PPF (7.1% - 15 साल लॉक-इन, कोई बीमा कवर नहीं)</option>
          <option value="SSY">सुकन्या समृद्धि योजना SSY (8.2% - केवल बेटी हेतु, 21 साल लॉक-इन)</option>
          <option value="NSC">पोस्ट ऑफिस NSC (7.7% ब्याज - मैच्योरिटी पर ब्याज टैक्स योग्य)</option>
          <option value="KVP">किसान विकास पत्र KVP (7.5% ब्याज - कोई टैक्स छूट नहीं, कोई बीमा नहीं)</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-600">सालाना निवेश बजट (₹)</label>
          <input type="number" id="cmp-budget" value="50000" step="5000" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600">अवधि (वर्ष)</label>
          <input type="number" id="cmp-years" value="15" class="w-full mt-1 px-3 py-2 border rounded-xl text-sm font-bold" />
        </div>
      </div>
      <button onclick="runComparison()" class="w-full py-3.5 rounded-xl font-bold text-white royal-gradient shadow-md active:scale-95 transition">
        तुलना रिपोर्ट देखें ⚖️
      </button>
    </div>
    <div id="cmp-result-area" class="mt-4"></div>
  `;
}

function runComparison() {
  const p1 = LIC_PLANS.find(p => p.no === document.getElementById('cmp-plan1').value);
  const p2No = document.getElementById('cmp-plan2').value;
  const p2 = p2No !== 'NONE' ? LIC_PLANS.find(p => p.no === p2No) : null;
  const govtType = document.getElementById('cmp-govt').value;
  const budget = parseInt(document.getElementById('cmp-budget').value) || 50000;
  const yrs = parseInt(document.getElementById('cmp-years').value) || 15;

  const totalInvested = budget * yrs;

  // LIC प्लान 1 गणना
  const sa1 = Math.round((budget / p1.rate) * 1000);
  const mat1 = Math.round(sa1 + (sa1 / 1000) * p1.bonus * yrs + (sa1 / 1000) * p1.fab);

  // LIC प्लान 2 गणना (यदि चुना हो)
  let sa2 = 0, mat2 = 0;
  if (p2) {
    sa2 = Math.round((budget / p2.rate) * 1000);
    mat2 = Math.round(sa2 + (sa2 / 1000) * p2.bonus * yrs + (sa2 / 1000) * p2.fab);
  }

  // सरकारी / बैंक विकल्प की चक्रवृद्धि गणना
  const govtRates = {
    FD: { name: "बैंक FD (टैक्स कटने के बाद)", netRate: 0.049, taxNote: "ब्याज पर हर साल 30% टैक्स कटता है", cover: "₹ 0 (कोई बीमा नहीं)", loan: "FD पर 80% तक" },
    PPF: { name: "पोस्ट ऑफिस PPF", netRate: 0.071, taxNote: "टैक्स-फ्री, पर 15 साल सख्त लॉक-इन", cover: "₹ 0 (कोई बीमा नहीं)", loan: "सीमित शर्तों पर" },
    SSY: { name: "सुकन्या समृद्धि (SSY)", netRate: 0.082, taxNote: "केवल 10 साल से कम की बेटी के लिए", cover: "₹ 0 (कोई बीमा नहीं)", loan: "लोन सुविधा नहीं" },
    NSC: { name: "पोस्ट ऑफिस NSC", netRate: 0.054, taxNote: "मैच्योरिटी ब्याज पर टैक्स लगता है", cover: "₹ 0 (कोई बीमा नहीं)", loan: "बैंक में गिरवी रखकर" },
    KVP: { name: "किसान विकास पत्र (KVP)", netRate: 0.0525, taxNote: "80C छूट नहीं, ब्याज टैक्स योग्य", cover: "₹ 0 (कोई बीमा नहीं)", loan: "सीमित सुविधा" }
  };
  const gInfo = govtRates[govtType];
  let govtMat = 0;
  for (let i = 0; i < yrs; i++) {
    govtMat = (govtMat + budget) * (1 + gInfo.netRate);
  }
  govtMat = Math.round(govtMat);

  const waMsg = `*निवेश तुलना रिपोर्ट (${formatINR(budget)}/वर्ष x ${yrs} साल)*\n\n` +
    `✅ *LIC ${p1.name} (${p1.no}):*\n- पहले दिन से जीवन सुरक्षा: ${formatINR(sa1)}\n- अनुमानित मैच्योरिटी: ${formatINR(mat1)} (100% टैक्स-फ्री 10(10D))\n\n` +
    `🏦 *${gInfo.name}:*\n- जीवन सुरक्षा कवर: ₹ 0\n- मैच्योरिटी: ${formatINR(govtMat)}\n\n` +
    `निष्कर्ष: पहले दिन से पूरे परिवार की सुरक्षा केवल LIC में मिलती है!\nसंपर्क: ${currentAgent.name} (${currentAgent.phone})`;

  document.getElementById('cmp-result-area').innerHTML = `
    <div class="bg-white p-4 rounded-2xl shadow-md space-y-3 border border-amber-200">
      <h3 class="font-bold text-sm text-slate-800 border-b pb-2">तुलना परिणाम (कुल निवेश: ${formatINR(totalInvested)})</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border-collapse">
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="p-2 text-left">विशेषता</th>
              <th class="p-2 text-right bg-blue-900">LIC ${p1.no}</th>
              ${p2 ? `<th class="p-2 text-right bg-indigo-900">LIC ${p2.no}</th>` : ''}
              <th class="p-2 text-right bg-amber-800">${govtType}</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr>
              <td class="p-2 font-bold">पहले दिन से बीमा कवर</td>
              <td class="p-2 text-right font-bold text-blue-700">${formatINR(sa1)}</td>
              ${p2 ? `<td class="p-2 text-right font-bold text-indigo-700">${formatINR(sa2)}</td>` : ''}
              <td class="p-2 text-right text-red-600 font-bold">₹ 0 (शून्य)</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="p-2 font-bold">अनुमानित मैच्योरिटी</td>
              <td class="p-2 text-right font-extrabold text-emerald-700">${formatINR(mat1)}</td>
              ${p2 ? `<td class="p-2 text-right font-extrabold text-emerald-700">${formatINR(mat2)}</td>` : ''}
              <td class="p-2 text-right font-bold text-slate-700">${formatINR(govtMat)}</td>
            </tr>
            <tr>
              <td class="p-2 font-bold">इनकम टैक्स नियम</td>
              <td class="p-2 text-right text-emerald-700">100% टैक्स-फ्री</td>
              ${p2 ? `<td class="p-2 text-right text-emerald-700">100% टैक्स-फ्री</td>` : ''}
              <td class="p-2 text-right text-[10px] text-slate-600">${gInfo.taxNote}</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="p-2 font-bold">अनहोनी पर परिवार को</td>
              <td class="p-2 text-right text-blue-800 font-semibold">पूरा बीमा + बोनस</td>
              ${p2 ? `<td class="p-2 text-right text-blue-800 font-semibold">पूरा बीमा + बोनस</td>` : ''}
              <td class="p-2 text-right text-slate-500">सिर्फ जमा राशि</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
        💡 <b>ग्राहक को समझाने का मुख्य बिंदु:</b> ${gInfo.name} में यदि निवेशक के साथ कोई अनहोनी हो जाए, तो बैंक केवल जमा किया हुआ पैसा लौटाता है—लेकिन LIC पहले दिन से <b>${formatINR(sa1)}</b> की पूरी सुरक्षा गारंटी देता है।
      </div>
      <a href="https://wa.me/?text=${encodeURIComponent(waMsg)}" target="_blank"
        class="block w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center shadow">
        💬 तुलना रिपोर्ट व्हाट्सएप पर भेजें
      </a>
    </div>`;
}

// 3. कॉम्बो प्लान बिल्डर UI
function renderComboUI(container) {
  const combos = [
    { id: 'kanyadan', title: '👰 कन्यादान / बेटी की शादी महा-पैकेज', plans: 'जीवन लक्ष्य (733) + जीवन लाभ (736)', daily: 150, fund: '₹ 26,50,000', tag: 'बेटी की शादी के समय एकमुश्त बड़ा फंड + पिता की अनुपस्थिति में भी प्रीमियम माफ!' },
    { id: 'pension', title: '👴 आजीवन टैक्स-फ्री पेंशन कॉम्बो', plans: 'जीवन उत्सव (771) + जीवन उमंग (745)', daily: 250, fund: '₹ 1,20,000 / वर्ष आजीवन', tag: '10-15 साल निवेश करें और 100 वर्ष की आयु तक हर साल टैक्स-फ्री पेंशन पाएं।' },
    { id: 'edu', title: '🎓 चाइल्ड हायर एजुकेशन गारंटी पैक', plans: 'अमृतबाल (774) + जीवन तरुण (734)', daily: 180, fund: '₹ 22,00,000 (18 से 25 वर्ष तक)', tag: 'बच्चे की कॉलेज फीस और उच्च शिक्षा के लिए हर साल गारंटीड फंड।' },
    { id: 'family', title: '🛡️ संपूर्ण परिवार 3-पीढ़ी सुरक्षा कवच', plans: 'जीवन आनंद (715) + बीमा कवच टर्म (887)', daily: 200, fund: '₹ 1 करोड़ कवर + ₹ 25 लाख बचत', tag: 'परिवार को 1 करोड़ की सुरक्षा और मैच्योरिटी पर 25 लाख का रिटर्न।' }
  ];

  let cards = combos.map(c => {
    const msg = `*${c.title}*\nशामिल प्लान: ${c.plans}\nअनुमानित बचत: मात्र ₹ ${c.daily}/दिन\nअनुमानित लाभ: ${c.fund}\nविशेषता: ${c.tag}\n\nअधिक जानकारी के लिए संपर्क करें:\n${currentAgent.name} (${currentAgent.phone})`;
    return `
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2">
        <div class="font-extrabold text-sm text-blue-900">${c.title}</div>
        <div class="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg inline-block">कॉम्बिनेशन: ${c.plans}</div>
        <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
          <div><span class="text-slate-500 block text-[10px]">अनुमानित बचत</span><b>₹ ${c.daily} / दिन</b></div>
          <div><span class="text-slate-500 block text-[10px]">अनुमानित लाभ</span><b class="text-emerald-700">${c.fund}</b></div>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">${c.tag}</p>
        <a href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank"
          class="block w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center">
          💬 यह कॉम्बो ग्राहक को व्हाट्सएप करें
        </a>
      </div>`;
  }).join('');

  container.innerHTML = `<div class="space-y-3">${cards}</div>`;
}
