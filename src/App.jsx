import { useState, useRef, useEffect, useCallback } from "react";

// ─── SUPABASE CONFIG ──────────────────────────────────────
const SUPABASE_URL = "https://njuztohvkfszdocstcoj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdXp0b2h2a2ZzemRvY3N0Y29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDQyMTYsImV4cCI6MjA5NTEyMDIxNn0.HAzZxPXTAZNFCMSP3x4weXTBN8ub2wswWoZSPEqFZZ8";

// ─── HINDI YOGA QUOTES ───────────────────────────────────
const HINDI_QUOTES = [
  // Short slogans
  "योग अपनाएं, जीवन को सुंदर बनाएं।",
  "चलो करें योग, दूर भगाएं रोग।",
  "स्वास्थ्य का एक ही राज़, योग हो हर दिन हमारे साथ।",
  "योग है जीवन का आधार, इससे बदलेगा संसार।",
  "मन और शरीर का मेल, योग है सेहत का खेल।",
  "करो योग, रहो निरोग।",
  "योग का दामन थामिए, तनाव को अलविदा कहिए।",
  // Motivational
  "योग सिर्फ कसरत नहीं, बल्कि खुद से मिलने का एक जरिया है। आज ही से योग को अपने जीवन का हिस्सा बनाएं।",
  "बाहरी दुनिया को बदलने से पहले, योग के जरिए अपनी अंदरूनी दुनिया को बदलिए।",
  "जब शरीर रहेगा स्वस्थ, तभी तो हर सपना होगा मस्त! योग करें, ऊर्जावान रहें।",
  "नियमित योग, उज्ज्वल भविष्य। अपने तन और मन को दें शांति का उपहार।",
  "दवाइयों पर निर्भरता छोड़िए, योग से नाता जोड़िए।",
  // Social
  "एक दिन की शुरुआत योग के साथ, पूरे दिन बनी रहेगी ताजगी की बात। #InternationalYogaDay",
  "उम्र चाहे जो भी हो, योग हर किसी के लिए है।",
  "योग केवल शरीर को लचीला नहीं बनाता, बल्कि जीवन के प्रति आपके दृष्टिकोण को भी बदल देता है।",
  "भागदौड़ भरी जिंदगी में, खुद के लिए थोड़ा वक्त निकालें। चटाई बिछाएं और योग की शक्ति को महसूस करें।",
  // Philosophical
  "सांसों पर नियंत्रण, मन पर विजय — यही है योग का असली उद्देश्य।",
  "योग आत्मा का संगीत है, जो शरीर के हर कोने को सुरीला बना देता है।",
  "जो करते हैं योग, उन्हें छू नहीं पाते रोग। शांति और समृद्धि का एक ही मार्ग — योग।",
  "खुद को जानने और पहचानने की यात्रा है योग।",
  // Classic
  "योग: चित्त-वृत्ति-निरोधः — महर्षि पतंजलि",
  "योगः कर्मसु कौशलम् — भगवद्गीता",
  "सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।",
];

const ORIENTATIONS = [
  { id:"portrait", label:"Portrait", labelHi:"पोर्ट्रेट", icon:"📱", w:720, h:1280, desc:"WhatsApp Status · Stories" },
  { id:"square",   label:"Square",   labelHi:"स्क्वेयर",   icon:"⬛", w:1080, h:1080, desc:"WhatsApp Post · Instagram" },
  { id:"landscape",label:"Landscape",labelHi:"लैंडस्केप", icon:"🖥", w:1280, h:720,  desc:"Presentation · Desktop" },
];

const BG_STYLES = [
  { id:"dark",          label:"Classic Dark",   labelHi:"क्लासिक",  thumb:"#070B08" },
  { id:"aipan_red",     label:"Aipan Red",      labelHi:"ऐपण लाल",  thumb:"#7A0E0E" },
  { id:"aipan_saffron", label:"Aipan Saffron",  labelHi:"ऐपण केसरी",thumb:"#B86010" },
  { id:"himalaya",      label:"Himalaya",       labelHi:"हिमालय",   thumb:"linear-gradient(160deg,#0a1a3e,#4a7abf,#2a5a2a)" },
  { id:"valley",        label:"Valley Green",   labelHi:"हरी घाटी", thumb:"linear-gradient(160deg,#0a2a0a,#2a6a1a,#0a1a0a)" },
  { id:"sunset",        label:"Uttarakhand Sunset", labelHi:"सूर्यास्त",thumb:"linear-gradient(160deg,#3a0a1a,#a03010,#e06020)" },
];

// ─── DATA ─────────────────────────────────────────────────
const DISTRICTS = ["Dehradun","Haridwar","Pauri Garhwal","Tehri Garhwal","Uttarkashi",
  "Chamoli","Rudraprayag","Nainital","Almora","Bageshwar","Pithoragarh","Champawat","Udham Singh Nagar"];

const ROLE_GROUPS = [
  { group:"VIP / Officials", items:["DM (District Magistrate)","Divisional Commissioner","MLA (विधायक)","MP (सांसद)","Chief Medical Officer (CMO)","District AYUSH Officer"] },
  { group:"Panchayati Raj",  items:["Gram Pradhan","Kshettra Panchayat Sadasya","Zila Panchayat Sadasya","BDO","Mayor / Nagar Palika Adhyaksh"] },
  { group:"AYUSH / Health",  items:["AYUSH Doctor","Doctor — Ayushman Arogya Mandir","AYUSH Pharmacist","CMO / DCMO","Yoga Instructor / Wellness Coach","ASHA / ANM Worker"] },
  { group:"Others",          items:["Teacher / Professor","School / College Student","Senior Citizen (वरिष्ठ नागरिक)","Sports Person / Athlete","Social Worker","General Public (आम नागरिक)"] }
];

const MODES = [
  { id:"photo",      icon:"📸", title:"Yoga Photo",   titleHi:"योग फोटो",   desc:"Click yourself in a yoga asana", color:"#E8622A" },
  { id:"yoga_video", icon:"🎥", title:"Yoga Video",   titleHi:"योग वीडियो", desc:"Record yourself performing an asana", color:"#10A87C" },
  { id:"message",    icon:"💬", title:"Yoga Message", titleHi:"योग संदेश",  desc:"Record your yoga message or pledge", color:"#8B5CF6" },
];

const ASANAS = [
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

// ─── 21-DAY CHALLENGE DATA ────────────────────────────────────────────────────
const DAILY_TASKS = [
  {day:1,  asana:"Tadasana",              sanskrit:"ताडासन",              pranayama:"Anulom Vilom",  mins:10, tip:"सीधे खड़े हों, गहरी सांस लें — यह आसन आपकी नींव है।"},
  {day:2,  asana:"Vrikshasana",           sanskrit:"वृक्षासन",             pranayama:"Bhramari",      mins:10, tip:"एकाग्रता से दोनों तरफ करें। संतुलन ही योग है।"},
  {day:3,  asana:"Vajrasana",             sanskrit:"वज्रासन",              pranayama:"Kapalbhati",    mins:12, tip:"भोजन के बाद करें — पाचन तंत्र मजबूत होगा।"},
  {day:4,  asana:"Balasana",              sanskrit:"बालासन",               pranayama:"Anulom Vilom",  mins:10, tip:"इस आसन में शरीर को पूरी तरह छोड़ दें।"},
  {day:5,  asana:"Bhujangasana",          sanskrit:"भुजंगासन",             pranayama:"Udgeeth",       mins:12, tip:"रीढ़ की हड्डी मजबूत बनाता है — धीरे-धीरे करें।"},
  {day:6,  asana:"Trikonasana",           sanskrit:"त्रिकोणासन",           pranayama:"Sheetali",      mins:12, tip:"दोनों तरफ समान समय करें। कूल्हे और रीढ़ खुलेंगे।"},
  {day:7,  asana:"Shavasana",             sanskrit:"शवासन",                pranayama:"Yoga Nidra",    mins:15, tip:"7 दिन पूरे! शरीर को पूर्ण विश्राम दें — यही असली योग है।"},
  {day:8,  asana:"Surya Namaskar (3×)",   sanskrit:"सूर्य नमस्कार",        pranayama:"Kapalbhati",    mins:15, tip:"12 चरणों में पूरा शरीर सक्रिय होता है।"},
  {day:9,  asana:"Padmasana",             sanskrit:"पद्मासन",              pranayama:"Anulom Vilom",  mins:12, tip:"ध्यान के लिए सबसे उत्तम आसन — मन शांत होगा।"},
  {day:10, asana:"Naukasana",             sanskrit:"नावकासन",              pranayama:"Bhastrika",     mins:12, tip:"10 दिन! आपका Core मजबूत हो रहा है — शाबाश!"},
  {day:11, asana:"Ustrasana",             sanskrit:"उष्ट्रासन",            pranayama:"Bhramari",      mins:12, tip:"छाती और गले को खोलता है। धीरे-धीरे जाएं।"},
  {day:12, asana:"Setu Bandhasana",       sanskrit:"सेतु बंधासन",          pranayama:"Sitali",        mins:12, tip:"पीठ दर्द में बहुत लाभकारी — रोज़ करें।"},
  {day:13, asana:"Ardha Matsyendrasana",  sanskrit:"अर्ध मत्स्येंद्रासन",  pranayama:"Anulom Vilom",  mins:12, tip:"रीढ़ की ट्विस्ट से विषाक्त पदार्थ बाहर निकलते हैं।"},
  {day:14, asana:"Shavasana + Meditation",sanskrit:"शवासन + ध्यान",        pranayama:"Yoga Nidra",    mins:20, tip:"14 दिन! दो सप्ताह की उपलब्धि सराहनीय है 🌟"},
  {day:15, asana:"Surya Namaskar (5×)",   sanskrit:"सूर्य नमस्कार",        pranayama:"Kapalbhati",    mins:20, tip:"आज 5 बार करें — आपका शरीर अब तैयार है।"},
  {day:16, asana:"Vrikshasana (Adv.)",    sanskrit:"वृक्षासन",             pranayama:"Bhramari",      mins:12, tip:"आंखें बंद करके करें — एकाग्रता बढ़ेगी।"},
  {day:17, asana:"Gomukhasana",           sanskrit:"गोमुखासन",             pranayama:"Ujjayi",        mins:12, tip:"कंधे और कूल्हे दोनों खुलते हैं।"},
  {day:18, asana:"Mandukasana",           sanskrit:"मंडूकासन",             pranayama:"Kapalbhati",    mins:12, tip:"मधुमेह नियंत्रण में अत्यंत सहायक।"},
  {day:19, asana:"Sarvangasana",          sanskrit:"सर्वांगासन",           pranayama:"Anulom Vilom",  mins:15, tip:"थायरॉइड और हार्मोन्स के लिए श्रेष्ठ — सावधानी से करें।"},
  {day:20, asana:"Chakrasana",            sanskrit:"चक्रासन",              pranayama:"Bhastrika",     mins:15, tip:"अंतिम दिन से पहले! पूरी शक्ति लगाएं 💪"},
  {day:21, asana:"Surya Namaskar (7×)",   sanskrit:"सूर्य नमस्कार",        pranayama:"Full Set",      mins:30, tip:"🎉 21 दिन पूरे! आप सच्चे Yoga Abhyasi हैं। यह आदत जीवनभर रखें।"},
];

const BADGES = [
  {id:"starter",   day:1,  emoji:"🌱", title:"Yoga Starter",       titleHi:"योग शुरुआत",      desc:"Your yoga journey begins!"},
  {id:"warrior",   day:5,  emoji:"⚔️", title:"Yoga Warrior",        titleHi:"योग योद्धा",       desc:"5 days without missing!"},
  {id:"week",      day:7,  emoji:"🏅", title:"Week Champion",       titleHi:"सप्ताह विजेता",    desc:"First week completed!"},
  {id:"prana",     day:10, emoji:"🌬️", title:"Pranayama Expert",    titleHi:"प्राणायाम विशेषज्ञ",desc:"10 days of breath mastery!"},
  {id:"fortnight", day:14, emoji:"🧘", title:"Fortnight Yogi",      titleHi:"पखवाड़े का योगी",  desc:"Two weeks strong!"},
  {id:"abhyasi",   day:21, emoji:"🎓", title:"Certified Yoga Abhyasi",titleHi:"प्रमाणित योग अभ्यासी",desc:"21-day challenge complete!"},
];

const CATEGORIES = ["All","Standing","Balance","Seated","Backbend","Flow","Pranayama","Restorative","Core","Relaxation"];

// ─── UTILS ────────────────────────────────────────────────
function hexToRgb(hex) { const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex||"#E8622A"); return r?`${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}`:"232,98,42"; }
function getInitials(n) { return (n||"YO").split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2); }
function wrapText(ctx, text, x, y, maxW, lh, maxLines=3) {
  const words=text.split(" "); let line="",ly=y,lines=0;
  for(const w of words){
    if(lines>=maxLines){ctx.fillText(line.trim()+"…",x,ly);return;}
    const t=line+w+" ";
    if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line.trim(),x,ly);line=w+" ";ly+=lh;lines++;}else line=t;
  }
  ctx.fillText(line.trim(),x,ly);
}
function randQuote() { return HINDI_QUOTES[Math.floor(Math.random()*HINDI_QUOTES.length)]; }

// ─── AIPAN ART HELPERS ────────────────────────────────────
function drawLotus(ctx, cx, cy, r, col, dotCol) {
  ctx.fillStyle=col;
  for(let i=0;i<8;i++){
    const a=(i*Math.PI)/4-Math.PI/2;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.21,r*0.5,0,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
  ctx.beginPath(); ctx.arc(cx,cy,r*0.19,0,Math.PI*2); ctx.fill();
  if(dotCol){ ctx.fillStyle=dotCol;
    for(let i=0;i<8;i++){const a=(i*Math.PI)/4; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*0.55,cy+Math.sin(a)*r*0.55,r*0.055,0,Math.PI*2); ctx.fill();}
  }
}
function drawAipanBorderH(ctx, x, y, len, thick, col) {
  ctx.fillStyle=col; const u=thick;
  for(let i=0;i<=len;i+=u*2){
    ctx.beginPath(); ctx.moveTo(x+i,y); ctx.lineTo(x+i+u,y); ctx.lineTo(x+i+u/2,y+u); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+i,y+u*0.5); ctx.lineTo(x+i+u,y+u*0.5); ctx.lineTo(x+i+u/2,y-u*0.5); ctx.closePath(); ctx.fill();
  }
}
function drawDotsGrid(ctx, W, H, spacing, r, col) {
  ctx.fillStyle=col;
  for(let x=spacing;x<W;x+=spacing) for(let y=spacing;y<H;y+=spacing){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
}
function drawSun(ctx, cx, cy, r, col) {
  ctx.fillStyle=col;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  for(let i=0;i<12;i++){
    const a=(i*Math.PI)/6; const x1=cx+Math.cos(a)*r*1.4; const y1=cy+Math.sin(a)*r*1.4;
    ctx.beginPath(); ctx.arc(x1,y1,r*0.14,0,Math.PI*2); ctx.fill();
  }
}
function drawMtnPeak(ctx, points, fillStyle, strokeStyle) {
  ctx.fillStyle=fillStyle; ctx.beginPath();
  ctx.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++) ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath(); ctx.fill();
  if(strokeStyle){ctx.strokeStyle=strokeStyle;ctx.lineWidth=1;ctx.stroke();}
}

// ─── BACKGROUND DRAWING ───────────────────────────────────
function drawBackground(ctx, W, H, style) {
  ctx.clearRect(0,0,W,H);
  const bw=Math.round(Math.min(W,H)*0.038);

  if(style==="aipan_red"||style==="aipan_saffron"){
    const bg = style==="aipan_red" ? "#6A0A0A" : "#A05010";
    const mid = style==="aipan_red" ? "#7A1212" : "#B86018";
    const pc  = style==="aipan_red" ? "rgba(255,240,220,0.55)" : "rgba(255,250,200,0.55)";
    const dc  = style==="aipan_red" ? "rgba(90,0,0,0.4)" : "rgba(80,30,0,0.4)";
    // Base
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // Texture inner rect
    ctx.fillStyle=mid; ctx.fillRect(bw*1.2,bw*1.2,W-bw*2.4,H-bw*2.4);
    // Dot grid
    drawDotsGrid(ctx,W,H,Math.round(W/28),Math.round(W/280),"rgba(255,255,255,0.06)");
    // Border strips top/bottom
    drawAipanBorderH(ctx,0,0,W,bw,pc);
    drawAipanBorderH(ctx,0,H-bw,W,bw,pc);
    // Border strips left/right (rotated)
    ctx.save(); ctx.translate(0,H); ctx.rotate(-Math.PI/2); drawAipanBorderH(ctx,0,0,H,bw,pc); ctx.restore();
    ctx.save(); ctx.translate(W,0); ctx.rotate(Math.PI/2); drawAipanBorderH(ctx,0,0,H,bw,pc); ctx.restore();
    // Corner lotus
    const lr=Math.round(Math.min(W,H)*0.055);
    const off=bw*2+lr;
    [[off,off],[W-off,off],[off,H-off],[W-off,H-off]].forEach(([cx,cy])=>drawLotus(ctx,cx,cy,lr,pc,dc));
    // Center lotus (faint)
    drawLotus(ctx,W/2,H/2,Math.round(Math.min(W,H)*0.09),"rgba(255,255,255,0.06)",null);
    // Sun top-center
    drawSun(ctx,W/2,bw*1.6,Math.round(bw*0.55),"rgba(255,255,255,0.18)");

  } else if(style==="himalaya"){
    // Sky
    const sky=ctx.createLinearGradient(0,0,0,H*0.62);
    sky.addColorStop(0,"#071228"); sky.addColorStop(0.4,"#0a2060"); sky.addColorStop(0.75,"#1a4a8a"); sky.addColorStop(1,"#5a90c0");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    // Stars
    ctx.fillStyle="rgba(255,255,255,0.7)";
    const rng=(()=>{let s=42;return()=>{s=(s*1664525+1013904223)&0xFFFFFFFF;return(s>>>0)/0xFFFFFFFF;};})();
    for(let i=0;i<80;i++){ctx.beginPath();ctx.arc(rng()*W,rng()*H*0.45,rng()*1.5+0.3,0,Math.PI*2);ctx.fill();}
    // Back peaks
    drawMtnPeak(ctx,[[0,H*0.52],[W*0.08,H*0.15],[W*0.18,H*0.32],[W*0.3,H*0.08],[W*0.42,H*0.25],[W*0.55,H*0.04],[W*0.67,H*0.2],[W*0.8,H*0.1],[W*0.9,H*0.22],[W,H*0.3],[W,H*0.52]],"rgba(180,200,230,0.6)","rgba(200,220,255,0.3)");
    // Snow caps
    const snows=[[W*0.08,H*0.15,W*0.04,H*0.27],[W*0.3,H*0.08,W*0.06,H*0.22],[W*0.55,H*0.04,W*0.07,H*0.18],[W*0.8,H*0.1,W*0.05,H*0.22]];
    snows.forEach(([px,py,pw,pb])=>drawMtnPeak(ctx,[[px,py],[px-pw/2,pb],[px+pw/2,pb]],"rgba(235,245,255,0.88)"));
    // Valley
    const val=ctx.createLinearGradient(0,H*0.48,0,H);
    val.addColorStop(0,"#1a4a18"); val.addColorStop(0.4,"#0e2e0a"); val.addColorStop(1,"#050f05");
    ctx.fillStyle=val; ctx.fillRect(0,H*0.48,W,H*0.52);
    // River
    ctx.save(); ctx.globalAlpha=0.22; ctx.fillStyle="#60a8d8";
    ctx.beginPath(); ctx.moveTo(W*0.25,H*0.58); ctx.bezierCurveTo(W*0.38,H*0.65,W*0.48,H*0.72,W*0.35,H*0.82);
    ctx.bezierCurveTo(W*0.25,H*0.9,W*0.42,H*0.96,W*0.55,H); ctx.lineTo(W*0.4,H); ctx.lineTo(W*0.2,H*0.59); ctx.closePath(); ctx.fill();
    ctx.restore();
    // dark overlay
    const ov=ctx.createLinearGradient(0,0,0,H); ov.addColorStop(0,"rgba(0,0,0,0.28)"); ov.addColorStop(1,"rgba(0,0,0,0.55)");
    ctx.fillStyle=ov; ctx.fillRect(0,0,W,H);

  } else if(style==="valley"){
    // Deep forest valley
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,"#0a1a12"); bg.addColorStop(0.35,"#1a3a18"); bg.addColorStop(0.65,"#0e2a0a"); bg.addColorStop(1,"#050f05");
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // Rolling hills
    [[H*0.28,"rgba(30,70,25,0.7)"],[H*0.38,"rgba(20,55,18,0.8)"],[H*0.5,"rgba(12,38,10,0.9)"]].forEach(([hy,fc])=>{
      ctx.fillStyle=fc; ctx.beginPath(); ctx.moveTo(0,H);
      for(let x=0;x<=W;x+=W/8) ctx.quadraticCurveTo(x+W/16,(hy+Math.sin(x/W*Math.PI)*H*0.05),x+W/8,hy+Math.cos(x/W*Math.PI*2)*H*0.04);
      ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
    });
    // Trees silhouette
    ctx.fillStyle="rgba(5,20,5,0.6)";
    for(let x=0;x<W;x+=Math.round(W/22)){const h=Math.round(H*0.08+Math.random()*H*0.06),tx=x+Math.random()*W/22;ctx.beginPath();ctx.moveTo(tx,H*0.55);ctx.lineTo(tx-h*0.35,H*0.55);ctx.lineTo(tx,H*0.55-h);ctx.lineTo(tx+h*0.35,H*0.55);ctx.closePath();ctx.fill();}
    // Sky glow
    const glw=ctx.createRadialGradient(W*0.5,0,0,W*0.5,0,H*0.4);
    glw.addColorStop(0,"rgba(30,80,30,0.3)"); glw.addColorStop(1,"transparent");
    ctx.fillStyle=glw; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(0,0,W,H);

  } else if(style==="sunset"){
    // Uttarakhand sunset
    const sky=ctx.createLinearGradient(0,0,0,H*0.65);
    sky.addColorStop(0,"#1a0818"); sky.addColorStop(0.2,"#4a1028"); sky.addColorStop(0.5,"#a03018"); sky.addColorStop(0.75,"#d05820"); sky.addColorStop(1,"#e87830");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    // Sun glow
    const sunG=ctx.createRadialGradient(W*0.6,H*0.35,0,W*0.6,H*0.35,H*0.25);
    sunG.addColorStop(0,"rgba(255,200,80,0.45)"); sunG.addColorStop(0.5,"rgba(255,120,20,0.2)"); sunG.addColorStop(1,"transparent");
    ctx.fillStyle=sunG; ctx.fillRect(0,0,W,H);
    // Mountain silhouettes (dark)
    drawMtnPeak(ctx,[[0,H*0.5],[W*0.1,H*0.22],[W*0.22,H*0.34],[W*0.38,H*0.16],[W*0.5,H*0.28],[W*0.62,H*0.12],[W*0.75,H*0.25],[W*0.88,H*0.18],[W,H*0.3],[W,H*0.5]],"rgba(15,5,5,0.85)");
    // Ground
    const gnd=ctx.createLinearGradient(0,H*0.48,0,H);
    gnd.addColorStop(0,"#200808"); gnd.addColorStop(1,"#080205");
    ctx.fillStyle=gnd; ctx.fillRect(0,H*0.48,W,H*0.52);
    // Horizon glow
    const hor=ctx.createLinearGradient(0,H*0.42,0,H*0.55);
    hor.addColorStop(0,"rgba(230,100,20,0.35)"); hor.addColorStop(1,"transparent");
    ctx.fillStyle=hor; ctx.fillRect(0,H*0.42,W,H*0.13);
    ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(0,0,W,H);

  } else { // dark
    ctx.fillStyle="#070B08"; ctx.fillRect(0,0,W,H);
    // subtle radial
    const r1=ctx.createRadialGradient(W*0.2,H*0.1,0,W*0.2,H*0.1,W*0.45);
    r1.addColorStop(0,"rgba(232,98,42,0.07)"); r1.addColorStop(1,"transparent");
    ctx.fillStyle=r1; ctx.fillRect(0,0,W,H);
    const r2=ctx.createRadialGradient(W*0.8,H*0.9,0,W*0.8,H*0.9,W*0.4);
    r2.addColorStop(0,"rgba(16,168,124,0.06)"); r2.addColorStop(1,"transparent");
    ctx.fillStyle=r2; ctx.fillRect(0,0,W,H);
  }
}

// ─── MAIN FRAME DRAWING ───────────────────────────────────
// ─── CERTIFICATE GENERATOR ─────────────────────────────────────────────────
function drawCertificate(canvas, {name, district, days, completedDate, certNum}) {
  const ctx=canvas.getContext("2d");
  const W=1200,H=850; canvas.width=W; canvas.height=H;
  const GOLD="#C8920A", MAROON="#8B1A1A", SAFFRON="#E8622A", DARK="#1A0A00";

  // Background
  ctx.fillStyle="#FFFDF5"; ctx.fillRect(0,0,W,H);

  // Outer border
  ctx.strokeStyle=GOLD; ctx.lineWidth=8;
  ctx.strokeRect(12,12,W-24,H-24);
  ctx.strokeStyle=MAROON; ctx.lineWidth=2;
  ctx.strokeRect(22,22,W-44,H-44);
  ctx.strokeStyle=GOLD; ctx.lineWidth=1;
  ctx.strokeRect(30,30,W-60,H-60);

  // Corner diamonds
  [[50,50],[W-50,50],[50,H-50],[W-50,H-50]].forEach(([cx,cy])=>{
    ctx.fillStyle=GOLD;
    ctx.beginPath(); ctx.moveTo(cx,cy-14); ctx.lineTo(cx+14,cy); ctx.lineTo(cx,cy+14); ctx.lineTo(cx-14,cy); ctx.closePath(); ctx.fill();
  });
  // Corner lotus dots
  [[50,50],[W-50,50],[50,H-50],[W-50,H-50]].forEach(([cx,cy])=>{
    for(let i=0;i<8;i++){const a=i*Math.PI/4; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*22,cy+Math.sin(a)*22,3,0,Math.PI*2); ctx.fillStyle=SAFFRON+"88"; ctx.fill();}
  });

  // Header
  ctx.textAlign="center";
  ctx.font="bold 15px Arial,sans-serif"; ctx.fillStyle=MAROON;
  ctx.fillText("DEPARTMENT OF AYURVEDIC & UNANI SERVICES, GOVERNMENT OF UTTARAKHAND",W/2,72);
  ctx.font="13px Arial,sans-serif"; ctx.fillStyle=GOLD;
  ctx.fillText("National AYUSH Mission, Uttarakhand  |  YogaPath Uttarakhand",W/2,92);

  ctx.strokeStyle=GOLD; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(50,106); ctx.lineTo(W-50,106); ctx.stroke();

  // Title
  ctx.font="bold 48px Georgia,serif"; ctx.fillStyle=DARK;
  ctx.fillText("Certificate of Achievement",W/2,170);
  ctx.font="22px Georgia,serif"; ctx.fillStyle=SAFFRON;
  ctx.fillText("प्रमाण पत्र",W/2,205);

  // Body
  ctx.font="16px Arial,sans-serif"; ctx.fillStyle=DARK+"CC";
  ctx.fillText("This is to certify that",W/2,255);

  ctx.font="bold 52px Georgia,serif"; ctx.fillStyle=MAROON;
  ctx.fillText(name,W/2,325);
  const nw=ctx.measureText(name).width;
  ctx.strokeStyle=SAFFRON; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W/2-nw/2,337); ctx.lineTo(W/2+nw/2,337); ctx.stroke();

  ctx.font="15px Arial,sans-serif"; ctx.fillStyle=DARK+"AA";
  ctx.fillText("District: "+district,W/2,365);

  ctx.font="17px Arial,sans-serif"; ctx.fillStyle=DARK;
  ctx.fillText("has successfully completed the",W/2,405);

  ctx.font="bold 38px Georgia,serif"; ctx.fillStyle=SAFFRON;
  ctx.fillText(days+"-Day Yoga Challenge",W/2,452);

  ctx.font="15px Arial,sans-serif"; ctx.fillStyle=DARK+"BB";
  ctx.fillText("International Day of Yoga 2026  |  YogaPath Uttarakhand",W/2,485);

  // Achievement badge
  ctx.font="bold 18px Arial,sans-serif"; ctx.fillStyle=GOLD;
  ctx.fillText("★  Certified Yoga Abhyasi  ★",W/2,525);

  // Divider
  ctx.strokeStyle=GOLD; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(50,545); ctx.lineTo(W-50,545); ctx.stroke();

  // Info row
  ctx.font="13px Arial,sans-serif"; ctx.fillStyle=DARK+"99";
  ctx.textAlign="left";  ctx.fillText("Date of Completion: "+completedDate, 70, 575);
  ctx.textAlign="right"; ctx.fillText("Certificate No: "+certNum, W-70, 575);
  ctx.textAlign="center"; ctx.fillText("Challenge Duration: "+days+" Days", W/2, 575);

  // Seal / emblem only — no signature lines
  const sigY=660;
  ctx.beginPath(); ctx.arc(W/2,sigY,60,0,Math.PI*2);
  ctx.strokeStyle=GOLD; ctx.lineWidth=3; ctx.stroke();
  ctx.beginPath(); ctx.arc(W/2,sigY,52,0,Math.PI*2);
  ctx.strokeStyle=MAROON+"55"; ctx.lineWidth=1; ctx.stroke();
  ctx.font="bold 16px Arial,sans-serif"; ctx.fillStyle=MAROON; ctx.textAlign="center";
  ctx.fillText("AYUSH",W/2,sigY-8);
  ctx.fillText("UTTARAKHAND",W/2,sigY+12);
  ctx.font="11px Arial,sans-serif"; ctx.fillStyle=GOLD;
  ctx.fillText("GOVT. OF UTTARAKHAND",W/2,sigY+30);

  // Footer
  ctx.font="11px Arial,sans-serif"; ctx.fillStyle=DARK+"55";
  ctx.fillText("This certificate is digitally generated and authenticated by YogaPath Uttarakhand.",W/2,H-42);
  ctx.fillText("Verify at yogapath.uk.gov.in  |  Certificate ID: "+certNum,W/2,H-24);
}


function drawSquareFrame(canvas, source, frameImg, p) {
  const ctx=canvas.getContext("2d");
  const FW=1080, FH=1080, STRIP=88;
  canvas.width=FW; canvas.height=FH+STRIP;

  // 1. User photo
  if(source&&(source.readyState===undefined||source.readyState>=2)){
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,FW,FH); ctx.clip();
    const sw=source.videoWidth||source.naturalWidth||FW;
    const sh=source.videoHeight||source.naturalHeight||FH;
    const sc=Math.min(FW/sw,FH/sh);
    ctx.drawImage(source,(FW-sw*sc)/2,(FH-sh*sc)/2,sw*sc,sh*sc);
    ctx.restore();
  } else { ctx.fillStyle="#e8e8e8"; ctx.fillRect(0,0,FW,FH); }

  // 2. Frame PNG overlay
  if(frameImg) ctx.drawImage(frameImg,0,0,FW,FH);

  // 3. Strip — fixed below frame, never overlaps
  const sg=ctx.createLinearGradient(0,FH,0,FH+STRIP);
  sg.addColorStop(0,"#0A1A0A"); sg.addColorStop(1,"#060F06");
  ctx.fillStyle=sg; ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A"; ctx.fillRect(0,FH,FW,4);

  // 4. ONE LINE — auto-shrink font until it fits
  const pin=String.fromCodePoint(0x1F4CD);
  const sep="  |  ";
  const parts=[p.name||"Yogi"];
  if(p.role) parts.push(p.role);
  if(p.district) parts.push(pin+" "+p.district);
  if(p.mode==="message") parts.push("Yoga Message");
  else if(p.asana) parts.push(p.asana.name+" | "+p.asana.sanskrit);
  const line=parts.join(sep);

  const MAX_W=FW-48;
  let fs=28;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W && fs>13){ fs--; ctx.font="bold "+fs+"px Arial,sans-serif"; }

  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#FFFFFF";
  ctx.fillText(line, FW/2, FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}


function drawPortraitFrame(canvas, source, frameImg, p) {
  const ctx=canvas.getContext("2d");
  const FW=720, FH=1280, STRIP=88;
  canvas.width=FW; canvas.height=FH+STRIP;
  ctx.fillStyle="#000"; ctx.fillRect(0,0,FW,FH);
  if(source&&(source.readyState===undefined||source.readyState>=2)){
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,FW,FH); ctx.clip();
    const sw=source.videoWidth||source.naturalWidth||FW;
    const sh=source.videoHeight||source.naturalHeight||FH;
    const sc=Math.min(FW/sw,FH/sh);
    ctx.drawImage(source,(FW-sw*sc)/2,(FH-sh*sc)/2,sw*sc,sh*sc);
    ctx.restore();
  } else { ctx.fillStyle="#e8e8e8"; ctx.fillRect(0,0,FW,FH); }
  if(frameImg) ctx.drawImage(frameImg,0,0,FW,FH);
  const sg=ctx.createLinearGradient(0,FH,0,FH+STRIP);
  sg.addColorStop(0,"#0A1A0A"); sg.addColorStop(1,"#060F06");
  ctx.fillStyle=sg; ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A"; ctx.fillRect(0,FH,FW,4);
  const pin=String.fromCodePoint(0x1F4CD);
  const sep="   |   ";
  const parts=[p.name||"Yogi"];
  if(p.role) parts.push(p.role);
  if(p.district) parts.push(pin+" "+p.district);
  if(p.mode==="message") parts.push("Yoga Message");
  else if(p.asana) parts.push(p.asana.name+" | "+p.asana.sanskrit);
  const line=parts.join(sep);
  const MAX_W=FW-48; let fs=26;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W&&fs>12){fs--;ctx.font="bold "+fs+"px Arial,sans-serif";}
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#FFFFFF";
  ctx.fillText(line,FW/2,FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}

function drawLandscapeFrame(canvas, source, frameImg, p) {
  const ctx=canvas.getContext("2d");
  const FW=1280, FH=640, STRIP=88;
  canvas.width=FW; canvas.height=FH+STRIP;
  ctx.fillStyle="#000"; ctx.fillRect(0,0,FW,FH);
  // Photo fills frame area
  if(source&&(source.readyState===undefined||source.readyState>=2)){
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,FW,FH); ctx.clip();
    const sw=source.videoWidth||source.naturalWidth||FW;
    const sh=source.videoHeight||source.naturalHeight||FH;
    const sc=Math.min(FW/sw,FH/sh);
    ctx.drawImage(source,(FW-sw*sc)/2,(FH-sh*sc)/2,sw*sc,sh*sc);
    ctx.restore();
  } else { ctx.fillStyle="#e8e8e8"; ctx.fillRect(0,0,FW,FH); }
  // Frame overlay
  if(frameImg) ctx.drawImage(frameImg,0,0,FW,FH);
  // Strip
  const sg=ctx.createLinearGradient(0,FH,0,FH+STRIP);
  sg.addColorStop(0,"#0A1A0A"); sg.addColorStop(1,"#060F06");
  ctx.fillStyle=sg; ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A"; ctx.fillRect(0,FH,FW,4);
  // One line auto-fit text
  const pin=String.fromCodePoint(0x1F4CD);
  const sep="   |   ";
  const parts=[p.name||"Yogi"];
  if(p.role) parts.push(p.role);
  if(p.district) parts.push(pin+" "+p.district);
  if(p.mode==="message") parts.push("Yoga Message");
  else if(p.asana) parts.push(p.asana.name+" | "+p.asana.sanskrit);
  const line=parts.join(sep);
  const MAX_W=FW-48;
  let fs=28;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W&&fs>13){fs--;ctx.font="bold "+fs+"px Arial,sans-serif";}
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#FFFFFF";
  ctx.fillText(line,FW/2,FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}

function drawAYUSHFrame(canvas, source, { asana, name, district, role, mode, msg, bgStyle="dark", orientation="portrait" }) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const isLandscape = W > H;
  const isAipan = bgStyle.startsWith("aipan");
  const accent = mode==="message" ? "#8B5CF6" : (asana?.color||"#E8622A");
  const textBase = isAipan ? "#FFF8F0" : "#EEEEF0";
  const textMuted = isAipan ? "rgba(255,240,210,0.55)" : "rgba(160,200,160,0.6)";
  const panelBg = isAipan ? "rgba(0,0,0,0.55)" : (bgStyle==="dark" ? "#060A06" : "rgba(0,0,0,0.65)");

  // 1. Draw background
  drawBackground(ctx, W, H, bgStyle);

  if (!isLandscape) {
    // ── PORTRAIT / SQUARE LAYOUT ──
    const HEADER = Math.round(H*0.115);
    const FOOTER = Math.round(H*0.235);
    const MY = HEADER, MH = H-HEADER-FOOTER;

    // Media
    if(source && (source.readyState===undefined||source.readyState>=2)){
      ctx.save(); ctx.beginPath(); ctx.rect(0,MY,W,MH); ctx.clip();
      const sw=source.videoWidth||source.naturalWidth||W;
      const sh=source.videoHeight||source.naturalHeight||H;
      const sc=Math.min(W/sw,MH/sh);
      ctx.drawImage(source,(W-sw*sc)/2,MY+(MH-sh*sc)/2,sw*sc,sh*sc);
      ctx.restore();
      const fadeB=ctx.createLinearGradient(0,MY+MH-H*0.1,0,MY+MH);
      fadeB.addColorStop(0,"transparent"); fadeB.addColorStop(1,bgStyle==="dark"?"#070B08":"rgba(0,0,0,0.7)");
      ctx.fillStyle=fadeB; ctx.fillRect(0,MY+MH-H*0.1,W,H*0.1);
    }

    // Header panel
    ctx.fillStyle=panelBg; ctx.fillRect(0,0,W,HEADER);
    ctx.fillStyle=accent; ctx.fillRect(0,0,W,4);
    ctx.fillStyle="rgba(16,168,124,0.22)"; ctx.fillRect(0,HEADER-2,W,2);

    const fs=H/1280;
    ctx.font=`${Math.round(46*fs)}px serif`; ctx.fillStyle="rgba(255,255,255,0.75)"; ctx.textAlign="left";
    ctx.fillText("🕉",20,Math.round(72*fs+8));
    ctx.textAlign="right"; ctx.fillStyle="rgba(255,255,255,0.38)";
    ctx.fillText("🪷",W-20,Math.round(72*fs+8));
    ctx.textAlign="center";
    ctx.font=`bold ${Math.round(30*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase;
    ctx.fillText("AYUSH UTTARAKHAND",W/2,Math.round(44*fs+4));
    ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`; ctx.fillStyle="rgba(255,255,255,0.78)";
    ctx.fillText("International Day of Yoga 2026  •  21 June",W/2,Math.round(72*fs+4));

    // Footer panel
    const FY=H-FOOTER;
    ctx.fillStyle=panelBg; ctx.fillRect(0,FY,W,FOOTER);
    ctx.fillStyle=accent; ctx.fillRect(22,FY+16,4,FOOTER-32);
    let fy=FY+Math.round(38*fs)+16; ctx.textAlign="left";
    ctx.font=`bold ${Math.round(34*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase;
    ctx.fillText(name||"Yogi",42,fy);
    if(role){fy+=Math.round(28*fs);ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`;ctx.fillStyle=accent;ctx.fillText(role,42,fy);}
    fy+=Math.round(26*fs); ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`; ctx.fillStyle=textMuted;
    ctx.fillText(`📍 ${district||"Uttarakhand"}`,42,fy);
    fy+=Math.round(32*fs);
    if(mode==="message"){ctx.font=`bold ${Math.round(30*fs)}px Arial,sans-serif`;ctx.fillStyle="#A78BFA";ctx.fillText("💬  Yoga Message",42,fy);fy+=Math.round(36*fs);ctx.font=`${Math.round(20*fs)}px Arial,sans-serif`;ctx.fillStyle="rgba(167,139,250,0.7)";ctx.fillText("International Day of Yoga 2026",42,fy);fy+=Math.round(28*fs);}
    else if(asana){ctx.font=`bold ${Math.round(20*fs)}px Arial,sans-serif`;ctx.fillStyle=accent;ctx.fillText(`${asana.icon}  ${asana.name}  |  ${asana.sanskrit}`,42,fy);fy+=Math.round(26*fs);
      ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`;ctx.fillStyle=textMuted;
      (asana.benefits||[]).slice(0,2).forEach(b=>{ctx.fillText(`✓  ${b}`,42,fy);fy+=Math.round(23*fs);});}
    fy+=4; ctx.font=`italic ${Math.round(16*fs)}px Georgia,serif`; ctx.fillStyle=isAipan?"rgba(255,230,100,0.9)":"rgba(200,160,20,0.9)";
    wrapText(ctx,`"${msg}"`,42,fy,W-84,Math.round(22*fs),2);
    ctx.textAlign="center"; ctx.font=`${Math.round(11*fs)}px Arial,sans-serif`; ctx.fillStyle=isAipan?"rgba(255,255,255,0.25)":"rgba(100,150,100,0.3)";
    ctx.fillText("Dept. of Ayurvedic & Unani Services  •  National AYUSH Mission, Uttarakhand",W/2,H-12);

  } else {
    // ── LANDSCAPE LAYOUT ──
    const HEADER=Math.round(H*0.13);
    const FOOTER=Math.round(H*0.09);
    const PHOTO_W=Math.round(W*0.575);
    const INFO_X=PHOTO_W+20;
    const INFO_W=W-PHOTO_W-32;
    const BODY_Y=HEADER; const BODY_H=H-HEADER-FOOTER;
    const fs=H/720;

    // Photo left
    if(source&&(source.readyState===undefined||source.readyState>=2)){
      ctx.save(); ctx.beginPath(); ctx.rect(0,BODY_Y,PHOTO_W,BODY_H); ctx.clip();
      const sw=source.videoWidth||source.naturalWidth||W;
      const sh=source.videoHeight||source.naturalHeight||H;
      const sc=Math.min(PHOTO_W/sw,BODY_H/sh);
      ctx.drawImage(source,(PHOTO_W-sw*sc)/2,BODY_Y+(BODY_H-sh*sc)/2,sw*sc,sh*sc);
      ctx.restore();
      const fadeR=ctx.createLinearGradient(PHOTO_W-H*0.12,0,PHOTO_W,0);
      fadeR.addColorStop(0,"transparent"); fadeR.addColorStop(1,bgStyle==="dark"?"#070B08":"rgba(0,0,0,0.7)");
      ctx.fillStyle=fadeR; ctx.fillRect(PHOTO_W-H*0.12,BODY_Y,H*0.12,BODY_H);
    }

    // Header (full width)
    ctx.fillStyle=panelBg; ctx.fillRect(0,0,W,HEADER);
    ctx.fillStyle=accent; ctx.fillRect(0,0,W,3);
    ctx.font=`${Math.round(36*fs)}px serif`; ctx.fillStyle="rgba(255,255,255,0.75)"; ctx.textAlign="left";
    ctx.fillText("🕉",16,Math.round(60*fs));
    ctx.textAlign="right"; ctx.fillStyle="rgba(255,255,255,0.35)";
    ctx.fillText("🪷",W-16,Math.round(60*fs));
    ctx.textAlign="center";
    ctx.font=`bold ${Math.round(26*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase;
    ctx.fillText("AYUSH UTTARAKHAND",W/2,Math.round(44*fs));
    ctx.font=`${Math.round(15*fs)}px Arial,sans-serif`; ctx.fillStyle="rgba(255,255,255,0.75)";
    ctx.fillText("International Day of Yoga 2026  •  21 June 2026",W/2,Math.round(68*fs));

    // Info right panel
    ctx.fillStyle=panelBg+"CC"; ctx.fillRect(PHOTO_W,BODY_Y,W-PHOTO_W,BODY_H);
    ctx.fillStyle=accent; ctx.fillRect(PHOTO_W,BODY_Y,3,BODY_H);
    let iy=BODY_Y+Math.round(36*fs); ctx.textAlign="left";
    ctx.font=`bold ${Math.round(30*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase;
    ctx.fillText(name||"Yogi",INFO_X,iy);
    if(role){iy+=Math.round(26*fs);ctx.font=`${Math.round(16*fs)}px Arial,sans-serif`;ctx.fillStyle=accent;wrapText(ctx,role,INFO_X,iy,INFO_W,Math.round(20*fs),2);}
    iy+=Math.round(24*fs); ctx.font=`${Math.round(15*fs)}px Arial,sans-serif`; ctx.fillStyle=textMuted;
    ctx.fillText(`📍 ${district||"Uttarakhand"}`,INFO_X,iy);
    iy+=Math.round(28*fs); ctx.fillStyle=isAipan?"rgba(200,180,180,0.5)":"rgba(100,150,100,0.25)";
    ctx.fillRect(INFO_X,iy,INFO_W-20,1); iy+=Math.round(18*fs);
    if(mode==="message"){ctx.font=`bold ${Math.round(24*fs)}px Arial,sans-serif`;ctx.fillStyle="#A78BFA";ctx.fillText("💬  Yoga Message",INFO_X,iy);iy+=Math.round(30*fs);ctx.font=`${Math.round(15*fs)}px Arial,sans-serif`;ctx.fillStyle="rgba(167,139,250,0.65)";ctx.fillText("International Day of Yoga 2026",INFO_X,iy);iy+=Math.round(22*fs);}
    else if(asana){ctx.font=`bold ${Math.round(19*fs)}px Arial,sans-serif`;ctx.fillStyle=accent;ctx.fillText(`${asana.icon}  ${asana.name}`,INFO_X,iy);iy+=Math.round(19*fs);
      ctx.font=`${Math.round(15*fs)}px Arial,sans-serif`;ctx.fillStyle=textMuted;ctx.fillText(asana.sanskrit,INFO_X,iy);iy+=Math.round(22*fs);
      ctx.font=`${Math.round(14*fs)}px Arial,sans-serif`;ctx.fillStyle=textMuted;
      (asana.benefits||[]).slice(0,3).forEach(b=>{ctx.fillText(`✓  ${b}`,INFO_X,iy);iy+=Math.round(20*fs);});}
    iy+=4; ctx.font=`italic ${Math.round(14*fs)}px Georgia,serif`; ctx.fillStyle=isAipan?"rgba(255,230,100,0.88)":"rgba(200,160,20,0.88)";
    wrapText(ctx,`"${msg}"`,INFO_X,iy,INFO_W-12,Math.round(20*fs),3);

    // Footer
    ctx.fillStyle=panelBg; ctx.fillRect(0,H-FOOTER,W,FOOTER);
    ctx.fillStyle=isAipan?"rgba(255,255,255,0.18)":"rgba(100,150,100,0.25)";
    ctx.textAlign="center"; ctx.font=`${Math.round(12*fs)}px Arial,sans-serif`;
    ctx.fillText("Dept. of Ayurvedic & Unani Services  •  National AYUSH Mission, Uttarakhand  •  IDY 2026",W/2,H-FOOTER/2+5);
  }

  // Border
  ctx.strokeStyle=isAipan?"rgba(255,255,255,0.35)":accent; ctx.lineWidth=5;
  ctx.strokeRect(2.5,2.5,W-5,H-5);
  ctx.strokeStyle="rgba(255,255,255,0.04)"; ctx.lineWidth=2;
  ctx.strokeRect(12,12,W-24,H-24);
}

// ─── SUPABASE LOGGER ──────────────────────────────────────
async function logToSupabase(d) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/yoga_participation`, {
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=minimal"},
      body:JSON.stringify(d)
    });
    return res.ok;
  } catch(e) { console.error('Supabase insert failed:',e); return false; }
}

// ─── CSS ─────────────────────────────────────────────────
const css=`
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#09090F;color:#fff;font-family:'Sora',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
.page{min-height:100vh;background:#09090F;}
.fade{animation:fi 0.32s cubic-bezier(0.16,1,0.3,1);}
@keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.tap{transition:transform 0.12s,opacity 0.12s;cursor:pointer;}
.tap:active{transform:scale(0.965);opacity:0.82;}
.back{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.7);padding:10px 16px;border-radius:12px;cursor:pointer;font-size:18px;transition:background 0.15s;}
.back:hover{background:rgba(255,255,255,0.1);}
.inp{width:100%;background:#13131E;border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 18px;color:#fff;font-size:15px;font-family:'Sora',sans-serif;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
.inp:focus{border-color:#E8622A;box-shadow:0 0 0 3px rgba(232,98,42,0.12);}
.inp::placeholder{color:rgba(255,255,255,0.25);}
select.inp{colorScheme:dark;cursor:pointer;}
select.inp option{background:#13131E;color:#fff;}
.prog{height:2px;background:rgba(255,255,255,0.07);border-radius:1px;margin-bottom:32px;}
.pfill{height:100%;background:linear-gradient(90deg,#E8622A,#10A87C);border-radius:1px;transition:width 0.5s cubic-bezier(0.16,1,0.3,1);}
.scroll-hide::-webkit-scrollbar{display:none;}
.card{background:#13131E;border:1px solid rgba(255,255,255,0.07);border-radius:18px;transition:border-color 0.18s,background 0.18s;}
.card:hover{border-color:rgba(255,255,255,0.13);}
.pill{display:inline-flex;align-items:center;border-radius:20px;font-weight:600;letter-spacing:0.3px;}
`;

// ─── CAMERA SCREEN ────────────────────────────────────────

function drawStrip(ctx,FW,FH,STRIP,p){
  ctx.fillStyle="#0A0A14";ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A";ctx.fillRect(0,FH,FW,4);
  const pin="\uD83D\uDCCD",sep="   |   ";
  const parts=[p.name||"Yogi"];
  if(p.role)parts.push(p.role);
  if(p.district)parts.push(pin+" "+p.district);
  if(p.asana)parts.push(p.asana.name||p.asana);
  const line=parts.join(sep);
  const MAX_W=FW-48;let fs=26;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W&&fs>11){fs--;ctx.font="bold "+fs+"px Arial,sans-serif";}
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillStyle="#FFF";ctx.fillText(line,FW/2,FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}

function drawFrameAdjust(canvas,media,frameImg,FW,FH,STRIP,off,sc,p,rot){
  const ctx=canvas.getContext("2d");
  if(canvas.width!==FW)canvas.width=FW;
  if(canvas.height!==FH+STRIP)canvas.height=FH+STRIP;
  ctx.fillStyle="#111";ctx.fillRect(0,0,FW,FH);
  if(media){
    const pw=media.naturalWidth||media.videoWidth||FW;
    const ph=media.naturalHeight||media.videoHeight||FH;
    if(pw&&ph){
      ctx.save();
      ctx.translate(FW/2+off.x,FH/2+off.y);
      if(rot) ctx.rotate((rot*Math.PI)/180);
      ctx.scale(sc,sc);
      const base=(rot===90||rot===270)?Math.min(FH/pw,FW/ph):Math.min(FW/pw,FH/ph);
      ctx.drawImage(media,-pw*base/2,-ph*base/2,pw*base,ph*base);
      ctx.restore();
    }
  }
  if(frameImg)ctx.drawImage(frameImg,0,0,FW,FH);
  drawStrip(ctx,FW,FH,STRIP,p);
}

function CameraScreen({mode,asana,name,district,role,msg,bgStyle,orientation,sqFrame,lsFrame,ptFrame,onCapture,onBack}){
  const canvasRef=useRef(null),animRef=useRef(null),
        nativeCamRef=useRef(null),galleryRef=useRef(null),
        sqImgRef=useRef(null),lsImgRef=useRef(null),ptImgRef=useRef(null),
        mediaRef=useRef(null),
        originalFileRef=useRef(null),
        ffmpegRef=useRef(null),
        offsetRef=useRef({x:0,y:0}),scaleRef=useRef(1),
        touchRef=useRef(null),
        mimeRef=useRef("video/mp4");

  const [phase,setPhase]=useState("pick");
  const [rotation,setRotation]=useState(0);
  const rotationRef=useRef(0);
  const [scale,setScale]=useState(1);
  const [offset,setOffset]=useState({x:0,y:0});
  const [saving,setSaving]=useState(false);
  const [saveProgress,setSaveProgress]=useState(0);
  const [saveStatus,setSaveStatus]=useState("");
  const [err,setErr]=useState(null);

  const isPhoto=mode==="photo";
  const ori=ORIENTATIONS.find(o=>o.id===orientation)||ORIENTATIONS[0];
  const FW=orientation==="square"?1080:orientation==="portrait"?720:orientation==="landscape"?1280:ori.w;
  const FH=orientation==="square"?1080:orientation==="portrait"?1280:orientation==="landscape"?640:ori.h;
  const STRIP=88;

  // ── Load frame PNGs ──
  useEffect(()=>{
    const load=(ref,src)=>{const img=new Image();img.onload=()=>ref.current=img;img.src=src;};
    if(orientation==="square"&&sqFrame) load(sqImgRef,`/frames/frame-sq-${sqFrame}.png`);
    if(orientation==="portrait"&&ptFrame) load(ptImgRef,`/frames/frame-pt-${ptFrame}.png`);
    if(orientation==="landscape"&&lsFrame) load(lsImgRef,`/frames/frame-ls-${lsFrame}.png`);
  },[orientation,sqFrame,ptFrame,lsFrame]);

  const getFrame=()=>orientation==="square"?sqImgRef.current:orientation==="portrait"?ptImgRef.current:orientation==="landscape"?lsImgRef.current:null;

  // ── RAF loop in adjust phase ──
  useEffect(()=>{
    if(phase!=="adjust")return;
    let raf;
    const loop=()=>{
      if(canvasRef.current&&mediaRef.current)
        drawFrameAdjust(canvasRef.current,mediaRef.current,getFrame(),FW,FH,STRIP,offsetRef.current,scaleRef.current,{name,role,district,asana,mode},rotationRef.current);
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  },[phase,FW,FH,name,role,district,asana,mode,orientation,sqFrame,ptFrame,lsFrame]);

  // ── File pick handler (native cam + gallery) ──
  function handleFile(e){
    const file=e.target.files?.[0];if(!file)return;
    setErr(null);
    const url=URL.createObjectURL(file);
    if(file.type.startsWith("image/")){
      const img=new Image();
      img.onload=()=>{
        mediaRef.current=img;
        offsetRef.current={x:0,y:0};scaleRef.current=1;
        setOffset({x:0,y:0});setScale(1);setPhase("adjust");
      };
      img.onerror=()=>setErr("Image load failed");
      img.src=url;
    } else if(file.type.startsWith("video/")){
      mimeRef.current=file.type||"video/mp4";
      originalFileRef.current=file;          // store original for lossless save
      const vid=document.createElement("video");
      vid.src=url;vid.muted=true;vid.loop=true;vid.playsInline=true;
      vid.onloadedmetadata=()=>{
        mediaRef.current=vid;
        offsetRef.current={x:0,y:0};scaleRef.current=1;
        setOffset({x:0,y:0});setScale(1);
        vid.play().catch(()=>{});
        setPhase("adjust");
      };
      vid.onerror=()=>setErr("Video load failed");
    } else {
      setErr("Unsupported file type");
    }
    e.target.value="";
  }

  // ── Touch: pan + pinch-zoom ──
  function onTouchStart(e){
    if(phase!=="adjust")return;
    if(e.touches.length===1){
      const rect=canvasRef.current.getBoundingClientRect();
      const k=FW/rect.width;
      touchRef.current={type:"pan",lx:e.touches[0].clientX,ly:e.touches[0].clientY,k};
    } else if(e.touches.length===2){
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      touchRef.current={type:"pinch",d0:d,s0:scaleRef.current};
    }
  }
  function onTouchMove(e){
    if(phase!=="adjust"||!touchRef.current)return;
    e.preventDefault();
    const tr=touchRef.current;
    if(tr.type==="pan"&&e.touches.length===1){
      offsetRef.current={x:offsetRef.current.x+(e.touches[0].clientX-tr.lx)*tr.k,y:offsetRef.current.y+(e.touches[0].clientY-tr.ly)*tr.k};
      touchRef.current={...tr,lx:e.touches[0].clientX,ly:e.touches[0].clientY};
    } else if(tr.type==="pinch"&&e.touches.length===2){
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      scaleRef.current=Math.max(0.2,Math.min(6,tr.s0*(d/tr.d0)));
    }
  }
  function onTouchEnd(){touchRef.current=null;setScale(scaleRef.current);setOffset({...offsetRef.current});}

  function zoomBy(d){const s=Math.max(0.2,Math.min(6,scaleRef.current+d));scaleRef.current=s;setScale(s);}
  function moveBy(dx,dy){const step=40;offsetRef.current={x:offsetRef.current.x+dx*step,y:offsetRef.current.y+dy*step};setOffset({...offsetRef.current});}
  function rotateCW(){const r=(rotationRef.current+90)%360;rotationRef.current=r;setRotation(r);offsetRef.current={x:0,y:0};setOffset({x:0,y:0});}
  function reset(){offsetRef.current={x:0,y:0};scaleRef.current=1;rotationRef.current=0;setOffset({x:0,y:0});setScale(1);setRotation(0);}

  // ── Save ──
  // ── Load FFmpeg singleton ──
  async function loadFFmpeg(onProg){
    if(ffmpegRef.current) return ffmpegRef.current;
    setSaveStatus("FFmpeg load हो रहा है... (पहली बार ~30 seconds)");
    const {FFmpeg}=await import("@ffmpeg/ffmpeg");
    const {toBlobURL}=await import("@ffmpeg/util");
    const ff=new FFmpeg();
    if(onProg) ff.on("progress",({progress})=>onProg(progress));
    const base="https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    await ff.load({
      coreURL:await toBlobURL(`${base}/ffmpeg-core.js`,"text/javascript"),
      wasmURL:await toBlobURL(`${base}/ffmpeg-core.wasm`,"application/wasm"),
    });
    ffmpegRef.current=ff;
    return ff;
  }

  // ── Canvas record (video only, no audio) ──
  async function recordCanvasVideo(origFile){
    return new Promise(async(resolve,reject)=>{
      const fi=getFrame();
      const vEl=document.createElement("video");
      vEl.src=URL.createObjectURL(origFile);
      vEl.muted=true; vEl.loop=false; vEl.playsInline=true;
      await new Promise(r=>{vEl.onloadedmetadata=r;});
      const oCanvas=document.createElement("canvas");
      oCanvas.width=FW; oCanvas.height=FH+STRIP;
      const stream=oCanvas.captureStream(30);
      const mime=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"]
        .find(t=>{try{return MediaRecorder.isTypeSupported(t);}catch{return false;}})||"video/webm";
      const chunks=[]; const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2500000});
      rec.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      rec.onstop=()=>resolve(new Blob(chunks,{type:rec.mimeType}));
      let raf;
      const loop=()=>{
        drawFrameAdjust(oCanvas,vEl,fi,FW,FH,STRIP,offsetRef.current,scaleRef.current,{name,role,district,asana,mode},rotationRef.current);
        raf=requestAnimationFrame(loop);
        if(vEl.duration>0) setSaveProgress(5+Math.round((vEl.currentTime/vEl.duration)*40));
      };
      raf=requestAnimationFrame(loop);
      vEl.currentTime=0;
      await new Promise(r=>{vEl.onseeked=()=>r();setTimeout(r,500);});
      rec.start(100);
      await vEl.play().catch(reject);
      vEl.onended=()=>{cancelAnimationFrame(raf);if(rec.state==="recording")rec.stop();};
      setTimeout(()=>{cancelAnimationFrame(raf);if(rec.state==="recording")rec.stop();},(vEl.duration*1000)+3000||60000);
    });
  }

  // ── FFmpeg: mux canvas video + original audio → MP4 ──
  async function canvasRecorderFallback(origFile){
    setSaving(true); setSaveProgress(2); setErr(null);
    try{
      // Phase 1: Record canvas (frame burned in, video only)
      setSaveStatus("Frame video record हो रही है...");
      const canvasBlob=await recordCanvasVideo(origFile);
      setSaveProgress(48); setSaveStatus("FFmpeg से audio+video merge हो रहा है...");

      // Phase 2: Load FFmpeg
      const ff=await loadFFmpeg(p=>setSaveProgress(48+Math.round(p*5)));
      setSaveProgress(55);

      // Phase 3: Write files to FFmpeg virtual FS
      const {fetchFile}=await import("@ffmpeg/util");
      await ff.writeFile("canvas.webm",await fetchFile(canvasBlob));
      await ff.writeFile("orig.mp4",await fetchFile(origFile));
      setSaveProgress(60); setSaveStatus("MP4 encode हो रहा है...");

      // Register progress for encoding phase
      const onFFProg=({progress})=>setSaveProgress(60+Math.round(progress*35));
      ff.on("progress",onFFProg);

      // Phase 4: Mux — canvas video + ORIGINAL audio (copied, not re-encoded)
      await ff.exec([
        "-i","canvas.webm",
        "-i","orig.mp4",
        "-c:v","libx264","-preset","ultrafast","-crf","23",
        "-map","0:v:0",
        "-map","1:a:0",
        "-c:a","copy",
        "-shortest",
        "-movflags","+faststart",
        "output.mp4"
      ]);

      ff.off("progress",onFFProg);
      setSaveProgress(97);

      // Phase 5: Read output & cleanup
      const data=await ff.readFile("output.mp4");
      await ff.deleteFile("canvas.webm").catch(()=>{});
      await ff.deleteFile("orig.mp4").catch(()=>{});
      await ff.deleteFile("output.mp4").catch(()=>{});

      const blob=new Blob([data.buffer],{type:"video/mp4"});
      const url=URL.createObjectURL(blob);
      setSaveProgress(100); setSaveStatus(""); setSaving(false);
      onCapture({type:"video",blob,url,mime:"video/mp4"});

    }catch(e){
      console.error("FFmpeg mux failed:",e);
      setSaving(false); setSaveProgress(0); setSaveStatus("");
      setErr("Save failed: "+e.message+". Please try again.");
    }
  }
  // ── WebCodecs-based encoding (H264+AAC proper MP4) ──
  async function encodeVideoWithFrame(origFile){
    const {Muxer,ArrayBufferTarget}=await import("mp4-muxer");
    const fi=getFrame();
    const ab=await origFile.arrayBuffer();
    const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    const audioBuffer=await audioCtx.decodeAudioData(ab);
    const W=FW, H=FH+STRIP;
    const muxer=new Muxer({
      target:new ArrayBufferTarget(),
      video:{codec:"avc",width:W,height:H},
      audio:{codec:"aac",sampleRate:audioBuffer.sampleRate,numberOfChannels:audioBuffer.numberOfChannels},
      fastStart:"in-memory"
    });
    const vEnc=new VideoEncoder({
      output:(chunk,meta)=>muxer.addVideoChunk(chunk,meta),
      error:e=>console.error("VE:",e)
    });
    const vcSupport=await VideoEncoder.isConfigSupported({codec:"avc1.42001f",width:W,height:H});
    if(!vcSupport.supported) throw new Error("H264 not supported");
    vEnc.configure({codec:"avc1.42001f",width:W,height:H,bitrate:3000000,framerate:30});
    const aEnc=new AudioEncoder({
      output:(chunk,meta)=>muxer.addAudioChunk(chunk,meta),
      error:e=>console.error("AE:",e)
    });
    aEnc.configure({codec:"mp4a.40.2",sampleRate:audioBuffer.sampleRate,numberOfChannels:audioBuffer.numberOfChannels,bitrate:128000});
    const oCanvas=document.createElement("canvas");
    oCanvas.width=W; oCanvas.height=H;
    const vEl=document.createElement("video");
    vEl.src=URL.createObjectURL(origFile); vEl.muted=true; vEl.playsInline=true;
    await new Promise(r=>{vEl.onloadedmetadata=r;});
    const duration=vEl.duration; let frameIdx=0;
    await new Promise((resolve,reject)=>{
      const onFrame=async(now,metadata)=>{
        try{
          drawFrameAdjust(oCanvas,vEl,fi,FW,FH,STRIP,offsetRef.current,scaleRef.current,{name,role,district,asana,mode},rotationRef.current);
          const ts=Math.round(metadata.mediaTime*1000000);
          const vf=new VideoFrame(oCanvas,{timestamp:ts});
          vEnc.encode(vf,{keyFrame:frameIdx%60===0}); vf.close(); frameIdx++;
          setSaveProgress(Math.min(80,Math.round((metadata.mediaTime/duration)*80)));
          if(!vEl.ended) vEl.requestVideoFrameCallback(onFrame); else resolve();
        }catch(e){reject(e);}
      };
      vEl.onended=resolve; vEl.onerror=reject;
      vEl.play().then(()=>vEl.requestVideoFrameCallback(onFrame)).catch(reject);
    });
    setSaveProgress(88);
    const sr=audioBuffer.sampleRate, nc=audioBuffer.numberOfChannels, CHUNK=4096;
    for(let i=0;i<audioBuffer.length;i+=CHUNK){
      const frames=Math.min(CHUNK,audioBuffer.length-i);
      const data=new Float32Array(frames*nc);
      for(let c=0;c<nc;c++) data.set(audioBuffer.getChannelData(c).subarray(i,i+frames),c*frames);
      const ad=new AudioData({format:"f32-planar",sampleRate:sr,numberOfFrames:frames,numberOfChannels:nc,timestamp:Math.round((i/sr)*1000000),data});
      aEnc.encode(ad); ad.close();
    }
    setSaveProgress(96);
    await vEnc.flush(); await aEnc.flush();
    muxer.finalize(); await audioCtx.close();
    setSaveProgress(100);
    return new Blob([muxer.target.buffer],{type:"video/mp4"});
  }

  async function doSave(){
    const med=mediaRef.current;
    if(!med){setErr("No media selected");return;}
    const isVid=med.tagName==="VIDEO";
    if(!isVid){
      const url=canvasRef.current.toDataURL("image/jpeg",0.94);
      onCapture({type:"photo",url}); return;
    }
    const origFile=originalFileRef.current;
    const hasWebCodecs=typeof VideoEncoder!=="undefined"
      &&typeof AudioEncoder!=="undefined"
      &&"requestVideoFrameCallback" in HTMLVideoElement.prototype;
    if(hasWebCodecs&&origFile){
      setSaving(true); setSaveProgress(5); setErr(null);
      try{
        const blob=await encodeVideoWithFrame(origFile);
        const url=URL.createObjectURL(blob);
        setSaving(false); setSaveProgress(0);
        onCapture({type:"video",blob,url,mime:"video/mp4"});
      }catch(e){
        console.error("WebCodecs failed, trying canvas fallback:",e);
        setSaving(false); setSaveProgress(0);
        // Fallback: canvas MediaRecorder (frame burned, audio best-effort)
        await canvasRecorderFallback(origFile);
      }
    } else if(origFile){
      // No WebCodecs: canvas MediaRecorder fallback
      await canvasRecorderFallback(origFile);
    } else {
      setErr("No video file. Please re-select.");
    }
  }

  useEffect(()=>()=>{cancelAnimationFrame(animRef.current);},[]);

  const acceptType=isPhoto?"image/*":"video/*";
  const modeObj=MODES.find(m=>m.id===mode);
  const frameImg=getFrame();

  return(
    <div style={{background:"#000",minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Sora',system-ui,sans-serif",color:"white"}}>
      {/* Header */}
      <div style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={()=>{cancelAnimationFrame(animRef.current);onBack();}}
          style={{background:"rgba(255,255,255,0.1)",border:"none",color:"white",padding:"7px 12px",borderRadius:"9px",cursor:"pointer",fontSize:"16px"}}>←</button>
        <div style={{fontSize:"12px",fontWeight:"600",opacity:0.85}}>
          {modeObj?.icon} {modeObj?.title} · {ori.label}
        </div>
        {phase==="adjust"
          ? <button onClick={reset} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.7)",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>Reset</button>
          : <div style={{width:"50px"}}/>
        }
      </div>

      {/* Canvas — visible in adjust AND while saving */}
      {(phase==="adjust"||saving)&&(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px",overflow:"hidden",position:"relative",touchAction:"none"}}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <canvas ref={canvasRef} width={FW} height={FH+STRIP}
            style={{width:"100%",maxHeight:"calc(100vh - 200px)",objectFit:"contain",borderRadius:"8px",border:saving?"1.5px solid rgba(16,168,124,0.4)":"1.5px solid rgba(232,98,42,0.4)"}}/>
          {saving&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",borderRadius:"8px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"36px"}}>⚙️</div>
            <div style={{fontSize:"14px",fontWeight:"700",color:"white"}}>{saveStatus||"Processing..."}</div>
            <div style={{width:"100%",maxWidth:"240px",height:"8px",background:"rgba(255,255,255,0.12)",borderRadius:"4px",overflow:"hidden"}}>
              <div style={{height:"100%",background:"linear-gradient(90deg,#E8622A,#10A87C)",borderRadius:"4px",width:`${saveProgress}%`,transition:"width 0.4s"}}/>
            </div>
            <div style={{fontSize:"13px",color:"#E8622A",fontWeight:"700"}}>{saveProgress}%</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)"}}>Frame + Original Audio → WhatsApp ready MP4</div>
          </div>}
          {!saving&&<div style={{position:"absolute",bottom:"10px",left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.6)",padding:"4px 14px",borderRadius:"20px",fontSize:"10px",color:"rgba(255,255,255,0.55)",whiteSpace:"nowrap"}}>
            👆 Drag · Pinch to zoom
          </div>}
        </div>
      )}



      {/* Bottom controls */}
      <div style={{padding:"12px 18px 32px",flexDirection:"column",alignItems:"center",gap:"10px",flexShrink:0,display:saving?"none":"flex"}}>
        {err&&<div style={{color:"#FCA5A5",fontSize:"11px",textAlign:"center",padding:"7px 12px",background:"rgba(239,68,68,0.1)",borderRadius:"8px",width:"100%"}}>{err}</div>}

        {/* PICK phase */}
        {phase==="pick"&&(
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"10px"}}>
            <div style={{textAlign:"center",marginBottom:"6px"}}>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.5)"}}>
                {isPhoto?"Photo lein ya gallery se choose karein":"Video record karein ya gallery se choose karein"}
              </div>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.25)",marginTop:"3px"}}>Native camera · Full quality · No zoom issues</div>
            </div>
            <button onClick={()=>nativeCamRef.current.click()}
              style={{width:"100%",background:"#E8622A",color:"white",border:"none",borderRadius:"13px",padding:"16px",fontSize:"15px",fontWeight:"700",cursor:"pointer",boxShadow:"0 6px 20px rgba(232,98,42,0.35)"}}>
              {isPhoto?"📸 Camera से Photo लें":"🎥 Camera से Video Record करें"}
            </button>
            <button onClick={()=>galleryRef.current.click()}
              style={{width:"100%",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>
              🖼 Gallery से चुनें
            </button>
            <input ref={nativeCamRef} type="file" accept={acceptType} capture="environment" style={{display:"none"}} onChange={handleFile}/>
            <input ref={galleryRef}   type="file" accept={acceptType} style={{display:"none"}} onChange={handleFile}/>
          </div>
        )}

        {/* ADJUST phase */}
        {phase==="adjust"&&(
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"8px"}}>
            {/* Row 1: Zoom + Rotate */}
            <div style={{display:"flex",alignItems:"center",gap:"8px",justifyContent:"center"}}>
              <button onClick={()=>zoomBy(-0.15)} title="Zoom Out"
                style={{width:"40px",height:"40px",borderRadius:"10px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontSize:"20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"6px 14px",minWidth:"72px",textAlign:"center"}}>
                <span style={{fontSize:"13px",fontWeight:"700",color:"#E8622A"}}>{Math.round(scale*100)}%</span>
              </div>
              <button onClick={()=>zoomBy(0.15)} title="Zoom In"
                style={{width:"40px",height:"40px",borderRadius:"10px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontSize:"20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              <button onClick={rotateCW} title="Rotate 90°"
                style={{width:"40px",height:"40px",borderRadius:"10px",background:rotation!==0?"rgba(232,98,42,0.2)":"rgba(255,255,255,0.08)",border:`1px solid ${rotation!==0?"#E8622A":"rgba(255,255,255,0.15)"}`,color:rotation!==0?"#E8622A":"white",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↻</button>
              <button onClick={reset} title="Reset"
                style={{width:"40px",height:"40px",borderRadius:"10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontSize:"13px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↺</button>
            </div>
            {/* Row 2: D-Pad */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
              <button onClick={()=>moveBy(0,-1)}
                style={{width:"42px",height:"36px",borderRadius:"9px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"white",fontSize:"16px",cursor:"pointer"}}>▲</button>
              <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                <button onClick={()=>moveBy(-1,0)}
                  style={{width:"42px",height:"36px",borderRadius:"9px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"white",fontSize:"16px",cursor:"pointer"}}>◀</button>
                <div style={{width:"42px",height:"36px",borderRadius:"9px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"rgba(255,255,255,0.2)"}}>↕</div>
                <button onClick={()=>moveBy(1,0)}
                  style={{width:"42px",height:"36px",borderRadius:"9px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"white",fontSize:"16px",cursor:"pointer"}}>▶</button>
              </div>
              <button onClick={()=>moveBy(0,1)}
                style={{width:"42px",height:"36px",borderRadius:"9px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"white",fontSize:"16px",cursor:"pointer"}}>▼</button>
            </div>
            <button onClick={doSave}
              style={{width:"100%",background:"#E8622A",color:"white",border:"none",borderRadius:"13px",padding:"16px",fontSize:"15px",fontWeight:"700",cursor:"pointer",boxShadow:"0 6px 20px rgba(232,98,42,0.35)"}}>
              {mediaRef.current?.tagName==="VIDEO"?"✓ Save Video with Frame →":"✓ Save Photo with Frame →"}
            </button>
            <input ref={galleryRef} type="file" accept={acceptType} style={{display:"none"}} onChange={handleFile}/>
          </div>
        )}
      </div>
    </div>
  );
}


function BgSwatch({ style, selected, onClick }) {
  const isGrad = style.thumb.startsWith("linear");
  return (
    <div onClick={onClick} className="tap" style={{borderRadius:"12px",overflow:"hidden",border:`2.5px solid ${selected?"#10A87C":"#101E10"}`,cursor:"pointer",position:"relative",transition:"all 0.15s",boxShadow:selected?"0 0 0 2px rgba(16,168,124,0.35)":"none"}}>
      <div style={{width:"100%",paddingTop:"62%",background:isGrad?style.thumb:style.thumb,position:"relative"}}>
        {!isGrad&&<div style={{position:"absolute",inset:0,background:style.thumb}}/>}
      </div>
      <div style={{padding:"6px 4px",background:"#13131E",textAlign:"center"}}>
        <div style={{fontSize:"10px",color:selected?"#10A87C":"#1A5A1A",fontWeight:"600",lineHeight:1.2}}>{style.labelHi}</div>
      </div>
      {selected&&<div style={{position:"absolute",top:"5px",right:"5px",background:"#10A87C",color:"white",fontSize:"10px",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"800"}}>✓</div>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────
// No mock data — all data from Supabase
const AV_COLORS=["#E8622A","#10A87C","#8B5CF6","#EC4899","#F59E0B","#0EA5E9","#A78BFA","#14B8A6"];

export default function App() {
  const [screen,setScreen]=useState("home");
  const [name,setName]=useState(""); const [district,setDistrict]=useState(""); const [role,setRole]=useState("");
  const [mode,setMode]=useState(null); const [asana,setAsana]=useState(null);
  const [orientation,setOrientation]=useState("portrait");
  const [bgStyle,setBgStyle]=useState("dark");
  const [cat,setCat]=useState("All");
  const [captured,setCaptured]=useState(null);
  const [msg]=useState(randQuote);
  const [community,setCommunity]=useState([]);
  const [totalCount,setTotalCount]=useState(0);
  const [distStats,setDistStats]=useState({});
  const [loading,setLoading]=useState(true);
  const [joined,setJoined]=useState(false);
  const [waMsg,setWaMsg]=useState("");
  const [shareHint,setShareHint]=useState(false);
  const [sqFrame,setSqFrame]=useState(1);
  const [lsFrame,setLsFrame]=useState(1);
  const [ptFrame,setPtFrame]=useState(1);
  const [challenge,setChallenge]=useState(null);  // {days,startDate,done:[],badges:[],certNum}
  const [certUrl,setCertUrl]=useState(null);
  const certCanvasRef=useRef(null);
  const [installPrompt,setInstallPrompt]=useState(null);
  const [isInstalled,setIsInstalled]=useState(false);
  const [isIOS,setIsIOS]=useState(false);
  const [showIOSHint,setShowIOSHint]=useState(false);

  // PWA Install
  useEffect(()=>{
    const iOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
    setIsIOS(iOS);
    if(window.matchMedia('(display-mode: standalone)').matches) { setIsInstalled(true); return; }
    const handler=(e)=>{ e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return ()=>window.removeEventListener('beforeinstallprompt', handler);
  },[]);

  async function handleInstall(){
    if(installPrompt){ installPrompt.prompt(); const{outcome}=await installPrompt.userChoice; if(outcome==='accepted'){setIsInstalled(true);setInstallPrompt(null);} }
    else if(isIOS){ setShowIOSHint(true); }
  }

  async function loadCommunity() {
    setLoading(true);
    try {
      // ── Step 1: Get exact total count ──
      const countRes = await fetch(
        `${SUPABASE_URL}/rest/v1/yoga_participation?select=id`,
        { headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"count=exact","Range-Unit":"items","Range":"0-0"} }
      );
      let total = 0;
      if(countRes.ok){
        total = parseInt(countRes.headers.get("Content-Range")?.split("/")?.[1]||"0");
        if(total>0) setTotalCount(total);
      }

      // ── Step 2: Paginate in batches of 1000 (Supabase server limit) ──
      const BATCH = 1000;
      const allData = [];
      let offset = 0;
      while(true){
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/yoga_participation?select=*&order=created_at.desc`,
          { headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Range-Unit":"items","Range":`${offset}-${offset+BATCH-1}`} }
        );
        if(!res.ok) break;
        const batch = await res.json();
        if(!Array.isArray(batch)||batch.length===0) break;
        allData.push(...batch);
        if(batch.length < BATCH) break;   // last page
        offset += BATCH;
        if(offset >= 20000) break;         // safety cap
      }

      if(allData.length > 0){
        setCommunity(allData);
        if(allData.length > total) setTotalCount(allData.length);
        const dc={};
        allData.forEach(e=>{ if(e.district) dc[e.district]=(dc[e.district]||0)+1; });
        setDistStats(dc);
      }
    } catch(e){ console.error('Supabase fetch failed:',e); }
    setLoading(false);
  }

  useEffect(()=>{ loadCommunity(); },[]);

  function download(){
    if(!captured) return;
    const a=document.createElement("a");
    if(captured.type==="video"){
      a.href=captured.url||URL.createObjectURL(captured.blob);
      const ext=(captured.mime||"").includes("mp4")?"mp4":"webm";
      a.download=`YogaPath-IDY2026-${Date.now()}.${ext}`;
    } else {
      a.href=captured.url;
      a.download=`YogaPath-IDY2026-${Date.now()}.jpg`;
    }
    document.body.appendChild(a);a.click();document.body.removeChild(a);
  }
  async function shareWA(){
    const who=role?(name+" ("+role+")"):name;
    const what=mode==="message"?"Yoga Message":(asana?.name||"Yoga");
    const txt=waMsg.trim()||("12वाँ अन्तर्राष्ट्रीय योग दिवस 🙏\n\n🧘 "+who+"\n📍 "+district+", Uttarakhand\n🎯 "+what+"\n\n#YogaAt100Uttarakhand #IDY2026 #AYUSH");
    if(captured?.type==="video"){
      try{
        const mime=captured.mime||"video/mp4";
        const ext=mime.includes("mp4")?"mp4":"webm";
        const a=document.createElement("a");
        a.href=captured.url||URL.createObjectURL(captured.blob);
        a.download="YogaPath-IDY2026."+ext;
        document.body.appendChild(a);a.click();document.body.removeChild(a);
      }catch(e){}
      setShareHint(true);
      return;
    }
    try{
      let file=null;
      if(captured?.url){
        const res=await fetch(captured.url);
        const blob=await res.blob();
        file=new File([blob],"YogaPath-IDY2026.jpg",{type:"image/jpeg"});
      }
      if(file&&navigator.share){ await navigator.share({files:[file],text:txt}); return; }
    }catch(e){ if(e?.name==="AbortError") return; }
    window.open("https://wa.me/?text="+encodeURIComponent(txt),"_blank");
  }
  // ── Challenge helpers ──────────────────────────────────────────────────
  function makeCertNum(name,district){
    let h=0; const s=name+district+Date.now();
    for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}
    return "YP"+(Math.abs(h)%900000+100000);
  }

  async function loadChallenge(nm,dist){
    const key=`challenge_${(nm||"").replace(/\s/g,"_")}_${(dist||"").replace(/\s/g,"_")}`;
    try{const r=await window.storage.get(key);if(r?.value) setChallenge(JSON.parse(r.value));}catch{}
  }

  async function saveChallenge(data,nm,dist){
    const key=`challenge_${(nm||"").replace(/\s/g,"_")}_${(dist||"").replace(/\s/g,"_")}`;
    try{await window.storage.set(key,JSON.stringify(data));}catch{}
    // Sync to Supabase
    if(SUPABASE_URL.includes(".supabase.co")){
      try{
        await fetch(`${SUPABASE_URL}/rest/v1/yoga_challenge`,{
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"resolution=merge-duplicates"},
          body:JSON.stringify({user_key:key,name:nm,district:dist,challenge_days:data.days,completed_days:data.done,badges:data.badges,last_checkin:data.lastCheckin,cert_generated:data.certGenerated||false})
        });
      }catch{}
    }
  }

  function startChallenge(days){
    const data={days,startDate:new Date().toISOString().split("T")[0],done:[],badges:["starter"],lastCheckin:null,certGenerated:false,certNum:makeCertNum(name,district)};
    setChallenge(data); saveChallenge(data,name,district); setScreen("tracker");
  }

  async function markDone(){
    if(!challenge) return;
    const today=new Date().toISOString().split("T")[0];
    if(challenge.lastCheckin===today) return; // already done
    const day=challenge.done.length+1;
    const newDone=[...challenge.done,day];
    // Check badges
    const earned=[...challenge.badges];
    BADGES.forEach(b=>{ if(b.day===day&&!earned.includes(b.id)) earned.push(b.id); });
    const certDone=(day>=challenge.days);
    const updated={...challenge,done:newDone,badges:earned,lastCheckin:today,certGenerated:certDone};
    setChallenge(updated); await saveChallenge(updated,name,district);
    if(certDone) setScreen("certificate");
  }

  function generateCert(){
    if(!certCanvasRef.current||!challenge) return;
    const today=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    drawCertificate(certCanvasRef.current,{name,district,days:challenge.days,completedDate:today,certNum:challenge.certNum});
    setCertUrl(certCanvasRef.current.toDataURL("image/jpeg",0.95));
  }

  function downloadCert(){
    if(!certUrl) return;
    const a=document.createElement("a"); a.href=certUrl; a.download=`YogaPath-Certificate-${name.replace(/\s/g,"-")}.jpg`; a.click();
  }

  async function joinWall(){
    await loadChallenge(name,district);
    const ok = await logToSupabase({name,district,role,mode,asana:asana?.name,participated_on:new Date().toISOString().split("T")[0]});
    setJoined(true);
    if(ok) { await loadCommunity(); }
    else { const upd=[{id:Date.now(),name,district,role,mode,asana:asana?.name,date:new Date().toISOString().split("T")[0]},...community]; setCommunity(upd); }
    setScreen("community");
  }

  const filtered=cat==="All"?ASANAS:ASANAS.filter(a=>a.category===cat);
  const modeObj=MODES.find(m=>m.id===mode);

  return (
    <>
      <style>{css}</style>

      {/* ── HOME ── */}
            {screen==="home"&&(
        <div className="page fade" style={{minHeight:"100vh",background:"#09090F",display:"flex",flexDirection:"column",padding:"0 0 32px"}}>
          {/* Decorative glow blobs */}
          <div style={{position:"fixed",top:"-80px",right:"-80px",width:"260px",height:"260px",borderRadius:"50%",background:"rgba(232,98,42,0.08)",filter:"blur(60px)",pointerEvents:"none",zIndex:0}}/>
          <div style={{position:"fixed",bottom:"20%",left:"-60px",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(16,168,124,0.06)",filter:"blur(50px)",pointerEvents:"none",zIndex:0}}/>

          <div style={{position:"relative",zIndex:1,flex:1,display:"flex",flexDirection:"column",padding:"52px 24px 0"}}>
            {/* Badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"rgba(232,98,42,0.1)",border:"1px solid rgba(232,98,42,0.2)",color:"#E8622A",fontSize:"10px",fontWeight:"700",letterSpacing:"2px",padding:"6px 14px",borderRadius:"20px",marginBottom:"28px",alignSelf:"flex-start"}}>
              <span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#E8622A",display:"inline-block"}}/>
              AYUSH UTTARAKHAND  ·  IDY 2026
            </div>

            {/* Title */}
            <div style={{marginBottom:"20px"}}>
              <h1 style={{fontSize:"52px",fontWeight:"900",lineHeight:1.0,letterSpacing:"-2px",color:"#FFFFFF",margin:0}}>
                Yoga<span style={{color:"#E8622A"}}>Path</span>
              </h1>
              <p style={{fontSize:"20px",fontWeight:"300",color:"rgba(255,255,255,0.4)",letterSpacing:"2px",marginTop:"4px"}}>UTTARAKHAND</p>
            </div>

            <p style={{color:"rgba(255,255,255,0.38)",fontSize:"14px",marginBottom:"32px",lineHeight:1.7}}>
              अपना योगाभ्यास एक सुंदर AYUSH फ्रेम में<br/>विश्व के साथ साझा करें 🙏
            </p>

            {/* Stats row */}
            <div style={{display:"flex",gap:"10px",marginBottom:"32px"}}>
              {[{v:(totalCount||community.length)+"+",l:"Yogis",c:"#E8622A"},{v:"13",l:"Districts",c:"#10A87C"},{v:"15",l:"Frames",c:"#8B5CF6"}].map(s=>(
                <div key={s.l} style={{flex:1,background:"#13131E",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"14px",padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontSize:"20px",fontWeight:"800",color:s.c}}>{s.v}</div>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)",marginTop:"3px"}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"32px"}}>
              {/* Yoga Frame — main feature */}
              <div className="tap" onClick={()=>setScreen("onboard")} style={{background:"#13131E",border:"1px solid rgba(232,98,42,0.25)",borderRadius:"18px",padding:"18px",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                  <div style={{width:"46px",height:"46px",borderRadius:"13px",background:"rgba(232,98,42,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>🖼️</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",fontSize:"16px",color:"#fff",marginBottom:"3px"}}>Yoga Frame <span style={{fontSize:"12px",color:"rgba(255,255,255,0.35)",fontWeight:"400"}}>· योग फ्रेम</span></div>
                    <div style={{color:"rgba(255,255,255,0.4)",fontSize:"12px"}}>Photo · Video · Yoga Message — AYUSH branded</div>
                  </div>
                  <div style={{color:"#E8622A",fontSize:"18px"}}>→</div>
                </div>
                <div style={{display:"flex",gap:"6px",marginTop:"12px"}}>
                  {MODES.map(m=><div key={m.id} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"8px",padding:"5px 10px",fontSize:"10px",color:"rgba(255,255,255,0.45)",display:"flex",alignItems:"center",gap:"5px"}}><span>{m.icon}</span><span>{m.titleHi}</span></div>)}
                </div>
              </div>

              {/* Second row */}
              <div style={{display:"flex",gap:"10px"}}>
                <div className="tap" onClick={()=>setScreen("community")} style={{flex:1,background:"#13131E",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px",cursor:"pointer"}}>
                  <div style={{fontSize:"24px",marginBottom:"8px"}}>🗺️</div>
                  <div style={{fontWeight:"700",fontSize:"14px",color:"#fff",marginBottom:"3px"}}>District Wall</div>
                  <div style={{color:"rgba(16,168,124,0.8)",fontSize:"11px",fontWeight:"600"}}>{(totalCount||community.length)} entries</div>
                </div>
                <div className="tap" onClick={()=>name?setScreen("challenge"):setScreen("onboard")} style={{flex:1,background:"#13131E",border:"1px solid rgba(139,92,246,0.25)",borderRadius:"16px",padding:"16px",cursor:"pointer"}}>
                  <div style={{fontSize:"24px",marginBottom:"8px"}}>🔥</div>
                  <div style={{fontWeight:"700",fontSize:"14px",color:"#fff",marginBottom:"3px"}}>21-Day Streak</div>
                  <div style={{color:"rgba(139,92,246,0.8)",fontSize:"11px",fontWeight:"600"}}>{challenge?`Day ${challenge.done.length}/${challenge.days}`:"Start Challenge"}</div>
                </div>
              </div>
            </div>

            {/* Install banner */}
            {!isInstalled&&(
              <div className="tap" onClick={handleInstall} style={{background:"rgba(16,168,124,0.07)",border:"1px solid rgba(16,168,124,0.18)",borderRadius:"14px",padding:"14px 16px",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer",marginBottom:"16px"}}>
                <span style={{fontSize:"20px"}}>📲</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"600",fontSize:"13px",color:"#10A87C"}}>App Install करें</div>
                  <div style={{color:"rgba(255,255,255,0.35)",fontSize:"11px",marginTop:"1px"}}>{isIOS?"Safari → Share → Add to Home Screen":"Home Screen पर add करें"}</div>
                </div>
                <span style={{color:"rgba(16,168,124,0.6)",fontSize:"16px"}}>→</span>
              </div>
            )}
            {showIOSHint&&(
              <div style={{background:"#13131E",border:"1px solid rgba(16,168,124,0.25)",borderRadius:"12px",padding:"14px",marginBottom:"16px",position:"relative"}}>
                <button onClick={()=>setShowIOSHint(false)} style={{position:"absolute",top:"8px",right:"10px",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"18px",cursor:"pointer"}}>✕</button>
                <div style={{fontWeight:"700",fontSize:"13px",color:"#10A87C",marginBottom:"10px"}}>iPhone पर Install:</div>
                <div style={{color:"rgba(255,255,255,0.55)",fontSize:"13px",lineHeight:1.8}}>
                  <div>1️⃣ Share button (□↑) दबाएं</div>
                  <div>2️⃣ "Add to Home Screen" चुनें</div>
                  <div>3️⃣ "Add" tap करें 🎉</div>
                </div>
              </div>
            )}
            {isInstalled&&(
              <div style={{background:"rgba(16,168,124,0.06)",border:"1px solid rgba(16,168,124,0.15)",borderRadius:"12px",padding:"11px 16px",display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
                <span style={{fontSize:"16px"}}>✅</span>
                <span style={{color:"rgba(255,255,255,0.45)",fontSize:"12px"}}>App installed — offline भी काम करेगा</span>
              </div>
            )}

            {/* Footer */}
            <div style={{textAlign:"center",paddingTop:"8px"}}>
              <div style={{color:"rgba(255,255,255,0.15)",fontSize:"11px"}}>Dept. of Ayurvedic & Unani Services · National AYUSH Mission, Uttarakhand</div>
            </div>
          </div>
        </div>
      )}

{screen==="onboard"&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"14px"}}>
            <button className="back" onClick={()=>setScreen("home")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{color:"rgba(255,255,255,0.38)",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 1 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>Your Profile</div></div>
          </div>
          <div className="prog"><div className="pfill" style={{width:"25%"}}/></div>
          <h2 style={{fontSize:"26px",fontWeight:"800",marginBottom:"6px"}}>Namaste 🙏</h2>
          <p style={{color:"rgba(255,255,255,0.38)",fontSize:"14px",marginBottom:"32px",fontWeight:"300"}}>This appears on your frame</p>
          <div style={{marginBottom:"20px"}}><label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Name</label><input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="पूरा नाम" style={name?{borderColor:"#10A87C"}:{}}/></div>
          <div style={{marginBottom:"20px"}}><label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>District</label>
            <select className="inp" value={district} onChange={e=>setDistrict(e.target.value)} style={district?{borderColor:"#10A87C",colorScheme:"dark"}:{colorScheme:"dark"}}><option value="">जिला चुनें</option>{DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}</select>
          </div>
          <div style={{marginBottom:"44px"}}>
            <label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Designation <span style={{color:"#E8622A",letterSpacing:"0px",textTransform:"none",fontSize:"12px"}}>(पदनाम)</span></label>
            <input className="inp" value={role} onChange={e=>setRole(e.target.value)}
              placeholder="अपना पदनाम लिखें — DM, MLA, Gram Pradhan, AYUSH Doctor..."
              style={role?{borderColor:"#10A87C"}:{}}/>
            <div style={{marginTop:"8px",display:"flex",flexWrap:"wrap",gap:"6px"}}>
              {["DM","MLA","Gram Pradhan","AYUSH Doctor","Yoga Instructor","General Public"].map(s=>(
                <div key={s} onClick={()=>setRole(s)} className="tap"
                  style={{background:role===s?"rgba(16,168,124,0.15)":"#0A120A",border:`1px solid ${role===s?"#10A87C":"#101E10"}`,
                  borderRadius:"20px",padding:"5px 12px",fontSize:"12px",color:role===s?"#10A87C":"#1A5A1A",cursor:"pointer"}}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <button className="tap" onClick={()=>{if(name.trim()&&district&&role) setScreen("modeSelect");}} style={{width:"100%",background:name&&district&&role?"linear-gradient(135deg,#E8622A,#C44E1A)":"#0C150C",color:name&&district&&role?"white":"#1A3A1A",border:"none",borderRadius:"16px",padding:"17px",fontSize:"16px",fontWeight:"700",cursor:name&&district&&role?"pointer":"not-allowed",boxShadow:name&&district&&role?"0 8px 22px rgba(232,98,42,0.3)":"none",transition:"all 0.3s"}}>
            Continue →
          </button>
        </div>
      )}

      {/* ── MODE SELECT ── */}
      {screen==="modeSelect"&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"14px"}}>
            <button className="back" onClick={()=>setScreen("onboard")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{color:"rgba(255,255,255,0.38)",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 2 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>What to Create</div></div>
          </div>
          <div className="prog"><div className="pfill" style={{width:"50%"}}/></div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"14px",padding:"12px 16px",marginBottom:"24px",display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:"700",fontSize:"13px",flexShrink:0}}>{getInitials(name)}</div>
            <div><div style={{fontWeight:"700",fontSize:"14px"}}>{name}</div><div style={{color:"rgba(16,168,124,0.75)",fontSize:"12px"}}>{role} · 📍 {district}</div></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {MODES.map(m=>{const sel=mode===m.id;return(
              <div key={m.id} className="tap" onClick={()=>setMode(m.id)} style={{background:sel?`rgba(${hexToRgb(m.color)},0.1)`:"#0A120A",border:`2px solid ${sel?m.color:"#101E10"}`,borderRadius:"16px",padding:"18px",cursor:"pointer",boxShadow:sel?`0 4px 20px rgba(${hexToRgb(m.color)},0.2)`:"none",transition:"all 0.18s"}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                  <div style={{width:"48px",height:"48px",borderRadius:"12px",background:`rgba(${hexToRgb(m.color)},0.1)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",flexShrink:0}}>{m.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"700",fontSize:"16px",marginBottom:"3px"}}>{m.title} <span style={{fontWeight:"300",color:"rgba(255,255,255,0.38)",fontSize:"13px"}}>· {m.titleHi}</span></div><div style={{color:"rgba(16,168,124,0.75)",fontSize:"13px"}}>{m.desc}</div></div>
                  {sel&&<div style={{color:m.color,fontSize:"18px",flexShrink:0}}>✓</div>}
                </div>
                {m.id==="message"&&<div style={{marginTop:"10px",padding:"9px 11px",background:"rgba(255,255,255,0.025)",borderRadius:"9px",color:"rgba(255,255,255,0.38)",fontSize:"11px",lineHeight:1.5}}>📢 DM, MLA, Gram Pradhan, AAM Doctor — सभी रिकॉर्ड कर सकते हैं</div>}
              </div>
            );})}
          </div>
          {mode&&<div style={{position:"fixed",bottom:0,left:0,right:0,padding:"12px 18px 22px",background:"linear-gradient(0deg,#060909 85%,transparent)"}}>
            <button className="tap" onClick={()=>setScreen(mode==="message"?"frameStyle":"asanaSelect")} style={{width:"100%",background:`linear-gradient(135deg,${modeObj?.color},${modeObj?.color}BB)`,color:"white",border:"none",borderRadius:"14px",padding:"16px",fontSize:"16px",fontWeight:"700",cursor:"pointer",boxShadow:`0 5px 20px rgba(${hexToRgb(modeObj?.color||"#E8622A")},0.32)`}}>
              {mode==="message"?"Choose Frame Style →":"Choose Asana →"}
            </button>
          </div>}
        </div>
      )}

      {/* ── ASANA SELECT ── */}
      {screen==="asanaSelect"&&(
        <div className="page fade">
          <div style={{padding:"28px 24px 0",display:"flex",alignItems:"center"}}>
            <button className="back" onClick={()=>setScreen("modeSelect")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{color:"rgba(255,255,255,0.38)",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 3 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>Choose Asana</div></div>
          </div>
          <div style={{padding:"12px 24px 0"}}><div className="prog"><div className="pfill" style={{width:"75%"}}/></div></div>
          <div className="scroll-hide" style={{display:"flex",gap:"8px",padding:"0 22px 14px",overflowX:"auto"}}>
            {CATEGORIES.map(c=><button key={c} onClick={()=>setCat(c)} style={{whiteSpace:"nowrap",padding:"7px 14px",borderRadius:"20px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",background:cat===c?"linear-gradient(135deg,#E8622A,#C44E1A)":"#0A140A",color:cat===c?"white":"#1A5A1A"}}>{c}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px",padding:"0 16px",paddingBottom:asana?"140px":"24px"}}>
            {filtered.map(a=>{const sel=asana?.id===a.id;return(
              <div key={a.id} className="tap" onClick={()=>setAsana(a)} style={{background:sel?`rgba(${hexToRgb(a.color)},0.1)`:"#09120A",border:`2px solid ${sel?a.color:"#101E10"}`,borderRadius:"16px",padding:"16px",cursor:"pointer",boxShadow:sel?`0 4px 20px rgba(${hexToRgb(a.color)},0.22)`:"none",transition:"all 0.18s"}}>
                <div style={{fontSize:"36px",marginBottom:"8px"}}>{a.icon}</div>
                <div style={{fontWeight:"700",fontSize:"14px",marginBottom:"3px"}}>{a.name}</div>
                <div style={{color:"rgba(16,168,124,0.75)",fontSize:"12px",marginBottom:"7px"}}>{a.sanskrit}</div>
                <div style={{display:"inline-block",background:`rgba(${hexToRgb(a.color)},0.1)`,color:a.color,fontSize:"10px",fontWeight:"700",padding:"2px 9px",borderRadius:"8px"}}>{a.category}</div>
              </div>
            );})}
          </div>
          {asana&&<div style={{position:"fixed",bottom:0,left:0,right:0,padding:"12px 16px 22px",background:"linear-gradient(0deg,#060909 85%,transparent)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",background:"#13131E",borderRadius:"13px",padding:"11px 14px",marginBottom:"10px",border:`1px solid ${asana.color}22`}}>
              <span style={{fontSize:"22px"}}>{asana.icon}</span>
              <div><div style={{fontWeight:"700",fontSize:"13px"}}>{asana.name}</div><div style={{color:"rgba(16,168,124,0.75)",fontSize:"11px"}}>{asana.description}</div></div>
            </div>
            <button className="tap" onClick={()=>setScreen("frameStyle")} style={{width:"100%",background:`linear-gradient(135deg,${asana.color},${asana.color}BB)`,color:"white",border:"none",borderRadius:"13px",padding:"15px",fontSize:"15px",fontWeight:"700",cursor:"pointer",boxShadow:`0 5px 18px rgba(${hexToRgb(asana.color)},0.32)`}}>Choose Frame Style →</button>
          </div>}
        </div>
      )}

      {/* ── FRAME STYLE (Orientation + Background) ── */}
      {screen==="frameStyle"&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"14px"}}>
            <button className="back" onClick={()=>setScreen(mode==="message"?"modeSelect":"asanaSelect")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{color:"rgba(255,255,255,0.38)",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 4 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>Frame Style</div></div>
          </div>
          <div className="prog"><div className="pfill" style={{width:"100%"}}/></div>

          {/* Orientation */}
          <div style={{marginBottom:"28px"}}>
            <label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Orientation / ओरिएंटेशन</label>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {ORIENTATIONS.map(o=>{const sel=orientation===o.id;return(
                <div key={o.id} className="tap" onClick={()=>setOrientation(o.id)} style={{background:sel?"rgba(16,168,124,0.08)":"#0A120A",border:`2px solid ${sel?"#10A87C":"#101E10"}`,borderRadius:"14px",padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"14px",transition:"all 0.15s"}}>
                  <span style={{fontSize:"22px"}}>{o.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",fontSize:"14px"}}>{o.label} <span style={{color:"rgba(16,168,124,0.75)",fontWeight:"400",fontSize:"13px"}}>· {o.labelHi}</span></div>
                    <div style={{color:"rgba(16,168,124,0.75)",fontSize:"12px",marginTop:"2px"}}>{o.desc}</div>
                    <div style={{color:"#0F3A0F",fontSize:"11px",marginTop:"2px"}}>{o.w}×{o.h}px</div>
                  </div>
                  {sel&&<div style={{color:"#10A87C",fontWeight:"700",fontSize:"16px"}}>✓</div>}
                </div>
              );})}
            </div>
          </div>

          {/* Background */}
          <div style={{marginBottom:"36px"}}>
            {orientation==="square" ? (
              <>
                <label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Frame Design चुनें</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                  {[1,2,3,4,5].map(i=>(
                    <div key={i} className="tap" onClick={()=>setSqFrame(i)} style={{borderRadius:"12px",overflow:"hidden",border:`2.5px solid ${sqFrame===i?"#10A87C":"#101E10"}`,cursor:"pointer",position:"relative",boxShadow:sqFrame===i?"0 0 0 2px rgba(16,168,124,0.3)":"none",transition:"all 0.15s"}}>
                      <img src={`/frames/frame-sq-${i}.png`} alt={`Frame ${i}`} style={{width:"100%",display:"block"}} loading="lazy"/>
                      {sqFrame===i&&<div style={{position:"absolute",top:"6px",right:"6px",background:"#10A87C",color:"white",fontSize:"10px",fontWeight:"800",width:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✓</div>}
                      <div style={{padding:"5px 4px",background:"#13131E",textAlign:"center",fontSize:"10px",color:sqFrame===i?"#10A87C":"#1A5A1A",fontWeight:"600"}}>Design {i}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:"10px",padding:"10px 12px",background:"rgba(16,168,124,0.04)",border:"1px solid rgba(16,168,124,0.12)",borderRadius:"10px",fontSize:"11px",color:"rgba(255,255,255,0.38)",lineHeight:1.5}}>
                  📸 Photo/Video frame ke center में आएगी · नाम, पद और जिला नीचे overlay होगा
                </div>
              </>
            ) : orientation==="portrait" ? (
              <>
                <label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Frame Design चुनें</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                  {[1,2,3,4,5].map(i=>(
                    <div key={i} className="tap" onClick={()=>setPtFrame(i)} style={{borderRadius:"12px",overflow:"hidden",border:`2.5px solid ${ptFrame===i?"#10A87C":"#101E10"}`,cursor:"pointer",position:"relative",boxShadow:ptFrame===i?"0 0 0 2px rgba(16,168,124,0.3)":"none",transition:"all 0.15s"}}>
                      <img src={`/frames/frame-pt-${i}.png`} alt={`Frame ${i}`} style={{width:"100%",display:"block"}} loading="lazy"/>
                      {ptFrame===i&&<div style={{position:"absolute",top:"6px",right:"6px",background:"#10A87C",color:"white",fontSize:"10px",fontWeight:"800",width:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✓</div>}
                      <div style={{padding:"5px 4px",background:"#13131E",textAlign:"center",fontSize:"10px",color:ptFrame===i?"#10A87C":"#1A5A1A",fontWeight:"600"}}>Design {i}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : orientation==="landscape" ? (
              <>
                <label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Frame Design चुनें</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                  {[1,2,3,4,5].map(i=>(
                    <div key={i} className="tap" onClick={()=>setLsFrame(i)} style={{borderRadius:"12px",overflow:"hidden",border:`2.5px solid ${lsFrame===i?"#10A87C":"#101E10"}`,cursor:"pointer",position:"relative",boxShadow:lsFrame===i?"0 0 0 2px rgba(16,168,124,0.3)":"none",transition:"all 0.15s"}}>
                      <img src={`/frames/frame-ls-${i}.png`} alt={`Frame ${i}`} style={{width:"100%",display:"block"}} loading="lazy"/>
                      {lsFrame===i&&<div style={{position:"absolute",top:"6px",right:"6px",background:"#10A87C",color:"white",fontSize:"10px",fontWeight:"800",width:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✓</div>}
                      <div style={{padding:"5px 4px",background:"#13131E",textAlign:"center",fontSize:"10px",color:lsFrame===i?"#10A87C":"#1A5A1A",fontWeight:"600"}}>Design {i}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label style={{display:"block",color:"rgba(16,168,124,0.75)",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Background / बैकग्राउंड</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                  {BG_STYLES.map(b=><BgSwatch key={b.id} style={b} selected={bgStyle===b.id} onClick={()=>setBgStyle(b.id)}/>)}
                </div>
              </>
            )}
          </div>

          <button className="tap" onClick={()=>setScreen("camera")} style={{width:"100%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"16px",padding:"17px",fontSize:"16px",fontWeight:"700",cursor:"pointer",boxShadow:"0 8px 22px rgba(232,98,42,0.32)"}}>
            Open Camera →
          </button>
        </div>
      )}

      {/* ── CAMERA ── */}
      {screen==="camera"&&<CameraScreen mode={mode} asana={asana} name={name} district={district} role={role} msg={msg} bgStyle={bgStyle} orientation={orientation} sqFrame={sqFrame} lsFrame={lsFrame} ptFrame={ptFrame} onCapture={d=>{setCaptured(d);setScreen("preview");}} onBack={()=>setScreen("frameStyle")}/>}

      {/* ── PREVIEW ── */}
      {screen==="preview"&&captured&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"22px"}}>
            <button className="back" onClick={()=>setScreen("camera")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{fontSize:"20px",fontWeight:"700"}}>YogaPath Frame ✨</div><div style={{color:"rgba(16,168,124,0.75)",fontSize:"12px",fontWeight:"300"}}>AYUSH frame baked in · {BG_STYLES.find(b=>b.id===bgStyle)?.labelHi} · {ORIENTATIONS.find(o=>o.id===orientation)?.label}</div></div>
          </div>
          {captured.type==="photo"
            ? <div style={{borderRadius:"18px",overflow:"hidden",marginBottom:"22px",boxShadow:"0 18px 56px rgba(0,0,0,0.7)"}}><img src={captured.url} alt="frame" style={{width:"100%",display:"block",borderRadius:"18px"}}/></div>
            : <div style={{borderRadius:"18px",overflow:"hidden",marginBottom:"22px",boxShadow:"0 18px 56px rgba(0,0,0,0.7)",background:"#000"}}><video src={captured.url} controls playsInline style={{width:"100%",display:"block",borderRadius:"18px",maxHeight:"460px",objectFit:"contain"}}/></div>
          }
          <div style={{background:"rgba(16,168,124,0.05)",border:"1px solid rgba(16,168,124,0.12)",borderRadius:"11px",padding:"10px 14px",marginBottom:"18px",fontSize:"11px",color:"rgba(16,168,124,0.75)",lineHeight:1.5}}>
            🔒 Media saved <strong style={{color:"#10A87C"}}>only on your device</strong> — nothing uploaded to any server
          </div>
                    {/* Custom WhatsApp message editor */}
          <div style={{marginBottom:"10px"}}>
            <div style={{fontSize:"10px",color:"rgba(16,168,124,0.8)",fontWeight:"700",letterSpacing:"1.5px",marginBottom:"5px"}}>✏️ WHATSAPP MESSAGE</div>
            <textarea
              value={waMsg} onChange={e=>setWaMsg(e.target.value)}
              placeholder={"🕉 "+name+"\n📍 "+district+", Uttarakhand\n🧘 "+(asana?.name||"Yoga")+"\n\n#YogaAt100Uttarakhand #IDY2026 #AYUSH"}
              rows={3}
              style={{width:"100%",background:"#13131E",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px",color:"rgba(255,255,255,0.75)",fontSize:"12px",fontFamily:"'Sora',sans-serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.6}}
            />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
            <button className="tap" onClick={download} style={{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 3px 14px rgba(5,150,105,0.28)"}}>⬇ Download</button>
            <button className="tap" onClick={shareWA} style={{background:"linear-gradient(135deg,#25D366,#1DAB52)",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 3px 14px rgba(37,211,102,0.28)"}}>📤 WhatsApp</button>
          </div>
                    {!joined
            ? <button className="tap" onClick={joinWall} style={{width:"100%",background:"#E8622A",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"15px",fontWeight:"700",cursor:"pointer",marginBottom:"10px",boxShadow:"0 6px 20px rgba(232,98,42,0.3)"}}>🌟 Add to District Wall →</button>
            : <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(16,168,124,0.08)",border:"1px solid rgba(16,168,124,0.2)",borderRadius:"12px",padding:"12px 16px",marginBottom:"10px"}}><span style={{fontSize:"18px"}}>✅</span><span style={{color:"#10A87C",fontSize:"14px",fontWeight:"600"}}>District Wall में जोड़ा गया</span></div>
          }
          {shareHint&&(
            <div style={{background:"rgba(16,168,124,0.08)",border:"1px solid rgba(16,168,124,0.2)",borderRadius:"12px",padding:"12px 16px",marginBottom:"8px",display:"flex",gap:"10px",alignItems:"flex-start"}}>
              <span style={{fontSize:"20px",flexShrink:0}}>📲</span>
              <div>
                <div style={{fontSize:"12px",fontWeight:"700",color:"#10A87C",marginBottom:"3px"}}>Video download ho gayi!</div>
                <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>Gallery खोलें → Video select करें → Share → WhatsApp चुनें</div>
              </div>
            </div>
          )}
          <button onClick={()=>setScreen("community")} style={{width:"100%",background:"transparent",color:"rgba(255,255,255,0.35)",border:"none",padding:"10px",fontSize:"12px",cursor:"pointer"}}>View District Wall →</button>
        </div>
      )}

      {/* ── COMMUNITY WALL ── */}
      {screen==="community"&&(()=>{
        const dc={...distStats};
        community.forEach(c=>{if(c.district) dc[c.district]=(dc[c.district]||0)+1;});
        const sorted=Object.entries(dc).sort((a,b)=>b[1]-a[1]);
        const mc={photo:0,yoga_video:0,message:0};community.forEach(c=>{if(c.mode) mc[c.mode]=(mc[c.mode]||0)+1;});
        return(
          <div className="page fade">
            <div style={{background:"linear-gradient(180deg,#060F06,#060909)",padding:"28px 24px 18px"}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:"20px"}}>
                <button className="back" onClick={()=>setScreen(joined?"preview":"splash")}>←</button>
                 <div style={{marginLeft:"14px"}}><div style={{fontSize:"21px",fontWeight:"800"}}>District Wall 🗺️</div><div style={{color:"rgba(16,168,124,0.75)",fontSize:"12px",fontWeight:"300"}}>Yoga @ 100 Uttarakhand · IDY 2026</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px",marginBottom:"10px"}}>
                {[{val:community.length,label:"Total Entries",color:"#E8622A"},{val:sorted.filter(d=>d[1]>0).length,label:"Districts Active",color:"#10A87C"}].map(({val,label,color})=>(
                  <div key={label} style={{background:"#13131E",borderRadius:"12px",padding:"12px",textAlign:"center",border:`1px solid ${color}16`}}><div style={{color,fontSize:"24px",fontWeight:"800"}}>{val}</div><div style={{color:"rgba(255,255,255,0.3)",fontSize:"10px",marginTop:"2px"}}>{label}</div></div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
                {MODES.map(m=><div key={m.id} style={{background:"#13131E",borderRadius:"10px",padding:"8px",textAlign:"center",border:`1px solid ${m.color}14`}}><div style={{fontSize:"18px"}}>{m.icon}</div><div style={{color:m.color,fontWeight:"700",fontSize:"16px"}}>{mc[m.id]||0}</div><div style={{color:"rgba(255,255,255,0.3)",fontSize:"10px"}}>{m.titleHi}</div></div>)}
              </div>
            </div>
            <div style={{padding:"14px 20px"}}>
              <div style={{marginBottom:"22px"}}>
                <div style={{color:"rgba(16,168,124,0.75)",fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"10px"}}>District Breakdown</div>
                {sorted.slice(0,13).map(([dist,count])=>{const maxV=sorted[0]?.[1]||1;return(
                  <div key={dist} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"7px"}}>
                    <div style={{width:"118px",fontSize:"11px",color:"rgba(16,168,124,0.8)",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dist}</div>
                    <div style={{flex:1,background:"#13131E",borderRadius:"4px",height:"7px",overflow:"hidden"}}>
                      <div style={{width:`${(count/maxV)*100}%`,height:"100%",background:"linear-gradient(90deg,#E8622A,#10A87C)",borderRadius:"4px"}}/>
                    </div>
                    <div style={{width:"20px",fontSize:"11px",color:"#E8622A",fontWeight:"700",flexShrink:0}}>{count}</div>
                  </div>
                );})}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
                <div style={{color:"rgba(16,168,124,0.75)",fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>Recent Entries</div>
                <button onClick={loadCommunity} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(16,168,124,0.75)",borderRadius:"8px",padding:"4px 10px",fontSize:"11px",cursor:"pointer"}}>↻ Refresh</button>
              </div>
              {loading&&<div style={{textAlign:"center",padding:"32px",color:"rgba(255,255,255,0.38)"}}><div style={{fontSize:"28px",marginBottom:"8px"}}>⏳</div><div style={{fontSize:"13px"}}>Loading...</div></div>}
              {!loading&&community.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"rgba(255,255,255,0.3)"}}><div style={{fontSize:"36px",marginBottom:"12px"}}>🧘</div><div style={{fontWeight:"600",fontSize:"15px",marginBottom:"6px"}}>अभी कोई entry नहीं</div><div style={{fontSize:"13px"}}>पहले Yoga Frame बनाएं और District Wall join करें</div></div>}
              {community.slice(0,20).map((entry,i)=>{
                const isMe=entry.name===name&&entry.district===district;
                const mO=MODES.find(m=>m.id===entry.mode);
                const aO=ASANAS.find(a=>a.name===entry.asana);
                const color=AV_COLORS[i%AV_COLORS.length];
                return(
                  <div key={entry.id||i} style={{display:"flex",alignItems:"center",gap:"11px",background:isMe?"rgba(232,98,42,0.05)":"#090F09",border:`1px solid ${isMe?"rgba(232,98,42,0.25)":"#0B180B"}`,borderRadius:"13px",padding:"11px 13px",marginBottom:"8px"}}>
                    <div style={{width:"40px",height:"40px",borderRadius:"50%",background:`linear-gradient(135deg,${color},${color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:"700",fontSize:"13px",flexShrink:0}}>{getInitials(entry.name)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"5px"}}><span style={{fontWeight:"700",fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.name}</span>{isMe&&<span style={{background:"#E8622A",color:"white",fontSize:"9px",fontWeight:"800",padding:"2px 6px",borderRadius:"5px",flexShrink:0}}>YOU</span>}</div>
                      {entry.role&&<div style={{color,fontSize:"10px",marginTop:"1px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.role}</div>}
                      <div style={{color:"rgba(255,255,255,0.38)",fontSize:"10px",marginTop:"2px"}}>{mO?.icon||"🧘"} {entry.asana||"Message"} · 📍 {entry.district}</div>
                    </div>
                    <div style={{color:"#0A200A",fontSize:"10px",flexShrink:0,textAlign:"right"}}><div>{entry.date}</div><div style={{fontSize:"18px",marginTop:"2px"}}>{aO?.icon||mO?.icon||"🧘"}</div></div>
                  </div>
                );
              })}
              {!joined&&<button className="tap" onClick={()=>setScreen("onboard")} style={{width:"100%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"14px",padding:"16px",fontSize:"15px",fontWeight:"700",cursor:"pointer",marginTop:"14px",boxShadow:"0 7px 22px rgba(232,98,42,0.28)"}}>Create on YogaPath →</button>}
            </div>
          </div>
        );
      })()}
      {/* ── CHALLENGE SELECTOR ── */}
      {screen==="challenge"&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"28px"}}>
            <button className="back" onClick={()=>setScreen("home")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{fontSize:"22px",fontWeight:"800"}}>21-Day Yoga Challenge 🔥</div><div style={{fontSize:"13px",color:"rgba(255,255,255,0.4)"}}>योग को आदत बनाएं</div></div>
          </div>
          {challenge&&challenge.done.length>0?(
            <div className="tap" onClick={()=>setScreen("tracker")} style={{background:"linear-gradient(135deg,#8B5CF6,#6D28D9)",borderRadius:"18px",padding:"20px",marginBottom:"16px",cursor:"pointer"}}>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.7)",marginBottom:"8px"}}>Your Active Challenge</div>
              <div style={{fontSize:"28px",fontWeight:"800",marginBottom:"4px"}}>{challenge.done.length}/{challenge.days} Days ✅</div>
              <div style={{height:"8px",background:"rgba(255,255,255,0.15)",borderRadius:"4px",marginTop:"10px"}}>
                <div style={{width:`${(challenge.done.length/challenge.days)*100}%`,height:"100%",background:"#FFFFFF",borderRadius:"4px"}}/>
              </div>
              <div style={{marginTop:"10px",fontSize:"12px",color:"rgba(255,255,255,0.7)"}}>Tap to continue today's practice →</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"14px",marginBottom:"28px"}}>
              {[{days:7,label:"7-Day Challenge",labelHi:"७ दिन चुनौती",color:"#10A87C",desc:"शुरुआत के लिए — Foundation week",reward:"Week Champion Badge 🏅"},{days:21,label:"21-Day Challenge",labelHi:"२१ दिन चुनौती",color:"#E8622A",desc:"Complete transformation — 3 full weeks",reward:"Certified Yoga Abhyasi Certificate 🎓",popular:true}].map(c=>(
                <div key={c.days} className="tap" onClick={()=>startChallenge(c.days)} style={{background:"#13131E",border:`2px solid ${c.color}33`,borderRadius:"18px",padding:"20px",cursor:"pointer",position:"relative"}}>
                  {c.popular&&<div style={{position:"absolute",top:"12px",right:"12px",background:c.color,color:"white",fontSize:"10px",fontWeight:"800",padding:"3px 10px",borderRadius:"10px"}}>RECOMMENDED</div>}
                  <div style={{fontSize:"28px",fontWeight:"800",color:c.color,marginBottom:"4px"}}>{c.days}</div>
                  <div style={{fontWeight:"700",fontSize:"17px",marginBottom:"2px"}}>{c.label} <span style={{color:"rgba(255,255,255,0.4)",fontWeight:"400",fontSize:"14px"}}>· {c.labelHi}</span></div>
                  <div style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",marginBottom:"10px"}}>{c.desc}</div>
                  <div style={{background:`${c.color}18`,border:`1px solid ${c.color}33`,borderRadius:"10px",padding:"8px 12px",fontSize:"12px",color:c.color,fontWeight:"600"}}>🎁 Reward: {c.reward}</div>
                </div>
              ))}
            </div>
          )}
          {/* Badges overview */}
          <div style={{background:"#13131E",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px"}}>
            <div style={{fontSize:"13px",fontWeight:"600",color:"rgba(255,255,255,0.7)",marginBottom:"12px"}}>Badges Unlocked 🏆</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {BADGES.map(b=>{const earned=challenge?.badges?.includes(b.id);return(
                <div key={b.id} style={{background:earned?"rgba(255,200,60,0.12)":"rgba(255,255,255,0.03)",border:`1px solid ${earned?"rgba(255,200,60,0.3)":"rgba(255,255,255,0.07)"}`,borderRadius:"12px",padding:"8px 12px",textAlign:"center",opacity:earned?1:0.5}}>
                  <div style={{fontSize:"20px",marginBottom:"3px"}}>{earned?b.emoji:"🔒"}</div>
                  <div style={{fontSize:"10px",color:earned?"rgba(255,200,60,0.9)":"rgba(255,255,255,0.3)",fontWeight:"600",lineHeight:1.2}}>{b.titleHi}</div>
                  <div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)",marginTop:"2px"}}>Day {b.day}</div>
                </div>
              );})}
            </div>
          </div>
          {challenge&&challenge.certGenerated&&<button className="tap" onClick={()=>setScreen("certificate")} style={{width:"100%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"14px",padding:"16px",fontSize:"15px",fontWeight:"700",cursor:"pointer",marginTop:"14px",boxShadow:"0 5px 18px rgba(232,98,42,0.3)"}}>🎓 View Your Certificate →</button>}
        </div>
      )}

      {/* ── DAILY TRACKER ── */}
      {screen==="tracker"&&challenge&&(()=>{
        const day=Math.min(challenge.done.length+1, challenge.days);
        const task=DAILY_TASKS[day-1]||DAILY_TASKS[20];
        const today=new Date().toISOString().split("T")[0];
        const doneToday=challenge.lastCheckin===today;
        const pct=Math.round((challenge.done.length/challenge.days)*100);
        return(
          <div className="page fade" style={{padding:"28px 24px"}}>
            <div style={{display:"flex",alignItems:"center",marginBottom:"24px"}}>
              <button className="back" onClick={()=>setScreen("challenge")}>←</button>
              <div style={{marginLeft:"14px"}}><div style={{fontSize:"20px",fontWeight:"800"}}>Day {challenge.done.length}/{challenge.days} 🔥</div><div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>{pct}% complete</div></div>
              <div style={{marginLeft:"auto",fontSize:"28px",fontWeight:"900",color:"#E8622A"}}>{challenge.done.length}🔥</div>
            </div>
            {/* Progress bar */}
            <div style={{height:"6px",background:"rgba(255,255,255,0.07)",borderRadius:"3px",marginBottom:"24px"}}>
              <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#E8622A,#8B5CF6)",borderRadius:"3px",transition:"width 0.5s ease"}}/>
            </div>
            {/* Today's task card */}
            <div style={{background:"#13131E",border:"1px solid rgba(232,98,42,0.2)",borderRadius:"20px",padding:"22px",marginBottom:"16px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
                <div style={{fontSize:"11px",color:"#E8622A",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>Today — Day {day}</div>
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:"8px",padding:"4px 10px",fontSize:"11px",color:"rgba(255,255,255,0.5)"}}>{task.mins} min</div>
              </div>
              <div style={{fontSize:"26px",fontWeight:"800",marginBottom:"4px"}}>{task.asana}</div>
              <div style={{fontSize:"18px",color:"rgba(255,255,255,0.45)",marginBottom:"16px"}}>{task.sanskrit}</div>
              <div style={{display:"flex",alignItems:"center",gap:"10px",background:"rgba(16,168,124,0.08)",border:"1px solid rgba(16,168,124,0.15)",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px"}}>
                <span style={{fontSize:"20px"}}>🌬️</span>
                <div><div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>Pranayama</div><div style={{fontWeight:"700",fontSize:"15px",color:"#10A87C"}}>{task.pranayama}</div></div>
              </div>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",lineHeight:1.5,fontStyle:"italic"}}>"{task.tip}"</div>
            </div>
            {/* Mark done button */}
            {!doneToday&&challenge.done.length<challenge.days?(
              <button className="tap" onClick={markDone} style={{width:"100%",background:"linear-gradient(135deg,#10A87C,#0D8A65)",color:"white",border:"none",borderRadius:"16px",padding:"20px",fontSize:"18px",fontWeight:"800",cursor:"pointer",boxShadow:"0 8px 28px rgba(16,168,124,0.35)",marginBottom:"14px",letterSpacing:"0.3px"}}>
                ✅ Mark as Done — Streak +1
              </button>
            ):(
              <div style={{background:"rgba(16,168,124,0.08)",border:"1px solid rgba(16,168,124,0.25)",borderRadius:"16px",padding:"18px",textAlign:"center",marginBottom:"14px"}}>
                <div style={{fontSize:"24px",marginBottom:"6px"}}>{challenge.done.length>=challenge.days?"🎓":"✅"}</div>
                <div style={{fontWeight:"700",color:"#10A87C"}}>{challenge.done.length>=challenge.days?"Challenge Complete! 🎉":"Today's practice done! Come back tomorrow."}</div>
              </div>
            )}
            {/* Days grid */}
            <div style={{background:"#13131E",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px"}}>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginBottom:"12px",fontWeight:"600"}}>Challenge Progress</div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(challenge.days,7)},1fr)`,gap:"6px"}}>
                {Array.from({length:challenge.days},(_,i)=>{
                  const d=i+1; const done=challenge.done.includes(d); const isBadge=BADGES.find(b=>b.day===d);
                  return(
                    <div key={d} style={{aspectRatio:"1",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",background:done?"linear-gradient(135deg,#10A87C,#0D8A65)":"rgba(255,255,255,0.05)",border:`1px solid ${done?"transparent":"rgba(255,255,255,0.07)"}`,fontSize:"11px",fontWeight:"700",color:done?"white":"rgba(255,255,255,0.3)",position:"relative"}}>
                      {isBadge&&done&&<div style={{position:"absolute",top:"-4px",right:"-4px",fontSize:"10px"}}>{isBadge.emoji}</div>}
                      {d}
                    </div>
                  );
                })}
              </div>
            </div>
            {challenge.done.length>=challenge.days&&<button className="tap" onClick={()=>setScreen("certificate")} style={{width:"100%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"14px",padding:"16px",fontSize:"15px",fontWeight:"700",cursor:"pointer",marginTop:"14px",boxShadow:"0 5px 18px rgba(232,98,42,0.3)"}}>🎓 Get Your Certificate →</button>}
          </div>
        );
      })()}

      {/* ── CERTIFICATE ── */}
      {screen==="certificate"&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"24px"}}>
            <button className="back" onClick={()=>setScreen("challenge")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{fontSize:"20px",fontWeight:"800"}}>Your Certificate 🎓</div><div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>Certified Yoga Abhyasi</div></div>
          </div>
          <canvas ref={certCanvasRef} style={{display:"none"}}/>
          {certUrl?(
            <div style={{borderRadius:"16px",overflow:"hidden",marginBottom:"20px",boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
              <img src={certUrl} alt="certificate" style={{width:"100%",display:"block"}}/>
            </div>
          ):(
            <div style={{background:"#13131E",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"40px 20px",textAlign:"center",marginBottom:"20px"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>🎓</div>
              <div style={{fontWeight:"700",fontSize:"18px",marginBottom:"8px"}}>Certified Yoga Abhyasi</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",marginBottom:"24px"}}>{name} · {district} · {challenge?.days}-Day Challenge</div>
              <button className="tap" onClick={generateCert} style={{background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"12px",padding:"14px 28px",fontSize:"15px",fontWeight:"700",cursor:"pointer",boxShadow:"0 5px 18px rgba(232,98,42,0.3)"}}>Generate Certificate →</button>
            </div>
          )}
          {certUrl&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <button className="tap" onClick={downloadCert} style={{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:"14px",padding:"16px",fontSize:"14px",fontWeight:"700",cursor:"pointer",boxShadow:"0 4px 16px rgba(5,150,105,0.3)"}}>⬇ Download</button>
              <button className="tap" onClick={()=>{const t="🎓 I completed the "+challenge?.days+"-Day Yoga Challenge!%0A%0AName: "+name+"%0ADistrict: "+district+"%0A%0A#YogaPath #AYUSH #IDY2026 #CertifiedYogaAbhyasi";window.open("https://wa.me/?text="+t,"_blank");}} style={{background:"linear-gradient(135deg,#25D366,#1DAB52)",color:"white",border:"none",borderRadius:"14px",padding:"16px",fontSize:"14px",fontWeight:"700",cursor:"pointer",boxShadow:"0 4px 16px rgba(37,211,102,0.3)"}}>📤 WhatsApp</button>
            </div>
          )}
          {/* Badges earned */}
          <div style={{background:"#13131E",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px",marginTop:"16px"}}>
            <div style={{fontSize:"13px",fontWeight:"600",marginBottom:"12px"}}>Your Badges</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
              {BADGES.filter(b=>challenge?.badges?.includes(b.id)).map(b=>(
                <div key={b.id} style={{background:"rgba(255,200,60,0.08)",border:"1px solid rgba(255,200,60,0.25)",borderRadius:"12px",padding:"10px 14px",textAlign:"center"}}>
                  <div style={{fontSize:"24px",marginBottom:"4px"}}>{b.emoji}</div>
                  <div style={{fontSize:"11px",fontWeight:"600",color:"rgba(255,200,60,0.9)"}}>{b.titleHi}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
