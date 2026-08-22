/* =============================================================
   SK SQUEEZE — Product / Flavor data
   Original SK SQUEEZE brand demo content.
   Nutrition & ingredient figures are illustrative demo values.
   `can` holds the label palette used by the can factory.
   ============================================================= */
window.SK_PRODUCTS = [
  {
    id: "citrus-rush",
    name: "SK Squeeze Citrus Rush",
    line1: "CITRUS RUSH", line2: "", canFont: 24,
    tagline: "Sun-ripe orange, lime zest & a bright sparkling finish.",
    description:
      "A vivid burst of orange and lime built on crisp sparkling water. Citrus Rush is the wake-up call of the SK SQUEEZE range — clean, zippy and impossibly refreshing without the sugar crash.",
    price: 2.75, motif: "citrus",
    c1: "#FF9E1B", c2: "#F25C05", accent: "#FFD447", deep: "#D14400",
    cream: "#FFF8E9", ink: "#5a2c00", accentSoft: "#FFF1D0",
    can: { body: "#efe4cf", bodyDark: "#d3c09a", wm: "#E8632A", sqBg: "#E8632A", sqText: "#fff",
           nameCol: "#E8632A", subCol: "rgba(90,60,20,.72)", seed: 11 },
    calories: 30, sugar: 4, carbs: 8, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Orange & lime juice (from concentrate)", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural citrus botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 4g sugar", "No artificial sweeteners", "Vegan & gluten-free"],
    rating: 4.8, reviews: 214, badge: "Bestseller"
  },
  {
    id: "berry-pop",
    name: "SK Squeeze Berry Pop",
    line1: "BERRY POP", line2: "", canFont: 26,
    tagline: "Wild blackberry, raspberry & a soft floral lift.",
    description:
      "Deep, jammy berries balanced with a delicate floral top note. Berry Pop is smooth and lightly tart — a grown-up soda that tastes indulgent while staying light.",
    price: 2.75, motif: "berry",
    c1: "#C2185B", c2: "#7B1FA2", accent: "#F06CC0", deep: "#5E1470",
    cream: "#FFEFF8", ink: "#4a0f38", accentSoft: "#F7D9EE",
    can: { body: "#59193c", bodyDark: "#360f24", wm: "#f9e9f2", sqBg: "#E85AAE", sqText: "#3a0f28",
           nameCol: "#f7d9ec", subCol: "rgba(247,217,236,.72)", seed: 22 },
    calories: 35, sugar: 5, carbs: 9, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Blackberry & raspberry juice", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural berry botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 5g sugar", "No artificial colors", "Vegan & gluten-free"],
    rating: 4.9, reviews: 187, badge: "Fan favorite"
  },
  {
    id: "tropical-wave",
    name: "SK Squeeze Tropical Wave",
    line1: "TROPICAL", line2: "WAVE", canFont: 27,
    tagline: "Pineapple, mango & passionfruit — pure escape.",
    description:
      "A rolling wave of pineapple, mango and passionfruit that tastes like a holiday in a can. Bright, juicy and endlessly sippable, with a clean sparkling backbone.",
    price: 2.85, motif: "tropical",
    c1: "#00BFA5", c2: "#00897B", accent: "#FF7A59", deep: "#00695C",
    cream: "#EDFFFB", ink: "#00463c", accentSoft: "#D2F5EE",
    can: { body: "#1f818a", bodyDark: "#0d565c", wm: "#eafcfb", sqBg: "#FFC24B", sqText: "#0d565c",
           nameCol: "#eafcfb", subCol: "rgba(234,252,251,.72)", seed: 33 },
    calories: 40, sugar: 6, carbs: 10, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Pineapple, mango & passionfruit juice", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural tropical botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 6g sugar", "No lab-made flavors", "Vegan & gluten-free"],
    rating: 4.7, reviews: 156, badge: "New"
  },
  {
    id: "cherry-vanilla",
    name: "SK Squeeze Cherry Vanilla",
    line1: "CHERRY", line2: "VANILLA", canFont: 26,
    tagline: "Dark cherry wrapped in smooth Madagascar vanilla.",
    description:
      "Rich dark cherry meets rounded, creamy vanilla for a nostalgic soda-fountain feel — reimagined light and modern. Silky, comforting and deeply satisfying.",
    price: 2.85, motif: "cherry",
    c1: "#E23B54", c2: "#9E1B32", accent: "#F7C9A0", deep: "#7A1225",
    cream: "#FFF4EC", ink: "#5e0e1c", accentSoft: "#F9DFD3",
    can: { body: "#7e1c2f", bodyDark: "#4f1019", wm: "#fdefe8", sqBg: "#F0B27A", sqText: "#4f1019",
           nameCol: "#fdeae0", subCol: "rgba(253,234,224,.72)", seed: 44 },
    calories: 35, sugar: 5, carbs: 9, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Dark cherry juice (from concentrate)", "Madagascar vanilla extract", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 5g sugar", "Real vanilla extract", "Vegan & gluten-free"],
    rating: 4.9, reviews: 203, badge: "Bestseller"
  },
  {
    id: "ginger-lime",
    name: "SK Squeeze Ginger Lime",
    line1: "GINGER", line2: "LIME", canFont: 28,
    tagline: "Fiery fresh ginger, cooled with bright lime.",
    description:
      "Real pressed ginger brings warmth and a gentle kick, lifted by sharp, cooling lime. Ginger Lime is crisp and invigorating — the most refreshingly bold SK SQUEEZE yet.",
    price: 2.75, motif: "ginger",
    c1: "#A4C639", c2: "#5E8C1E", accent: "#F4E04D", deep: "#456814",
    cream: "#FBFFEC", ink: "#33500f", accentSoft: "#EAF4C9",
    can: { body: "#171a1c", bodyDark: "#050607", wm: "#f3f7f0", sqBg: "#A6CE39", sqText: "#12160a",
           nameCol: "#A6CE39", subCol: "rgba(200,208,190,.72)", leaf: "#A6CE39", seed: 55 },
    calories: 25, sugar: 3, carbs: 7, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Pressed ginger & lime juice", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural ginger botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Lowest sugar — 3g", "Real pressed ginger", "Vegan & gluten-free"],
    rating: 4.8, reviews: 142, badge: "Low sugar"
  },
  {
    id: "classic-cola",
    name: "SK Squeeze Classic Cola",
    line1: "CLASSIC", line2: "COLA", canFont: 28,
    tagline: "The classic, reimagined — bold cola, half the sugar.",
    description:
      "A grown-up take on the drink everyone knows. Deep caramel-cola character with warm spice and vanilla, built light on plant fiber and a fraction of the usual sugar.",
    price: 2.65, motif: "cola",
    c1: "#C0392B", c2: "#7B1E14", accent: "#E74C3C", deep: "#6E1109",
    cream: "#FFF2EE", ink: "#4a0f09", accentSoft: "#F6D8D2",
    can: { body: "#ece0c8", bodyDark: "#c9b691", wm: "#9E1B2E", sqBg: "#9E1B2E", sqText: "#fff",
           nameCol: "#9E1B2E", subCol: "rgba(90,60,20,.72)", seed: 66 },
    calories: 45, sugar: 8, carbs: 12, fiber: 5, protein: 0,
    ingredients: ["Sparkling water", "Cola nut & citrus extracts", "Caramel (plant-based)", "Prebiotic plant fiber", "Cassava root fiber", "Vanilla extract", "Sea salt", "Stevia leaf"],
    benefits: ["5g plant fiber", "Half the sugar", "No phosphoric acid", "Vegan & gluten-free"],
    rating: 4.7, reviews: 268, badge: "Classic"
  },
  {
    id: "orange-squeeze",
    name: "SK Squeeze Orange Squeeze",
    line1: "ORANGE", line2: "", canFont: 30,
    tagline: "Fresh-pressed orange with a bright, juicy snap.",
    description:
      "Like squeezing a whole crate of sun-warmed oranges into a can. Juicy, zesty and full-bodied with a crisp sparkle — the everyday citrus you'll never get tired of.",
    price: 2.75, motif: "orange",
    c1: "#F08A1E", c2: "#D26A08", accent: "#FFC24B", deep: "#B5590A",
    cream: "#FFF6E9", ink: "#5a2e00", accentSoft: "#FFE9C6",
    can: { body: "#f0891d", bodyDark: "#c76a08", wm: "#fff6e6", sqBg: "#fff6e6", sqText: "#c76a08",
           nameCol: "#fff6e6", subCol: "rgba(255,246,230,.8)", seed: 77 },
    calories: 40, sugar: 7, carbs: 10, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Pressed orange juice (from concentrate)", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural orange botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 7g sugar", "Real pressed orange", "Vegan & gluten-free"],
    rating: 4.8, reviews: 191, badge: "Juicy"
  },
  {
    id: "lemon-lime",
    name: "SK Squeeze Lemon Lime",
    line1: "LEMON", line2: "LIME", canFont: 28,
    tagline: "Crisp lemon and lime with a clean, dry finish.",
    description:
      "Sharp, sparkling and endlessly refreshing. A bright lemon-lime built dry and clean — a perfect everyday sipper and an even better mixer.",
    price: 2.65, motif: "lemonlime",
    c1: "#4CAF50", c2: "#2E7D32", accent: "#C6E85A", deep: "#1B5E20",
    cream: "#F2FCE9", ink: "#16400f", accentSoft: "#E1F3C6",
    can: { body: "#1d6b41", bodyDark: "#0e4227", wm: "#f2fce9", sqBg: "#D8E85A", sqText: "#0e4227",
           nameCol: "#eafbd8", subCol: "rgba(226,246,213,.72)", leaf: "#D8E85A", seed: 88 },
    calories: 30, sugar: 4, carbs: 8, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Lemon & lime juice (from concentrate)", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural citrus botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 4g sugar", "Great as a mixer", "Vegan & gluten-free"],
    rating: 4.7, reviews: 174, badge: "Crisp"
  },
  {
    id: "strawberry-sunshine",
    name: "SK Squeeze Strawberry Sunshine",
    line1: "STRAWBERRY", line2: "SUNSHINE", canFont: 22,
    tagline: "Ripe strawberries with a warm, sunny sweetness.",
    description:
      "Sun-ripened strawberries at their peak — soft, fragrant and gently sweet. Strawberry Sunshine is bright and mellow, like the first warm day of summer in a can.",
    price: 2.85, motif: "strawberry",
    c1: "#EC5A6E", c2: "#C23A52", accent: "#FFB199", deep: "#8E1B30",
    cream: "#FFF0F0", ink: "#5e1020", accentSoft: "#FBD9DD",
    can: { body: "#e06479", bodyDark: "#b6435a", wm: "#fff2f2", sqBg: "#FFD1A8", sqText: "#b6435a",
           nameCol: "#fff0f0", subCol: "rgba(255,240,240,.78)", seed: 99 },
    calories: 35, sugar: 6, carbs: 9, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Strawberry juice (from concentrate)", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural strawberry botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 6g sugar", "No artificial colors", "Vegan & gluten-free"],
    rating: 4.9, reviews: 221, badge: "Fan favorite"
  },
  {
    id: "blueberry-blast",
    name: "SK Squeeze Blueberry Blast",
    line1: "BLUEBERRY", line2: "BLAST", canFont: 24,
    tagline: "Plump wild blueberries with a cool, crisp pop.",
    description:
      "Deep, juicy wild blueberries with a cool, crisp sparkle. Blueberry Blast is smooth and a little tart — rich in flavor, light on everything else.",
    price: 2.85, motif: "blueberry",
    c1: "#5A8FC7", c2: "#2E5F8F", accent: "#7FB0E0", deep: "#1E3F63",
    cream: "#EEF5FC", ink: "#14304f", accentSoft: "#D5E6F5",
    can: { body: "#8fb4d6", bodyDark: "#6890b8", wm: "#1e3a5f", sqBg: "#1e3a5f", sqText: "#fff",
           nameCol: "#1e3a5f", subCol: "rgba(30,58,95,.72)", seed: 111 },
    calories: 35, sugar: 5, carbs: 9, fiber: 6, protein: 0,
    ingredients: ["Sparkling water", "Wild blueberry juice (from concentrate)", "Prebiotic plant fiber", "Cassava root fiber", "Sea salt", "Natural berry botanicals", "Stevia leaf"],
    benefits: ["6g plant fiber", "Only 5g sugar", "Real wild blueberry", "Vegan & gluten-free"],
    rating: 4.8, reviews: 165, badge: "New"
  }
];

window.SK_TESTIMONIALS = [
  { name: "Maya R.", flavor: "Cherry Vanilla", rating: 5, text: "The first soda I've had that tastes genuinely premium. Cherry Vanilla is dangerously good and no sugar slump after." },
  { name: "Daniel K.", flavor: "Citrus Rush", rating: 5, text: "Citrus Rush replaced my afternoon energy drink. Crisp, clean, and the can looks incredible on my desk." },
  { name: "Priya S.", flavor: "Berry Pop", rating: 5, text: "I bought the variety pack for a dinner party and everyone asked where I got them. Berry Pop was gone first." },
  { name: "Leo M.", flavor: "Ginger Lime", rating: 4, text: "The ginger kick is real — not watered down. It's become my go-to mixer and my straight-up sipper." },
  { name: "Sofia T.", flavor: "Tropical Wave", rating: 5, text: "Tropical Wave tastes like actual fruit, not candy. Subscription sorted, I never want to run out." },
  { name: "Aaron B.", flavor: "Classic Cola", rating: 5, text: "Finally a cola I don't feel guilty about. All the nostalgia, none of the sugar coma. Obsessed." },
  { name: "Nina L.", flavor: "Strawberry Sunshine", rating: 5, text: "Strawberry Sunshine is summer in a can. My kids and I fight over the last one every single time." },
  { name: "Marcus V.", flavor: "Blueberry Blast", rating: 5, text: "Blueberry Blast is unreal — tastes like real berries and the can design is gorgeous. Premium all the way." }
];

window.SK_INSTAGRAM = [
  { flavor: "citrus-rush", cap: "Golden hour, golden can ☀️" },
  { flavor: "tropical-wave", cap: "Poolside pour 🌊" },
  { flavor: "strawberry-sunshine", cap: "Summer, canned 🍓" },
  { flavor: "classic-cola", cap: "The classic, reimagined" },
  { flavor: "blueberry-blast", cap: "Wild berry energy 💜" },
  { flavor: "orange-squeeze", cap: "Fresh squeezed 🧡" },
  { flavor: "berry-pop", cap: "Berry season, all year" },
  { flavor: "ginger-lime", cap: "The desk companion 🌿" }
];
