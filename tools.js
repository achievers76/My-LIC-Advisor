// अतिरिक्त मॉड्यूल्स रेंडरर (Poster Maker, 360° Family CRM, Objection Handler)
function renderExtraModule(mod, titleEl, bodyEl) {
  if (mod === 'poster') {
    titleEl.innerText = '🎨 पर्सनल ब्रांडिंग पोस्टर मेकर';
    renderPosterMakerUI(bodyEl);
  } else if (mod === 'crm') {
    titleEl.innerText = '👨‍👩‍👧‍👦 360° फैमिली पोर्टफोलियो CRM';
    renderCRMUI(bodyEl);
  } else if (mod === 'objection') {
    titleEl.innerText = '🗣️ ऑब्जेक्शन हैंडलर स्क्रिप्ट्स';
    renderObjectionUI(bodyEl);
  }
}

// 4. लाइव पर्सनल ब्रांडिंग पोस्टर मेकर
function renderPosterMakerUI(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="text-xs font-bold text-slate-600">कार्ड का प्रकार चुनें</label>
            <select id="poster-theme" onchange="drawBrandingPoster()" class="w-full mt-1 p-2 border rounded-xl text-xs font-bold bg-purple-50">
              <option value="bday">🎂 जन्मदिन की बधाई</option>
              <option value="anniv">💍 शादी की सालगिरह</option>
              <option value="renewal">⏰ प्रीमियम किस्त रिमाइंडर</option>
              <option value="pension">👴 आजीवन पेंशन योजना</option>
              <option value="child">🎓 बच्चों का उज्ज्वल भविष्य</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600">ग्राहक का नाम लिखें</label>
            <input type="text" id="poster-client" value="श्री राजेश शर्मा जी" oninput="drawBrandingPoster()"
              class="w-full mt-1 p-2 border rounded-xl text-xs font-bold" />
          </div>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600">कस्टम संदेश (बदल सकते हैं)</label>
          <input type="text" id="poster-msg" value="आपके सुखद, स्वस्थ एवं सुरक्षित जीवन की हार्दिक शुभकामनाएं!" oninput="drawBrandingPoster()"
            class="w-full mt-1 p-2 border rounded-xl text-xs" />
        </div>
      </div>

      <!-- लाइव पोस्टर प्रिव्यू -->
      <div class="bg-white p-3 rounded-2xl shadow-md flex flex-col items-center">
        <canvas id="poster-canvas" width="600" height="720" class="w-full max-w-sm rounded-xl border shadow"></canvas>
        <div class="grid grid-cols-2 gap-2.5 w-full mt-3">
          <button onclick="downloadPosterPNG()" class="py-3 bg-blue-700 text-white rounded-xl text-xs font-bold shadow active:scale-95">
            ⬇️ पोस्टर डाउनलोड करें
          </button>
          <a id="poster-wa-btn" href="#" target="_blank" class="py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center shadow">
            💬 व्हाट्सएप संदेश भेजें
          </a>
        </div>
      </div>
    </div>
  `;
  setTimeout(drawBrandingPoster, 100);
}

function drawBrandingPoster() {
  const canvas = document.getElementById('poster-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const theme = document.getElementById('poster-theme').value;
  const clientName = document.getElementById('poster-client').value || 'सम्मानित ग्राहक';
  const customMsg = document.getElementById('poster-msg').value || '';

  const themes = {
    bday: { c1: '#1e1b4b', c2: '#4338ca', badge: '🎉 हार्दिक शुभकामनाएं 🎉', title: 'जन्मदिन मुबारक हो!' },
    anniv: { c1: '#701a75', c2: '#be185d', badge: '💐 शुभ विवाह वर्षगांठ 💐', title: 'शादी की सालगिरह मुबारक!' },
    renewal: { c1: '#7c2d12', c2: '#c2410c', badge: '🔔 आवश्यक सूचना 🔔', title: 'प्रीमियम भुगतान अनुस्मारक' },
    pension: { c1: '#064e3b', c2: '#047857', badge: '🛡️ गारंटीड सुरक्षा 🛡️', title: 'आजीवन टैक्स-फ्री पेंशन' },
    child: { c1: '#0f294a', c2: '#1d4ed8', badge: '🎓 उज्ज्वल भविष्य 🎓', title: 'बच्चों की उच्च शिक्षा गारंटी' }
  };
  const t = themes[theme];

  // बैकग्राउंड ग्रेडिएंट
  const grad = ctx.createLinearGradient(0, 0, 600, 580);
  grad.addColorStop(0, t.c1);
  grad.addColorStop(1, t.c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 720);

  // सुनहरा बॉर्डर
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 564, 684);

  // ऊपरी बैज व शीर्षक
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t.badge, 300, 90);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(t.title, 300, 165);

  // ग्राहक का नाम बॉक्स
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(60, 210, 480, 75);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(clientName, 300, 260);

  // संदेश की पंक्तियाँ
  ctx.fillStyle = '#f8fafc';
  ctx.font = '24px sans-serif';
  const words = customMsg.split(' ');
  let line = '', y = 350;
  for (let w of words) {
    if ((line + w).length > 34) {
      ctx.fillText(line, 300, y);
      line = w + ' ';
      y += 38;
    } else {
      line += w + ' ';
    }
  }
  ctx.fillText(line, 300, y);

  // निचला एजेंट ब्रांडिंग स्ट्रिप (सफेद पट्टी)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(22, 555, 556, 143);

  ctx.fillStyle = '#0f294a';
  ctx.textAlign = 'left';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(currentAgent.name || 'LIC बीमा सलाहकार', 155, 605);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`${currentAgent.club || 'LIC सलाहकार'} | कोड: ${currentAgent.code}`, 155, 638);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`📞 ${currentAgent.phone || ''}`, 155, 675);

  // एजेंट की गोल फोटो
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(88, 626, 48, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 40, 578, 96, 96);
    ctx.restore();
  };
  img.src = currentAgent.photo;

  // व्हाट्सएप लिंक अपडेट
  const waMsg = `*${t.title}*\nप्रिय ${clientName},\n${customMsg}\n\nशुभेच्छु:\n*${currentAgent.name}* (${currentAgent.club})\n📞 ${currentAgent.phone}`;
  document.getElementById('poster-wa-btn').href = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;
}

function downloadPosterPNG() {
  const canvas = document.getElementById('poster-canvas');
  const link = document.createElement('a');
  link.download = 'bima-saathi-poster.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
// 5. 360° फैमिली पोर्टफोलियो CRM
let clientPolicies = JSON.parse(localStorage.getItem('bs_crm_data') || 'null') || [
  { id: 1, family: 'अमित वर्मा', member: 'अमित वर्मा (स्वयं)', phone: '9876543210', company: 'LIC', plan: 'जीवन लाभ (736)', policyNo: '514892341', prem: 45200, due: '15 नवम्बर 2026' },
  { id: 2, family: 'अमित वर्मा', member: 'नेहा वर्मा (पत्नी)', phone: '9876543210', company: 'LIC', plan: 'बीमा लक्ष्मी (881)', policyNo: '514892990', prem: 32000, due: '22 नवम्बर 2026' },
  { id: 3, family: 'अमित वर्मा', member: 'आरव वर्मा (पुत्र)', phone: '9876543210', company: 'Star Health', plan: 'फैमिली हेल्थ ऑप्टिमा', policyNo: 'SH-992811', prem: 18500, due: '05 दिसम्बर 2026' }
];

function renderCRMUI(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white p-4 rounded-2xl shadow-sm space-y-2.5">
        <h3 class="text-sm font-extrabold text-slate-800">➕ नई पॉलिसी जोड़ें (LIC / अन्य कंपनी)</h3>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" id="crm-family" placeholder="परिवार मुखिया का नाम *" class="p-2 border rounded-xl text-xs" />
          <input type="text" id="crm-member" placeholder="सदस्य व रिश्ता *" class="p-2 border rounded-xl text-xs" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input type="tel" id="crm-phone" placeholder="मोबाइल नंबर *" class="p-2 border rounded-xl text-xs" />
          <select id="crm-comp" class="p-2 border rounded-xl text-xs bg-slate-50 font-bold">
            <option value="LIC">LIC ऑफ इंडिया</option>
            <option value="Health/Mediclaim">हेल्थ / मेडिक्लेम</option>
            <option value="Motor/Car">मोटर / कार बीमा</option>
            <option value="Other Life">अन्य बीमा कंपनी</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" id="crm-plan" placeholder="प्लान नाम / नंबर" class="p-2 border rounded-xl text-xs" />
          <input type="text" id="crm-polno" placeholder="पॉलिसी नंबर" class="p-2 border rounded-xl text-xs" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input type="number" id="crm-prem" placeholder="सालाना किस्त (₹)" class="p-2 border rounded-xl text-xs" />
          <input type="text" id="crm-due" placeholder="अगली किस्त तारीख (FUP)" class="p-2 border rounded-xl text-xs" />
        </div>
        <button onclick="addCRMPolicy()" class="w-full py-2.5 rounded-xl font-bold text-white royal-gradient text-xs shadow">
          परिवार पोर्टफोलियो में जोड़ें ✓
        </button>
      </div>

      <div id="crm-list" class="space-y-3"></div>
    </div>
  `;
  renderCRMList();
}

function addCRMPolicy() {
  const family = document.getElementById('crm-family').value.trim();
  const member = document.getElementById('crm-member').value.trim();
  const phone = document.getElementById('crm-phone').value.trim();
  if (!family || !member || !phone) { alert('कृपया परिवार का नाम, सदस्य और मोबाइल नंबर भरें'); return; }

  clientPolicies.unshift({
    id: Date.now(),
    family,
    member,
    phone,
    company: document.getElementById('crm-comp').value,
    plan: document.getElementById('crm-plan').value.trim() || 'बीमा पॉलिसी',
    policyNo: document.getElementById('crm-polno').value.trim() || 'N/A',
    prem: parseInt(document.getElementById('crm-prem').value) || 0,
    due: document.getElementById('crm-due').value.trim() || 'आगामी माह'
  });

  localStorage.setItem('bs_crm_data', JSON.stringify(clientPolicies));
  renderCRMList();
}

function deleteCRMPolicy(id) {
  clientPolicies = clientPolicies.filter(p => p.id !== id);
  localStorage.setItem('bs_crm_data', JSON.stringify(clientPolicies));
  renderCRMList();
}

function renderCRMList() {
  const listEl = document.getElementById('crm-list');
  if (!listEl) return;
  if (clientPolicies.length === 0) {
    listEl.innerHTML = '<p class="text-center text-xs text-slate-400 py-6">अभी कोई पॉलिसी रिकॉर्ड नहीं है।</p>';
    return;
  }

  listEl.innerHTML = clientPolicies.map(p => {
    const waText = `नमस्ते *${p.member}* जी,\nयह आपकी *${p.company}* पॉलिसी (*${p.plan}*, पॉलिसी नं: ${p.policyNo}) की प्रीमियम किस्त *${formatINR(p.prem)}* (देय तिथि: *${p.due}*) का विनम्र अनुस्मारक है।\nकृपया समय पर भुगतान कर पॉलिसी लाभ सुरक्षित रखें।\n\nसादर,\n*${currentAgent.name}*\n📞 ${currentAgent.phone}`;
    return `
      <div class="bg-white p-3.5 rounded-2xl shadow-sm border-l-4 ${p.company === 'LIC' ? 'border-blue-700' : 'border-amber-500'} space-y-2">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">परिवार: ${p.family} • ${p.company}</span>
            <h4 class="font-bold text-sm text-slate-900 mt-1">${p.member}</h4>
            <p class="text-xs text-slate-500">${p.plan} | नं: <b>${p.policyNo}</b></p>
          </div>
          <button onclick="deleteCRMPolicy(${p.id})" class="text-xs text-red-400 px-2">🗑️</button>
        </div>
        <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-xs">
          <span>किस्त: <b>${formatINR(p.prem)}</b></span>
          <span class="text-rose-700 font-bold">FUP: ${p.due}</span>
        </div>
        <a href="https://wa.me/91${p.phone.replace(/\D/g,'')}?text=${encodeURIComponent(waText)}" target="_blank"
          class="block w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center">
          💬 व्हाट्सएप रिमाइंडर भेजें
        </a>
      </div>`;
  }).join('');
}

// 6. ऑब्जेक्शन हैंडलर स्क्रिप्ट्स
function renderObjectionUI(container) {
  const scripts = [
    {
      q: '1. "LIC में रिटर्न कम है, म्यूचुअल फंड या शेयर बाजार बेहतर है।"',
      a: 'सर, म्यूचुअल फंड में रिटर्न बाजार के उतार-चढ़ाव पर निर्भर है और 12.5% LTCG टैक्स भी कटता है। लेकिन अगर निवेश शुरू करने के 6 महीने बाद भगवान न करे कोई अनहोनी हो जाए, तो म्यूचुअल फंड केवल जमा पैसा देगा—जबकि LIC पहले ही दिन से आपके परिवार के पूरे 20-25 साल के सपनों की गारंटी लेती है, वो भी पूरी तरह टैक्स-फ्री (Section 10(10D))!'
    },
    {
      q: '2. "अभी मेरे पास पैसे नहीं हैं, अगले महीने या मार्च में सोचेंगे।"',
      a: 'सर, बिल्कुल सही—पैसे की व्यवस्था हर किसी के लिए महत्वपूर्ण है। लेकिन बीमा पैसे से ज्यादा अच्छी सेहत और उम्र से मिलता है। आज आपकी उम्र कम है इसलिए प्रीमियम सबसे सस्ता है। केवल ₹150-₹200 प्रतिदिन की छोटी सी बचत से आज ही अपने परिवार को सुरक्षित करना शुरू किया जा सकता है।'
    },
    {
      q: '3. "मेरे पास पहले से एक-दो पॉलिसी हैं, अब और जरूरत नहीं है।"',
      a: 'यह बहुत अच्छी बात है कि आप बीमा के प्रति जागरूक हैं! बस एक छोटा सा सवाल: आपकी मौजूदा पॉलिसियों का कुल कवर आपकी सालाना आय का कम से कम 10 गुना है? महंगाई हर 7 साल में खर्च दोगुना कर देती है। आइए एक बार आपके पूरे परिवार का 360° गैप चेक कर लेते हैं।'
    },
    {
      q: '4. "पत्नी या परिवार से पूछकर बताऊंगा।"',
      a: 'सर, यह परिवार की सुरक्षा का फैसला है, इसलिए उनसे बात करना बिल्कुल जरूरी है। लेकिन जब वे पूछेंगे कि इस प्लान में कितना बोनस, कितना रिस्क कवर और कब-कब पैसा मिलेगा, तो शायद आप सभी बिंदु विस्तार से न बता पाएं। क्या हम आज शाम 10 मिनट साथ बैठकर उन्हें यह चार्ट दिखा दें?'
    },
    {
      q: '5. "बैंक FD में पैसा सुरक्षित भी है और जब चाहें निकाल सकते हैं।"',
      a: 'सर, बैंक FD पर मिलने वाले ब्याज पर हर साल आपके टैक्स स्लैब (20% या 30%) के हिसाब से टैक्स कट जाता है, जिससे असली रिटर्न 5% से भी कम रह जाता है। साथ ही FD में कोई लाइफ कवर नहीं होता, जबकि LIC में आपको लोन सुविधा के साथ टैक्स-फ्री गारंटीड रिटर्न और जीवन सुरक्षा दोनों मिलते हैं।'
    }
  ];

  container.innerHTML = `
    <div class="space-y-3">
      <div class="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs text-blue-900">
        💡 ग्राहक के हर सवाल का सटीक और प्रभावशाली जवाब—सीधे कॉपी करें या व्हाट्सएप पर भेजें:
      </div>
      ${scripts.map(s => `
        <div class="bg-white p-4 rounded-2xl shadow-sm space-y-2 border border-slate-100">
          <h4 class="font-extrabold text-sm text-rose-800">${s.q}</h4>
          <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">${s.a}</p>
          <a href="https://wa.me/?text=${encodeURIComponent('*सवाल:* ' + s.q + '\n\n*सही समाधान:* ' + s.a + '\n\n- ' + currentAgent.name + ' (' + currentAgent.phone + ')')}"
            target="_blank" class="inline-block text-[11px] font-bold text-emerald-700 underline">
            💬 यह जवाब व्हाट्सएप पर शेयर करें ➔
          </a>
        </div>
      `).join('')}
    </div>
  `;
}
