let ytPlayer, audioCtx, analyser, source, dataArray, animationId;
let userInteracted = false;
let neonActive = false;
const colors = ["#b84cff","#1f8bff","#5eff5e","#ff33a6","#ff914d"];

window.onYouTubeIframeAPIReady = function(){
  ytPlayer = new YT.Player("ytPlayer", {
    height:"405", width:"720",
    playerVars:{ rel:0, modestbranding:1 },
    events:{
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  });
};

function onPlayerReady(){
  document.body.addEventListener("click", ()=>{
    if(!userInteracted){
      userInteracted = true;
      try{ ytPlayer.playVideo(); ytPlayer.mute(); }catch{}
    }
  });
  initColorPicker();
}

function onPlayerStateChange(e){
  if(e.data === YT.PlayerState.PLAYING){
    if(!neonActive){
      neonActive = true;
      document.body.classList.add("neon-active");
      startVisualizer();
    }
  }else if(e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED){
    stopVisualizer();
    document.body.classList.remove("neon-active");
    neonActive = false;
  }
}

function startVisualizer(){
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

  try{
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    if(!source){
      const element = ytPlayer.getIframe();
      source = audioCtx.createMediaElementSource(element);
      analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
  }catch(e){ console.warn("AudioContext error:",e); return; }

  function draw(){
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bars = 64;
    const barWidth = canvas.width / bars;
    for(let i=0;i<bars;i++){
      const value = dataArray[i];
      const barHeight = (value/255) * canvas.height;
      const hue = 200 + i*2;
      ctx.fillStyle = `hsl(${hue},100%,60%)`;
      ctx.fillRect(i*barWidth, canvas.height - barHeight, barWidth-2, barHeight);
    }
  }
  draw();
}

function stopVisualizer(){
  cancelAnimationFrame(animationId);
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function initColorPicker(){
  const box = document.getElementById("colorPicker");
  const saved = localStorage.getItem("karaokeColor");
  const active = saved || colors[1];
  document.documentElement.style.setProperty("--accent", active);

  colors.forEach(c=>{
    const sw = document.createElement("div");
    sw.className = "color-swatch";
    sw.style.background = c;
    if(c===active) sw.classList.add("active");
    sw.onclick = ()=>{
      document.querySelectorAll(".color-swatch").forEach(s=>s.classList.remove("active"));
      sw.classList.add("active");
      document.documentElement.style.setProperty("--accent", c);
      localStorage.setItem("karaokeColor", c);
    };
    box.appendChild(sw);
  });
}

document.getElementById("buscarYT").onclick = buscarYouTube;

async function buscarYouTube(){
  const q = document.getElementById("ytQuery").value.trim();
  if(!q) return alert("Escribe algo para buscar.");
  const key = "AIzaSyA4NpwgJmEzBGGTzFFjShyrtWICgSSml-I";
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(q)}&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  renderYTResults(data.items || []);
}

function renderYTResults(items){
  const cont = document.getElementById("ytResults");
  cont.innerHTML = "";
  items.forEach(it=>{
    const id = it.id.videoId;
    const sn = it.snippet;
    const div = document.createElement("div");
    div.className = "ytCard";
    div.innerHTML = `
      <img class="ytThumb" src="${sn.thumbnails.medium.url}">
      <div class="ytBody">
        <div class="ytTitle">${sn.title}</div>
        <div class="ytMeta">${sn.channelTitle}</div>
        <button onclick="ytPlayer.loadVideoById('${id}')">▶️ Reproducir</button>
      </div>`;
    cont.appendChild(div);
  });
}

document.getElementById("exportAll").onclick = ()=>alert("Función de exportar Builder aún activa. Listas en localStorage.");
