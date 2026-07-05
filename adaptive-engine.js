/* Language Ai V5.2.1 Adaptive Engine Stabilization */
(function(){
  'use strict';

  const VERSION='V5.2.1 Adaptive Engine Stabilization';
  const ADAPTIVE_KEY='language_ai_adaptive_v1';
  const TEN_MIN=10*60*1000;
  const DAY=24*60*60*1000;
  const MAX_ATTEMPTS=500;
  let lastDown=0;
  let renderPending=false;

  function parse(raw,fallback){try{return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
  function ts(){return Date.now();}
  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function slug(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s+/g,'-').slice(0,80)||'item';}
  function baseState(){return{version:VERSION,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),attempts:[],mastery:{}};}
  function difficulty(score){if(score<.30)return'weak';if(score<.50)return'learning';if(score<.75)return'solid';return'mastered';}
  function delay(correct,label){if(!correct)return TEN_MIN;if(label==='weak'||label==='learning')return DAY;if(label==='solid')return 3*DAY;return 7*DAY;}
  function courseFromKey(key){key=String(key||'').toLowerCase();if(key.includes('es_en')||key.includes('spanish'))return'es_en';if(key.includes('bn_en')||key.includes('bangla'))return'bn_en';return'';}
  function labelOf(item){return clean(item.correctAnswer||item.promptText||item.lastUserAnswer||item.itemId||'Practice item').replace(/^unknown$/i,'Practice item');}

  function normalizeItem(item,key){
    item=item||{};
    const score=typeof item.mastery==='number'?clamp(item.mastery,0,1):.25;
    const id=clean(item.id||key||item.itemId||'unknown');
    const label=clean(item.correctAnswer||item.promptText||item.itemId||id||'Practice item');
    return{
      id,
      courseId:clean(item.courseId||courseFromKey(id)||'bn_en'),
      lessonId:clean(item.lessonId||'current'),
      itemId:clean(item.itemId||id),
      promptText:clean(item.promptText||label),
      correctAnswer:clean(item.correctAnswer||label),
      lastUserAnswer:clean(item.lastUserAnswer||''),
      activityType:clean(item.activityType||'practice'),
      seenCount:Number(item.seenCount||0),
      correctCount:Number(item.correctCount||0),
      wrongCount:Number(item.wrongCount||0),
      currentStreak:Number(item.currentStreak||0),
      lastSeenAt:Number(item.lastSeenAt||0),
      mastery:score,
      dueAt:Number(item.dueAt||0),
      difficulty:item.difficulty||difficulty(score)
    };
  }

  function normalizeState(state){
    const s=Object.assign(baseState(),state||{});
    s.attempts=Array.isArray(s.attempts)?s.attempts:[];
    s.mastery=s.mastery&&typeof s.mastery==='object'?s.mastery:{};
    Object.keys(s.mastery).forEach(k=>{s.mastery[k]=normalizeItem(s.mastery[k],k);});
    return s;
  }

  function getAdaptiveState(){return normalizeState(parse(localStorage.getItem(ADAPTIVE_KEY),baseState()));}

  function saveAdaptiveState(state){
    const s=normalizeState(state);
    s.version=VERSION;
    s.updatedAt=new Date().toISOString();
    localStorage.setItem(ADAPTIVE_KEY,JSON.stringify(s));
    syncFallback(s);
    return s;
  }

  function syncFallback(state){
    const payload={adaptive:{version:VERSION,updatedAt:state.updatedAt,mastery:state.mastery,recentAttempts:state.attempts.slice(-50)}};
    [window.LanguageAiFirebase,window.firebaseBackend,window.LanguageAiCloud,window.LanguageAiSync,window.appFirebase].forEach(bridge=>{
      try{const fn=bridge&&(bridge.saveAdaptiveProgress||bridge.syncProgress||bridge.saveProgress);if(typeof fn==='function')fn.call(bridge,payload);}catch{}
    });
  }

  function detectCourseId(){
    const saved=parse(localStorage.getItem('language_ai_v1_state'),{});
    const txt=[saved.course,saved.selectedCourse,saved.courseId,document.body&&document.body.dataset.courseId,document.querySelector('#screen')&&document.querySelector('#screen').innerText].join(' ').toLowerCase();
    if(txt.includes('spanish')||txt.includes('hola')||txt.includes('quiero'))return'es_en';
    if(txt.includes('bangla')||txt.includes('bengali')||txt.includes('বাংলা')||txt.includes('পানি'))return'bn_en';
    return clean(saved.course||saved.selectedCourse||saved.courseId||'bn_en');
  }

  function detectLessonId(){
    const saved=parse(localStorage.getItem('language_ai_v1_state'),{});
    const text=(document.querySelector('#screen')&&document.querySelector('#screen').innerText)||'';
    const m=text.match(/(?:day|lesson|দিন)\s*(\d+)/i);
    return clean(saved.lessonId||saved.currentLesson||saved.day||(m&&m[1])||'current');
  }

  function detectView(){
    const active=document.querySelector('.nav-btn.active[data-view],.drawer-link.active[data-view]');
    const view=(document.body&&document.body.dataset.view)||active&&active.dataset.view||'';
    const text=((document.querySelector('#screen')&&document.querySelector('#screen').innerText)||'').toLowerCase();
    if(view)return view;
    if(text.includes('review')||text.includes('weak')||text.includes('রিভিউ'))return'review';
    if(text.includes('home')||text.includes('today')||text.includes('streak'))return'home';
    return'';
  }

  function stableItemId(a){return[slug(a.courseId),slug(a.lessonId),slug(a.activityType),slug(a.promptText||a.userAnswer||a.correctAnswer)].join('::');}

  function updateItemMastery(attempt,state){
    const id=clean(attempt.itemId)||stableItemId(attempt);
    const key=`${attempt.courseId}_${id}`;
    const old=normalizeItem(state.mastery[key],key);
    const correct=!!attempt.correct;
    const nextStreak=correct?old.currentStreak+1:0;
    const bonus=correct?Math.min(.05,nextStreak*.01):0;
    const score=correct?clamp(old.mastery+.10+bonus,0,1):clamp(old.mastery-.16,0,1);
    const diff=difficulty(score);
    const stamp=Number(attempt.timestamp||ts());
    const item=Object.assign(old,{
      id:key,courseId:attempt.courseId,lessonId:attempt.lessonId,itemId:id,
      promptText:clean(attempt.promptText||old.promptText||id),
      correctAnswer:clean(attempt.correctAnswer||old.correctAnswer||attempt.promptText||id),
      lastUserAnswer:clean(attempt.userAnswer||old.lastUserAnswer||''),
      activityType:clean(attempt.activityType||old.activityType),
      seenCount:old.seenCount+1,correctCount:old.correctCount+(correct?1:0),wrongCount:old.wrongCount+(correct?0:1),
      currentStreak:nextStreak,lastSeenAt:stamp,mastery:Number(score.toFixed(3)),difficulty:diff,dueAt:stamp+delay(correct,diff)
    });
    state.mastery[key]=item;
    return item;
  }

  function recordAdaptiveAttempt(input){
    const attempt={
      courseId:clean(input.courseId||detectCourseId()),lessonId:clean(input.lessonId||detectLessonId()),
      itemId:clean(input.itemId||''),promptText:clean(input.promptText||''),correctAnswer:clean(input.correctAnswer||''),
      userAnswer:clean(input.userAnswer||''),activityType:clean(input.activityType||'practice'),correct:!!input.correct,
      responseMs:Number(input.responseMs||0),hintUsed:!!input.hintUsed,timestamp:Number(input.timestamp||ts())
    };
    if(!attempt.promptText&&!attempt.userAnswer)return null;
    attempt.itemId=attempt.itemId||stableItemId(attempt);
    if(!attempt.correctAnswer)attempt.correctAnswer=attempt.correct?attempt.userAnswer||attempt.promptText:attempt.promptText||attempt.userAnswer;
    const state=getAdaptiveState();
    const item=updateItemMastery(attempt,state);
    state.attempts.push(Object.assign({},attempt,{masteryAfter:item.mastery,difficultyAfter:item.difficulty}));
    state.attempts=state.attempts.slice(-MAX_ATTEMPTS);
    saveAdaptiveState(state);
    queueRender();
    return item;
  }

  function getItems(courseId){return Object.values(getAdaptiveState().mastery).map((i,n)=>normalizeItem(i,`legacy-${n}`)).filter(i=>!courseId||i.courseId===courseId);}
  function getWeakItems(courseId,limit=5){return getItems(courseId).filter(i=>i.difficulty==='weak'||i.wrongCount>0||i.mastery<.5).sort((a,b)=>(a.mastery-b.mastery)||(b.wrongCount-a.wrongCount)||(a.lastSeenAt-b.lastSeenAt)).slice(0,limit);}
  function getDueReviewItems(courseId,limit=10){const t=ts();return getItems(courseId).filter(i=>i.dueAt&&i.dueAt<=t).sort((a,b)=>a.dueAt-b.dueAt).slice(0,limit);}
  function getSmartLessonMix(courseId,currentLessonId){return{lessonId:currentLessonId,currentItems:getItems(courseId).filter(i=>String(i.lessonId)===String(currentLessonId)).slice(0,6),weakItems:getWeakItems(courseId,4),reviewItems:getDueReviewItems(courseId,4)};}

  function getSmartPlanMessage(courseId=detectCourseId()){
    const weak=getWeakItems(courseId,3),due=getDueReviewItems(courseId,3),recent=getAdaptiveState().attempts.filter(a=>a.courseId===courseId).slice(-12);
    const accuracy=recent.length?recent.filter(a=>a.correct).length/recent.length:null;
    const names=weak.map(labelOf).join(', ');
    if(weak.length>=3||(accuracy!==null&&accuracy<.55))return courseId==='bn_en'?{bn:`আজ একটু ধীরে চলি। আমরা আবার প্র্যাকটিস করবো: ${names||'কঠিন শব্দগুলো'}।`,en:'Slow review today. Practice weak words first.'}:{bn:'',en:`Let’s slow down today. Review these first: ${names||'your weak words'}.`};
    if(due.length)return courseId==='bn_en'?{bn:`আজ ${due.length}টা পুরোনো জিনিস মনে করার সময়। আগে রিভিউ, তারপর নতুন শেখা।`,en:'Review first, then learn.'}:{bn:'',en:`You have ${due.length} review items due. Warm up first, then continue.`};
    return courseId==='bn_en'?{bn:'আপনি ভালো করছেন। আজ নতুন শেখা + একটু পুরোনো রিভিউ।',en:'New learning plus light review.'}:{bn:'',en:'You are doing well. Learn a little new content and keep reviewing.'};
  }

  function promptNear(el){
    const host=el.closest('[data-question],.quiz-card,.game-card,.lesson-card,.card,section,article')||document.querySelector('#screen');
    const data=el.dataset.prompt||host&&host.dataset&&host.dataset.question||'';
    if(clean(data))return clean(data).slice(0,180);
    const nodes=Array.from(host&&host.querySelectorAll?host.querySelectorAll('h1,h2,h3,h4,p,.question,.prompt,.word,.sentence'):[]).map(n=>clean(n.innerText||n.textContent)).filter(t=>t.length>2&&t.length<180).slice(0,3);
    return clean(nodes.join(' / ')||el.getAttribute('aria-label')||el.innerText||el.textContent||'Practice item').slice(0,180);
  }

  function answerFrom(el){return clean(el.dataset.answer||el.value||el.innerText||el.textContent||el.getAttribute('aria-label')||'');}
  function activityFrom(el){const t=((document.querySelector('#screen')&&document.querySelector('#screen').innerText)||'').toLowerCase();if(el.dataset.activity)return el.dataset.activity;if(t.includes('sentence')||t.includes('tile')||t.includes('বাক্য'))return'sentence-build';if(t.includes('match')||t.includes('মিল'))return'match';if(t.includes('speak')||t.includes('mic')||t.includes('বলুন'))return'speech';if(t.includes('review')||t.includes('weak'))return'review';if(t.includes('quiz'))return'quiz';return'tap';}

  function inferCorrect(el){
    const target=el.closest('[data-correct],[data-answer],.correct,.wrong,.success,.error')||el;
    const dc=target.dataset.correct,da=String(target.dataset.answer||'').toLowerCase(),cls=String(target.className||'').toLowerCase();
    const feedback=[da,cls,target.getAttribute('aria-label')||'',document.querySelector('#toast')&&document.querySelector('#toast').innerText||'',target.closest('.card,section,article')&&target.closest('.card,section,article').innerText||''].join(' ').toLowerCase();
    if(dc==='true'||da==='correct'||cls.includes('correct')||cls.includes('success'))return true;
    if(dc==='false'||da==='wrong'||cls.includes('wrong')||cls.includes('error'))return false;
    if(['correct','right','great','nice','সঠিক','ঠিক','ভালো'].some(w=>feedback.includes(w)))return true;
    if(['wrong','try again','incorrect','ভুল','আবার চেষ্টা'].some(w=>feedback.includes(w)))return false;
    return null;
  }

  function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function speak(text){if(!text||!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=detectCourseId()==='es_en'?'es-ES':'en-US';u.rate=.86;speechSynthesis.speak(u);}catch{}}

  function renderSmartPlan(){
    const screen=document.querySelector('#screen'); if(!screen||detectView()!=='home'||screen.querySelector('.smart-plan'))return;
    const plan=getSmartPlanMessage(); const card=document.createElement('section'); card.className='adaptive-card smart-plan glass';
    card.style='margin:10px;padding:16px;border-radius:18px;background:rgba(255,255,255,.86);box-shadow:0 8px 24px rgba(0,0,0,.10);';
    card.innerHTML=`<strong>🧠 Today's Smart Plan</strong>${plan.bn?`<p style="margin:7px 0 3px;line-height:1.45;">${escapeHtml(plan.bn)}</p>`:''}<small style="display:block;color:#666;line-height:1.4;">${escapeHtml(plan.en)}</small>`;
    screen.prepend(card);
  }

  function renderWeakWords(){
    const screen=document.querySelector('#screen'); if(!screen||detectView()!=='review'||screen.querySelector('.weak-words'))return;
    const weak=getWeakItems(detectCourseId(),5); const card=document.createElement('section'); card.className='adaptive-card weak-words glass';
    card.style='margin:10px;padding:16px;border-radius:18px;background:rgba(255,255,255,.86);box-shadow:0 8px 24px rgba(0,0,0,.08);';
    const rows=weak.length?weak.map(i=>{const l=labelOf(i);return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:8px 0;padding:10px;background:#fff;border-radius:12px;"><span><strong>${escapeHtml(l)}</strong><br><small>${Math.round(i.mastery*100)}% mastery • ${i.wrongCount} misses</small></span><button class="adaptive-card-btn" data-adaptive-say="${escapeHtml(l)}" style="min-width:44px;min-height:44px;border:0;border-radius:12px;background:#182033;color:white;font-size:18px;">🔊</button></div>`;}).join(''):'<p style="margin:8px 0 0;">No weak words yet. Practice a few questions and this will personalize.</p>';
    card.innerHTML=`<h3 style="margin:0 0 8px;">🔥 Weak Words</h3>${rows}`; screen.prepend(card);
  }

  function queueRender(){if(renderPending)return;renderPending=true;requestAnimationFrame(()=>{renderPending=false;renderSmartPlan();renderWeakWords();});}

  document.addEventListener('pointerdown',()=>{lastDown=ts();},true);
  document.addEventListener('click',e=>{
    const say=e.target.closest('[data-adaptive-say]'); if(say){e.preventDefault();speak(say.dataset.adaptiveSay);return;}
    const screen=document.querySelector('#screen'); if(!screen||!screen.contains(e.target))return;
    if(e.target.closest('.bottom-nav,.drawer,.topbar,.adaptive-card,.adaptive-card-btn'))return;
    const el=e.target.closest('button,[role="button"],.choice,.tile,.option,[data-correct],[data-answer]'); if(!el)return;
    setTimeout(()=>{const correct=inferCorrect(el); if(correct===null)return; const promptText=promptNear(el),userAnswer=answerFrom(el); recordAdaptiveAttempt({courseId:el.dataset.courseId||detectCourseId(),lessonId:el.dataset.lessonId||detectLessonId(),itemId:el.dataset.itemId||'',promptText,correctAnswer:correct?(userAnswer||promptText):promptText,userAnswer,activityType:activityFrom(el),correct,responseMs:lastDown?ts()-lastDown:0});},350);
  },true);

  const observer=new MutationObserver(queueRender); observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-view']}); setInterval(queueRender,2500); queueRender();

  window.LanguageAiAdaptive={version:VERSION,getAdaptiveState,saveAdaptiveState,recordAdaptiveAttempt,updateItemMastery:function(attempt){const s=getAdaptiveState();const item=updateItemMastery(Object.assign({courseId:detectCourseId(),lessonId:detectLessonId(),timestamp:ts()},attempt),s);saveAdaptiveState(s);return item;},getWeakItems,getDueReviewItems,getSmartLessonMix,getSmartPlanMessage};
})();
