// सभी 28 नवीनतम LIC प्लान्स और 6 राइडर्स का डेटाबेस
const LIC_PLANS = [
  // 1. एंडोमेंट प्लान्स (12 प्लान)
  { no: "736", name: "जीवन लाभ (Jeevan Labh)", cat: "Endowment", minAge: 8, maxAge: 59, defaultTerm: 25, defaultPpt: 16, rate: 45, bonus: 47, fab: 25, type: "endowment", desc: "सीमित प्रीमियम भुगतान (10, 15, 16 वर्ष) और उच्च बोनस वाला सबसे लोकप्रिय प्लान।" },
  { no: "715", name: "न्यू जीवन आनंद (New Jeevan Anand)", cat: "Endowment", minAge: 18, maxAge: 50, defaultTerm: 21, defaultPpt: 21, rate: 52, bonus: 45, fab: 20, type: "anand", desc: "मैच्योरिटी के बाद भी आजीवन फ्री रिस्क कवर जारी रहने वाला डबल बेनिफिट प्लान।" },
  { no: "733", name: "जीवन लक्ष्य (Jeevan Lakshya)", cat: "Endowment", minAge: 18, maxAge: 50, defaultTerm: 25, defaultPpt: 22, rate: 46, bonus: 46, fab: 25, type: "lakshya", desc: "बच्चों की शिक्षा व शादी के लिए सर्वश्रेष्ठ; अनहोनी पर आगे के प्रीमियम माफ + सालाना आय।" },
  { no: "714", name: "न्यू एंडोमेंट प्लान (New Endowment)", cat: "Endowment", minAge: 8, maxAge: 55, defaultTerm: 20, defaultPpt: 20, rate: 50, bonus: 42, fab: 15, type: "endowment", desc: "बचत और सुरक्षा का सरल व भरोसेमंद रेगुलर प्रीमियम प्लान।" },
  { no: "717", name: "सिंगल प्रीमियम एंडोमेंट (Single Premium)", cat: "Endowment", minAge: 0, maxAge: 65, defaultTerm: 15, defaultPpt: 1, rate: 720, bonus: 40, fab: 15, type: "single", desc: "एकमुश्त निवेश (FD का बेहतरीन विकल्प) और टैक्स-फ्री मैच्योरिटी।" },
  { no: "774", name: "अमृतबाल (Amritbaal)", cat: "Endowment", minAge: 0, maxAge: 13, defaultTerm: 20, defaultPpt: 7, rate: 115, bonus: 80, fab: 0, type: "guaranteed", desc: "बच्चों के भविष्य के लिए प्रति हजार ₹80 गारंटीड एडिशन वाला विशेष चाइल्ड प्लान।" },
  { no: "912", name: "नव जीवन श्री (Nav Jeevan Shree)", cat: "Endowment", minAge: 0, maxAge: 60, defaultTerm: 18, defaultPpt: 10, rate: 82, bonus: 65, fab: 0, type: "guaranteed", desc: "गारंटीड रिटर्न और सीमित प्रीमियम वाला नया बचत प्लान।" },
  { no: "881", name: "बीमा लक्ष्मी (Bima Lakshmi)", cat: "Endowment", minAge: 18, maxAge: 55, defaultTerm: 20, defaultPpt: 12, rate: 68, bonus: 55, fab: 0, type: "guaranteed", desc: "महिलाओं और परिवार की आर्थिक सुरक्षा व गारंटीड बचत का विशेष प्लान।" },
  { no: "888", name: "न्यू जीवन साथी - सिंगल (Jeevan Sathi Single)", cat: "Endowment", minAge: 18, maxAge: 55, defaultTerm: 15, defaultPpt: 1, rate: 750, bonus: 42, fab: 15, type: "single", desc: "पति-पत्नी दोनों को एक ही पॉलिसी में कवर करने वाला सिंगल प्रीमियम प्लान।" },
  { no: "889", name: "न्यू जीवन साथी - लिमिटेड (Jeevan Sathi Ltd)", cat: "Endowment", minAge: 18, maxAge: 55, defaultTerm: 20, defaultPpt: 12, rate: 64, bonus: 44, fab: 15, type: "endowment", desc: "पति-पत्नी का संयुक्त जीवन कवर (Joint Life) और सीमित प्रीमियम भुगतान।" },
  { no: "890", name: "न्यू बीमा ज्योति (New Bima Jyoti)", cat: "Endowment", minAge: 0, maxAge: 60, defaultTerm: 20, defaultPpt: 15, rate: 66, bonus: 50, fab: 0, type: "guaranteed", desc: "हर साल ₹50 प्रति हजार का गारंटीड एडिशन देने वाला निश्चित रिटर्न प्लान।" },
  { no: "770", name: "बीमा प्लैटिनम (Bima Platinum)", cat: "Endowment", minAge: 18, maxAge: 55, defaultTerm: 20, defaultPpt: 10, rate: 78, bonus: 60, fab: 0, type: "guaranteed", desc: "उच्च सम एश्योर्ड और गारंटीड बोनस वाला प्रीमियम प्लान।" },

  // 2. होल लाइफ प्लान्स (3 प्लान)
  { no: "745", name: "जीवन उमंग (Jeevan Umang)", cat: "Whole Life", minAge: 0, maxAge: 55, defaultTerm: 35, defaultPpt: 15, rate: 78, bonus: 45, fab: 30, type: "wholelife_8", desc: "प्रीमियम खत्म होने के बाद 100 वर्ष की आयु तक हर साल 8% टैक्स-फ्री गारंटीड पेंशन।" },
  { no: "771", name: "जीवन उत्सव (Jeevan Utsav)", cat: "Whole Life", minAge: 0, maxAge: 65, defaultTerm: 35, defaultPpt: 10, rate: 108, bonus: 40, fab: 0, type: "wholelife_10", desc: "5 से 16 साल प्रीमियम भरें और आजीवन हर साल सम एश्योर्ड का 10% गारंटीड इनकम पाएं।" },
  { no: "883", name: "जीवन उत्सव सिंगल (Jeevan Utsav Single)", cat: "Whole Life", minAge: 0, maxAge: 65, defaultTerm: 35, defaultPpt: 1, rate: 950, bonus: 40, fab: 0, type: "wholelife_10", desc: "एक बार निवेश करें और जीवन भर हर साल 10% गारंटीड टैक्स-फ्री आय पाएं।" },

  // 3. मनी बैक प्लान्स (5 प्लान)
  { no: "748", name: "बीमा श्री (Bima Shree)", cat: "Money Back", minAge: 8, maxAge: 55, defaultTerm: 20, defaultPpt: 16, rate: 76, bonus: 55, fab: 20, type: "moneyback", desc: "उच्च आय वर्ग के लिए गारंटीड एडिशन और समय-समय पर मनी बैक वाला प्रीमियम प्लान।" },
  { no: "720", name: "न्यू मनी बैक - 20 वर्ष (Money Back 20Y)", cat: "Money Back", minAge: 13, maxAge: 50, defaultTerm: 20, defaultPpt: 15, rate: 62, bonus: 38, fab: 15, type: "moneyback", desc: "5वें, 10वें और 15वें वर्ष में 20%-20% मनी बैक तथा 20वें वर्ष में बोनस सहित मैच्योरिटी।" },
  { no: "721", name: "न्यू मनी बैक - 25 वर्ष (Money Back 25Y)", cat: "Money Back", minAge: 13, maxAge: 45, defaultTerm: 25, defaultPpt: 20, rate: 56, bonus: 40, fab: 15, type: "moneyback", desc: "5वें, 10वें, 15वें व 20वें वर्ष में 15%-15% मनी बैक और 25वें वर्ष में बड़ी मैच्योरिटी।" },
  { no: "732", name: "चिल्ड्रन्स मनी बैक (Children's Money Back)", cat: "Money Back", minAge: 0, maxAge: 12, defaultTerm: 25, defaultPpt: 25, rate: 48, bonus: 42, fab: 15, type: "child_mb", desc: "बच्चे की 18, 20 और 22 वर्ष की आयु पर 20%-20% मनी बैक और 25वें वर्ष में पूर्ण मैच्योरिटी।" },
  { no: "734", name: "जीवन तरुण (Jeevan Tarun)", cat: "Money Back", minAge: 0, maxAge: 12, defaultTerm: 25, defaultPpt: 20, rate: 52, bonus: 42, fab: 15, type: "child_mb", desc: "बच्चे की 20 से 24 वर्ष की आयु के बीच पढ़ाई के लिए सालाना मनी बैक और 25वें वर्ष में मैच्योरिटी।" },

  // 4. टर्म इंश्योरेंस प्लान्स (8 प्लान)
  { no: "876", name: "डिजी टर्म (Digi Term)", cat: "Term", minAge: 18, maxAge: 45, defaultTerm: 30, defaultPpt: 30, rate: 3.2, bonus: 0, fab: 0, type: "term", desc: "कम प्रीमियम में परिवार के लिए बड़ा सुरक्षा कवच।" },
  { no: "878", name: "डिजी क्रेडिट लाइफ (Digi Credit Life)", cat: "Term", minAge: 18, maxAge: 45, defaultTerm: 20, defaultPpt: 20, rate: 2.8, bonus: 0, fab: 0, type: "term", desc: "होम लोन और बिजनेस लोन की सुरक्षा के लिए घटते कवर वाला टर्म प्लान।" },
  { no: "877", name: "युवा क्रेडिट लाइफ (Yuva Credit Life)", cat: "Term", minAge: 18, maxAge: 45, defaultTerm: 20, defaultPpt: 20, rate: 2.6, bonus: 0, fab: 0, type: "term", desc: "युवाओं के लोन दायित्वों की सुरक्षा के लिए किफायती टर्म प्लान।" },
  { no: "875", name: "युवा टर्म (Yuva Term)", cat: "Term", minAge: 18, maxAge: 45, defaultTerm: 30, defaultPpt: 30, rate: 2.9, bonus: 0, fab: 0, type: "term", desc: "युवाओं के लिए विशेष रूप से डिजाइन किया गया हाई-कवर टर्म इंश्योरेंस।" },
  { no: "954", name: "न्यू टेक-टर्म (New Tech-Term)", cat: "Term", minAge: 18, maxAge: 65, defaultTerm: 30, defaultPpt: 30, rate: 3.4, bonus: 0, fab: 0, type: "term", desc: "लेवल या बढ़ते हुए सम एश्योर्ड के विकल्प वाला लोकप्रिय टर्म प्लान।" },
  { no: "859", name: "सरल जीवन बीमा (Saral Jeevan Bima)", cat: "Term", minAge: 18, maxAge: 65, defaultTerm: 25, defaultPpt: 25, rate: 4.1, bonus: 0, fab: 0, type: "term", desc: "सरल शर्तों वाला स्टैंडर्ड प्योर टर्म लाइफ इंश्योरेंस।" },
  { no: "887", name: "बीमा कवच (Bima Kavach)", cat: "Term", minAge: 18, maxAge: 60, defaultTerm: 30, defaultPpt: 30, rate: 3.5, bonus: 0, fab: 0, type: "term", desc: "संपूर्ण परिवार की आय सुरक्षा के लिए आधुनिक टर्म कवर।" },
  { no: "894", name: "जीवन रक्षा (Jeevan Raksha)", cat: "Term", minAge: 18, maxAge: 60, defaultTerm: 25, defaultPpt: 25, rate: 3.8, bonus: 0, fab: 0, type: "term", desc: "किफायती दरों पर जीवन सुरक्षा प्रदान करने वाला टर्म प्लान।" }
];

const LIC_RIDERS = [
  { id: "dab", name: "AD & DB राइडर (दुर्घटना मृत्यु व विकलांगता लाभ)", ratePerThousand: 1.0 },
  { id: "term", name: "न्यू टर्म एश्योरेंस राइडर (अतिरिक्त जीवन कवर)", ratePerThousand: 2.2 },
  { id: "pwb", name: "प्रीमियम वेवर बेनिफिट (PWB - बच्चों के प्लान हेतु)", ratePerThousand: 1.8 },
  { id: "ci", name: "क्रिटिकल इलनेस हेल्थ राइडर (गंभीर बीमारी कवर)", ratePerThousand: 2.5 },
  { id: "ab", name: "एक्सीडेंट बेनिफिट राइडर", ratePerThousand: 0.8 },
  { id: "fci", name: "फीमेल क्रिटिकल इलनेस राइडर (महिलाओं हेतु)", ratePerThousand: 2.1 }
];

// भारतीय रुपया फॉर्मेट हेल्पर
function formatINR(num) {
  return '₹ ' + Math.round(num).toLocaleString('en-IN');
}
