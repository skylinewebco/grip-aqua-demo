/* =============================================================
   SK — Cart + Checkout (functional demo, no real payments)
   ============================================================= */
(function (global) {
  "use strict";

  const KEY = "sk_cart_v1";
  const SHIP_FLAT = 4.95;
  const FREE_SHIP_OVER = 25;

  const byId = (id) => SK_PRODUCTS.find((p) => p.id === id);
  const money = (n) => "$" + n.toFixed(2);

  let items = load();
  let listeners = [];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    listeners.forEach((fn) => fn());
  }

  function add(id, qty) {
    qty = qty || 1;
    const line = items.find((i) => i.id === id);
    if (line) line.qty += qty;
    else items.push({ id, qty });
    save();
  }
  function setQty(id, qty) {
    const line = items.find((i) => i.id === id);
    if (!line) return;
    line.qty = Math.max(1, qty);
    save();
  }
  function remove(id) {
    items = items.filter((i) => i.id !== id);
    save();
  }
  function clear() { items = []; save(); }

  function count() { return items.reduce((s, i) => s + i.qty, 0); }
  function subtotal() {
    return items.reduce((s, i) => {
      const p = byId(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  }
  function shipping() {
    if (items.length === 0) return 0;
    return subtotal() >= FREE_SHIP_OVER ? 0 : SHIP_FLAT;
  }
  function total() { return subtotal() + shipping(); }

  function detailed() {
    return items.map((i) => ({ ...byId(i.id), qty: i.qty }));
  }

  global.SKCart = {
    add, setQty, remove, clear,
    count, subtotal, shipping, total, detailed,
    get items() { return items; },
    onChange(fn) { listeners.push(fn); },
    money,
    FREE_SHIP_OVER, SHIP_FLAT
  };
})(window);
