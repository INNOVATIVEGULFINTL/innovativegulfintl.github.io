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
