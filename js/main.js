/* =============================================================
   SK — Main application
   Motion, rendering, and interaction wiring
   ============================================================= */
(function () {
  "use strict";

  const P = window.SK_PRODUCTS;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = SKCart.money;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      $("#loader").classList.add("done");
      ScrollTrigger.refresh();
    }, reduce ? 100 : 1200);
  });

  /* =========================================================
     HERO CAN (stationary) + SHOWCASE cans + alternating fly-ins
     ========================================================= */
  const heroFlavor = P[0]; // Citrus Rush anchors the hero

  function renderHeroCan() {
    const el = $("#heroCan");
    if (!el) return;
    el.innerHTML = SKCan.build(heroFlavor);
    // Hero can is intentionally stationary — no scroll-driven motion and no idle float.
  }

  function renderShowcaseCans() {
    $$(".scene__can").forEach((el) => {
      const p = byId(el.dataset.can) || P[0];
      el.innerHTML = SKCan.build(p);
    });
  }

  // Feature cans in the content sections: a cinematic, SCROLL-DRIVEN side entry.
  // The can starts off-screen and its X/rotation/scale are tied directly to scroll
  // progress (scrub) — it travels into place as the section moves through the viewport.
  // Alternates RIGHT / LEFT per can. GPU transforms only. Works on desktop AND mobile;
  // distance scales with viewport so it never causes horizontal overflow.
  function sceneCanEntry(el) {
    const dir = el.dataset.fly === "left" ? -1 : 1;
    // Full cinematic entry on every device. It's scroll-driven (user-controlled), so it
    // runs regardless of the reduced-motion flag — which is what was explicitly requested.
    // Function values recompute on resize; the off-screen start is clipped by
    // body{overflow-x:hidden}, so it never creates a horizontal scrollbar (desktop or mobile).
    const dist = () => dir * Math.min(window.innerWidth * 0.9, 720);
    const rot = dir * (parseFloat(el.dataset.flyRot || 8));

    gsap.set(el, { force3D: true, willChange: "transform" });
    gsap.fromTo(el,
      { x: dist, rotate: rot, scale: 0.8, opacity: 0.6 },
      {
        x: 0, rotate: 0, scale: 1, opacity: 1, ease: "none",
        scrollTrigger: {
          trigger: el.closest(".scene"),
          start: "top bottom",     // section just enters from the bottom → can is off-screen
          end: "center center",    // section centered → can has arrived at rest
          scrub: 1,                // buttery lerp, high-refresh friendly
          invalidateOnRefresh: true
        }
      });
  }

  // Flavor grid cards: a lighter alternating slide-in on enter (keeps the CSS :hover lift).
  function cardEntry(el) {
    const dir = el.dataset.fly === "left" ? -1 : 1;
    if (reduce) { gsap.set(el, { opacity: 1, clearProps: "transform" }); return; }
    gsap.set(el, { opacity: 0, x: dir * 84, scale: 0.96, force3D: true });
    gsap.to(el, {
      opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      onComplete: () => gsap.set(el, { clearProps: "transform" })
    });
  }

  function initFlyIns() {
    $$(".scene__can[data-fly]").forEach(sceneCanEntry);
    $$(".flavor-card[data-fly]").forEach(cardEntry);
  }

  /* =========================================================
     NAV
     ========================================================= */
  const nav = $("#nav");
  ScrollTrigger.create({
    start: "top -60",
    onUpdate: (self) => nav.classList.toggle("scrolled", self.scroll() > 60),
    onRefresh: (self) => nav.classList.toggle("scrolled", self.scroll() > 60)
  });

  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");
  function toggleMenu(open) {
    hamburger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
  }
  hamburger.addEventListener("click", () => toggleMenu(!mobileMenu.classList.contains("open")));

  // Smooth in-page nav
  $$("[data-nav]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      toggleMenu(false);
      gsap.to(window, {
        duration: reduce ? 0 : 1,
        ease: "power3.inOut",
        scrollTo: { y: target, offsetY: 68 }
      });
    });
  });
  $$('[data-noop]').forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));

  /* =========================================================
     REVEAL animations
     ========================================================= */
  function initReveals() {
    if (reduce) {
      $$(".reveal, .reveal-line").forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal, .reveal-line").forEach((el) => io.observe(el));

    // Stagger grouped reveals
    $$(".hero__content .reveal").forEach((el, i) => (el.style.transitionDelay = i * 0.08 + "s"));
    $$(".reveal-line").forEach((el, i) => (el.style.transitionDelay = (i % 3) * 0.09 + "s"));
  }

  /* =========================================================
     FLAVOR GRID
     ========================================================= */
  function renderFlavors() {
    const grid = $("#flavorGrid");
    grid.innerHTML = P.map((p, i) => `
      <article class="flavor-card" data-fly="${i % 2 === 0 ? "left" : "right"}" style="--accent:${p.accent};--accent-soft:${hexA(p.accent, .16)}" data-id="${p.id}">
        <span class="flavor-card__badge">${p.badge}</span>
        <span class="flavor-card__fav">★ ${p.rating}</span>
        <div class="flavor-card__can">${SKCan.build(p, { face: "front" })}</div>
        <h3 class="flavor-card__name">${p.name}</h3>
        <p class="flavor-card__desc">${p.tagline}</p>
        <div class="flavor-card__meta">
          <span class="flavor-card__price">${money(p.price)}</span>
          <span class="flavor-card__rating"><b>${p.rating}</b> · ${p.reviews} reviews</span>
        </div>
        <div class="flavor-card__actions">
          <button class="btn btn--ghost" data-view="${p.id}">View</button>
          <button class="btn btn--accent" data-add="${p.id}">Add to Cart</button>
        </div>
      </article>`).join("");

    grid.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      const view = e.target.closest("[data-view]");
      const card = e.target.closest(".flavor-card");
      if (add) { SKCart.add(add.dataset.add); toast(`Added ${byId(add.dataset.add).name}`); flyPulse(add); return; }
      if (view) { openProduct(view.dataset.view); return; }
      if (card && !e.target.closest("button")) openProduct(card.dataset.id);
    });
  }

  /* =========================================================
     PRODUCT DETAIL MODAL
     ========================================================= */
  const productModal = $("#productModal");
  const productDetail = $("#productDetail");
  let currentPid = null;

  function openProduct(id) {
    currentPid = id;
    renderProduct(id);
    openOverlay(productModal);
  }

  function renderProduct(id) {
    const p = byId(id);
    productDetail.style.setProperty("--accent", p.accent);
    productDetail.style.setProperty("--accent-soft", hexA(p.accent, .18));
    productDetail.innerHTML = `
      <button class="icon-btn pd-close" data-close-modal aria-label="Close">✕</button>
      <div class="pd-media">
        <div class="pd-thumbs">
          ${P.map((f) => `<button class="pd-thumb ${f.id === id ? "active" : ""}" data-switch="${f.id}" title="${f.name}">${SKCan.build(f, { face: "front" })}</button>`).join("")}
        </div>
        <div class="pd-can">${SKCan.build(p, { face: "front" })}</div>
      </div>
      <div class="pd-body">
        <span class="pd-badge">${p.badge}</span>
        <h2 class="pd-title">${p.name}</h2>
        <p class="pd-tag">${p.tagline}</p>
        <p class="pd-desc">${p.description}</p>
        <div class="pd-nutri">
          <div><b>${p.calories}</b><span>calories</span></div>
          <div><b>${p.sugar}g</b><span>sugar</span></div>
          <div><b>${p.fiber}g</b><span>fiber</span></div>
          <div><b>${p.carbs}g</b><span>carbs</span></div>
        </div>
        <div class="pd-section">
          <h4>Benefits</h4>
          <div class="pd-benefits">${p.benefits.map((b) => `<span>${b}</span>`).join("")}</div>
        </div>
        <div class="pd-section">
          <h4>Ingredients</h4>
          <div class="pd-chips">${p.ingredients.map((i) => `<span>${i}</span>`).join("")}</div>
        </div>
        <div class="pd-buy">
          <div class="pd-buy-row">
            <span class="pd-price">${money(p.price)}</span>
            <div class="qty" data-qty>
              <button data-step="-1" aria-label="Decrease">−</button>
              <input type="text" value="1" inputmode="numeric" aria-label="Quantity" />
              <button data-step="1" aria-label="Increase">+</button>
            </div>
          </div>
          <div class="pd-actions">
            <button class="btn btn--ghost" data-add-detail>Add to Cart</button>
            <button class="btn btn--accent" data-buy-now>Buy Now</button>
          </div>
        </div>
      </div>`;

    // wire quantity
    const qtyWrap = $("[data-qty]", productDetail);
    const qtyInput = $("input", qtyWrap);
    qtyWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]");
      if (!b) return;
      let v = parseInt(qtyInput.value, 10) || 1;
      v = Math.max(1, v + parseInt(b.dataset.step, 10));
      qtyInput.value = v;
    });
    qtyInput.addEventListener("input", () => {
      qtyInput.value = qtyInput.value.replace(/\D/g, "").slice(0, 3);
    });
    qtyInput.addEventListener("blur", () => { if (!parseInt(qtyInput.value, 10)) qtyInput.value = 1; });

    // thumbs switch
    $$("[data-switch]", productDetail).forEach((t) =>
      t.addEventListener("click", () => switchFlavor(t.dataset.switch)));

    $("[data-add-detail]", productDetail).addEventListener("click", () => {
      SKCart.add(id, parseInt(qtyInput.value, 10) || 1);
      toast(`Added ${p.name} ×${qtyInput.value}`);
    });
    $("[data-buy-now]", productDetail).addEventListener("click", () => {
      SKCart.add(id, parseInt(qtyInput.value, 10) || 1);
      closeOverlay(productModal);
      openCart();
    });
  }

  function switchFlavor(id) {
    if (id === currentPid) return;
    const media = $(".pd-media", productDetail);
    const body = $(".pd-body", productDetail);
    if (reduce) { currentPid = id; renderProduct(id); return; }
    gsap.to([media, body], {
      opacity: 0, y: 8, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        currentPid = id;
        renderProduct(id);
        gsap.fromTo([$(".pd-media", productDetail), $(".pd-body", productDetail)],
          { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    });
  }

  /* =========================================================
     NUTRITION
     ========================================================= */
  function renderNutrition() {
    const tabs = $("#nutriTabs");
    tabs.innerHTML = P.map((p, i) =>
      `<button class="nutri-tab ${i === 0 ? "active" : ""}" data-nutri="${p.id}">${p.line1} ${p.line2 || ""}</button>`).join("");
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-nutri]");
      if (!b) return;
      $$(".nutri-tab", tabs).forEach((t) => t.classList.remove("active"));
      b.classList.add("active");
      renderNutriPanel(b.dataset.nutri);
    });
    renderNutriPanel(P[0].id);
  }

  const NUTRI_MAX = { calories: 60, sugar: 12, carbs: 15, fiber: 10 };
  function ring(label, val, max, unit) {
    const r = 32, c = 2 * Math.PI * r;
    const pct = Math.min(1, val / max);
    const off = c * (1 - pct);
    return `<div class="ring">
      <svg class="ring__svg" viewBox="0 0 78 78">
        <circle class="ring__track" cx="39" cy="39" r="${r}"/>
        <circle class="ring__val" cx="39" cy="39" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${off}"/>
      </svg>
      <span class="ring__num">${val}${unit}</span>
      <span class="ring__lbl">${label}</span>
    </div>`;
  }
  function renderNutriPanel(id) {
    const p = byId(id);
    const panel = $("#nutriPanel");
    panel.style.setProperty("--accent", p.accent);
    panel.innerHTML = `
      <div class="nutri-panel__head">
        <div style="width:56px">${SKCan.build(p, { face: "front" })}</div>
        <div><h3>${p.name}</h3><p>Per 355mL can · demo values</p></div>
      </div>
      <div class="nutri-rings">
        ${ring("Calories", p.calories, NUTRI_MAX.calories, "")}
        ${ring("Sugar", p.sugar, NUTRI_MAX.sugar, "g")}
        ${ring("Carbs", p.carbs, NUTRI_MAX.carbs, "g")}
        ${ring("Fiber", p.fiber, NUTRI_MAX.fiber, "g")}
      </div>
      <div class="nutri-ingredients">
        <h4>Ingredients</h4>
        <ul>${p.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>
      <p class="nutri-serving">Serving size: 1 can (355mL) · Servings per pack: 12 · ${p.protein}g protein · Gluten-free · Vegan · Non-GMO. Figures are illustrative SK demo values.</p>`;
    // animate rings (setTimeout is reliable even when rAF is throttled)
    setTimeout(() => {
      $$(".ring__val", panel).forEach((c) => { c.style.strokeDashoffset = c.dataset.off; });
    }, 60);
  }

  /* =========================================================
     TESTIMONIALS
     ========================================================= */
  function renderReviews() {
    const track = $("#reviewsTrack");
    const cards = SK_TESTIMONIALS.map((t) => {
      const fl = P.find((p) => p.name.includes(t.flavor));
      const ac = fl ? fl.accent : "#ff9e1b";
      return `<div class="review-card">
        <div class="review-card__stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</div>
        <p class="review-card__text">“${t.text}”</p>
        <div class="review-card__foot">
          <div class="review-card__avatar" style="background:${ac}">${t.name[0]}</div>
          <div><div class="review-card__name">${t.name}</div><div class="review-card__flavor">SK ${t.flavor}</div></div>
        </div>
      </div>`;
    }).join("");
    track.innerHTML = cards + cards; // seamless loop
    if (reduce) track.style.animation = "none";
  }

  /* =========================================================
     INSTAGRAM
     ========================================================= */
  function renderSocial() {
    const grid = $("#socialGrid");
    grid.innerHTML = SK_INSTAGRAM.map((s) => {
      const p = byId(s.flavor);
      return `<a class="social-tile" href="#social" data-nav style="background:linear-gradient(150deg,${p.c1},${p.deep})">
        <div class="social-tile__can">${SKCan.build(p, { face: "front" })}</div>
        <div class="social-tile__cap">${s.cap}</div>
      </a>`;
    }).join("");
    // rewire data-nav for new nodes
    $$('[data-nav]', grid).forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      gsap.to(window, { duration: reduce ? 0 : 0.8, scrollTo: { y: "#social", offsetY: 68 } });
    }));
  }

  /* =========================================================
     STORY can (parallax)
     ========================================================= */
  function renderStory() {
    const el = $("#storyCan");
    el.innerHTML = SKCan.build(P[3], { face: "front" }); // Cherry Vanilla
    $(".story .blob--3") && $(".story .blob--3").style.setProperty("--accent", P[3].accent);
    if (reduce) return;
    gsap.fromTo(el, { yPercent: 8, rotationZ: -3 }, {
      yPercent: -8, rotationZ: 3, ease: "none",
      scrollTrigger: { trigger: "#story", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* =========================================================
     SUBSCRIPTION
     ========================================================= */
  function initSubscribe() {
    const base = 32.99;
    const toggle = $("#planToggle");
    toggle.addEventListener("click", (e) => {
      const b = e.target.closest("[data-freq]");
      if (!b) return;
      $$("button", toggle).forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const freq = b.dataset.freq;
      $("#planFreqLabel").textContent = freq === "14" ? "every 2 weeks" : "monthly";
    });
    const save = base * 0.15;
    $("#planSave").textContent = "−" + money(save);
    $("#planTotal").textContent = money(base - save);
    $("#subscribeCta").addEventListener("click", () => {
      SKCart.add(P[0].id, 4); SKCart.add(P[1].id, 4); SKCart.add(P[3].id, 4);
      toast("Subscription variety pack added");
      openCart();
    });
  }

  /* =========================================================
     NEWSLETTER
     ========================================================= */
  function initNewsletter() {
    const form = $("#newsletterForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#newsEmail");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        email.focus(); toast("Please enter a valid email"); return;
      }
      $(".field", form).style.display = "none";
      $(".newsletter__note", form).style.display = "none";
      const s = $("#newsSuccess"); s.hidden = false;
      gsap.fromTo(s, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
    });
  }

  /* =========================================================
     CART DRAWER
     ========================================================= */
  const cartDrawer = $("#cartDrawer");
  function openCart() { renderCart(); openOverlay(cartDrawer); }

  function renderCart() {
    const body = $("#cartItems");
    const foot = $("#cartFoot");
    const items = SKCart.detailed();
    if (!items.length) {
      body.innerHTML = `<div class="cart-empty">
        <svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L23 8H7"/><circle cx="10" cy="21" r="1.4"/><circle cx="19" cy="21" r="1.4"/></svg>
        <p>Your cart is empty.</p></div>`;
      foot.innerHTML = `<button class="btn btn--solid" data-close-cart>Start shopping</button>`;
      wireCartFoot();
      return;
    }
    body.innerHTML = items.map((p) => `
      <div class="cart-line" data-line="${p.id}">
        <div class="cart-line__img">${SKCan.build(p, { face: "front" })}</div>
        <div class="cart-line__info">
          <div class="cart-line__name">${p.name}</div>
          <div class="cart-line__price">${money(p.price)} each</div>
          <div class="cart-line__ctrls">
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Decrease">−</button>
              <input type="text" value="${p.qty}" readonly aria-label="Quantity" />
              <button data-inc="${p.id}" aria-label="Increase">+</button>
            </div>
            <button class="cart-line__remove" data-remove="${p.id}">Remove</button>
          </div>
        </div>
        <div style="font-weight:700">${money(p.price * p.qty)}</div>
      </div>`).join("");

    const sub = SKCart.subtotal(), ship = SKCart.shipping();
    const towardFree = Math.max(0, SKCart.FREE_SHIP_OVER - sub);
    foot.innerHTML = `
      ${towardFree > 0 ? `<p class="cart-note" style="margin-bottom:12px">Add <b>${money(towardFree)}</b> more for free shipping 🚚</p>` : ""}
      <div class="cart-sum"><span>Subtotal</span><b>${money(sub)}</b></div>
      <div class="cart-sum"><span>Shipping</span><b>${ship === 0 ? "Free" : money(ship)}</b></div>
      <div class="cart-total"><span>Total</span><b>${money(SKCart.total())}</b></div>
      <button class="btn btn--solid" id="checkoutBtn">Checkout · ${money(SKCart.total())}</button>
      <p class="cart-note">Demo checkout — no real payment is processed.</p>`;

    body.addEventListener("click", cartBodyClick, { once: true });
    $("#checkoutBtn").addEventListener("click", () => { closeOverlay(cartDrawer); openCheckout(); });
    wireCartFoot();
  }
  function cartBodyClick(e) {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-remove]");
    if (inc) { const p = byId(inc.dataset.inc); SKCart.setQty(p.id, qtyOf(p.id) + 1); }
    else if (dec) { const p = byId(dec.dataset.dec); SKCart.setQty(p.id, qtyOf(p.id) - 1); }
    else if (rem) { SKCart.remove(rem.dataset.remove); }
    if (inc || dec || rem) renderCart();
    else $("#cartItems").addEventListener("click", cartBodyClick, { once: true });
  }
  function qtyOf(id) { const l = SKCart.items.find((i) => i.id === id); return l ? l.qty : 1; }
  function wireCartFoot() {
    $$("[data-close-cart]", cartDrawer).forEach((b) =>
      b.addEventListener("click", () => closeOverlay(cartDrawer)));
  }

  /* =========================================================
     CHECKOUT
     ========================================================= */
  const checkoutModal = $("#checkoutModal");
  const checkoutPanel = $("#checkoutPanel");
  let payMethod = "card";

  function openCheckout() {
    if (!SKCart.items.length) { openCart(); return; }
    payMethod = "card";
    renderCheckout();
    openOverlay(checkoutModal);
  }

  function renderCheckout() {
    const sub = SKCart.subtotal(), ship = SKCart.shipping(), tot = SKCart.total();
    const items = SKCart.detailed();
    checkoutPanel.innerHTML = `
      <button class="icon-btn pd-close" data-close-checkout aria-label="Close">✕</button>
      <div class="checkout__grid">
        <div class="checkout__form">
          <div class="checkout__steps"><span class="checkout__step active"></span><span class="checkout__step active"></span><span class="checkout__step"></span></div>
          <h3>Checkout</h3>
          <p class="checkout__sub">Fast, secure, and entirely a demo — enter anything you like.</p>

          <div class="field-group">
            <div class="inp"><label>Email</label><input data-req type="email" placeholder="you@email.com" value=""></div>
            <div class="field-row">
              <div class="inp"><label>First name</label><input data-req placeholder="Alex"></div>
              <div class="inp"><label>Last name</label><input data-req placeholder="Rivera"></div>
            </div>
            <div class="inp"><label>Address</label><input data-req placeholder="123 Sparkling Ave"></div>
            <div class="field-row">
              <div class="inp"><label>City</label><input data-req placeholder="Portland"></div>
              <div class="inp"><label>ZIP</label><input data-req placeholder="97201"></div>
            </div>
          </div>

          <h4 style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted-2);margin-bottom:12px">Payment</h4>
          <div class="pay-methods">
            <button class="pay-method active" data-pay="card"><span>💳</span><span>Card</span></button>
            <button class="pay-method" data-pay="paylater"><span>🗓️</span><span>Pay in 4</span></button>
            <button class="pay-method" data-pay="cash"><span>💵</span><span>Cash on delivery</span></button>
          </div>
          <div id="payFields">${cardFields()}</div>

          <button class="btn btn--solid" id="placeOrder" style="width:100%;justify-content:center;margin-top:6px">Pay ${money(tot)}</button>
          <button class="checkout__back" data-close-checkout>← Back to shopping</button>
        </div>

        <div class="checkout__aside">
          <h4>Order summary</h4>
          ${items.map((p) => `<div class="co-line"><span>${p.name} <b style="color:var(--muted)">×${p.qty}</b></span><b>${money(p.price * p.qty)}</b></div>`).join("")}
          <div class="co-sum">
            <div class="co-line"><span>Subtotal</span><b>${money(sub)}</b></div>
            <div class="co-line"><span>Shipping</span><b>${ship === 0 ? "Free" : money(ship)}</b></div>
            <div class="co-line" style="font-size:16px;margin-top:6px"><span>Total</span><b style="font-family:var(--serif);font-size:22px">${money(tot)}</b></div>
          </div>
        </div>
      </div>`;

    $$("[data-pay]", checkoutPanel).forEach((b) => b.addEventListener("click", () => {
      payMethod = b.dataset.pay;
      $$("[data-pay]", checkoutPanel).forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      $("#payFields").innerHTML = payMethod === "card" ? cardFields()
        : payMethod === "paylater" ? paylaterFields(tot) : cashFields();
      formatCard();
    }));
    formatCard();
    $("#placeOrder").addEventListener("click", placeOrder);
  }

  function cardFields() {
    return `<div class="field-group">
      <div class="inp"><label>Card number</label><input id="ccNum" data-req inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="19"></div>
      <div class="field-row">
        <div class="inp"><label>Expiry</label><input id="ccExp" data-req placeholder="MM/YY" maxlength="5"></div>
        <div class="inp"><label>CVC</label><input id="ccCvc" data-req inputmode="numeric" placeholder="123" maxlength="4"></div>
      </div>
    </div>`;
  }
  function paylaterFields(tot) {
    return `<div class="field-group"><div class="inp"><label>4 interest-free payments</label>
      <input value="${money(tot / 4)} today, then 3× ${money(tot / 4)}" readonly></div></div>`;
  }
  function cashFields() {
    return `<div class="field-group"><div class="inp"><label>Cash on delivery</label>
      <input value="Pay the courier when your SK arrives 🚚" readonly></div></div>`;
  }
  function formatCard() {
    const num = $("#ccNum"); const exp = $("#ccExp"); const cvc = $("#ccCvc");
    if (num) num.addEventListener("input", () => {
      num.value = num.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    });
    if (exp) exp.addEventListener("input", () => {
      let v = exp.value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      exp.value = v;
    });
    if (cvc) cvc.addEventListener("input", () => { cvc.value = cvc.value.replace(/\D/g, "").slice(0, 4); });
  }

  function placeOrder() {
    // Validate visible required fields
    let ok = true;
    $$("[data-req]", checkoutPanel).forEach((inp) => {
      const empty = !inp.value.trim();
      inp.parentElement.classList.toggle("err", empty);
      if (empty) ok = false;
    });
    if (!ok) { toast("Please complete the highlighted fields"); return; }

    const btn = $("#placeOrder");
    btn.textContent = "Processing…"; btn.disabled = true;
    setTimeout(() => {
      const orderNo = "SK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const tot = SKCart.total();
      checkoutPanel.innerHTML = `
        <button class="icon-btn pd-close" data-close-checkout aria-label="Close">✕</button>
        <div class="confirm">
          <div class="confirm__check">✓</div>
          <h3>Order confirmed!</h3>
          <p>Thanks for choosing SK. Your sparkling refreshment is on its way — you'll get a tracking email shortly.</p>
          <div class="confirm__order">Order <b>${orderNo}</b> · Total <b>${money(tot)}</b> · ${payLabel()}</div>
          <button class="btn btn--solid" data-close-checkout>Continue browsing</button>
        </div>`;
      SKCart.clear();
      wireOverlayCloses();
    }, reduce ? 200 : 1300);
  }
  function payLabel() {
    return payMethod === "card" ? "Paid by card" : payMethod === "paylater" ? "Pay in 4" : "Cash on delivery";
  }

  /* =========================================================
     Overlay helpers
     ========================================================= */
  function openOverlay(el) {
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
  }
  function closeOverlay(el) {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    if (!$(".modal.open") && !$(".drawer.open")) document.body.classList.remove("locked");
  }
  function wireOverlayCloses() {
    $$("[data-close-modal]").forEach((b) => b.onclick = () => closeOverlay(productModal));
    $$("[data-close-cart]").forEach((b) => b.onclick = () => closeOverlay(cartDrawer));
    $$("[data-close-checkout]").forEach((b) => b.onclick = () => closeOverlay(checkoutModal));
  }
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) closeOverlay(productModal);
    if (e.target.matches("[data-close-cart]")) closeOverlay(cartDrawer);
    if (e.target.matches("[data-close-checkout]")) closeOverlay(checkoutModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      [productModal, cartDrawer, checkoutModal].forEach((m) => m.classList.contains("open") && closeOverlay(m));
      toggleMenu(false);
    }
  });

  $("#cartBtn").addEventListener("click", openCart);

  /* =========================================================
     Cart badge sync
     ========================================================= */
  function syncBadge() {
    const c = SKCart.count();
    const el = $("#cartCount");
    el.textContent = c;
    el.classList.toggle("show", c > 0);
  }
  SKCart.onChange(syncBadge);

  /* =========================================================
     Toast + micro-interactions
     ========================================================= */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.innerHTML = `<span class="toast__dot"></span>${msg}`;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }
  function flyPulse(btn) {
    if (reduce) return;
    gsap.fromTo($("#cartBtn"), { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
  }

  /* ---------- utils ---------- */
  function byId(id) { return P.find((p) => p.id === id); }
  function hexA(hex, a) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* =========================================================
     BOOT
     ========================================================= */
  $("#year").textContent = new Date().getFullYear();
  renderHeroCan();
  renderShowcaseCans();
  renderFlavors();
  renderNutrition();
  renderReviews();
  renderSocial();
  renderStory();
  initSubscribe();
  initNewsletter();
  initReveals();
  syncBadge();
  initFlyIns();

  // Refresh triggers after everything paints
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
