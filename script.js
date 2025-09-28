
const products = [
  { id: 'p1', title: 'Conjunto Rendado Amarelo', price: 79.90, img: 'images/conjunto-amarelo.jpg' },
  { id: 'p2', title: 'Conjunto Azul Rendado (1)', price: 89.90, img: 'images/conjunto-azul-1.jpg' },
  { id: 'p3', title: 'Conjunto Azul Rendado (2)', price: 89.90, img: 'images/conjunto-amarelo.jpg' },
  { id: 'p4', title: 'Cuecas Lupo Kit', price: 99.90, img: 'images/cuecas-lupo.jpg' },
  { id: 'p5', title: 'Conjunto Coloridos', price: 149.90, img: 'images/conjunto-coloridos.jpg' },
  { id: 'p6', title: 'Conjunto Preto Elegance', price: 89.90, img: 'images/conjunto-preto.jpg' }
];

let cart = {};
try { cart = JSON.parse(localStorage.getItem('galaxi_cart') || '{}'); } catch(e){ cart = {}; }

const productsEl = document.getElementById('products');
const cartListEl = document.getElementById('cartList');
const totalEl = document.getElementById('total');
const cartCountEl = document.getElementById('cartCount');
const cartPanel = document.getElementById('cart');
const viewCartBtn = document.getElementById('viewCartBtn');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkout');
const clearBtn = document.getElementById('clearCart');
const saveBtn = document.getElementById('saveCart');
const closeXBtn = document.getElementById('closeX');
const searchInput = document.getElementById('search');

function renderProducts(filter = ''){
  const q = filter.trim().toLowerCase();
  productsEl.innerHTML = '';
  const list = products.filter(p => p.title.toLowerCase().includes(q));
  for(const p of list){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+imagem'">
      <div style='margin-top:8px'>
        <div style='display:flex;justify-content:space-between;align-items:center'>
          <strong>${p.title}</strong>
          <div class='price'>R$ ${p.price.toFixed(2).replace('.',',')}</div>
        </div>
        <div style='margin-top:6px'>
          <button class='add' data-id='${p.id}'>Adicionar ao carrinho</button>
        </div>
      </div>
    `;
    productsEl.appendChild(card);
  }
  document.querySelectorAll('.add').forEach(btn => btn.addEventListener('click', ()=> addToCart(btn.dataset.id, 1)));
}

function addToCart(id, qty=1){
  cart[id] = (cart[id] || 0) + qty;
  saveCart(); renderCart();
}
function setQty(id, qty){
  if(qty <= 0) delete cart[id]; else cart[id] = qty;
  saveCart(); renderCart();
}
function clearCart(){ cart = {}; saveCart(); renderCart(); }
function saveCart(){ localStorage.setItem('galaxi_cart', JSON.stringify(cart)); }

function renderCart(){
  cartListEl.innerHTML = '';
  const ids = Object.keys(cart);
  let sum = 0;
  for(const id of ids){
    const p = products.find(x=>x.id===id);
    if(!p) continue;
    const qty = cart[id];
    sum += p.price * qty;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src='${p.img}' onerror="this.src='https://via.placeholder.com/120?text=Sem+img'" />
      <div class='info'>
        <div style='display:flex;justify-content:space-between;align-items:center'>
          <div><strong>${p.title}</strong><div class='muted'>R$ ${p.price.toFixed(2).replace('.',',')}</div></div>
          <div class='qty'>
            <button data-action='dec' data-id='${id}'>-</button>
            <div style='min-width:28px;text-align:center'>${qty}</div>
            <button data-action='inc' data-id='${id}'>+</button>
          </div>
        </div>
        <div style='margin-top:6px;display:flex;justify-content:space-between;align-items:center'>
          <div class='muted'>Subtotal</div>
          <div>R$ ${(p.price*qty).toFixed(2).replace('.',',')}</div>
        </div>
      </div>
    `;
    cartListEl.appendChild(item);
  }
  totalEl.textContent = `R$ ${sum.toFixed(2).replace('.',',')}`;
  cartCountEl.textContent = ids.reduce((a,b)=>a+cart[b],0) || 0;

  cartListEl.querySelectorAll('button[data-action]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.id; const act = b.dataset.action;
      if(act==='inc') setQty(id, (cart[id]||0)+1);
      if(act==='dec') setQty(id, (cart[id]||0)-1);
    });
  });
}

viewCartBtn.addEventListener('click', ()=> toggleCart(true));
closeCartBtn.addEventListener('click', ()=> toggleCart(false));
closeXBtn.addEventListener('click', ()=> toggleCart(false));
clearBtn.addEventListener('click', ()=> { if(confirm('Remover todos os itens do carrinho?')) clearCart(); });
saveBtn.addEventListener('click', ()=> { saveCart(); alert('Carrinho salvo no navegador.'); });

checkoutBtn.addEventListener('click', ()=>{
  const ids = Object.keys(cart);
  if(ids.length===0){ alert('Carrinho vazio.'); return; }
  const resumo = ids.map(id=>{ const p = products.find(x=>x.id===id); return `${p.title} x ${cart[id]}`; }).join('\n');
  if(confirm(`Confirmar compra:\n\n${resumo}\n\nTotal: ${totalEl.textContent}`)){
    alert('Compra finalizada! Obrigado.');
    clearCart(); toggleCart(false);
  }
});

function toggleCart(show){ cartPanel.style.display = show ? 'block' : 'none'; cartPanel.setAttribute('aria-hidden', String(!show)); }

searchInput.addEventListener('input', ()=>{ renderProducts(searchInput.value); });

renderProducts(); renderCart();
window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='c'){ const shown = cartPanel.style.display!=='none'; toggleCart(!shown); } });
