/* Startup guard: keep a useful screen visible if a runtime error occurs. */
(function(){
  var entered=false, screen=document.getElementById('welcome-screen');
  var enter=document.getElementById('welcome-enter');
  function showApp(){
    entered=true;
    if(screen) screen.classList.add('is-hidden');
    document.body.classList.add('hesabino-entered');
    try{ if(typeof render==='function') render(); }catch(err){showRecovery(err);}
  }
  function showRecovery(err){
    var r=document.getElementById('boot-recovery');
    if(r) r.style.display='grid';
    if(window.console&&console.error)console.error('Hesabino startup error:',err);
  }
  if(enter)enter.addEventListener('click',showApp);
  window.addEventListener('error',function(e){
    if(!entered && e && e.message && /render|S is not defined|Cannot read|undefined/i.test(e.message)) showRecovery(e.message);
  });
  window.addEventListener('unhandledrejection',function(e){if(!entered)showRecovery(e.reason||'خطای شروع برنامه')});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden && entered){
      try{if(typeof render==='function')render()}catch(err){showRecovery(err)}
    }
  });
  window.addEventListener('pageshow',function(){
    if(!entered && screen)screen.classList.remove('is-hidden');
  });
})();
