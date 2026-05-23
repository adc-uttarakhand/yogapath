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
      const sc=Math.max(W/sw,MH/sh);
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
      const sc=Math.max(PHOTO_W/sw,BODY_H/sh);
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
  if(!SUPABASE_URL.includes(".supabase.co")) return;
  try { await fetch(`${SUPABASE_URL}/rest/v1/yoga_participation`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=minimal"},body:JSON.stringify(d)}); } catch{}
}

// ─── CSS ─────────────────────────────────────────────────
const css=`
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#060909;color:#fff;font-family:'Sora',system-ui,sans-serif;}
.page{min-height:100vh;background:#060909;}
.fade{animation:fi 0.3s ease;}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.tap{transition:transform 0.12s;cursor:pointer;} .tap:active{transform:scale(0.97);}
.back{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);color:#9CA3AF;padding:10px 16px;border-radius:11px;cursor:pointer;font-size:18px;}
.inp{width:100%;background:#0C150C;border:1.5px solid #142014;border-radius:13px;padding:15px 16px;color:#fff;font-size:15px;font-family:'Sora',sans-serif;outline:none;transition:border-color 0.2s;}
.inp:focus{border-color:#10A87C;} .inp::placeholder{color:#2A3A2A;}
select.inp{colorScheme:dark;} select.inp option{background:#0C150C;}
.prog{height:2px;background:#0C180C;border-radius:1px;margin-bottom:32px;}
.pfill{height:100%;background:linear-gradient(90deg,#E8622A,#10A87C);border-radius:1px;transition:width 0.4s ease;}
.scroll-hide::-webkit-scrollbar{display:none;}
`;

// ─── CAMERA SCREEN ────────────────────────────────────────
function CameraScreen({ mode, asana, name, district, role, msg, bgStyle, orientation, onCapture, onBack }) {
  const videoRef=useRef(null), canvasRef=useRef(null), animRef=useRef(null), recRef=useRef(null), chunksRef=useRef([]), streamRef=useRef(null);
  const [camState,setCamState]=useState("idle");
  const [facing,setFacing]=useState("user");
  const [secs,setSecs]=useState(0);
  const [err,setErr]=useState(null);
  const isPhoto=mode==="photo";
  const ori=ORIENTATIONS.find(o=>o.id===orientation)||ORIENTATIONS[0];
  const CW=ori.w, CH=ori.h;

  const drawLoop=useCallback(()=>{
    if(!canvasRef.current||!videoRef.current) return;
    const cv=canvasRef.current;
    if(cv.width!==CW) cv.width=CW;
    if(cv.height!==CH) cv.height=CH;
    drawAYUSHFrame(cv,videoRef.current,{asana,name,district,role,mode,msg,bgStyle,orientation});
    animRef.current=requestAnimationFrame(drawLoop);
  },[asana,name,district,role,mode,msg,bgStyle,orientation,CW,CH]);

  async function startCam(f=facing){
    try{
      if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:f,width:{ideal:CW},height:{ideal:CH}},audio:!isPhoto});
      streamRef.current=s; videoRef.current.srcObject=s; await videoRef.current.play();
      cancelAnimationFrame(animRef.current); drawLoop(); setCamState("previewing"); setErr(null);
    }catch(e){setErr(e.name==="NotAllowedError"?"Camera permission denied. Please allow access.":e.message);}
  }
  function stopCam(){cancelAnimationFrame(animRef.current);if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}if(videoRef.current) videoRef.current.srcObject=null;}
  useEffect(()=>()=>stopCam(),[]);
  function flip(){const f=facing==="user"?"environment":"user";setFacing(f);startCam(f);}
  function capturePhoto(){const url=canvasRef.current.toDataURL("image/jpeg",0.94);stopCam();onCapture({type:"photo",url});}
  function startRec(){
    chunksRef.current=[];
    const cs=canvasRef.current.captureStream(30);
    (streamRef.current?.getAudioTracks()||[]).forEach(t=>cs.addTrack(t));
    const mime=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm","video/mp4"].find(t=>{try{return MediaRecorder.isTypeSupported(t)}catch{return false}})||"video/webm";
    recRef.current=new MediaRecorder(cs,{mimeType:mime});
    recRef.current.ondataavailable=e=>{if(e.data.size>0) chunksRef.current.push(e.data);};
    recRef.current.onstop=()=>{const blob=new Blob(chunksRef.current,{type:mime});stopCam();onCapture({type:"video",blob,url:URL.createObjectURL(blob),mime});};
    recRef.current.start(200); setCamState("recording"); setSecs(0);
  }
  function stopRec(){recRef.current?.stop();setCamState("processing");}
  useEffect(()=>{if(camState!=="recording") return;const t=setInterval(()=>setSecs(s=>s+1),1000);return()=>clearInterval(t);},[camState]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const modeObj=MODES.find(m=>m.id===mode);
  const isLS=orientation==="landscape";

  return (
    <div style={{background:"#000",minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Sora',system-ui,sans-serif"}}>
      <div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>{stopCam();onBack();}} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"white",padding:"8px 14px",borderRadius:"10px",cursor:"pointer",fontSize:"18px"}}>←</button>
        <div style={{color:"white",fontSize:"13px",fontWeight:"600",display:"flex",alignItems:"center",gap:"6px"}}>
          <span>{modeObj?.icon}</span><span>{modeObj?.title}</span>
          <span style={{color:"#555",fontSize:"11px"}}>· {ori.label}</span>
          {bgStyle!=="dark"&&<span style={{color:"#555",fontSize:"11px"}}>· {BG_STYLES.find(b=>b.id===bgStyle)?.labelHi}</span>}
        </div>
        {(camState==="previewing"||camState==="recording")
          ? <button onClick={flip} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"white",padding:"8px 12px",borderRadius:"10px",cursor:"pointer",fontSize:"20px"}}>⇄</button>
          : <div style={{width:"42px"}}/>}
      </div>

      {isLS&&<div style={{padding:"4px 16px",background:"rgba(255,160,20,0.12)",borderRadius:"8px",margin:"0 16px 6px",fontSize:"11px",color:"rgba(255,160,20,0.8)",textAlign:"center"}}>📐 Landscape mode — rotate phone sideways for best results</div>}

      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",padding:"0 4px"}}>
        <video ref={videoRef} style={{display:"none"}} muted playsInline autoPlay/>
        <canvas ref={canvasRef} width={CW} height={CH} style={{width:"100%",maxHeight:"calc(100vh - 190px)",objectFit:"contain",display:"block",borderRadius:"10px"}}/>
        {camState==="idle"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#555"}}><div style={{fontSize:"42px",marginBottom:"10px"}}>📷</div><div style={{fontSize:"13px"}}>Tap below to start</div></div></div>}
        {camState==="recording"&&<div style={{position:"absolute",top:"16px",left:"50%",transform:"translateX(-50%)",background:"rgba(220,38,38,0.88)",color:"white",padding:"5px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:"700",display:"flex",alignItems:"center",gap:"7px"}}><div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#FCA5A5"}}/>REC {fmt(secs)}</div>}
        {camState==="processing"&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"white",textAlign:"center"}}><div style={{fontSize:"34px",marginBottom:"8px"}}>⏳</div><div style={{fontSize:"14px"}}>Processing...</div></div></div>}
      </div>

      <div style={{padding:"14px 20px 28px",display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",minHeight:"95px"}}>
        {err&&<div style={{color:"#FCA5A5",fontSize:"12px",textAlign:"center",padding:"8px 14px",background:"rgba(239,68,68,0.1)",borderRadius:"10px",maxWidth:"290px"}}>{err}</div>}
        {camState==="idle"&&<button onClick={()=>startCam()} style={{background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"14px",padding:"14px 36px",fontSize:"15px",fontWeight:"700",cursor:"pointer",boxShadow:"0 5px 18px rgba(232,98,42,0.38)"}}>Start Camera</button>}
        {camState==="previewing"&&isPhoto&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}><button onClick={capturePhoto} style={{width:"74px",height:"74px",borderRadius:"50%",background:"white",border:"6px solid rgba(255,255,255,0.28)",cursor:"pointer",fontSize:"26px",display:"flex",alignItems:"center",justifyContent:"center"}}>📸</button><div style={{color:"#444",fontSize:"11px"}}>Tap to capture</div></div>}
        {camState==="previewing"&&!isPhoto&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}><button onClick={startRec} style={{width:"74px",height:"74px",borderRadius:"50%",background:"#DC2626",border:"6px solid rgba(220,38,38,0.33)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:"27px",height:"27px",borderRadius:"50%",background:"white"}}/></button><div style={{color:"#555",fontSize:"11px"}}>Tap to record</div></div>}
        {camState==="recording"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}><button onClick={stopRec} style={{width:"74px",height:"74px",borderRadius:"50%",background:"#DC2626",border:"6px solid rgba(220,38,38,0.33)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:"25px",height:"25px",borderRadius:"4px",background:"white"}}/></button><div style={{color:"#F87171",fontSize:"11px",fontWeight:"600"}}>Tap to stop</div></div>}
        {camState==="previewing"&&<div style={{color:"#222",fontSize:"10px",textAlign:"center"}}>AYUSH frame is live • baked directly into your {isPhoto?"photo":"video"}</div>}
      </div>
    </div>
  );
}

// ─── BG SWATCH COMPONENT ─────────────────────────────────
function BgSwatch({ style, selected, onClick }) {
  const isGrad = style.thumb.startsWith("linear");
  return (
    <div onClick={onClick} className="tap" style={{borderRadius:"12px",overflow:"hidden",border:`2.5px solid ${selected?"#10A87C":"#101E10"}`,cursor:"pointer",position:"relative",transition:"all 0.15s",boxShadow:selected?"0 0 0 2px rgba(16,168,124,0.35)":"none"}}>
      <div style={{width:"100%",paddingTop:"62%",background:isGrad?style.thumb:style.thumb,position:"relative"}}>
        {!isGrad&&<div style={{position:"absolute",inset:0,background:style.thumb}}/>}
      </div>
      <div style={{padding:"6px 4px",background:"#0A120A",textAlign:"center"}}>
        <div style={{fontSize:"10px",color:selected?"#10A87C":"#1A5A1A",fontWeight:"600",lineHeight:1.2}}>{style.labelHi}</div>
      </div>
      {selected&&<div style={{position:"absolute",top:"5px",right:"5px",background:"#10A87C",color:"white",fontSize:"10px",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"800"}}>✓</div>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────
const MOCK_COMM=[
  {id:1,name:"Dr. Rajesh Kumar",district:"Dehradun",role:"DM (District Magistrate)",mode:"message",asana:null,date:"2026-06-15"},
  {id:2,name:"Priya Sharma",district:"Haridwar",role:"AYUSH Doctor",mode:"yoga_video",asana:"Vrikshasana",date:"2026-06-14"},
  {id:3,name:"Gram Pradhan Rajwant",district:"Almora",role:"Gram Pradhan",mode:"message",asana:null,date:"2026-06-14"},
  {id:4,name:"Sunita Rawat",district:"Nainital",role:"Doctor — Ayushman Arogya Mandir",mode:"photo",asana:"Padmasana",date:"2026-06-13"},
  {id:5,name:"Anita Bisht",district:"Pithoragarh",role:"Yoga Instructor / Wellness Coach",mode:"yoga_video",asana:"Surya Namaskar",date:"2026-06-12"},
  {id:6,name:"Deepak Joshi",district:"Chamoli",role:"AYUSH Pharmacist",mode:"photo",asana:"Vajrasana",date:"2026-06-12"},
  {id:7,name:"MLA Mohan Negi",district:"Tehri Garhwal",role:"MLA (विधायक)",mode:"message",asana:null,date:"2026-06-11"},
  {id:8,name:"Kavita Pant",district:"Uttarkashi",role:"General Public (आम नागरिक)",mode:"photo",asana:"Tadasana",date:"2026-06-10"},
];
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
  const [community,setCommunity]=useState(MOCK_COMM);
  const [distStats,setDistStats]=useState({});
  const [joined,setJoined]=useState(false);
  const [showRoleDD,setShowRoleDD]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("yoga-v5");if(r?.value) setCommunity(JSON.parse(r.value));const d=await window.storage.get("yogadist-v5");if(d?.value) setDistStats(JSON.parse(d.value));}catch{}})();},[]);

  function download(){if(!captured) return;const a=document.createElement("a");a.href=captured.url;a.download=captured.type==="photo"?`yoga-frame-${Date.now()}.jpg`:`yoga-video-${Date.now()}.webm`;a.click();}
  function shareWA(){const who=role?`${name} (${role})`:name;const what=mode==="message"?"Yoga Message":`${asana?.name}`;const t=`🕉 ${who}\n📍 ${district}, Uttarakhand\n🧘 ${what}\n\n"${msg}"\n\n#YogaAt100Uttarakhand #IDY2026 #AYUSH`;window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,"_blank");}
  async function joinWall(){
    const entry={id:Date.now(),name,district,role,mode,asana:asana?.name,date:new Date().toISOString().split("T")[0]};
    const updated=[entry,...community].slice(0,100);
    setCommunity(updated);
    const nd={...distStats,[district]:(distStats[district]||0)+1};
    setDistStats(nd); setJoined(true);
    try{const p=updated.filter(c=>!MOCK_COMM.find(m=>m.id===c.id));await window.storage.set("yoga-v5",JSON.stringify(p.slice(0,60)));await window.storage.set("yogadist-v5",JSON.stringify(nd));}catch{}
    logToSupabase({name,district,role,mode,asana:asana?.name,participated_on:new Date().toISOString().split("T")[0]});
    setScreen("community");
  }

  const filtered=cat==="All"?ASANAS:ASANAS.filter(a=>a.category===cat);
  const modeObj=MODES.find(m=>m.id===mode);

  return (
    <>
      <style>{css}</style>

      {/* ── HOME ── */}
      {screen==="home"&&(
        <div className="page fade" style={{padding:"0 0 32px"}}>
          {/* App Header */}
          <div style={{background:"linear-gradient(135deg,#080F08,#0A160A)",padding:"36px 24px 24px",borderBottom:"1px solid #0D1A0D",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-40px",right:"-40px",width:"180px",height:"180px",borderRadius:"50%",background:"radial-gradient(circle,rgba(232,98,42,0.1),transparent)",filter:"blur(30px)"}}/>
            <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"20px"}}>
              <div style={{fontSize:"44px",filter:"drop-shadow(0 0 16px rgba(232,98,42,0.5))"}} >🕉️</div>
              <div>
                <div style={{fontSize:"26px",fontWeight:"800",letterSpacing:"-0.5px",lineHeight:1.1}}>YogaPath</div>
                <div style={{background:"linear-gradient(135deg,#E8622A,#F59E0B)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",fontSize:"18px",fontWeight:"700",letterSpacing:"0.5px"}}>Uttarakhand</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{color:"#1A5A1A",fontSize:"12px",fontWeight:"300"}}>AYUSH Uttarakhand  ·  IDY 2026</div>
                <div style={{color:"#E8622A",fontSize:"12px",fontWeight:"600",marginTop:"2px"}}>21 June 2026  🧘  International Day of Yoga</div>
              </div>
              <div style={{background:"rgba(16,168,124,0.08)",border:"1px solid rgba(16,168,124,0.18)",borderRadius:"10px",padding:"6px 12px",textAlign:"center"}}>
                <div style={{color:"#10A87C",fontWeight:"800",fontSize:"18px"}}>{community.length}+</div>
                <div style={{color:"#1A3A1A",fontSize:"9px",marginTop:"1px"}}>Yogis</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{padding:"20px 18px 0"}}>
            <div style={{color:"#1A5A1A",fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"14px"}}>Features</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>

              {/* Yoga Frame — ACTIVE */}
              <div className="tap" onClick={()=>setScreen("onboard")} style={{background:"linear-gradient(135deg,rgba(232,98,42,0.12),rgba(232,98,42,0.06))",border:"1.5px solid rgba(232,98,42,0.35)",borderRadius:"18px",padding:"20px 16px",cursor:"pointer",gridColumn:"span 2",boxShadow:"0 4px 20px rgba(232,98,42,0.12)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                  <div style={{fontSize:"36px"}}>🖼️</div>
                  <div style={{background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",fontSize:"10px",fontWeight:"800",padding:"4px 10px",borderRadius:"8px",letterSpacing:"1px"}}>ACTIVE</div>
                </div>
                <div style={{fontWeight:"800",fontSize:"20px",marginBottom:"4px"}}>Yoga Frame</div>
                <div style={{color:"#6A3A1A",fontSize:"13px",marginBottom:"14px"}}>Photo, Video & Message — AYUSH branded frame</div>
                <div style={{display:"flex",gap:"8px"}}>
                  {MODES.map(m=><div key={m.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"6px 10px",fontSize:"11px",color:"#4A2A1A",display:"flex",alignItems:"center",gap:"5px"}}><span>{m.icon}</span><span>{m.titleHi}</span></div>)}
                </div>
              </div>

              {/* District Wall */}
              <div className="tap" onClick={()=>setScreen("community")} style={{background:"#0A120A",border:"1px solid #101E10",borderRadius:"18px",padding:"18px 16px",cursor:"pointer"}}>
                <div style={{fontSize:"30px",marginBottom:"10px"}}>🗺️</div>
                <div style={{fontWeight:"700",fontSize:"15px",marginBottom:"3px"}}>District Wall</div>
                <div style={{color:"#1A4A1A",fontSize:"12px",marginBottom:"10px"}}>Live participation map</div>
                <div style={{background:"rgba(16,168,124,0.08)",borderRadius:"7px",padding:"5px 8px",display:"inline-block"}}>
                  <span style={{color:"#10A87C",fontWeight:"700",fontSize:"13px"}}>{community.length}</span>
                  <span style={{color:"#1A4A1A",fontSize:"11px",marginLeft:"4px"}}>entries</span>
                </div>
              </div>

              {/* Certificate — Coming Soon */}
              <div style={{background:"#0A120A",border:"1px solid #0D1A0D",borderRadius:"18px",padding:"18px 16px",opacity:0.5,position:"relative"}}>
                <div style={{fontSize:"30px",marginBottom:"10px"}}>📜</div>
                <div style={{fontWeight:"700",fontSize:"15px",marginBottom:"3px"}}>Certificate</div>
                <div style={{color:"#1A3A1A",fontSize:"12px"}}>Participation certificate</div>
                <div style={{position:"absolute",top:"12px",right:"12px",background:"#1A2A1A",color:"#2A5A2A",fontSize:"9px",fontWeight:"700",padding:"3px 8px",borderRadius:"6px",letterSpacing:"1px"}}>SOON</div>
              </div>

              {/* Leaderboard — Coming Soon */}
              <div style={{background:"#0A120A",border:"1px solid #0D1A0D",borderRadius:"18px",padding:"18px 16px",opacity:0.5,position:"relative"}}>
                <div style={{fontSize:"30px",marginBottom:"10px"}}>🏆</div>
                <div style={{fontWeight:"700",fontSize:"15px",marginBottom:"3px"}}>Leaderboard</div>
                <div style={{color:"#1A3A1A",fontSize:"12px"}}>Top districts & yogis</div>
                <div style={{position:"absolute",top:"12px",right:"12px",background:"#1A2A1A",color:"#2A5A2A",fontSize:"9px",fontWeight:"700",padding:"3px 8px",borderRadius:"6px",letterSpacing:"1px"}}>SOON</div>
              </div>

              {/* QR / Share — Coming Soon */}
              <div style={{background:"#0A120A",border:"1px solid #0D1A0D",borderRadius:"18px",padding:"18px 16px",opacity:0.5,position:"relative"}}>
                <div style={{fontSize:"30px",marginBottom:"10px"}}>📊</div>
                <div style={{fontWeight:"700",fontSize:"15px",marginBottom:"3px"}}>Analytics</div>
                <div style={{color:"#1A3A1A",fontSize:"12px"}}>District-wise reports</div>
                <div style={{position:"absolute",top:"12px",right:"12px",background:"#1A2A1A",color:"#2A5A2A",fontSize:"9px",fontWeight:"700",padding:"3px 8px",borderRadius:"6px",letterSpacing:"1px"}}>SOON</div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div style={{padding:"24px 24px 0",textAlign:"center"}}>
            <div style={{color:"#0F1F0F",fontSize:"11px"}}>Dept. of Ayurvedic & Unani Services  ·  National AYUSH Mission, Uttarakhand</div>
          </div>
        </div>
      )}

      {/* ── ONBOARD ── */}
      {screen==="onboard"&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"14px"}}>
            <button className="back" onClick={()=>setScreen("home")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{color:"#1A4A1A",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 1 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>Your Profile</div></div>
          </div>
          <div className="prog"><div className="pfill" style={{width:"25%"}}/></div>
          <h2 style={{fontSize:"26px",fontWeight:"800",marginBottom:"6px"}}>Namaste 🙏</h2>
          <p style={{color:"#1A4A1A",fontSize:"14px",marginBottom:"32px",fontWeight:"300"}}>This appears on your frame</p>
          <div style={{marginBottom:"20px"}}><label style={{display:"block",color:"#1A5A1A",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Name</label><input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="पूरा नाम" style={name?{borderColor:"#10A87C"}:{}}/></div>
          <div style={{marginBottom:"20px"}}><label style={{display:"block",color:"#1A5A1A",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>District</label>
            <select className="inp" value={district} onChange={e=>setDistrict(e.target.value)} style={district?{borderColor:"#10A87C",colorScheme:"dark"}:{colorScheme:"dark"}}><option value="">जिला चुनें</option>{DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}</select>
          </div>
          <div style={{marginBottom:"44px",position:"relative"}}>
            <label style={{display:"block",color:"#1A5A1A",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Designation / Role</label>
            <div onClick={()=>setShowRoleDD(!showRoleDD)} className="inp" style={{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderColor:role?"#10A87C":"#142014",color:role?"#fff":"#2A3A2A"}}>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{role||"भूमिका चुनें"}</span>
              <span style={{color:"#1A4A1A",marginLeft:"8px"}}>{showRoleDD?"▲":"▼"}</span>
            </div>
            {showRoleDD&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#0C150C",border:"1px solid #1A2A1A",borderRadius:"12px",zIndex:100,maxHeight:"260px",overflowY:"auto"}}>
                {ROLE_GROUPS.map(g=>(
                  <div key={g.group}>
                    <div style={{padding:"7px 14px",color:"#1A5A1A",fontSize:"10px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase",background:"#080F08",borderBottom:"1px solid #0F1A0F"}}>{g.group}</div>
                    {g.items.map(item=>(
                      <div key={item} onClick={()=>{setRole(item);setShowRoleDD(false);}} style={{padding:"11px 14px",cursor:"pointer",fontSize:"13px",color:role===item?"#10A87C":"#4A7A4A",borderBottom:"1px solid #0C160C"}}>
                        {role===item&&"✓ "}{item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
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
            <div style={{marginLeft:"14px"}}><div style={{color:"#1A4A1A",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 2 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>What to Create</div></div>
          </div>
          <div className="prog"><div className="pfill" style={{width:"50%"}}/></div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"14px",padding:"12px 16px",marginBottom:"24px",display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:"700",fontSize:"13px",flexShrink:0}}>{getInitials(name)}</div>
            <div><div style={{fontWeight:"700",fontSize:"14px"}}>{name}</div><div style={{color:"#1A5A1A",fontSize:"12px"}}>{role} · 📍 {district}</div></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {MODES.map(m=>{const sel=mode===m.id;return(
              <div key={m.id} className="tap" onClick={()=>setMode(m.id)} style={{background:sel?`rgba(${hexToRgb(m.color)},0.1)`:"#0A120A",border:`2px solid ${sel?m.color:"#101E10"}`,borderRadius:"16px",padding:"18px",cursor:"pointer",boxShadow:sel?`0 4px 20px rgba(${hexToRgb(m.color)},0.2)`:"none",transition:"all 0.18s"}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                  <div style={{width:"48px",height:"48px",borderRadius:"12px",background:`rgba(${hexToRgb(m.color)},0.1)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",flexShrink:0}}>{m.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"700",fontSize:"16px",marginBottom:"3px"}}>{m.title} <span style={{fontWeight:"300",color:"#1A4A1A",fontSize:"13px"}}>· {m.titleHi}</span></div><div style={{color:"#1A5A1A",fontSize:"13px"}}>{m.desc}</div></div>
                  {sel&&<div style={{color:m.color,fontSize:"18px",flexShrink:0}}>✓</div>}
                </div>
                {m.id==="message"&&<div style={{marginTop:"10px",padding:"9px 11px",background:"rgba(255,255,255,0.025)",borderRadius:"9px",color:"#1A4A1A",fontSize:"11px",lineHeight:1.5}}>📢 DM, MLA, Gram Pradhan, AAM Doctor — सभी रिकॉर्ड कर सकते हैं</div>}
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
            <div style={{marginLeft:"14px"}}><div style={{color:"#1A4A1A",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 3 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>Choose Asana</div></div>
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
                <div style={{color:"#1A5A1A",fontSize:"12px",marginBottom:"7px"}}>{a.sanskrit}</div>
                <div style={{display:"inline-block",background:`rgba(${hexToRgb(a.color)},0.1)`,color:a.color,fontSize:"10px",fontWeight:"700",padding:"2px 9px",borderRadius:"8px"}}>{a.category}</div>
              </div>
            );})}
          </div>
          {asana&&<div style={{position:"fixed",bottom:0,left:0,right:0,padding:"12px 16px 22px",background:"linear-gradient(0deg,#060909 85%,transparent)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",background:"#09120A",borderRadius:"13px",padding:"11px 14px",marginBottom:"10px",border:`1px solid ${asana.color}22`}}>
              <span style={{fontSize:"22px"}}>{asana.icon}</span>
              <div><div style={{fontWeight:"700",fontSize:"13px"}}>{asana.name}</div><div style={{color:"#1A5A1A",fontSize:"11px"}}>{asana.description}</div></div>
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
            <div style={{marginLeft:"14px"}}><div style={{color:"#1A4A1A",fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"2px"}}>Step 4 of 4</div><div style={{fontSize:"20px",fontWeight:"700"}}>Frame Style</div></div>
          </div>
          <div className="prog"><div className="pfill" style={{width:"100%"}}/></div>

          {/* Orientation */}
          <div style={{marginBottom:"28px"}}>
            <label style={{display:"block",color:"#1A5A1A",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Orientation / ओरिएंटेशन</label>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {ORIENTATIONS.map(o=>{const sel=orientation===o.id;return(
                <div key={o.id} className="tap" onClick={()=>setOrientation(o.id)} style={{background:sel?"rgba(16,168,124,0.08)":"#0A120A",border:`2px solid ${sel?"#10A87C":"#101E10"}`,borderRadius:"14px",padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"14px",transition:"all 0.15s"}}>
                  <span style={{fontSize:"22px"}}>{o.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"700",fontSize:"14px"}}>{o.label} <span style={{color:"#1A5A1A",fontWeight:"400",fontSize:"13px"}}>· {o.labelHi}</span></div>
                    <div style={{color:"#1A5A1A",fontSize:"12px",marginTop:"2px"}}>{o.desc}</div>
                    <div style={{color:"#0F3A0F",fontSize:"11px",marginTop:"2px"}}>{o.w}×{o.h}px</div>
                  </div>
                  {sel&&<div style={{color:"#10A87C",fontWeight:"700",fontSize:"16px"}}>✓</div>}
                </div>
              );})}
            </div>
          </div>

          {/* Background */}
          <div style={{marginBottom:"36px"}}>
            <label style={{display:"block",color:"#1A5A1A",fontSize:"11px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Background / बैकग्राउंड</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
              {BG_STYLES.map(b=><BgSwatch key={b.id} style={b} selected={bgStyle===b.id} onClick={()=>setBgStyle(b.id)}/>)}
            </div>
            <div style={{marginTop:"10px",padding:"10px 12px",background:"rgba(255,200,20,0.04)",border:"1px solid rgba(255,200,20,0.1)",borderRadius:"10px",fontSize:"11px",color:"#2A4A0A",lineHeight:1.5}}>
              🎨 <strong style={{color:"#4A8A0A"}}>Aipan</strong> — कुमाऊंनी लोक कला · <strong style={{color:"#4A8A0A"}}>Himalaya / Valley / Sunset</strong> — उत्तराखंड दृश्यावली
            </div>
          </div>

          <button className="tap" onClick={()=>setScreen("camera")} style={{width:"100%",background:"linear-gradient(135deg,#E8622A,#C44E1A)",color:"white",border:"none",borderRadius:"16px",padding:"17px",fontSize:"16px",fontWeight:"700",cursor:"pointer",boxShadow:"0 8px 22px rgba(232,98,42,0.32)"}}>
            Open Camera →
          </button>
        </div>
      )}

      {/* ── CAMERA ── */}
      {screen==="camera"&&<CameraScreen mode={mode} asana={asana} name={name} district={district} role={role} msg={msg} bgStyle={bgStyle} orientation={orientation} onCapture={d=>{setCaptured(d);setScreen("preview");}} onBack={()=>setScreen("frameStyle")}/>}

      {/* ── PREVIEW ── */}
      {screen==="preview"&&captured&&(
        <div className="page fade" style={{padding:"28px 24px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:"22px"}}>
            <button className="back" onClick={()=>setScreen("camera")}>←</button>
            <div style={{marginLeft:"14px"}}><div style={{fontSize:"20px",fontWeight:"700"}}>YogaPath Frame ✨</div><div style={{color:"#1A5A1A",fontSize:"12px",fontWeight:"300"}}>AYUSH frame baked in · {BG_STYLES.find(b=>b.id===bgStyle)?.labelHi} · {ORIENTATIONS.find(o=>o.id===orientation)?.label}</div></div>
          </div>
          {captured.type==="photo"
            ? <div style={{borderRadius:"18px",overflow:"hidden",marginBottom:"22px",boxShadow:"0 18px 56px rgba(0,0,0,0.7)"}}><img src={captured.url} alt="frame" style={{width:"100%",display:"block",borderRadius:"18px"}}/></div>
            : <div style={{borderRadius:"18px",overflow:"hidden",marginBottom:"22px",boxShadow:"0 18px 56px rgba(0,0,0,0.7)",background:"#000"}}><video src={captured.url} controls playsInline style={{width:"100%",display:"block",borderRadius:"18px",maxHeight:"460px",objectFit:"contain"}}/></div>
          }
          <div style={{background:"rgba(16,168,124,0.05)",border:"1px solid rgba(16,168,124,0.12)",borderRadius:"11px",padding:"10px 14px",marginBottom:"18px",fontSize:"11px",color:"#1A5A1A",lineHeight:1.5}}>
            🔒 Media saved <strong style={{color:"#10A87C"}}>only on your device</strong> — nothing uploaded to any server
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
            <button className="tap" onClick={download} style={{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 3px 14px rgba(5,150,105,0.28)"}}>⬇ Download</button>
            <button className="tap" onClick={shareWA} style={{background:"linear-gradient(135deg,#25D366,#1DAB52)",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 3px 14px rgba(37,211,102,0.28)"}}>📤 WhatsApp</button>
          </div>
          <button className="tap" onClick={joinWall} style={{width:"100%",background:joined?"#090F09":"linear-gradient(135deg,#E8622A,#C44E1A)",color:joined?"#1A4A1A":"white",border:joined?"1px solid #101E10":"none",borderRadius:"13px",padding:"14px",fontSize:"15px",fontWeight:"700",cursor:"pointer",marginBottom:"10px",boxShadow:joined?"none":"0 5px 18px rgba(232,98,42,0.28)"}}>
            {joined?"✓ Added to District Wall":"🌟 Add to District Wall →"}
          </button>
          <button onClick={()=>setScreen("community")} style={{width:"100%",background:"transparent",color:"#1A3A1A",border:"1px solid #0C1A0C",borderRadius:"13px",padding:"12px",fontSize:"13px",cursor:"pointer"}}>
            View District Wall →
          </button>
        </div>
      )}

      {/* ── COMMUNITY WALL ── */}
      {screen==="community"&&(()=>{
        const dc={};community.forEach(c=>{if(c.district) dc[c.district]=(dc[c.district]||0)+1;});
        Object.entries(distStats).forEach(([d,v])=>{dc[d]=Math.max(dc[d]||0,v);});
        const sorted=Object.entries(dc).sort((a,b)=>b[1]-a[1]);
        const mc={photo:0,yoga_video:0,message:0};community.forEach(c=>{if(c.mode) mc[c.mode]=(mc[c.mode]||0)+1;});
        return(
          <div className="page fade">
            <div style={{background:"linear-gradient(180deg,#060F06,#060909)",padding:"28px 24px 18px"}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:"20px"}}>
                <button className="back" onClick={()=>setScreen(joined?"preview":"splash")}>←</button>
                 <div style={{marginLeft:"14px"}}><div style={{fontSize:"21px",fontWeight:"800"}}>District Wall 🗺️</div><div style={{color:"#1A5A1A",fontSize:"12px",fontWeight:"300"}}>Yoga @ 100 Uttarakhand · IDY 2026</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px",marginBottom:"10px"}}>
                {[{val:community.length,label:"Total Entries",color:"#E8622A"},{val:sorted.filter(d=>d[1]>0).length,label:"Districts Active",color:"#10A87C"}].map(({val,label,color})=>(
                  <div key={label} style={{background:"#0A120A",borderRadius:"12px",padding:"12px",textAlign:"center",border:`1px solid ${color}16`}}><div style={{color,fontSize:"24px",fontWeight:"800"}}>{val}</div><div style={{color:"#1A3A1A",fontSize:"10px",marginTop:"2px"}}>{label}</div></div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
                {MODES.map(m=><div key={m.id} style={{background:"#0A120A",borderRadius:"10px",padding:"8px",textAlign:"center",border:`1px solid ${m.color}14`}}><div style={{fontSize:"18px"}}>{m.icon}</div><div style={{color:m.color,fontWeight:"700",fontSize:"16px"}}>{mc[m.id]||0}</div><div style={{color:"#1A3A1A",fontSize:"10px"}}>{m.titleHi}</div></div>)}
              </div>
            </div>
            <div style={{padding:"14px 20px"}}>
              <div style={{marginBottom:"22px"}}>
                <div style={{color:"#1A5A1A",fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"10px"}}>District Breakdown</div>
                {sorted.slice(0,13).map(([dist,count])=>{const maxV=sorted[0]?.[1]||1;return(
                  <div key={dist} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"7px"}}>
                    <div style={{width:"118px",fontSize:"11px",color:"#2A6A2A",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dist}</div>
                    <div style={{flex:1,background:"#09130A",borderRadius:"4px",height:"7px",overflow:"hidden"}}>
                      <div style={{width:`${(count/maxV)*100}%`,height:"100%",background:"linear-gradient(90deg,#E8622A,#10A87C)",borderRadius:"4px"}}/>
                    </div>
                    <div style={{width:"20px",fontSize:"11px",color:"#E8622A",fontWeight:"700",flexShrink:0}}>{count}</div>
                  </div>
                );})}
              </div>
              <div style={{color:"#1A5A1A",fontSize:"10px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"10px"}}>Recent Entries</div>
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
                      <div style={{color:"#1A4A1A",fontSize:"10px",marginTop:"2px"}}>{mO?.icon||"🧘"} {entry.asana||"Message"} · 📍 {entry.district}</div>
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
    </>
  );
}
