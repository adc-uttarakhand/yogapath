import { useState, useRef, useEffect, useCallback } from "react";
import { MODES, ASANAS, CATEGORIES, ORIENTATIONS, BG_STYLES, BADGES, DAILY_TASKS, hexToRgb, getInitials, AVATAR_COLORS } from './constants';
import { drawCertificate } from './utils/canvas';

// ─── SHARED UI HELPERS ────────────────────────────────────────────────────────
function BgSwatch({ style, selected, onClick }) {
  const isGrad = style.thumb.startsWith("linear");
  return (
    <div onClick={onClick} className="tap" style={{borderRadius:"12px",overflow:"hidden",border:`2.5px solid ${selected?"#10A87C":"#101E10"}`,cursor:"pointer",position:"relative",transition:"all 0.15s",boxShadow:selected?"0 0 0 2px rgba(16,168,124,0.35)":"none"}}>
      <div style={{width:"100%",paddingTop:"62%",background:isGrad?style.thumb:undefined,position:"relative"}}>
        {!isGrad&&<div style={{position:"absolute",inset:0,background:style.thumb}}/>}
      </div>
      <div style={{padding:"6px 4px",background:"#0A120A",textAlign:"center"}}>
        <div style={{fontSize:"10px",color:selected?"#10A87C":"#1A5A1A",fontWeight:"600",lineHeight:1.2}}>{style.labelHi}</div>
      </div>
      {selected&&<div style={{position:"absolute",top:"5px",right:"5px",background:"#10A87C",color:"white",fontSize:"10px",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"800"}}>✓</div>}
    </div>
  );
}

// ─── HOMESCREEN ──────────────────────────────────────────────────
export function HomeScreen({ nav, user, comm, pwa, chal }) {
  const { screen, setScreen } = nav;
  const { name } = user;
  const { community, loading } = comm;
  const { isInstalled, isIOS, showIOSHint, setShowIOSHint, handleInstall } = pwa;
  const { challenge } = chal;

  return (
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
              {[{v:community.length+"+",l:"Yogis",c:"#E8622A"},{v:"13",l:"Districts",c:"#10A87C"},{v:"15",l:"Frames",c:"#8B5CF6"}].map(s=>(
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
                  <div style={{color:"rgba(16,168,124,0.8)",fontSize:"11px",fontWeight:"600"}}>{community.length} entries</div>
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
  );
}

// ─── ONBOARDSCREEN ──────────────────────────────────────────────────
export function OnboardScreen({ nav, user, chal }) {
  const { screen, setScreen } = nav;
  const { name, setName, district, setDistrict, role, setRole } = user;
  const { loadChallenge } = chal;

  return (
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
  );
}

// ─── MODESELECTSCREEN ──────────────────────────────────────────────────
export function ModeSelectScreen({ nav, user, creation }) {
  const { screen, setScreen } = nav;
  const { name, district, role } = user;
  const { mode, setMode } = creation;

  return (
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
  );
}

// ─── ASANASELECTSCREEN ──────────────────────────────────────────────────
export function AsanaSelectScreen({ nav, creation }) {
  const { screen, setScreen } = nav;
  const [cat, setCat] = useState("All");
  const { asana, setAsana } = creation;
  const filtered = cat === "All" ? ASANAS : ASANAS.filter(a => a.category === cat);

  return (
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
  );
}

// ─── FRAMESTYLESCREEN ──────────────────────────────────────────────────
export function FrameStyleScreen({ nav, creation }) {
  const { screen, setScreen } = nav;
  const { orientation, setOrientation, bgStyle, setBgStyle, sqFrame, setSqFrame, lsFrame, setLsFrame, ptFrame, setPtFrame, mode } = creation;

  return (
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
  );
}

// ─── PREVIEWSCREEN ──────────────────────────────────────────────────
export function PreviewScreen({ nav, user, creation, captureProps }) {
  const { screen, setScreen } = nav;
  const { name, district, role } = user;
  const { mode, asana, orientation, bgStyle, sqFrame, msg } = creation;
  const { captured, joined, autoLog } = captureProps;

  return (
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
            <button className="tap" onClick={download} style={{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 3px 14px rgba(5,150,105,0.28)"}}>⬇ Download</button>
            <button className="tap" onClick={shareWA} style={{background:"linear-gradient(135deg,#25D366,#1DAB52)",color:"white",border:"none",borderRadius:"13px",padding:"14px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 3px 14px rgba(37,211,102,0.28)"}}>📤 WhatsApp</button>
          </div>
          {joined&&(
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(16,168,124,0.08)",border:"1px solid rgba(16,168,124,0.2)",borderRadius:"12px",padding:"12px 16px",marginBottom:"10px"}}>
              <span style={{fontSize:"18px"}}>✅</span>
              <span style={{color:"#10A87C",fontSize:"14px",fontWeight:"600"}}>District Wall में जोड़ा गया</span>
            </div>
          )}
          <button onClick={()=>setScreen("community")} style={{width:"100%",background:"transparent",color:"rgba(255,255,255,0.3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"13px",padding:"12px",fontSize:"13px",cursor:"pointer"}}>
            View District Wall →
          </button>
        </div>
  );
}

// ─── COMMUNITYSCREEN ──────────────────────────────────────────────────
export function CommunityScreen({ nav, user, comm, captureProps }) {
  const { screen, setScreen } = nav;
  const { name, district } = user;
  const { community, distStats, loading, loadCommunity } = comm;
  const { joined } = captureProps;
  const dc={...distStats}; community.forEach(c=>{if(c.district) dc[c.district]=(dc[c.district]||0)+1;}); const sorted=Object.entries(dc).sort((a,b)=>b[1]-a[1]); const mc={photo:0,yoga_video:0,message:0}; community.forEach(c=>{if(c.mode) mc[c.mode]=(mc[c.mode]||0)+1;});

  return (
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
      }
  );
}

// ─── CHALLENGESCREEN ──────────────────────────────────────────────────
export function ChallengeScreen({ nav, user, chal }) {
  const { screen, setScreen } = nav;
  const { name, district } = user;
  const { challenge, startChallenge, certUrl } = chal;

  return (
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
  );
}

// ─── TRACKERSCREEN ──────────────────────────────────────────────────
export function TrackerScreen({ nav, chal }) {
  const { screen, setScreen } = nav;
  const { challenge, markDone } = chal;
  const day=Math.min(challenge.done.length+1, challenge.days); const task=DAILY_TASKS[day-1]||DAILY_TASKS[20]; const today=new Date().toISOString().split("T")[0]; const doneToday=challenge.lastCheckin===today; const pct=Math.round((challenge.done.length/challenge.days)*100);

  return (
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
      }
  );
}

// ─── CERTIFICATESCREEN ──────────────────────────────────────────────────
export function CertificateScreen({ nav, user, chal }) {
  const { screen, setScreen } = nav;
  const { name, district } = user;
  const { challenge, certUrl, setCertUrl } = chal;
  const certCanvasRef = useRef(null);

  function generateCert() {
    if (!certCanvasRef.current || !challenge) return;
    const today = new Date().toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"});
    drawCertificate(certCanvasRef.current, {name, district, days:challenge.days, completedDate:today, certNum:challenge.certNum});
    setCertUrl(certCanvasRef.current.toDataURL("image/jpeg", 0.95));
  }

  function downloadCert() {
    if (!certUrl) return;
    const a = document.createElement("a");
    a.href = certUrl; a.download = `YogaPath-Certificate-${name.replace(/\s/g,"-")}.jpg`; a.click();
  }

  return (
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
  );
}

