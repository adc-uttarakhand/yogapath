import { wrapText } from '../constants';

// ─── AIPAN ART HELPERS ────────────────────────────────────────────────────────
function aipanStrip(draw, x, y, w, unit, color, flip=false) {
  for(let i=0;i<w+unit*2;i+=unit*2){
    if(!flip){ draw.polygon([(x+i,y),(x+i+unit,y),(x+i+unit/2,y+unit)],{fill:color}); }
    else { draw.polygon([(x+i,y+unit),(x+i+unit,y+unit),(x+i+unit/2,y)],{fill:color}); }
  }
}

function drawLotus(ctx, cx, cy, r, fill) {
  import { aipan } from './aipan'; // reuse
  ctx.fillStyle = fill;
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const px=cx+Math.cos(a)*r*0.62, py=cy+Math.sin(a)*r*0.62;
    const pr=r*0.36;
    ctx.beginPath(); ctx.ellipse(px,py,pr,pr,0,0,Math.PI*2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(cx,cy,r*0.22,0,Math.PI*2); ctx.fill();
}

function diamond(ctx, cx, cy, w, h, col) {
  ctx.fillStyle=col;
  ctx.beginPath(); ctx.moveTo(cx,cy-h/2); ctx.lineTo(cx+w/2,cy); ctx.lineTo(cx,cy+h/2); ctx.lineTo(cx-w/2,cy); ctx.closePath(); ctx.fill();
}

function dots(ctx, x1, y1, x2, y2, sp, r, col) {
  ctx.fillStyle=col;
  for(let x=x1+sp/2;x<x2;x+=sp) for(let y=y1+sp/2;y<y2;y+=sp){ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
}

function aipanH(ctx, x, y, w, unit, color, flip=false) {
  ctx.fillStyle=color;
  for(let i=0;i<w+unit*2;i+=unit*2){
    if(!flip){ ctx.beginPath(); ctx.moveTo(x+i,y); ctx.lineTo(x+i+unit,y); ctx.lineTo(x+i+unit/2,y+unit); ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(x+i,y+unit); ctx.lineTo(x+i+unit,y+unit); ctx.lineTo(x+i+unit/2,y); ctx.closePath(); ctx.fill(); }
  }
}

// ─── BACKGROUND DRAWING ───────────────────────────────────────────────────────
export function drawBackground(ctx, W, H, style) {
  ctx.clearRect(0,0,W,H);
  const bw=Math.round(Math.min(W,H)*0.038);

  if(style==="aipan_red"||style==="aipan_saffron"){
    const bg=style==="aipan_red"?"#6A0A0A":"#A05010";
    const pc=style==="aipan_red"?"rgba(255,240,220,0.55)":"rgba(255,250,200,0.55)";
    const dc=style==="aipan_red"?"rgba(90,0,0,0.4)":"rgba(80,30,0,0.4)";
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="rgba(255,255,255,0.06)";
    for(let x=bw;x<W;x+=Math.round(W/28)) for(let y=bw;y<H;y+=Math.round(W/28)){ ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill(); }
    aipanH(ctx,0,0,W,bw,pc);
    aipanH(ctx,0,H-bw,W,bw,pc,true);
    const lr=Math.round(Math.min(W,H)*0.055);
    const off=bw*2+lr;
    [[off,off],[W-off,off],[off,H-off],[W-off,H-off]].forEach(([cx,cy])=>{ ctx.fillStyle=pc; drawLotus(ctx,cx,cy,lr,pc); });
    ctx.fillStyle="rgba(255,198,52,0.8)";
    ctx.beginPath(); ctx.arc(W/2,bw*1.6,bw*0.55,0,Math.PI*2); ctx.fill();

  } else if(style==="himalaya") {
    const sky=ctx.createLinearGradient(0,0,0,H*0.62);
    sky.addColorStop(0,"#071228"); sky.addColorStop(0.4,"#0a2060"); sky.addColorStop(0.75,"#1a4a8a"); sky.addColorStop(1,"#5a90c0");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="rgba(255,255,255,0.6)";
    ctx.beginPath(); ctx.moveTo(0,H*0.52); ctx.lineTo(W*0.08,H*0.15); ctx.lineTo(W*0.22,H*0.32); ctx.lineTo(W*0.3,H*0.08); ctx.lineTo(W*0.42,H*0.25); ctx.lineTo(W*0.55,H*0.04); ctx.lineTo(W*0.67,H*0.2); ctx.lineTo(W*0.8,H*0.1); ctx.lineTo(W*0.9,H*0.22); ctx.lineTo(W,H*0.3); ctx.lineTo(W,H*0.52); ctx.closePath(); ctx.fill();
    ctx.fillStyle="rgba(235,245,255,0.9)";
    [[W*0.55,H*0.04,W*0.06],[W*0.3,H*0.08,W*0.05],[W*0.8,H*0.1,W*0.045]].forEach(([px,py,pw])=>{ ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px-pw,py+pw*1.1); ctx.lineTo(px+pw,py+pw*1.1); ctx.closePath(); ctx.fill(); });
    const val=ctx.createLinearGradient(0,H*0.48,0,H); val.addColorStop(0,"#1a4a18"); val.addColorStop(1,"#050f05");
    ctx.fillStyle=val; ctx.fillRect(0,H*0.48,W,H*0.52);
    const ov=ctx.createLinearGradient(0,0,0,H); ov.addColorStop(0,"rgba(0,0,0,0.28)"); ov.addColorStop(1,"rgba(0,0,0,0.55)");
    ctx.fillStyle=ov; ctx.fillRect(0,0,W,H);

  } else if(style==="valley") {
    const bg=ctx.createLinearGradient(0,0,0,H); bg.addColorStop(0,"#0a1a12"); bg.addColorStop(0.35,"#1a3a18"); bg.addColorStop(1,"#050f05");
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    const glw=ctx.createRadialGradient(W*0.5,0,0,W*0.5,0,H*0.4); glw.addColorStop(0,"rgba(30,80,30,0.3)"); glw.addColorStop(1,"transparent");
    ctx.fillStyle=glw; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(0,0,W,H);

  } else if(style==="sunset") {
    const sky=ctx.createLinearGradient(0,0,0,H*0.65); sky.addColorStop(0,"#1a0818"); sky.addColorStop(0.2,"#4a1028"); sky.addColorStop(0.5,"#a03018"); sky.addColorStop(0.75,"#d05820"); sky.addColorStop(1,"#e87830");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="rgba(15,5,5,0.85)";
    ctx.beginPath(); ctx.moveTo(0,H*0.5); ctx.lineTo(W*0.1,H*0.22); ctx.lineTo(W*0.38,H*0.16); ctx.lineTo(W*0.62,H*0.12); ctx.lineTo(W*0.88,H*0.18); ctx.lineTo(W,H*0.3); ctx.lineTo(W,H*0.5); ctx.closePath(); ctx.fill();
    const gnd=ctx.createLinearGradient(0,H*0.48,0,H); gnd.addColorStop(0,"#200808"); gnd.addColorStop(1,"#080205");
    ctx.fillStyle=gnd; ctx.fillRect(0,H*0.48,W,H*0.52);
    ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(0,0,W,H);

  } else {
    // dark
    ctx.fillStyle="#09090F"; ctx.fillRect(0,0,W,H);
    const r1=ctx.createRadialGradient(W*0.2,H*0.1,0,W*0.2,H*0.1,W*0.45); r1.addColorStop(0,"rgba(232,98,42,0.07)"); r1.addColorStop(1,"transparent");
    ctx.fillStyle=r1; ctx.fillRect(0,0,W,H);
    const r2=ctx.createRadialGradient(W*0.8,H*0.9,0,W*0.8,H*0.9,W*0.4); r2.addColorStop(0,"rgba(16,168,124,0.06)"); r2.addColorStop(1,"transparent");
    ctx.fillStyle=r2; ctx.fillRect(0,0,W,H);
  }
}

// ─── PORTRAIT / SQUARE FRAME (programmatic) ───────────────────────────────────
export function drawAYUSHFrame(canvas, source, { asana, name, district, role, mode, msg, bgStyle="dark", orientation="portrait" }) {
  const ctx=canvas.getContext("2d");
  const W=canvas.width, H=canvas.height;
  const isLandscape=W>H;
  const isAipan=bgStyle.startsWith("aipan");
  const accent=mode==="message"?"#8B5CF6":(asana?.color||"#E8622A");
  const textBase=isAipan?"#FFF8F0":"#EEEEF0";
  const textMuted=isAipan?"rgba(255,240,210,0.55)":"rgba(160,200,160,0.6)";
  const panelBg=isAipan?"rgba(0,0,0,0.55)":(bgStyle==="dark"?"#060A06":"rgba(0,0,0,0.65)");

  drawBackground(ctx,W,H,bgStyle);

  if(!isLandscape){
    const HEADER=Math.round(H*0.115), FOOTER=Math.round(H*0.235);
    const MY=HEADER, MH=H-HEADER-FOOTER;
    if(source&&(source.readyState===undefined||source.readyState>=2)){
      ctx.save(); ctx.beginPath(); ctx.rect(0,MY,W,MH); ctx.clip();
      const sw=source.videoWidth||source.naturalWidth||W, sh=source.videoHeight||source.naturalHeight||H;
      const sc=Math.max(W/sw,MH/sh);
      ctx.drawImage(source,(W-sw*sc)/2,MY+(MH-sh*sc)/2,sw*sc,sh*sc);
      ctx.restore();
      const fadeB=ctx.createLinearGradient(0,MY+MH-H*0.1,0,MY+MH); fadeB.addColorStop(0,"transparent"); fadeB.addColorStop(1,bgStyle==="dark"?"#09090F":"rgba(0,0,0,0.7)");
      ctx.fillStyle=fadeB; ctx.fillRect(0,MY+MH-H*0.1,W,H*0.1);
    }
    ctx.fillStyle=panelBg; ctx.fillRect(0,0,W,HEADER);
    ctx.fillStyle=accent; ctx.fillRect(0,0,W,4);
    const fs=H/1280;
    ctx.font=`${Math.round(46*fs)}px serif`; ctx.fillStyle="rgba(255,255,255,0.75)"; ctx.textAlign="left"; ctx.fillText("🕉",20,Math.round(72*fs+8));
    ctx.textAlign="center";
    ctx.font=`bold ${Math.round(30*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase; ctx.fillText("AYUSH UTTARAKHAND",W/2,Math.round(44*fs+4));
    ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`; ctx.fillStyle="rgba(255,255,255,0.78)"; ctx.fillText("International Day of Yoga 2026  •  21 June 2026",W/2,Math.round(80*fs+4));
    const FY=H-FOOTER; ctx.fillStyle=panelBg; ctx.fillRect(0,FY,W,FOOTER);
    ctx.fillStyle=accent; ctx.fillRect(22,FY+16,4,FOOTER-32);
    let fy=FY+Math.round(38*fs)+16; ctx.textAlign="left";
    ctx.font=`bold ${Math.round(34*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase; ctx.fillText(name||"Yogi",42,fy);
    if(role){fy+=Math.round(28*fs);ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`;ctx.fillStyle=accent;ctx.fillText(role,42,fy);}
    fy+=Math.round(26*fs); ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`; ctx.fillStyle=textMuted; ctx.fillText(`📍 ${district||"Uttarakhand"}`,42,fy);
    fy+=Math.round(32*fs);
    if(mode==="message"){ctx.font=`bold ${Math.round(30*fs)}px Arial,sans-serif`;ctx.fillStyle="#A78BFA";ctx.fillText("💬  Yoga Message",42,fy);fy+=Math.round(36*fs);}
    else if(asana){ctx.font=`bold ${Math.round(20*fs)}px Arial,sans-serif`;ctx.fillStyle=accent;ctx.fillText(`${asana.icon}  ${asana.name}  |  ${asana.sanskrit}`,42,fy);fy+=Math.round(26*fs);
      ctx.font=`${Math.round(17*fs)}px Arial,sans-serif`;ctx.fillStyle=textMuted;(asana.benefits||[]).slice(0,2).forEach(b=>{ctx.fillText(`✓  ${b}`,42,fy);fy+=Math.round(23*fs);});}
    fy+=4; ctx.font=`italic ${Math.round(16*fs)}px Georgia,serif`; ctx.fillStyle=isAipan?"rgba(255,230,100,0.9)":"rgba(200,160,20,0.9)";
    wrapText(ctx,`"${msg}"`,42,fy,W-84,Math.round(22*fs),2);
    ctx.textAlign="center"; ctx.font=`${Math.round(11*fs)}px Arial,sans-serif`; ctx.fillStyle="rgba(100,150,100,0.3)";
    ctx.fillText("Dept. of Ayurvedic & Unani Services  •  National AYUSH Mission, Uttarakhand",W/2,H-12);
  } else {
    // Landscape layout (full-width center)
    const HEADER=Math.round(H*0.13), FOOTER=Math.round(H*0.09);
    const BODY_Y=HEADER; const BODY_H=H-HEADER-FOOTER;
    const fs=H/720;
    if(source&&(source.readyState===undefined||source.readyState>=2)){
      ctx.save(); ctx.beginPath(); ctx.rect(0,BODY_Y,W,BODY_H); ctx.clip();
      const sw=source.videoWidth||source.naturalWidth||W, sh=source.videoHeight||source.naturalHeight||H;
      const sc=Math.max(W/sw,BODY_H/sh);
      ctx.drawImage(source,(W-sw*sc)/2,BODY_Y+(BODY_H-sh*sc)/2,sw*sc,sh*sc);
      ctx.restore();
    }
    ctx.fillStyle=panelBg; ctx.fillRect(0,0,W,HEADER);
    ctx.fillStyle=accent; ctx.fillRect(0,0,W,3);
    ctx.textAlign="center";
    ctx.font=`bold ${Math.round(26*fs)}px Arial,sans-serif`; ctx.fillStyle=textBase; ctx.fillText("AYUSH UTTARAKHAND",W/2,Math.round(44*fs));
    ctx.font=`${Math.round(15*fs)}px Arial,sans-serif`; ctx.fillStyle="rgba(255,255,255,0.75)";
    ctx.fillText("International Day of Yoga 2026  •  21 June 2026",W/2,Math.round(68*fs));
    ctx.fillStyle=panelBg; ctx.fillRect(0,H-FOOTER,W,FOOTER);
    ctx.textAlign="center"; ctx.font=`${Math.round(12*fs)}px Arial,sans-serif`; ctx.fillStyle="rgba(100,150,100,0.25)";
    ctx.fillText("Dept. of Ayurvedic & Unani Services  •  National AYUSH Mission, Uttarakhand  •  IDY 2026",W/2,H-FOOTER/2+5);
  }

  ctx.strokeStyle=isAipan?"rgba(255,255,255,0.35)":accent; ctx.lineWidth=5;
  ctx.strokeRect(2.5,2.5,W-5,H-5);
}

// ─── SQUARE PNG FRAME ─────────────────────────────────────────────────────────
export function drawSquareFrame(canvas, source, frameImg, p) {
  const ctx=canvas.getContext("2d");
  const FW=1080,FH=1080,STRIP=88;
  canvas.width=FW; canvas.height=FH+STRIP;
  if(source&&(source.readyState===undefined||source.readyState>=2)){
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,FW,FH); ctx.clip();
    const sw=source.videoWidth||source.naturalWidth||FW, sh=source.videoHeight||source.naturalHeight||FH;
    const sc=Math.max(FW/sw,FH/sh);
    ctx.drawImage(source,(FW-sw*sc)/2,(FH-sh*sc)/2,sw*sc,sh*sc);
    ctx.restore();
  } else { ctx.fillStyle="#e8e8e8"; ctx.fillRect(0,0,FW,FH); }
  if(frameImg) ctx.drawImage(frameImg,0,0,FW,FH);
  const sg=ctx.createLinearGradient(0,FH,0,FH+STRIP);
  sg.addColorStop(0,"#0A1A0A"); sg.addColorStop(1,"#060F06");
  ctx.fillStyle=sg; ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A"; ctx.fillRect(0,FH,FW,4);
  const pin=String.fromCodePoint(0x1F4CD);
  const parts=[p.name||"Yogi"];
  if(p.role) parts.push(p.role);
  if(p.district) parts.push(pin+" "+p.district);
  if(p.mode==="message") parts.push("Yoga Message");
  else if(p.asana) parts.push(p.asana.name+" | "+p.asana.sanskrit);
  const line=parts.join("   |   ");
  const MAX_W=FW-48; let fs=28;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W&&fs>13){fs--;ctx.font="bold "+fs+"px Arial,sans-serif";}
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#FFFFFF"; ctx.fillText(line,FW/2,FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}

// ─── LANDSCAPE PNG FRAME ──────────────────────────────────────────────────────
export function drawLandscapeFrame(canvas, source, frameImg, p) {
  const ctx=canvas.getContext("2d");
  const FW=1280,FH=640,STRIP=88;
  canvas.width=FW; canvas.height=FH+STRIP;
  if(source&&(source.readyState===undefined||source.readyState>=2)){
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,FW,FH); ctx.clip();
    const sw=source.videoWidth||source.naturalWidth||FW, sh=source.videoHeight||source.naturalHeight||FH;
    const sc=Math.max(FW/sw,FH/sh);
    ctx.drawImage(source,(FW-sw*sc)/2,(FH-sh*sc)/2,sw*sc,sh*sc);
    ctx.restore();
  } else { ctx.fillStyle="#e8e8e8"; ctx.fillRect(0,0,FW,FH); }
  if(frameImg) ctx.drawImage(frameImg,0,0,FW,FH);
  const sg=ctx.createLinearGradient(0,FH,0,FH+STRIP);
  sg.addColorStop(0,"#0A1A0A"); sg.addColorStop(1,"#060F06");
  ctx.fillStyle=sg; ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A"; ctx.fillRect(0,FH,FW,4);
  const pin=String.fromCodePoint(0x1F4CD);
  const parts=[p.name||"Yogi"];
  if(p.role) parts.push(p.role);
  if(p.district) parts.push(pin+" "+p.district);
  if(p.mode==="message") parts.push("Yoga Message");
  else if(p.asana) parts.push(p.asana.name+" | "+p.asana.sanskrit);
  const line=parts.join("   |   ");
  const MAX_W=FW-48; let fs=28;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W&&fs>13){fs--;ctx.font="bold "+fs+"px Arial,sans-serif";}
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#FFFFFF"; ctx.fillText(line,FW/2,FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}

// ─── PORTRAIT PNG FRAME ───────────────────────────────────────────────────────
export function drawPortraitFrame(canvas, source, frameImg, p) {
  const ctx=canvas.getContext("2d");
  const FW=720,FH=1280,STRIP=88;
  canvas.width=FW; canvas.height=FH+STRIP;
  if(source&&(source.readyState===undefined||source.readyState>=2)){
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,FW,FH); ctx.clip();
    const sw=source.videoWidth||source.naturalWidth||FW, sh=source.videoHeight||source.naturalHeight||FH;
    const sc=Math.max(FW/sw,FH/sh);
    ctx.drawImage(source,(FW-sw*sc)/2,(FH-sh*sc)/2,sw*sc,sh*sc);
    ctx.restore();
  } else { ctx.fillStyle="#e8e8e8"; ctx.fillRect(0,0,FW,FH); }
  if(frameImg) ctx.drawImage(frameImg,0,0,FW,FH);
  const sg=ctx.createLinearGradient(0,FH,0,FH+STRIP);
  sg.addColorStop(0,"#0A1A0A"); sg.addColorStop(1,"#060F06");
  ctx.fillStyle=sg; ctx.fillRect(0,FH,FW,STRIP);
  ctx.fillStyle="#E8622A"; ctx.fillRect(0,FH,FW,4);
  const pin=String.fromCodePoint(0x1F4CD);
  const parts=[p.name||"Yogi"];
  if(p.role) parts.push(p.role);
  if(p.district) parts.push(pin+" "+p.district);
  if(p.mode==="message") parts.push("Yoga Message");
  else if(p.asana) parts.push(p.asana.name+" | "+p.asana.sanskrit);
  const line=parts.join("   |   ");
  const MAX_W=FW-48; let fs=26;
  ctx.font="bold "+fs+"px Arial,sans-serif";
  while(ctx.measureText(line).width>MAX_W&&fs>12){fs--;ctx.font="bold "+fs+"px Arial,sans-serif";}
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#FFFFFF"; ctx.fillText(line,FW/2,FH+STRIP/2+4);
  ctx.textBaseline="alphabetic";
}

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────
export function drawCertificate(canvas, { name, district, days, completedDate, certNum }) {
  const ctx=canvas.getContext("2d");
  const W=1200,H=850; canvas.width=W; canvas.height=H;
  const GOLD="#C8920A", MAROON="#8B1A1A", SAFFRON="#E8622A", DARK="#1A0A00";

  ctx.fillStyle="#FFFDF5"; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=GOLD; ctx.lineWidth=8; ctx.strokeRect(12,12,W-24,H-24);
  ctx.strokeStyle=MAROON; ctx.lineWidth=2; ctx.strokeRect(22,22,W-44,H-44);
  ctx.strokeStyle=GOLD; ctx.lineWidth=1; ctx.strokeRect(30,30,W-60,H-60);

  [[50,50],[W-50,50],[50,H-50],[W-50,H-50]].forEach(([cx,cy])=>{
    ctx.fillStyle=GOLD;
    ctx.beginPath(); ctx.moveTo(cx,cy-14); ctx.lineTo(cx+14,cy); ctx.lineTo(cx,cy+14); ctx.lineTo(cx-14,cy); ctx.closePath(); ctx.fill();
  });

  ctx.textAlign="center";
  ctx.font="bold 15px Arial,sans-serif"; ctx.fillStyle=MAROON;
  ctx.fillText("DEPARTMENT OF AYURVEDIC & UNANI SERVICES, GOVERNMENT OF UTTARAKHAND",W/2,72);
  ctx.font="13px Arial,sans-serif"; ctx.fillStyle=GOLD;
  ctx.fillText("National AYUSH Mission, Uttarakhand  |  YogaPath Uttarakhand",W/2,92);
  ctx.strokeStyle=GOLD; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(50,106); ctx.lineTo(W-50,106); ctx.stroke();

  ctx.font="bold 48px Georgia,serif"; ctx.fillStyle=DARK; ctx.fillText("Certificate of Achievement",W/2,170);
  ctx.font="22px Georgia,serif"; ctx.fillStyle=SAFFRON; ctx.fillText("प्रमाण पत्र",W/2,205);

  ctx.font="16px Arial,sans-serif"; ctx.fillStyle=DARK+"CC"; ctx.fillText("This is to certify that",W/2,255);

  ctx.font="bold 52px Georgia,serif"; ctx.fillStyle=MAROON; ctx.fillText(name,W/2,325);
  const nw=ctx.measureText(name).width;
  ctx.strokeStyle=SAFFRON; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W/2-nw/2,337); ctx.lineTo(W/2+nw/2,337); ctx.stroke();

  ctx.font="15px Arial,sans-serif"; ctx.fillStyle=DARK+"AA"; ctx.fillText("District: "+district,W/2,365);
  ctx.font="17px Arial,sans-serif"; ctx.fillStyle=DARK; ctx.fillText("has successfully completed the",W/2,405);
  ctx.font="bold 38px Georgia,serif"; ctx.fillStyle=SAFFRON; ctx.fillText(days+"-Day Yoga Challenge",W/2,452);
  ctx.font="15px Arial,sans-serif"; ctx.fillStyle=DARK+"BB"; ctx.fillText("International Day of Yoga 2026  |  YogaPath Uttarakhand",W/2,485);
  ctx.font="bold 18px Arial,sans-serif"; ctx.fillStyle=GOLD; ctx.fillText("★  Certified Yoga Abhyasi  ★",W/2,525);

  ctx.strokeStyle=GOLD; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(50,545); ctx.lineTo(W-50,545); ctx.stroke();

  ctx.font="13px Arial,sans-serif"; ctx.fillStyle=DARK+"99";
  ctx.textAlign="left";  ctx.fillText("Date of Completion: "+completedDate,70,575);
  ctx.textAlign="right"; ctx.fillText("Certificate No: "+certNum,W-70,575);
  ctx.textAlign="center"; ctx.fillText("Challenge Duration: "+days+" Days",W/2,575);

  // Seal only (no signatures)
  const sigY=660;
  ctx.beginPath(); ctx.arc(W/2,sigY,60,0,Math.PI*2);
  ctx.strokeStyle=GOLD; ctx.lineWidth=3; ctx.stroke();
  ctx.beginPath(); ctx.arc(W/2,sigY,52,0,Math.PI*2);
  ctx.strokeStyle=MAROON+"55"; ctx.lineWidth=1; ctx.stroke();
  ctx.font="bold 16px Arial,sans-serif"; ctx.fillStyle=MAROON;
  ctx.fillText("AYUSH",W/2,sigY-8); ctx.fillText("UTTARAKHAND",W/2,sigY+12);
  ctx.font="11px Arial,sans-serif"; ctx.fillStyle=GOLD; ctx.fillText("GOVT. OF UTTARAKHAND",W/2,sigY+30);

  ctx.font="11px Arial,sans-serif"; ctx.fillStyle=DARK+"55";
  ctx.fillText("This certificate is digitally generated and authenticated by YogaPath Uttarakhand.",W/2,H-42);
  ctx.fillText("Certificate ID: "+certNum,W/2,H-24);
}
