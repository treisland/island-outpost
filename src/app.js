const theme=document.getElementById('theme');theme.value=window.outpostTheme.get();theme.addEventListener('change',()=>window.outpostTheme.set(theme.value));
const search=document.getElementById('search');
if(search){
 const params=new URLSearchParams(location.search);search.value=params.get('q')||'';
 const filters=[...document.querySelectorAll('[data-filter]')];
 let topic=filters.some(b=>b.dataset.filter===params.get('topic'))?params.get('topic'):'all';
 function render(update=false){
  const terms=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let count=0;
  for(const card of document.querySelectorAll('.card')){card.hidden=!(terms.every(t=>card.dataset.title.includes(t))&&(topic==='all'||card.dataset.topic===topic));if(!card.hidden)count++;}
  for(const b of filters)b.setAttribute('aria-pressed',String(b.dataset.filter===topic));
  document.getElementById('result-count').textContent=`${count} ${count===1?'entry':'entries'}`;document.getElementById('empty').hidden=count!==0;
  if(update){const url=new URL(location.href);url.search='';if(search.value.trim())url.searchParams.set('q',search.value.trim());if(topic!=='all')url.searchParams.set('topic',topic);history.replaceState(null,'',url);}
 }
 search.addEventListener('input',()=>render(true));for(const b of filters)b.addEventListener('click',()=>{topic=b.dataset.filter;render(true);});
 document.querySelector('.search-form').addEventListener('submit',e=>e.preventDefault());
 document.getElementById('clear-filters').addEventListener('click',()=>{topic='all';search.value='';render(true);search.focus();});render();
}
for(const button of document.querySelectorAll('.copy-prompt'))button.addEventListener('click',async()=>{
 const root=button.closest('.prompt-example'),status=root.querySelector('.copy-status');try{await navigator.clipboard.writeText(root.querySelector('code').textContent);status.textContent='Copied to clipboard.';}catch{status.textContent='Select the example text to copy it.';}
});
