(function(){
  var $=function(id){return document.getElementById(id)};
  var need=$("q-need");
  function toast(s){var t=$("toast");if(!t)return;t.textContent=s;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(function(){t.hidden=true},2200)}

  // "Request a quote" on an item adds it to the request box
  var first=true;
  document.addEventListener("click",function(e){
    var b=e.target.closest("[data-q]");if(!b||!need)return;
    var line=b.getAttribute("data-q")+" – quantity: ";
    if(first){need.value="";first=false}
    if(need.value.indexOf(b.getAttribute("data-q"))<0) need.value+=(need.value&&!/\n$/.test(need.value)?"\n":"")+line;
    b.textContent="Added to your request ✓";b.classList.add("done");
    toast("Added. Scroll down to send your quote request.");
  });


  // "Choose your solution" family filter on brand pages
  var grid=$("fam-grid");
  if(grid){
    var tiles=document.querySelectorAll(".sol[data-fam]"),title=$("fam-title"),sub=$("fam-sub"),ctl=document.querySelector(".famctl");
    var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
    function card(a,fam){
      var label=a[1]+(a[0]?" ("+a[0]+")":"")+(a[3]?" – "+a[3]:"");
      var pic=a[4]?'<div class="ph"><img src="/assets/stock/'+esc(a[4])+'" alt="'+esc(a[1])+'" loading="lazy"></div>':'<div class="ph ph-none"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 6h10M21 6v12L10 38a3 3 0 0 0 2.7 4h22.6A3 3 0 0 0 38 38L27 18V6"/><path d="M15 30h18"/></svg></div>';
      return '<article class="it" data-fam="'+fam+'">'+pic+'<div class="b"><div class="top"><span class="code">'+esc(a[0]||"")+'</span><span class="br">'+esc(a[3])+'</span></div><h3>'+esc(a[1])+'</h3>'+(a[2]?'<p class="d">'+esc(a[2])+'</p>':'')+'<span class="chip">In stock in Muscat</span></div><button class="btn q" type="button" data-q="'+esc(label)+'">Request a quote</button></article>';
    }
    function pick(id,scroll){
      tiles.forEach(function(t){t.setAttribute("aria-pressed",String(t.getAttribute("data-fam")===id))});
      grid.querySelectorAll("[data-fam]").forEach(function(el){el.hidden=!!id&&el.getAttribute("data-fam")!==id});
      if(id){
        var t=document.querySelector('.sol[data-fam="'+id+'"]'),nm=t.querySelector(".sl").firstChild.textContent;
        var n=grid.querySelectorAll('.it[data-fam="'+id+'"]:not(.rng)').length,mb=grid.querySelector('.more-f[data-fam="'+id+'"]');
        if(mb)n+=+mb.getAttribute("data-more");
        title.textContent=nm;sub.textContent=n?n+" in stock in Muscat":"Supplied to order – ask us for models and prices";ctl.hidden=false;
        try{history.replaceState(null,"","#f-"+id)}catch(e){}
      }else{title.textContent=title.getAttribute("data-all");sub.textContent=sub.getAttribute("data-all");ctl.hidden=true;try{history.replaceState(null,"",location.pathname)}catch(e){}}
      if(scroll)$("stock").scrollIntoView({behavior:"smooth",block:"start"});
    }
    tiles.forEach(function(t){t.addEventListener("click",function(){var id=t.getAttribute("data-fam");pick(t.getAttribute("aria-pressed")==="true"?"":id,true)})});
    $("fam-all").addEventListener("click",function(){pick("",false)});
    grid.addEventListener("click",function(ev){
      var b=ev.target.closest(".more-f");if(!b)return;
      var fam=b.getAttribute("data-fam");b.disabled=true;b.textContent="Loading…";
      fetch(b.getAttribute("data-src")).then(function(r){return r.json()}).then(function(j){
        b.insertAdjacentHTML("beforebegin",(j[fam]||[]).map(function(a){return card(a,fam)}).join(""));b.remove();
      }).catch(function(){b.disabled=false;b.textContent="Could not load. Try again"});
    });
    var h=(location.hash.match(/^#f-([\w-]+)$/)||[])[1];
    if(h&&document.querySelector('.sol[data-fam="'+h+'"]'))pick(h,false);
  }

  // Send the request by WhatsApp or email
  var via="wa",f=$("qf");
  if(!f)return;
  f.querySelectorAll("[data-via]").forEach(function(b){b.addEventListener("click",function(){via=b.getAttribute("data-via")})});
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var v=function(id){return ($(id).value||"").trim()};
    if(!v("q-name")||!v("q-need")){$("q-err").hidden=false;return}
    $("q-err").hidden=true;
    var msg="Request for quotation – Innovative Gulf International\n\nName: "+v("q-name")+"\nOrganisation: "+(v("q-org")||"-")+"\nPhone: "+(v("q-phone")||"-")+"\nEmail: "+(v("q-email")||"-")+"\nPage: "+location.href+"\n\nRequirement:\n"+v("q-need");
    if(via==="wa") window.open("https://wa.me/96897090570?text="+encodeURIComponent(msg),"_blank","noopener");
    else location.href="mailto:Info@igintl.om?subject="+encodeURIComponent("Request for quotation")+"&body="+encodeURIComponent(msg);
  });
})();
