// Change these example products here. Prices are shown in pounds.
const products = [
  { id: "mug", name: "Sunday Mug", detail: "A slow-morning favourite", price: 18, badge: "BESTSELLER", tone: "sage", shape: "cup", mark: "a" },
  { id: "notebook", name: "Good Things Book", detail: "For plans, lists & little ideas", price: 12, badge: "PAPER GOODS", tone: "sand", shape: "notebook", mark: "GOOD\nTHINGS" },
  { id: "tote", name: "Everyday Tote", detail: "Room for the important bits", price: 22, badge: "TAKE IT ALONG", tone: "blue", shape: "tote", mark: "AXENT" },
  { id: "cap", name: "Weekend Cap", detail: "A little shade, a lot of style", price: 20, badge: "NEW FAVOURITE", tone: "peach", shape: "cap", mark: "AXENT" }
];
const money = value => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
const shapeHTML = product => `<div class="product-shape shape-${product.shape}">${product.mark.replace("\n", "<br>")}</div>`;
const grid = document.getElementById("productGrid");
grid.innerHTML = products.map(product => `
  <article class="product-card">
    <div class="product-picture tone-${product.tone}"><span class="product-badge">${product.badge}</span>${shapeHTML(product)}</div>
    <div class="product-info"><span class="product-name">${product.name}</span><span class="product-price">${money(product.price)}</span></div>
    <p class="product-subtitle">${product.detail}</p>
    <button class="add-button" data-add="${product.id}"><span>Add to basket</span><span aria-hidden="true">＋</span></button>
  </article>`).join("");

let basket = JSON.parse(localStorage.getItem("axent-basket") || "{}");
const cartDrawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("backdrop");
const toast = document.getElementById("toast");
function saveBasket() { localStorage.setItem("axent-basket", JSON.stringify(basket)); renderBasket(); }
function countBasket() { return Object.values(basket).reduce((sum, count) => sum + count, 0); }
function showToast(message) { toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1700); }
function renderBasket() {
  const entries = products.filter(product => basket[product.id]);
  const count = countBasket();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  document.getElementById("emptyCart").style.display = entries.length ? "none" : "flex";
  document.getElementById("cartItems").innerHTML = entries.map(product => `
    <div class="cart-row">
      <div class="cart-thumb tone-${product.tone}">${shapeHTML(product)}</div>
      <div><div class="cart-row-name">${product.name}</div><div class="cart-row-price">${money(product.price)} each</div>
        <div class="quantity"><button data-change="${product.id}" data-step="-1" aria-label="Remove one ${product.name}">−</button><span>${basket[product.id]}</span><button data-change="${product.id}" data-step="1" aria-label="Add one ${product.name}">＋</button></div>
        <button class="remove-button" data-remove="${product.id}">Remove</button>
      </div><span class="row-total">${money(product.price * basket[product.id])}</span>
    </div>`).join("");
  document.getElementById("subtotal").textContent = money(entries.reduce((sum, product) => sum + product.price * basket[product.id], 0));
}
function openDrawer() { cartDrawer.classList.add("open"); backdrop.classList.add("open"); cartDrawer.setAttribute("aria-hidden", "false"); document.getElementById("closeCart").focus(); }
function closeDrawer() { cartDrawer.classList.remove("open"); backdrop.classList.remove("open"); cartDrawer.setAttribute("aria-hidden", "true"); }
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");
  if (add) { const id = add.dataset.add; basket[id] = (basket[id] || 0) + 1; saveBasket(); showToast("Added to your basket ✳"); }
  if (change) { const id = change.dataset.change; basket[id] = (basket[id] || 0) + Number(change.dataset.step); if (basket[id] <= 0) delete basket[id]; saveBasket(); }
  if (remove) { delete basket[remove.dataset.remove]; saveBasket(); }
});
document.getElementById("openCart").addEventListener("click", openDrawer);
document.getElementById("closeCart").addEventListener("click", closeDrawer);
document.getElementById("keepShopping").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeDrawer(); });
document.getElementById("checkout").addEventListener("click", () => {
  if (!countBasket()) { showToast("Add something to your basket first."); return; }
  alert("AXENT is a demo shop, so checkout is not live yet. Ask a parent or guardian to set up a hosted card checkout for the shop. Customers can enter their card number, expiry date, and CVV on the payment provider's secure page. Those details must never be typed into or saved by this AXENT website.");
});
renderBasket();
