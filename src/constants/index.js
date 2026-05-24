// ─── SUPABASE CONFIG ─────────────────────────────────────────────────────────
export const SUPABASE_URL = "https://njuztohvkfszdocstcoj.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdXp0b2h2a2ZzemRvY3N0Y29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDQyMTYsImV4cCI6MjA5NTEyMDIxNn0.HAzZxPXTAZNFCMSP3x4weXTBN8ub2wswWoZSPEqFZZ8";

// ─── DISTRICTS ────────────────────────────────────────────────────────────────
export const DISTRICTS = [
  "Dehradun","Haridwar","Pauri Garhwal","Tehri Garhwal","Uttarkashi",
  "Chamoli","Rudraprayag","Nainital","Almora","Bageshwar",
  "Pithoragarh","Champawat","Udham Singh Nagar"
];

// ─── MODES ───────────────────────────────────────────────────────────────────
export const MODES = [
  { id:"photo",      icon:"📸", title:"Yoga Photo",   titleHi:"योग फोटो",   desc:"Click yourself in a yoga asana",      color:"#E8622A" },
  { id:"yoga_video", icon:"🎥", title:"Yoga Video",   titleHi:"योग वीडियो", desc:"Record yourself performing an asana", color:"#10A87C" },
  { id:"message",    icon:"💬", title:"Yoga Message", titleHi:"योग संदेश",  desc:"Record your yoga message or pledge",  color:"#8B5CF6" },
];

// ─── ASANAS ──────────────────────────────────────────────────────────────────
export const ASANAS = [
  { id:"tadasana",      name:"Tadasana",      sanskrit:"ताडासन",        icon:"🏔", category:"Standing",   color:"#E8622A", benefits:["Improves posture","Strengthens legs","Increases awareness","Relieves sciatica"],         description:"Mountain Pose — foundation of all standing asanas" },
  { id:"vrikshasana",   name:"Vrikshasana",   sanskrit:"वृक्षासन",       icon:"🌳", category:"Balance",    color:"#10A87C", benefits:["Improves balance","Strengthens core","Calms nervous system","Builds focus"],             description:"Tree Pose — rooted yet reaching skyward" },
  { id:"vajrasana",     name:"Vajrasana",     sanskrit:"वज्रासन",        icon:"💎", category:"Seated",     color:"#A78BFA", benefits:["Aids digestion","Relieves knee pain","Calms mind","Improves posture"],                   description:"Diamond Pose — safe after meals" },
  { id:"bhujangasana",  name:"Bhujangasana",  sanskrit:"भुजंगासन",       icon:"🐍", category:"Backbend",   color:"#EF4444", benefits:["Strengthens spine","Opens chest","Reduces fatigue","Good for asthma"],                   description:"Cobra Pose — awakens pranic energy" },
  { id:"padmasana",     name:"Padmasana",     sanskrit:"पद्मासन",        icon:"🪷", category:"Seated",     color:"#EC4899", benefits:["Deepens meditation","Calms the brain","Stimulates spine","Flexible joints"],              description:"Lotus Pose — seat of enlightenment" },
  { id:"trikonasana",   name:"Trikonasana",   sanskrit:"त्रिकोणासन",     icon:"🔺", category:"Standing",   color:"#F59E0B", benefits:["Stretches spine","Opens hips","Stimulates organs","Reduces anxiety"],                    description:"Triangle Pose — geometry of balance" },
  { id:"surya_namaskar",name:"Surya Namaskar",sanskrit:"सूर्य नमस्कार",  icon:"☀", category:"Flow",       color:"#FF7C1E", benefits:["Full body workout","Improves circulation","Boosts energy","Reduces stress"],              description:"Sun Salutation — complete yoga in 12 steps" },
  { id:"shavasana",     name:"Shavasana",     sanskrit:"शवासन",          icon:"✨", category:"Relaxation", color:"#6366F1", benefits:["Deep relaxation","Lowers blood pressure","Relieves depression","Relaxes muscles"],        description:"Corpse Pose — most rewarding asana" },
  { id:"sukhasana",     name:"Sukhasana",     sanskrit:"सुखासन",         icon:"🧘", category:"Seated",     color:"#14B8A6", benefits:["Opens hip joints","Lengthens spine","Calms mind","Inner peace"],                        description:"Easy Pose — gateway to meditation" },
  { id:"balasana",      name:"Balasana",      sanskrit:"बालासन",         icon:"🌙", category:"Restorative",color:"#C084FC", benefits:["Relieves back pain","Calms nervous system","Reduces stress","Stretches hips"],            description:"Child's Pose — return to innocence" },
  { id:"naukasana",     name:"Naukasana",     sanskrit:"नावकासन",        icon:"⛵", category:"Core",       color:"#0EA5E9", benefits:["Strengthens core","Improves digestion","Tones abs","Builds stamina"],                    description:"Boat Pose — sail with strength" },
  { id:"anulom_vilom",  name:"Anulom Vilom",  sanskrit:"अनुलोम विलोम",   icon:"🌬", category:"Pranayama",  color:"#2DD4BF", benefits:["Calms nervous system","Purifies nadis","Reduces stress","Improves focus"],              description:"Alternate Nostril Breathing — breath of balance" },
];

export const CATEGORIES = ["All","Standing","Balance","Seated","Backbend","Flow","Pranayama","Restorative","Core","Relaxation"];

// ─── ORIENTATIONS ─────────────────────────────────────────────────────────────
export const ORIENTATIONS = [
  { id:"portrait",  label:"Portrait",  labelHi:"पोर्ट्रेट", icon:"📱", w:720,  h:1280, desc:"WhatsApp Status · Stories" },
  { id:"square",    label:"Square",    labelHi:"स्क्वेयर",  icon:"⬛", w:1080, h:1080, desc:"WhatsApp Post · Instagram" },
  { id:"landscape", label:"Landscape", labelHi:"लैंडस्केप", icon:"🖥", w:1280, h:720,  desc:"Presentation · Desktop" },
];

// ─── BACKGROUND STYLES ────────────────────────────────────────────────────────
export const BG_STYLES = [
  { id:"dark",          label:"Classic Dark",       labelHi:"क्लासिक",   thumb:"#070B08" },
  { id:"aipan_red",     label:"Aipan Red",          labelHi:"ऐपण लाल",   thumb:"#7A0E0E" },
  { id:"aipan_saffron", label:"Aipan Saffron",      labelHi:"ऐपण केसरी", thumb:"#B86010" },
  { id:"himalaya",      label:"Himalaya",           labelHi:"हिमालय",    thumb:"linear-gradient(160deg,#0a1a3e,#4a7abf,#2a5a2a)" },
  { id:"valley",        label:"Valley Green",       labelHi:"हरी घाटी",  thumb:"linear-gradient(160deg,#0a2a0a,#2a6a1a,#0a1a0a)" },
  { id:"sunset",        label:"Uttarakhand Sunset", labelHi:"सूर्यास्त", thumb:"linear-gradient(160deg,#3a0a1a,#a03010,#e06020)" },
];

// ─── HINDI YOGA QUOTES ────────────────────────────────────────────────────────
export const HINDI_QUOTES = [
  "योग अपनाएं, जीवन को सुंदर बनाएं।",
  "चलो करें योग, दूर भगाएं रोग।",
  "स्वास्थ्य का एक ही राज़, योग हो हर दिन हमारे साथ।",
  "योग है जीवन का आधार, इससे बदलेगा संसार।",
  "मन और शरीर का मेल, योग है सेहत का खेल।",
  "करो योग, रहो निरोग।",
  "योग का दामन थामिए, तनाव को अलविदा कहिए।",
  "योग सिर्फ कसरत नहीं, बल्कि खुद से मिलने का एक जरिया है।",
  "नियमित योग, उज्ज्वल भविष्य।",
  "दवाइयों पर निर्भरता छोड़िए, योग से नाता जोड़िए।",
  "सांसों पर नियंत्रण, मन पर विजय — यही है योग का असली उद्देश्य।",
  "योग: चित्त-वृत्ति-निरोधः — महर्षि पतंजलि",
  "योगः कर्मसु कौशलम् — भगवद्गीता",
  "सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।",
  "खुद को जानने और पहचानने की यात्रा है योग।",
];

// ─── 21-DAY CHALLENGE ────────────────────────────────────────────────────────
export const DAILY_TASKS = [
  {day:1,  asana:"Tadasana",              sanskrit:"ताडासन",              pranayama:"Anulom Vilom", mins:10, tip:"सीधे खड़े हों, गहरी सांस लें — यह आसन आपकी नींव है।"},
  {day:2,  asana:"Vrikshasana",           sanskrit:"वृक्षासन",             pranayama:"Bhramari",     mins:10, tip:"एकाग्रता से दोनों तरफ करें। संतुलन ही योग है।"},
  {day:3,  asana:"Vajrasana",             sanskrit:"वज्रासन",              pranayama:"Kapalbhati",   mins:12, tip:"भोजन के बाद करें — पाचन तंत्र मजबूत होगा।"},
  {day:4,  asana:"Balasana",              sanskrit:"बालासन",               pranayama:"Anulom Vilom", mins:10, tip:"इस आसन में शरीर को पूरी तरह छोड़ दें।"},
  {day:5,  asana:"Bhujangasana",          sanskrit:"भुजंगासन",             pranayama:"Udgeeth",      mins:12, tip:"रीढ़ की हड्डी मजबूत बनाता है — धीरे-धीरे करें।"},
  {day:6,  asana:"Trikonasana",           sanskrit:"त्रिकोणासन",           pranayama:"Sheetali",     mins:12, tip:"दोनों तरफ समान समय करें।"},
  {day:7,  asana:"Shavasana",             sanskrit:"शवासन",                pranayama:"Yoga Nidra",   mins:15, tip:"7 दिन पूरे! शरीर को पूर्ण विश्राम दें।"},
  {day:8,  asana:"Surya Namaskar (3×)",   sanskrit:"सूर्य नमस्कार",        pranayama:"Kapalbhati",   mins:15, tip:"12 चरणों में पूरा शरीर सक्रिय होता है।"},
  {day:9,  asana:"Padmasana",             sanskrit:"पद्मासन",              pranayama:"Anulom Vilom", mins:12, tip:"ध्यान के लिए सबसे उत्तम आसन।"},
  {day:10, asana:"Naukasana",             sanskrit:"नावकासन",              pranayama:"Bhastrika",    mins:12, tip:"10 दिन! आपका Core मजबूत हो रहा है।"},
  {day:11, asana:"Ustrasana",             sanskrit:"उष्ट्रासन",            pranayama:"Bhramari",     mins:12, tip:"छाती और गले को खोलता है।"},
  {day:12, asana:"Setu Bandhasana",       sanskrit:"सेतु बंधासन",          pranayama:"Sitali",       mins:12, tip:"पीठ दर्द में बहुत लाभकारी।"},
  {day:13, asana:"Ardha Matsyendrasana",  sanskrit:"अर्ध मत्स्येंद्रासन",  pranayama:"Anulom Vilom", mins:12, tip:"रीढ़ की ट्विस्ट से विषाक्त पदार्थ बाहर निकलते हैं।"},
  {day:14, asana:"Shavasana + Meditation",sanskrit:"शवासन + ध्यान",        pranayama:"Yoga Nidra",   mins:20, tip:"14 दिन! दो सप्ताह की उपलब्धि सराहनीय है 🌟"},
  {day:15, asana:"Surya Namaskar (5×)",   sanskrit:"सूर्य नमस्कार",        pranayama:"Kapalbhati",   mins:20, tip:"आज 5 बार करें — आपका शरीर अब तैयार है।"},
  {day:16, asana:"Vrikshasana (Adv.)",    sanskrit:"वृक्षासन",             pranayama:"Bhramari",     mins:12, tip:"आंखें बंद करके करें — एकाग्रता बढ़ेगी।"},
  {day:17, asana:"Gomukhasana",           sanskrit:"गोमुखासन",             pranayama:"Ujjayi",       mins:12, tip:"कंधे और कूल्हे दोनों खुलते हैं।"},
  {day:18, asana:"Mandukasana",           sanskrit:"मंडूकासन",             pranayama:"Kapalbhati",   mins:12, tip:"मधुमेह नियंत्रण में अत्यंत सहायक।"},
  {day:19, asana:"Sarvangasana",          sanskrit:"सर्वांगासन",           pranayama:"Anulom Vilom", mins:15, tip:"थायरॉइड के लिए श्रेष्ठ — सावधानी से करें।"},
  {day:20, asana:"Chakrasana",            sanskrit:"चक्रासन",              pranayama:"Bhastrika",    mins:15, tip:"अंतिम दिन से पहले! पूरी शक्ति लगाएं 💪"},
  {day:21, asana:"Surya Namaskar (7×)",   sanskrit:"सूर्य नमस्कार",        pranayama:"Full Set",     mins:30, tip:"🎉 21 दिन पूरे! आप सच्चे Yoga Abhyasi हैं।"},
];

export const BADGES = [
  {id:"starter",   day:1,  emoji:"🌱", title:"Yoga Starter",         titleHi:"योग शुरुआत",       desc:"Your yoga journey begins!"},
  {id:"warrior",   day:5,  emoji:"⚔️", title:"Yoga Warrior",          titleHi:"योग योद्धा",        desc:"5 days without missing!"},
  {id:"week",      day:7,  emoji:"🏅", title:"Week Champion",         titleHi:"सप्ताह विजेता",     desc:"First week completed!"},
  {id:"prana",     day:10, emoji:"🌬️", title:"Pranayama Expert",      titleHi:"प्राणायाम विशेषज्ञ",desc:"10 days of breath mastery!"},
  {id:"fortnight", day:14, emoji:"🧘", title:"Fortnight Yogi",        titleHi:"पखवाड़े का योगी",   desc:"Two weeks strong!"},
  {id:"abhyasi",   day:21, emoji:"🎓", title:"Certified Yoga Abhyasi",titleHi:"प्रमाणित योग अभ्यासी",desc:"21-day challenge complete!"},
];

// ─── AVATAR COLORS ────────────────────────────────────────────────────────────
export const AVATAR_COLORS = ["#E8622A","#10A87C","#8B5CF6","#EC4899","#F59E0B","#0EA5E9","#A78BFA","#14B8A6"];

// ─── UTILS ────────────────────────────────────────────────────────────────────
export const hexToRgb = (hex) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#E8622A");
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "232,98,42";
};
export const getInitials = (n) => (n||"YO").split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2);
export const randQuote   = () => HINDI_QUOTES[Math.floor(Math.random()*HINDI_QUOTES.length)];
export const wrapText    = (ctx,text,x,y,maxW,lh,maxLines=3) => {
  const words=text.split(" "); let line="",ly=y,lines=0;
  for(const w of words){
    if(lines>=maxLines){ctx.fillText(line.trim()+"…",x,ly);return;}
    const t=line+w+" ";
    if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line.trim(),x,ly);line=w+" ";ly+=lh;lines++;}
    else line=t;
  }
  ctx.fillText(line.trim(),x,ly);
};
