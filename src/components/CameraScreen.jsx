import { useState, useRef, useEffect, useCallback } from "react";
import { drawAYUSHFrame, drawSquareFrame, drawLandscapeFrame, drawPortraitFrame } from '../utils/canvas';

export default function CameraScreen({ mode, asana, name, district, role, msg, bgStyle, orientation, sqFrame, lsFrame, ptFrame, onCapture, onBack }) {
  const videoRef=useRef(null), canvasRef=useRef(null), animRef=useRef(null), recRef=useRef(null), chunksRef=useRef([]), streamRef=useRef(null), sqImgRef=useRef(null), lsImgRef=useRef(null), ptImgRef=useRef(null);
  const [camState,setCamState]=useState("idle");
  // Load square PNG frame directly inside CameraScreen
  useEffect(()=>{
    if(orientation==="square"&&sqFrame){
      const img=new Image();
      img.onload=()=>{ sqImgRef.current=img; };
      img.onerror=()=>{ sqImgRef.current=null; };
      img.src=`/frames/frame-sq-${sqFrame}.png`;
    } else { sqImgRef.current=null; }
  },[orientation,sqFrame]);

  useEffect(()=>{
    if(orientation==="portrait"&&ptFrame){
      const img=new Image();
      img.onload=()=>{ ptImgRef.current=img; };
      img.onerror=()=>{ ptImgRef.current=null; };
      img.src=`/frames/frame-pt-${ptFrame}.png`;
    } else if(orientation!=="portrait") { ptImgRef.current=null; }
  },[orientation,ptFrame]);

  useEffect(()=>{
    if(orientation==="landscape"&&lsFrame){
      const img=new Image();
      img.onload=()=>{ lsImgRef.current=img; };
      img.onerror=()=>{ lsImgRef.current=null; };
      img.src=`/frames/frame-ls-${lsFrame}.png`;
    } else { lsImgRef.current=null; }
  },[orientation,lsFrame]);
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
    const sqImg=sqImgRef.current;
    const lsImg=lsImgRef.current;
    if(orientation==="square"&&sqImg){
        if(cv.width!==1080) cv.width=1080;
        if(cv.height!==1168) cv.height=1168;
        drawSquareFrame(cv,videoRef.current,sqImg,{name,role,district,mode,asana,msg,sqFrame});
      } else if(orientation==="portrait"&&ptImgRef.current){
        if(cv.width!==720) cv.width=720;
        if(cv.height!==1368) cv.height=1368;
        drawPortraitFrame(cv,videoRef.current,ptImgRef.current,{name,role,district,mode,asana,msg});
      } else if(orientation==="landscape"&&lsImg){
        if(cv.width!==1280) cv.width=1280;
        if(cv.height!==728) cv.height=728;
        drawLandscapeFrame(cv,videoRef.current,lsImg,{name,role,district,mode,asana,msg});
      } else {
        if(cv.width!==CW) cv.width=CW;
        if(cv.height!==CH) cv.height=CH;
        drawAYUSHFrame(cv,videoRef.current,{asana,name,district,role,mode,msg,bgStyle,orientation});
      }
    animRef.current=requestAnimationFrame(drawLoop);
  },[asana,name,district,role,mode,msg,bgStyle,orientation,sqFrame,lsFrame,ptFrame,CW,CH]);

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
