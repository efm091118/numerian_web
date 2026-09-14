
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const stateKey = "numerianProgressV1";
const defaultState = {points:0, coins:0, stars:0, correct:0, attempts:0, streak:0, profile:"Visitante", completed:[]};
let state = {...defaultState, ...(JSON.parse(localStorage.getItem(stateKey) || "{}"))};
let activeTopic = "multiplicacion";
let currentQuestion = null;

const topics = {
  multiplicacion: {title:"Aventura de multiplicaciones mágicas",desc:"Resuelve multiplicaciones para desbloquear recompensas.",icon:"🧙‍♂️",
    q:()=>{const a=rnd(2,12),b=rnd(2,12); return mk(`${a} × ${b}`,a*b);}},
  division: {title:"El mercado digital de las divisiones",desc:"Reparte productos de forma equitativa.",icon:"🛒",
    q:()=>{const b=rnd(2,10),ans=rnd(2,12),a=b*ans;return mk(`Si repartes ${a} objetos entre ${b} personas, ¿cuántos recibe cada una?`,ans);}},
  suma: {title:"Suma relámpago",desc:"Combina cantidades con rapidez y precisión.",icon:"⚡",
    q:()=>{const a=rnd(20,500),b=rnd(10,300);return mk(`${a} + ${b}`,a+b);}},
  resta: {title:"Misión resta",desc:"Encuentra cuánto queda y supera el reto.",icon:"🧭",
    q:()=>{let a=rnd(80,600),b=rnd(10,a-1);return mk(`${a} − ${b}`,a-b);}},
  fracciones: {title:"Pizza de fracciones",desc:"Reconoce fracciones sencillas con ejemplos visuales.",icon:"🍕",
    q:()=>{const qs=[["Una pizza tiene 8 porciones y comes 4. ¿Qué fracción comiste?","1/2",["1/4","1/2","3/4","2/3"]],["De 6 partes iguales tomas 2. ¿Qué fracción simplificada es?","1/3",["1/2","1/3","2/5","3/4"]],["¿Cuál fracción representa la mitad?","1/2",["1/3","1/4","1/2","2/3"]]];const x=qs[rnd(0,qs.length-1)];return {text:x[0],answer:x[1],options:shuffle(x[2])};}},
  geometria: {title:"Exploradores de geometría",desc:"Reconoce figuras, ángulos y perímetros.",icon:"📐",
    q:()=>{const qs=[["¿Cuántos lados tiene un hexágono?","6",["4","5","6","8"]],["Un cuadrado tiene lado de 5 cm. ¿Cuál es su perímetro?","20",["10","15","20","25"]],["¿Qué figura tiene 3 lados?","Triángulo",["Círculo","Triángulo","Rectángulo","Pentágono"]]];const x=qs[rnd(0,qs.length-1)];return {text:x[0],answer:x[1],options:shuffle(x[2])};}},
  medidas: {title:"Laboratorio de medidas",desc:"Practica longitud, tiempo, capacidad y masa.",icon:"📏",
    q:()=>{const qs=[["¿Cuántos centímetros hay en 2 metros?","200",["20","100","200","2000"]],["1 hora y 30 minutos equivalen a…","90 min",["60 min","75 min","90 min","130 min"]],["1000 mililitros equivalen a…","1 litro",["10 litros","1 litro","100 litros","1 gramo"]]];const x=qs[rnd(0,qs.length-1)];return {text:x[0],answer:x[1],options:shuffle(x[2])};}},
  problemas: {title:"Detectives de problemas",desc:"Elige la operación correcta en situaciones cotidianas.",icon:"🕵️",
    q:()=>{const qs=[["Ana tiene 4 bolsas con 7 canicas cada una. ¿Cuántas canicas tiene?","28",["11","24","28","32"]],["Hay 36 libros en 6 estantes iguales. ¿Cuántos van en cada estante?","6",["5","6","7","8"]],["Un bus lleva 45 personas y bajan 18. ¿Cuántas quedan?","27",["23","27","33","63"]]];const x=qs[rnd(0,qs.length-1)];return {text:x[0],answer:x[1],options:shuffle(x[2])};}}
};

function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function mk(text,answer){
  const vals = new Set([answer]);
  while(vals.size<4){ let v=Math.max(0, answer+rnd(-10,10)); if(v!==answer) vals.add(v); }
  return {text,answer:String(answer),options:shuffle([...vals].map(String))};
}
function save(){localStorage.setItem(stateKey,JSON.stringify(state)); updateUI()}
function updateUI(){
  $("#points").textContent=state.points;
  $("#coins").textContent=state.coins+" 🪙";
  $("#stars").textContent=state.stars+" ⭐";
  $("#streak").textContent=state.streak+" 🔥";
  $("#profileLabel").textContent=state.profile;
  $("#teacherPoints").textContent=state.points;
  $("#teacherCorrect").textContent=state.correct;
  $("#teacherAttempts").textContent=state.attempts;
  const acc=state.attempts?Math.round(state.correct/state.attempts*100):0;
  $("#teacherAccuracy").textContent=acc+"%";
  let level="Matemático Novato", progress=state.points%300;
  if(state.points>=600){level="Maestro Numerian";progress=300}
  else if(state.points>=300) level="Calculador Experto";
  $("#level").textContent=level;
  $("#levelBar").style.width=Math.min(100,progress/300*100)+"%";
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function newQuestion(){
  currentQuestion=topics[activeTopic].q();
  $("#question").textContent=currentQuestion.text;
  $("#gameVisual").textContent=topics[activeTopic].icon;
  $("#feedback").textContent=""; $("#feedback").className="feedback";
  $("#options").innerHTML="";
  currentQuestion.options.forEach(opt=>{
    const b=document.createElement("button"); b.className="option"; b.textContent=opt;
    b.onclick=()=>answer(opt,b); $("#options").appendChild(b);
  });
}
function answer(opt,btn){
  if(!currentQuestion) return;
  state.attempts++;
  $$(".option").forEach(b=>b.disabled=true);
  if(String(opt)===String(currentQuestion.answer)){
    state.correct++; state.streak++; state.points+=30; state.coins+=5; 
    if(state.streak%3===0) state.stars++;
    $("#feedback").textContent="¡Correcto! +30 puntos y +5 monedas."; $("#feedback").className="feedback good";
    btn.style.borderColor="#3AA867";
  }else{
    state.streak=0;
    $("#feedback").textContent=`Casi. La respuesta correcta era ${currentQuestion.answer}. Intenta explicar cómo se obtiene.`; $("#feedback").className="feedback bad";
    btn.style.borderColor="#D4584B";
  }
  save();
}
$$(".world").forEach(b=>b.addEventListener("click",()=>{
  $$(".world").forEach(x=>x.classList.remove("active")); b.classList.add("active");
  activeTopic=b.dataset.topic;
  $("#gameTitle").textContent=topics[activeTopic].title;
  $("#gameDescription").textContent=topics[activeTopic].desc;
  newQuestion();
}));
$("#newQuestion").onclick=newQuestion;

$$("[data-profile]").forEach(b=>b.onclick=()=>{state.profile=b.dataset.profile;save();toast(`Perfil ${state.profile} activado`)});
$("#resetProgress").onclick=()=>{if(confirm("¿Reiniciar puntos, monedas, estrellas y estadísticas de este navegador?")){state={...defaultState,profile:state.profile};save();toast("Progreso reiniciado")}};

$("#activityForm").addEventListener("submit",e=>{
  e.preventDefault();
  const activity={title:$("#activityTitle").value,grade:$("#activityGrade").value,question:$("#activityQuestion").value,answer:$("#activityAnswer").value};
  localStorage.setItem("numerianCustomActivity",JSON.stringify(activity));
  renderCustom(); e.target.reset(); toast("Actividad guardada para el estudiante");
});
function renderCustom(){
  const a=JSON.parse(localStorage.getItem("numerianCustomActivity")||"null");
  const box=$("#customActivityPlay");
  if(!a){$("#customActivityTitle").textContent="Aún no hay actividad personalizada";$("#customActivityText").textContent="Un docente puede crearla desde su panel y quedará disponible en este navegador.";box.innerHTML="";return}
  $("#customActivityTitle").textContent=a.title+" · "+a.grade;
  $("#customActivityText").textContent=a.question;
  box.innerHTML=`<label>Tu respuesta <input id="customAnswer" aria-label="Respuesta a actividad personalizada"></label><button class="btn secondary small" id="customCheck">Comprobar</button><div id="customFeedback" class="feedback"></div>`;
  $("#customCheck").onclick=()=>{
    const ok=$("#customAnswer").value.trim().toLowerCase()===String(a.answer).trim().toLowerCase();
    const f=$("#customFeedback");state.attempts++;
    if(ok){state.correct++;state.points+=40;state.coins+=8;f.textContent="¡Muy bien! +40 puntos.";f.className="feedback good"} else {f.textContent="Revisa el procedimiento y vuelve a intentarlo.";f.className="feedback bad"}
    save();
  };
}

// Memory game
let memoryFirst=null, memoryLock=false;
$("#memoryStart").onclick=()=>{
  const pairs=[[3,4],[6,7],[8,5],[9,3],[7,7],[12,4]].map(([a,b])=>[`${a}×${b}`,String(a*b)]);
  const cards=shuffle(pairs.flatMap((p,i)=>[{txt:p[0],pair:i},{txt:p[1],pair:i}]));
  const board=$("#memoryBoard"); board.innerHTML=""; memoryFirst=null; memoryLock=false;
  cards.forEach((c,idx)=>{
    const b=document.createElement("button");b.className="memory-card hidden-text";b.textContent=c.txt;b.dataset.pair=c.pair;b.dataset.idx=idx;
    b.onclick=()=>{
      if(memoryLock||b.classList.contains("matched")||!b.classList.contains("hidden-text"))return;
      b.classList.remove("hidden-text");
      if(!memoryFirst){memoryFirst=b;return}
      if(memoryFirst.dataset.pair===b.dataset.pair){
        memoryFirst.classList.add("matched");b.classList.add("matched");memoryFirst=null;state.points+=20;state.coins+=3;save();
        if($$(".memory-card.matched").length===cards.length){state.stars++;save();toast("¡Memoria completada! Ganaste una estrella ⭐")}
      }else{
        memoryLock=true;const first=memoryFirst;setTimeout(()=>{first.classList.add("hidden-text");b.classList.add("hidden-text");memoryFirst=null;memoryLock=false},750)
      }
    };board.appendChild(b);
  });
};

// Library filters
$$(".filter").forEach(b=>b.onclick=()=>{
  $$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  const f=b.dataset.filter;
  $$(".library-card").forEach(c=>c.hidden=!(f==="all"||c.dataset.tags.split(" ").includes(f)));
});
$$("[data-jump]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.jump).scrollIntoView({behavior:"smooth"}));

// Contact demo
$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const msgs=JSON.parse(localStorage.getItem("numerianMessages")||"[]");
  msgs.push({name:$("#contactName").value,email:$("#contactEmail").value,message:$("#contactMessage").value,date:new Date().toISOString()});
  localStorage.setItem("numerianMessages",JSON.stringify(msgs));
  $("#contactStatus").textContent="Mensaje guardado localmente. Para envío real, conecta un backend o servicio de formularios.";
  $("#contactStatus").className="feedback good"; e.target.reset();
});

// Accessibility and nav
$("#fontBtn").onclick=()=>{const r=document.documentElement;const cur=parseFloat(getComputedStyle(r).getPropertyValue("--font-scale"))||1;r.style.setProperty("--font-scale",cur>=1.16?1:1.16)};
$("#contrastBtn").onclick=()=>document.body.classList.toggle("high-contrast");
$("#motionBtn").onclick=()=>document.body.classList.toggle("reduce-motion");
$("#menuBtn").onclick=()=>{const n=$("#mainNav");const open=n.classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",String(open))};
$("#mainNav").addEventListener("click",e=>{if(e.target.tagName==="A"){$("#mainNav").classList.remove("open");$("#menuBtn").setAttribute("aria-expanded","false")}});

updateUI();renderCustom();newQuestion();
