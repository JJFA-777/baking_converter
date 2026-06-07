import { useState, useRef, useEffect } from "react";
import "./App.css";

// ─────────────────────────────────────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────────────────────────────────────
const LOGO = "/favicon.png";
const LOGO_WHITE = "/images/logo-white.png";

// ─────────────────────────────────────────────────────────────────────────────
// INGREDIENT DATA
// ─────────────────────────────────────────────────────────────────────────────
const INGREDIENT_GROUPS = [
  {
    id: "flours",
    label: "Flours & Starches",
    emoji: "🌾",
    items: [
      { id: "all_purpose_flour",     name: "All-Purpose Flour",          gramsPerCup: 120, icon: "🌾" },
      { id: "bread_flour",           name: "Bread Flour",                gramsPerCup: 127, icon: "🍞" },
      { id: "cake_flour",            name: "Cake Flour",                 gramsPerCup: 100, icon: "🎂" },
      { id: "pastry_flour",          name: "Pastry Flour",               gramsPerCup: 106, icon: "🥐" },
      { id: "self_rising_flour",     name: "Self-Rising Flour",          gramsPerCup: 120, icon: "🌾" },
      { id: "high_gluten_flour",     name: "High-Gluten Flour",          gramsPerCup: 132, icon: "💪" },
      { id: "pizza_00_flour",        name: "00 Pizza Flour",             gramsPerCup: 120, icon: "🍕" },
      { id: "whole_wheat_flour",     name: "Whole Wheat Flour",          gramsPerCup: 130, icon: "🌾" },
      { id: "whole_wheat_pastry",    name: "Whole Wheat Pastry Flour",   gramsPerCup: 120, icon: "🌾" },
      { id: "medium_rye_flour",      name: "Medium Rye Flour",           gramsPerCup: 102, icon: "🌾" },
      { id: "white_rye_flour",       name: "White Rye Flour",            gramsPerCup: 102, icon: "🌾" },
      { id: "spelt_flour",           name: "Spelt Flour",                gramsPerCup: 118, icon: "🌾" },
      { id: "almond_flour",          name: "Almond Flour",               gramsPerCup: 96,  icon: "🌰" },
      { id: "almond_meal",           name: "Almond Meal",                gramsPerCup: 96,  icon: "🌰" },
      { id: "hazelnut_flour",        name: "Hazelnut Flour",             gramsPerCup: 112, icon: "🌰" },
      { id: "coconut_flour",         name: "Coconut Flour",              gramsPerCup: 128, icon: "🥥" },
      { id: "oat_flour",             name: "Oat Flour",                  gramsPerCup: 92,  icon: "🥣" },
      { id: "rice_flour",            name: "Rice Flour",                 gramsPerCup: 158, icon: "🍚" },
      { id: "chickpea_flour",        name: "Chickpea Flour",             gramsPerCup: 92,  icon: "🫘" },
      { id: "soy_flour",             name: "Soy Flour",                  gramsPerCup: 80,  icon: "🫘" },
      { id: "quinoa_flour",          name: "Quinoa Flour",               gramsPerCup: 112, icon: "🌿" },
      { id: "teff_flour",            name: "Teff Flour",                 gramsPerCup: 130, icon: "🌾" },
      { id: "potato_flour",          name: "Potato Flour",               gramsPerCup: 180, icon: "🥔" },
      { id: "potato_starch",         name: "Potato Starch",              gramsPerCup: 192, icon: "🥔" },
      { id: "tapioca_flour",         name: "Tapioca / Tapioca Starch",   gramsPerCup: 120, icon: "🫙" },
      { id: "corn_starch",           name: "Corn Starch",                gramsPerCup: 128, icon: "🌽" },
      { id: "vital_wheat_gluten",    name: "Vital Wheat Gluten",         gramsPerCup: 136, icon: "💛" },
      { id: "keto_wheat_flour",      name: "Keto Wheat Flour",           gramsPerCup: 96,  icon: "🌾" },
      { id: "keto_pizza_mix",        name: "Keto Wheat Pizza Crust Mix", gramsPerCup: 100, icon: "🍕" },
      { id: "flax_meal",             name: "Flax Meal",                  gramsPerCup: 152, icon: "🌿" },
    ],
  },
  {
    id: "sugars",
    label: "Sugars & Sweeteners",
    emoji: "🍯",
    items: [
      { id: "granulated_sugar",      name: "Granulated Sugar",           gramsPerCup: 200, icon: "🍬" },
      { id: "caster_sugar",          name: "Caster Sugar (Super-fine)",  gramsPerCup: 200, icon: "✨" },
      { id: "powdered_sugar",        name: "Powdered / Icing Sugar",     gramsPerCup: 120, icon: "☁️" },
      { id: "brown_sugar",           name: "Brown Sugar (packed)",       gramsPerCup: 220, icon: "🟤" },
      { id: "raw_sugar",             name: "Raw / Turbinado Sugar",      gramsPerCup: 200, icon: "🟡" },
      { id: "demerara_sugar",        name: "Demerara Sugar",             gramsPerCup: 200, icon: "🟤" },
      { id: "coconut_sugar",         name: "Coconut Sugar",              gramsPerCup: 180, icon: "🥥" },
      { id: "maple_sugar",           name: "Maple Sugar",                gramsPerCup: 152, icon: "🍁" },
      { id: "date_powder",           name: "Date Powder",                gramsPerCup: 142, icon: "🟤" },
      { id: "honey",                 name: "Honey",                      gramsPerCup: 340, icon: "🍯" },
      { id: "maple_syrup",           name: "Maple Syrup",                gramsPerCup: 322, icon: "🍁" },
      { id: "maple_cream",           name: "Maple Cream",                gramsPerCup: 322, icon: "🍁" },
      { id: "agave",                 name: "Agave Nectar",               gramsPerCup: 333, icon: "🌵" },
      { id: "molasses",              name: "Molasses / Black Treacle",   gramsPerCup: 328, icon: "🫙" },
      { id: "golden_syrup",          name: "Golden Syrup",               gramsPerCup: 340, icon: "🌟" },
      { id: "glucose_syrup",         name: "Glucose Syrup",              gramsPerCup: 340, icon: "🫙" },
      { id: "sweetened_cond_coconut",name: "Sweetened Condensed Coconut Milk", gramsPerCup: 306, icon: "🥥" },
      { id: "splenda",               name: "Sugar Substitute (Splenda)", gramsPerCup: 24,  icon: "🌿" },
      { id: "monkfruit_allulose",    name: "Monkfruit & Allulose Blend", gramsPerCup: 100, icon: "🌿" },
      { id: "erythritol",            name: "Erythritol / Sugar Substitute", gramsPerCup: 192, icon: "🌿" },
    ],
  },
  {
    id: "fats",
    label: "Fats, Oils & Spreads",
    emoji: "🧈",
    items: [
      { id: "butter",                name: "Butter",                     gramsPerCup: 227, icon: "🧈" },
      { id: "clarified_butter",      name: "Clarified Butter (Ghee)",    gramsPerCup: 205, icon: "🧈" },
      { id: "palm_shortening",       name: "Palm Shortening",            gramsPerCup: 190, icon: "🥥" },
      { id: "shortening",            name: "Vegetable Shortening",       gramsPerCup: 190, icon: "🥡" },
      { id: "lard",                  name: "Lard",                       gramsPerCup: 205, icon: "🐷" },
      { id: "vegetable_oil",         name: "Vegetable Oil",              gramsPerCup: 218, icon: "🫙" },
      { id: "olive_oil",             name: "Olive Oil",                  gramsPerCup: 216, icon: "🫒" },
      { id: "coconut_oil",           name: "Coconut Oil",                gramsPerCup: 218, icon: "🥥" },
      { id: "canola_oil",            name: "Canola Oil",                 gramsPerCup: 218, icon: "🌻" },
      { id: "almond_butter",         name: "Almond Butter",              gramsPerCup: 258, icon: "🌰" },
      { id: "peanut_butter",         name: "Peanut Butter",              gramsPerCup: 258, icon: "🥜" },
      { id: "hazelnut_spread",       name: "Hazelnut Spread (Nutella)",  gramsPerCup: 300, icon: "🌰" },
      { id: "cream_cheese",          name: "Cream Cheese",               gramsPerCup: 232, icon: "🧀" },
      { id: "mayonnaise",            name: "Mayonnaise",                 gramsPerCup: 220, icon: "🫙" },
    ],
  },
  {
    id: "dairy",
    label: "Dairy & Eggs",
    emoji: "🥛",
    items: [
      { id: "milk",                  name: "Milk (whole/fresh)",         gramsPerCup: 244, icon: "🥛" },
      { id: "buttermilk",            name: "Buttermilk",                 gramsPerCup: 245, icon: "🥛" },
      { id: "heavy_cream",           name: "Heavy / Whipping Cream",     gramsPerCup: 238, icon: "🫙" },
      { id: "double_cream",          name: "Double Cream",               gramsPerCup: 235, icon: "🫙" },
      { id: "light_cream",           name: "Light Cream / Half & Half",  gramsPerCup: 232, icon: "🫙" },
      { id: "sour_cream",            name: "Sour Cream",                 gramsPerCup: 240, icon: "🫙" },
      { id: "creme_fraiche",         name: "Crème Fraîche",              gramsPerCup: 240, icon: "🫙" },
      { id: "yogurt",                name: "Yogurt (plain)",             gramsPerCup: 245, icon: "🍶" },
      { id: "greek_yogurt",          name: "Greek Yogurt",               gramsPerCup: 245, icon: "🏺" },
      { id: "cottage_cheese",        name: "Cottage Cheese",             gramsPerCup: 226, icon: "🧀" },
      { id: "ricotta",               name: "Cheese (Ricotta)",           gramsPerCup: 246, icon: "🧀" },
      { id: "mascarpone",            name: "Mascarpone",                 gramsPerCup: 226, icon: "🧀" },
      { id: "parmesan",              name: "Cheese (Grated Parmesan)",   gramsPerCup: 100, icon: "🧀" },
      { id: "feta",                  name: "Cheese (Grated / Crumbled Feta)", gramsPerCup: 150, icon: "🧀" },
      { id: "milk_evaporated",       name: "Milk (Evaporated)",          gramsPerCup: 252, icon: "🥛" },
      { id: "sweetened_cond_milk",   name: "Sweetened Condensed Milk",   gramsPerCup: 306, icon: "🥛" },
      { id: "cream_of_coconut",      name: "Cream of Coconut (sweetened)", gramsPerCup: 296, icon: "🥥" },
      { id: "milk_almond",           name: "Almond Milk",                gramsPerCup: 240, icon: "🌰" },
      { id: "milk_oat",              name: "Oat Milk",                   gramsPerCup: 240, icon: "🥣" },
      { id: "coconut_milk",          name: "Coconut Milk (canned)",      gramsPerCup: 240, icon: "🥥" },
      { id: "water",                 name: "Water",                      gramsPerCup: 237, icon: "💧" },
      { id: "nonfat_milk_powder",    name: "Non-Fat Powdered Milk",      gramsPerCup: 120, icon: "🥛" },
      { id: "full_cream_milk_powder",name: "Whole / Full-Cream Milk Powder", gramsPerCup: 128, icon: "🥛" },
      { id: "buttermilk_powder",     name: "Buttermilk Powder",          gramsPerCup: 120, icon: "🥛" },
      { id: "coconut_milk_powder",   name: "Coconut Milk Powder",        gramsPerCup: 130, icon: "🥥" },
      { id: "eggs_fresh",            name: "Eggs (whole, large) — per cup ≈ 4–5 eggs", gramsPerCup: 200, icon: "🥚" },
      { id: "egg_whites_dried",      name: "Egg Whites (dried)",         gramsPerCup: 56,  icon: "🥚" },
      { id: "egg_yolks_fresh",       name: "Egg Yolks (fresh) — per cup ≈ 12 yolks", gramsPerCup: 242, icon: "🥚" },
    ],
  },
  {
    id: "fruits",
    label: "Fruits & Berries",
    emoji: "🍓",
    items: [
      { id: "strawberries_sliced",   name: "Strawberries (fresh, sliced)", gramsPerCup: 166, icon: "🍓" },
      { id: "strawberries_frozen",   name: "Strawberries (frozen)",       gramsPerCup: 160, icon: "🍓" },
      { id: "blueberries_fresh",     name: "Blueberries (fresh or frozen)", gramsPerCup: 148, icon: "🫐" },
      { id: "blueberries_dried",     name: "Blueberries (dried)",         gramsPerCup: 170, icon: "🫐" },
      { id: "raspberries_fresh",     name: "Raspberries (fresh)",         gramsPerCup: 123, icon: "🍓" },
      { id: "raspberries_frozen",    name: "Raspberries (frozen)",        gramsPerCup: 120, icon: "🍓" },
      { id: "mango_fresh",           name: "Mango (fresh, diced)",        gramsPerCup: 165, icon: "🥭" },
      { id: "mango_dried",           name: "Mango (dried, diced)",        gramsPerCup: 140, icon: "🥭" },
      { id: "cherries_fresh",        name: "Cherries (fresh, pitted, chopped)", gramsPerCup: 155, icon: "🍒" },
      { id: "cherries_frozen",       name: "Cherries (frozen)",           gramsPerCup: 155, icon: "🍒" },
      { id: "cherry_concentrate",    name: "Cherry Concentrate",          gramsPerCup: 340, icon: "🍒" },
      { id: "cranberries_dried",     name: "Cranberries (dried)",         gramsPerCup: 120, icon: "🍒" },
      { id: "cranberries_fresh",     name: "Cranberries (fresh or frozen)", gramsPerCup: 100, icon: "🍒" },
      { id: "berries_frozen",        name: "Berries (mixed, frozen)",     gramsPerCup: 140, icon: "🫐" },
      { id: "raisins",               name: "Raisins",                     gramsPerCup: 165, icon: "🍇" },
      { id: "currants",              name: "Currants",                    gramsPerCup: 145, icon: "🍇" },
      { id: "apples_fresh",          name: "Apples (fresh, sliced)",      gramsPerCup: 125, icon: "🍎" },
      { id: "apples_dried",          name: "Apples (dried, diced)",       gramsPerCup: 85,  icon: "🍎" },
      { id: "applesauce",            name: "Applesauce",                  gramsPerCup: 245, icon: "🍎" },
      { id: "apricots_dried",        name: "Apricots (dried, diced)",     gramsPerCup: 130, icon: "🍑" },
      { id: "bananas_mashed",        name: "Bananas (mashed)",            gramsPerCup: 225, icon: "🍌" },
      { id: "dates_chopped",         name: "Dates (chopped)",             gramsPerCup: 178, icon: "🟤" },
      { id: "peaches_diced",         name: "Peaches (peeled, diced)",     gramsPerCup: 154, icon: "🍑" },
      { id: "pears_diced",           name: "Pears (peeled, diced)",       gramsPerCup: 155, icon: "🍐" },
      { id: "pineapple_crushed",     name: "Pineapple (crushed, drained)", gramsPerCup: 246, icon: "🍍" },
      { id: "pineapple_fresh",       name: "Pineapple (fresh or canned, diced)", gramsPerCup: 165, icon: "🍍" },
      { id: "pineapple_dried",       name: "Pineapple (dried)",           gramsPerCup: 130, icon: "🍍" },
      { id: "ginger_fresh",          name: "Ginger (fresh, sliced)",      gramsPerCup: 96,  icon: "🫚" },
      { id: "lemon_juice",           name: "Lemon Juice",                 gramsPerCup: 227, icon: "🍋" },
      { id: "lime_juice",            name: "Lime Juice",                  gramsPerCup: 227, icon: "🍋" },
      { id: "key_lime_juice",        name: "Key Lime Juice",              gramsPerCup: 227, icon: "🍋" },
    ],
  },
  {
    id: "nuts",
    label: "Nuts & Seeds",
    emoji: "🌰",
    items: [
      { id: "almond_whole",          name: "Almonds (whole, unblanched)", gramsPerCup: 143, icon: "🌰" },
      { id: "almond_slivered",       name: "Almonds (slivered)",          gramsPerCup: 108, icon: "🌰" },
      { id: "chopped_almonds",       name: "Almonds (chopped)",           gramsPerCup: 117, icon: "🌰" },
      { id: "chopped_walnuts",       name: "Walnuts (chopped)",           gramsPerCup: 117, icon: "🌰" },
      { id: "walnuts_whole",         name: "Walnuts (whole)",             gramsPerCup: 100, icon: "🌰" },
      { id: "chopped_pecans",        name: "Pecans (chopped)",            gramsPerCup: 109, icon: "🌰" },
      { id: "cashews_chopped",       name: "Cashews (chopped)",           gramsPerCup: 130, icon: "🌰" },
      { id: "cashews_whole",         name: "Cashews (whole)",             gramsPerCup: 137, icon: "🌰" },
      { id: "macadamia_nuts",        name: "Macadamia Nuts (whole)",      gramsPerCup: 134, icon: "🌰" },
      { id: "peanuts",               name: "Peanuts (shelled)",           gramsPerCup: 146, icon: "🥜" },
      { id: "pine_nuts",             name: "Pine Nuts",                   gramsPerCup: 136, icon: "🌲" },
      { id: "pistachios",            name: "Pistachio Nuts (shelled)",    gramsPerCup: 123, icon: "🌿" },
      { id: "pumpkin_seeds",         name: "Pumpkin Seeds",               gramsPerCup: 138, icon: "🎃" },
      { id: "chia_seeds",            name: "Chia Seeds",                  gramsPerCup: 161, icon: "🌿" },
      { id: "sesame_seeds",          name: "Sesame Seeds",                gramsPerCup: 144, icon: "🌿" },
      { id: "flaxseed",              name: "Flaxseed (whole)",            gramsPerCup: 149, icon: "🌿" },
      { id: "poppy_seeds",           name: "Poppy Seeds",                 gramsPerCup: 136, icon: "🌿" },
      { id: "desiccated_coconut",    name: "Desiccated Coconut",          gramsPerCup: 93,  icon: "🥥" },
    ],
  },
  {
    id: "grains",
    label: "Grains & Cereals",
    emoji: "🥐",
    items: [
      { id: "rolled_oats",           name: "Rolled Oats (old-fashioned)", gramsPerCup: 90,  icon: "🥣" },
      { id: "steel_cut_oats",        name: "Steel-Cut Oats",              gramsPerCup: 170, icon: "🥣" },
      { id: "oats_prepared",         name: "Oats (cooked / prepared)",    gramsPerCup: 240, icon: "🥣" },
      { id: "oat_bran",              name: "Oat Bran",                    gramsPerCup: 94,  icon: "🥣" },
      { id: "wheat_bran",            name: "Wheat Bran",                  gramsPerCup: 58,  icon: "🌾" },
      { id: "wheat_germ",            name: "Wheat Germ",                  gramsPerCup: 115, icon: "🌾" },
      { id: "wheat_berries",         name: "Wheat Berries (red)",         gramsPerCup: 195, icon: "🌾" },
      { id: "granola_plain",          name: "Granola (plain)",             gramsPerCup: 113, icon: "🥣" },
      { id: "granola_fruit_seed",      name: "Granola (fruit & seed)",       gramsPerCup: 120, icon: "🍇" },
      { id: "breadcrumbs_dried",     name: "Breadcrumbs (dried / panko)", gramsPerCup: 120, icon: "🍞" },
      { id: "breadcrumbs_fresh",     name: "Breadcrumbs (fresh)",         gramsPerCup: 60,  icon: "🍞" },
      { id: "graham_cracker_crumbs", name: "Graham Cracker Crumbs",       gramsPerCup: 100, icon: "🍪" },
      { id: "sourdough_starter",     name: "Sourdough Starter (active)",  gramsPerCup: 240, icon: "🍞" },
      { id: "oat_milk",              name: "Oat Milk",                   gramsPerCup: 240, icon: "🥣" },
    ],
  },
  {
    id: "cocoa",
    label: "Chocolate & Cocoa",
    emoji: "🍫",
    items: [
      { id: "cocoa_powder",          name: "Cocoa Powder",                gramsPerCup: 85,  icon: "🍫" },
      { id: "cocoa_dutch",           name: "Dutch-Process Cocoa",         gramsPerCup: 82,  icon: "🍫" },
      { id: "cocoa_liquor",          name: "Cocoa Liquor (unsweetened)",  gramsPerCup: 227, icon: "🍫" },
      { id: "cacao_beans",           name: "Cacao Beans (whole)",         gramsPerCup: 170, icon: "🫘" },
      { id: "cacao_nibs",            name: "Cacao Nibs",                  gramsPerCup: 120, icon: "🫘" },
      { id: "chocolate_chips",       name: "Chocolate Chips (dark/semi)", gramsPerCup: 170, icon: "🍫" },
      { id: "white_choc_chips",      name: "White Chocolate Chips",       gramsPerCup: 170, icon: "🤍" },
      { id: "chocolate_chopped",     name: "Chocolate (roughly chopped)", gramsPerCup: 170, icon: "🍫" },
    ],
  },
  {
    id: "leaveners",
    label: "Leaveners & Flavourings",
    emoji: "🧂",
    items: [
      { id: "baking_powder",         name: "Baking Powder",               gramsPerCup: 230, icon: "🥄" },
      { id: "baking_soda",           name: "Baking Soda",                 gramsPerCup: 230, icon: "🥄" },
      { id: "salt",                  name: "Salt (table)",                gramsPerCup: 288, icon: "🧂" },
      { id: "salt_kosher",           name: "Salt (kosher)",               gramsPerCup: 144, icon: "🧂" },
      { id: "instant_yeast",         name: "Instant Yeast",               gramsPerCup: 150, icon: "🍄" },
      { id: "active_dry_yeast",      name: "Active Dry Yeast",            gramsPerCup: 144, icon: "🍄" },
      { id: "cream_of_tartar",       name: "Cream of Tartar",             gramsPerCup: 240, icon: "🧪" },
      { id: "meringue_powder",       name: "Meringue Powder",             gramsPerCup: 112, icon: "☁️" },
      { id: "espresso_powder",       name: "Espresso Powder",             gramsPerCup: 90,  icon: "☕" },
      { id: "matcha_powder",         name: "Matcha Powder",               gramsPerCup: 80,  icon: "🍵" },
      { id: "ginger_powder",         name: "Ginger Powder",               gramsPerCup: 180, icon: "🫚" },
      { id: "buttermilk_powder_lev", name: "Buttermilk Powder",           gramsPerCup: 120, icon: "🥛" },
    ],
  },
  {
    id: "pantry",
    label: "Pantry Extras",
    emoji: "🧁",
    items: [
      { id: "jam_preserves",         name: "Jam or Preserves",            gramsPerCup: 340, icon: "🫙" },
      { id: "lemon_curd",            name: "Lemon Curd",                  gramsPerCup: 320, icon: "🍋" },
      { id: "lemon_juice_powder",    name: "Lemon Juice Powder",          gramsPerCup: 192, icon: "🍋" },
      { id: "lime_juice_powder",     name: "Lime Juice Powder",           gramsPerCup: 192, icon: "🍋" },
      { id: "candied_lemon_peel",    name: "Candied Lemon Peel",          gramsPerCup: 180, icon: "🍋" },
      { id: "candied_orange_peel",   name: "Candied Orange Peel",         gramsPerCup: 180, icon: "🍊" },
      { id: "marzipan",              name: "Marzipan",                    gramsPerCup: 285, icon: "💛" },
      { id: "marshmallows_mini",     name: "Marshmallows (mini)",         gramsPerCup: 43,  icon: "☁️" },
    ],
  },
];

const DEFAULT_INGREDIENTS = INGREDIENT_GROUPS.flatMap(g => g.items);

// ─────────────────────────────────────────────────────────────────────────────
// UNITS
// ─────────────────────────────────────────────────────────────────────────────
const UNITS = ["grams", "cups", "ounces", "tablespoon", "teaspoon"];
const UNIT_LABELS = { grams: "g", cups: "cup", ounces: "oz", tablespoon: "tbsp", teaspoon: "tsp" };

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function toGrams(value, unit, gpc) {
  const v = parseFloat(value);
  if (isNaN(v)) return NaN;
  switch (unit) {
    case "grams":  return v;
    case "cups":   return v * gpc;
    case "ounces": return v * 28.3495;
    case "tablespoon": return v * (gpc / 16);
    case "teaspoon":    return v * (gpc / 48);
    default:       return v;
  }
}
function fromGrams(g, unit, gpc) {
  switch (unit) {
    case "grams":  return g;
    case "cups":   return g / gpc;
    case "ounces": return g / 28.3495;
    case "tablespoon": return g / (gpc / 16);
    case "teaspoon":    return g / (gpc / 48);
    default:       return g;
  }
}
function formatValue(value, unit) {
  if (isNaN(value) || !isFinite(value)) return "—";

  if (unit === "ounces") {
    return value.toFixed(1);
  }

  if (unit === "grams") {
    if (value < 0.01) return value.toExponential(2);
    if (value < 1)    return value.toFixed(3);
    if (value < 10)   return value.toFixed(2);
    if (value < 100)  return value.toFixed(1);
    return Math.round(value).toString();
  }

  // For cups, tbsp, tsp - use fractions
  const fractions = [
    { val: 0.75, str: "3/4" },
    { val: 0.6667, str: "2/3" },
    { val: 0.5, str: "1/2" },
    { val: 0.3333, str: "1/3" },
    { val: 0.25, str: "1/4" },
    { val: 0.125, str: "1/8" },
  ];

  // We use a precision of 24ths to accommodate both 8ths and 3rds
  const n = Math.round(value * 24) / 24;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toString();

  const whole = Math.floor(n);
  let remainder = n - whole;
  const parts = [];

  for (const f of fractions) {
    if (remainder >= f.val - 0.001) {
      parts.push(f.str);
      remainder -= f.val;
    }
  }

  const fractionStr = parts.join("+");
  return whole > 0 ? `${whole}+${fractionStr}` : fractionStr;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "bi_custom_ingredients";
function loadCustom() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveCustom(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG & ADS
// ─────────────────────────────────────────────────────────────────────────────
const WA_NUMBER = "+233500880529";
const EBOOKS = [
  { id: "ebook-1", title: "Volume 1: Cakes", image: "/images/Volume-1_Cakes.png", message: "Hi! I'm interested in 'Volume 1: Cakes' ebook. Could you tell me more?" },
  { id: "ebook-2", title: "Volume 2: Quick Breads", image: "/images/Volume-2_Quick-Breads.png", message: "Hi! I'm interested in 'Volume 2: Quick Breads' ebook. Could you tell me more?" },
  { id: "ebook-3", title: "Volume 3: Cake Fillings Encyclopaedia", image: "/images/Volume-3_Cake-Fillings-Encyclopaedia.png", message: "Hi! I'm interested in 'Volume 3: Cake Fillings Encyclopaedia' ebook. Could you tell me more?" },
  { id: "ebook-4", title: "Volume 4: Ice Cream Making", image: "/images/Volume-4_Ice-Cream-Making.png", message: "Hi! I'm interested in 'Volume 4: Ice Cream Making' ebook. Could you tell me more?" },
  { id: "ebook-5", title: "Volume 5: Mastering Cake Business", image: "/images/Volume-5_Mastering-Cake-Business.jpeg", message: "Hi! I'm interested in 'Volume 5: Mastering Cake Business' ebook. Could you tell me more?" },
  { id: "ebook-6", title: "Volume 6: Dessert Masters", image: "/images/Volume-6_Dessert-Masters.png", message: "Hi! I'm interested in 'Volume 6: Dessert Masters' ebook. Could you tell me more?" },
  { id: "ebook-7", title: "Volume 7: Homemade Bread Manual", image: "/images/Volume-7_Homemade_Bread_Manual.jpg", message: "Hi! I'm interested in 'Volume 7: Homemade Bread Manual' ebook. Could you tell me more?" },
  { id: "ebook-8", title: "Volume 8: Perfect Donut Recipe", image: "/images/Volume-8_Perfect-Donut-Recipe.jpg", message: "Hi! I'm interested in 'Volume 8: Perfect Donut Recipe' ebook. Could you tell me more?" },
  { id: "ebook-9", title: "Volume 9: Yoghurt Making", image: "/images/Volume-9_Yoghurt-Making.png", message: "Hi! I'm interested in 'Volume 9: Yoghurt Making' ebook. Could you tell me more?" },
  { id: "ebook-10", title: "Volume 10: Tropical Climate Fondant Recipe", image: "/images/Volume-10_Tropical-Climate-Fondant-Recipe.png", message: "Hi! I'm interested in 'Volume 10: Tropical Climate Fondant Recipe' ebook. Could you tell me more?" },
  { id: "ebook-11", title: "Volume 11: Scrumptious Smoothies", image: "/images/Volume-11_Scrumptious Smoothies.png", message: "Hi! I'm interested in 'Volume 11: Scrumptious Smoothies' ebook. Could you tell me more?" },
  { id: "ebook-12", title: "Volume 12: Homemade Chocolate Making", image: "/images/Volume-12_Homemade-Chocolate Making.jpg", message: "Hi! I'm interested in 'Volume 12: Homemade Chocolate Making' ebook. Could you tell me more?" },
  { id: "ebook-13", title: "Volume 13: Sugar-Free Cakes", image: "/images/Volume-13_Sugar-Free-Cakes.png", message: "Hi! I'm interested in 'Volume 13: Sugar-Free Cakes' ebook. Could you tell me more?" },
  { id: "ebook-14", title: "Volume 14: Eat Desserts n' Still Lose Weight", image: "/images/Volume-14_Eat-Desserts-n-Still-Lose-Weight.png", message: "Hi! I'm interested in 'Volume 14: Eat Desserts n' Still Lose Weight' ebook. Could you tell me more?" },
  { id: "ebook-15", title: "Volume 15: Parfait Manual", image: "/images/Volume-15_Parfait-Mansal.png", message: "Hi! I'm interested in 'Volume 15: Parfait Manual' ebook. Could you tell me more?" },
  { id: "ebook-16", title: "Volume 16: Fruit, Seed n' Nut Granola", image: "/images/Volume-16_Fruit-Seed-n-Nut-Granola.png", message: "Hi! I'm interested in 'Volume 16: Fruit, Seed n' Nut Granola' ebook. Could you tell me more?" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
const IconScale = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1"/><path d="M3 9h18"/><path d="M8 9l-4 9h8Z"/><path d="M16 9l-4 9h8Z"/><path d="M5 21h14"/>
  </svg>
);

const IconConvert = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
  </svg>
);

const IconEdit = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconChevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconThermometer = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// INGREDIENT PICKER
// ─────────────────────────────────────────────────────────────────────────────
function IngredientPicker({ value, onChange, customIngredients }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const searchRef           = useRef(null);

  const allItems  = [...DEFAULT_INGREDIENTS, ...customIngredients.map(i => ({ ...i, groupName: "My Custom", icon: "⭐" }))];
  const selected  = allItems.find(i => i.id === value);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 120);
    else setSearch("");
  }, [open]);

  const q = search.toLowerCase().trim();

  const filteredGroups = INGREDIENT_GROUPS.map(g => ({
    ...g, items: q ? g.items.filter(i => i.name.toLowerCase().includes(q)) : g.items,
  })).filter(g => g.items.length > 0);

  const filteredCustom = q ? customIngredients.filter(i => i.name.toLowerCase().includes(q)) : customIngredients;
  const noResults = filteredGroups.length === 0 && filteredCustom.length === 0;

  return (
    <>
      <button className="bc-picker-trigger" onClick={() => setOpen(true)} id="ingredient-picker-btn">
        <span className="bc-trigger-icon">{selected ? selected.icon : "⭐"}</span>
        <div className="bc-trigger-info">
          <span className="bc-trigger-name">{selected ? selected.name : "Choose from 170+ ingredients"}</span>
          <span className="bc-trigger-meta">{selected ? `${selected.gramsPerCup}g / cup` : ""}</span>
        </div>
        <span className="bc-trigger-chevron"><IconChevron /></span>
      </button>

      {open && (
        <>
          <div className="bc-backdrop" onClick={() => setOpen(false)} />
          <div className="bc-panel" role="dialog" aria-label="Select an ingredient">
            <div className="bc-panel-handle" />
            <div className="bc-panel-search-row">
              <span className="bc-search-icon-wrap"><IconSearch /></span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search 170+ ingredients…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bc-panel-search"
                id="ingredient-search"
              />
              {search && <button className="bc-search-clear" onClick={() => setSearch("")}>✕</button>}
            </div>
            <div className="bc-panel-list">
              {filteredGroups.map(g => (
                <div key={g.id} className="bc-panel-group">
                  <div className="bc-panel-group-header"><span>{g.emoji}</span>{g.label}</div>
                  {g.items.map(item => (
                    <button
                      key={item.id}
                      className={`bc-panel-item${item.id === value ? " is-selected" : ""}`}
                      onClick={() => { onChange(item.id); setOpen(false); }}
                    >
                      <span className="bc-panel-item-icon">{item.icon}</span>
                      <span className="bc-panel-item-name">{item.name}</span>
                      <span className="bc-panel-item-grams">{item.gramsPerCup}g</span>
                      {item.id === value && <span className="bc-panel-item-check">✓</span>}
                    </button>
                  ))}
                </div>
              ))}
              {filteredCustom.length > 0 && (
                <div className="bc-panel-group">
                  <div className="bc-panel-group-header"><span>⭐</span>My Custom</div>
                  {filteredCustom.map(item => (
                    <button
                      key={item.id}
                      className={`bc-panel-item${item.id === value ? " is-selected" : ""}`}
                      onClick={() => { onChange(item.id); setOpen(false); }}
                    >
                      <span className="bc-panel-item-icon">⭐</span>
                      <span className="bc-panel-item-name">{item.name}</span>
                      <span className="bc-panel-item-grams">{item.gramsPerCup}g</span>
                      {item.id === value && <span className="bc-panel-item-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
              {noResults && (
                <div className="bc-panel-empty">
                  No ingredients found for<br /><strong>"{search}"</strong>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK AD CARD
// ─────────────────────────────────────────────────────────────────────────────
function EbookCard({ book, index }) {
  const waLink = WA_NUMBER
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(book.message)}`
    : "#";

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="bc-ebook-card"
      style={{ animationDelay: `${index * 0.55}s` }}
      title={`Enquire about: ${book.title}`}
    >
      <div className="bc-ebook-cover">
        <img src={book.image} alt={book.title} className="bc-ebook-image" />
        <div className="bc-ebook-overlay">
          <div className="bc-ebook-title-overlay">{book.title}</div>
        </div>
        <div className="bc-ebook-enquire-badge"><IconWhatsApp /></div>
      </div>
      <div className="bc-ebook-cta">
        <span className="bc-wa-icon"><IconWhatsApp /></span>
        Enquire
      </div>
    </a>
  );
}

function EbooksSection() {
  return (
    <div className="bc-ebooks-section">
      <div className="bc-ebooks-header">
        <span className="bc-ebooks-label bc-handwriting-title">📖 From the Author's Kitchen</span>
        <p className="bc-ebooks-sub-large">Tap an ebook to enquire via WhatsApp</p>
      </div>
      <div className="bc-ebooks-scroll">
        {EBOOKS.slice(0, 3).map((book, i) => <EbookCard key={book.id} book={book} index={i} />)}
      </div>
      <p className="bc-ebooks-hint-more">See full collection in Ebooks tab</p>
    </div>
  );
}

function EbooksTab() {
  return (
    <div className="bc-ebooks-tab">
      <div className="bc-ebooks-header">
        <h2 className="bc-ebooks-title bc-handwriting-title">Our Recipe eBooks</h2>
        <p className="bc-ebooks-sub-large">Browse our full collection of detailed step-by-step recipe ebooks and click to enquire via WhatsApp</p>
      </div>
      <div className="bc-ebooks-grid">
        {EBOOKS.map((book, i) => (
          <EbookCard key={book.id} book={book} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPERATURE CONVERTER
// ─────────────────────────────────────────────────────────────────────────────
const TEMP_POINTS = [
  { c: 100, f: 212, gm: 0.125 },
  { c: 110, f: 225, gm: 0.25 },
  { c: 120, f: 250, gm: 0.5 },
  { c: 140, f: 275, gm: 1.0 },
  { c: 150, f: 300, gm: 2.0 },
  { c: 170, f: 325, gm: 3.0 },
  { c: 180, f: 350, gm: 4.0 },
  { c: 190, f: 375, gm: 5.0 },
  { c: 200, f: 400, gm: 6.0 },
  { c: 220, f: 425, gm: 7.0 },
  { c: 230, f: 450, gm: 8.0 },
  { c: 240, f: 475, gm: 9.0 },
  { c: 250, f: 500, gm: 10.0 }
];

function convertTemp(value, fromUnit, toUnit) {
  const val = parseFloat(value);
  if (isNaN(val)) return NaN;
  if (fromUnit === toUnit) return val;

  let c;
  if (fromUnit === "celsius") {
    c = val;
  } else if (fromUnit === "fahrenheit") {
    c = (val - 32) * 5 / 9;
  } else if (fromUnit === "gasmark") {
    if (val <= TEMP_POINTS[0].gm) {
      c = TEMP_POINTS[0].c;
    } else if (val >= TEMP_POINTS[TEMP_POINTS.length - 1].gm) {
      c = TEMP_POINTS[TEMP_POINTS.length - 1].c;
    } else {
      for (let i = 0; i < TEMP_POINTS.length - 1; i++) {
        const p0 = TEMP_POINTS[i];
        const p1 = TEMP_POINTS[i + 1];
        if (val >= p0.gm && val <= p1.gm) {
          c = p0.c + ((val - p0.gm) * (p1.c - p0.c)) / (p1.gm - p0.gm);
          break;
        }
      }
    }
  }

  if (toUnit === "celsius") return c;
  if (toUnit === "fahrenheit") return c * 9 / 5 + 32;
  if (toUnit === "gasmark") {
    if (c <= TEMP_POINTS[0].c) return TEMP_POINTS[0].gm;
    if (c >= TEMP_POINTS[TEMP_POINTS.length - 1].c) return TEMP_POINTS[TEMP_POINTS.length - 1].gm;
    for (let i = 0; i < TEMP_POINTS.length - 1; i++) {
      const p0 = TEMP_POINTS[i];
      const p1 = TEMP_POINTS[i + 1];
      if (c >= p0.c && c <= p1.c) {
        return p0.gm + ((c - p0.c) * (p1.gm - p0.gm)) / (p1.c - p0.c);
      }
    }
  }
  return NaN;
}

function formatGasMark(val) {
  if (isNaN(val) || !isFinite(val)) return "—";
  if (val <= 0.18) return "1/8";
  if (val <= 0.35) return "1/4";
  if (val <= 0.75) return "1/2";
  return Math.round(val).toString();
}

function formatTemp(value, unit) {
  if (isNaN(value) || !isFinite(value)) return "—";
  if (unit === "gasmark") return formatGasMark(value);
  return Math.round(value).toString();
}

const TEMP_UNITS = ["celsius", "fahrenheit", "gasmark"];
const TEMP_UNIT_LABELS = { celsius: "°C", fahrenheit: "°F", gasmark: "Gas Mark" };

function TemperatureTab({ tempVal, setTempVal, tempUnit, setTempUnit, copied, setCopied }) {
  const results = TEMP_UNITS.filter(u => u !== tempUnit).map(u => {
    const rawVal = convertTemp(tempVal, tempUnit, u);
    return {
      unit: u,
      label: TEMP_UNIT_LABELS[u],
      value: formatTemp(rawVal, u)
    };
  });

  const presets = [
    { label: "110°C / Pavlovas", value: 110 },
    { label: "140°C / Slow Bake", value: 140 },
    { label: "150°C / Cheesecakes", value: 150 },
    { label: "160°C / Cakes (Delic.)", value: 160 },
    { label: "180°C / Cakes & Cookies", value: 180 },
    { label: "200°C / Breads & Pies", value: 200 },
    { label: "220°C / Choux Artisan", value: 220 }
  ];

  const bakingZones = [
    { title: "Cool / Slow Oven", range: "110°C – 130°C / 225°F – 250°F / Gas Mark 1/4 – 1/2", desc: "Best for meringues, pavlovas, and rich, heavy fruit cakes requiring long slow cooking." },
    { title: "Very Moderate / Warm Oven", range: "140°C – 150°C / 275°F – 300°F / Gas Mark 1 – 2", desc: "Cheesecakes, delicate custard desserts, pound cakes, shortbread, and roasting nuts." },
    { title: "Moderate Oven", range: "160°C – 180°C / 325°F – 350°F / Gas Mark 3 – 4", desc: "Standard sweet spot. Perfect for cupcakes, cookies, muffins, sponge cakes, brownies, and quick breads." },
    { title: "Moderately Hot Oven", range: "190°C – 200°C / 375°F – 400°F / Gas Mark 5 – 6", desc: "Ideal for yeast breads, dinner rolls, pies, tarts, and crispy cookies." },
    { title: "Hot Oven", range: "210°C – 220°C / 410°F – 425°F / Gas Mark 7", desc: "Excellent for puff pastry, choux pastry (eclairs & profiteroles), and crusty artisan breads." },
    { title: "Very Hot Oven", range: "230°C – 250°C / 450°F – 500°F / Gas Mark 8 – 10", desc: "Initial bread baking oven spring, pizza stones, flatbreads, and fast roasting." }
  ];

  function copyResult(v, u) {
    const displayUnit = u === "gasmark" ? "Gas Mark" : (u === "celsius" ? "°C" : "°F");
    navigator.clipboard?.writeText(v + " " + displayUnit).catch(() => {});
    setCopied(u);
    setTimeout(() => setCopied(""), 1800);
  }

  return (
    <>
      <div className="bc-custom-card bc-how-it-works">
        <h3 className="bc-custom-title" style={{ fontSize: '20px', marginBottom: '8px' }}>Baking Temperatures</h3>
        <p className="bc-custom-footer-note" style={{ textAlign: 'left', margin: '0 24px 24px', lineHeight: '1.5' }}>
          Convert temperatures between Celsius, Fahrenheit, and Gas Mark. Select standard presets or browse our visual baking temperature guide below for precise results.
        </p>
      </div>

      <div className="bc-row">
        <div className="bc-field">
          <label className="bc-label">Temperature</label>
          <input
            id="temp-amount-input"
            type="number"
            value={tempVal}
            onChange={e => setTempVal(e.target.value)}
            className="bc-input"
            placeholder="e.g. 180"
          />
        </div>
        <div className="bc-field">
          <label className="bc-label">Scale</label>
          <select
            id="temp-unit-select"
            value={tempUnit}
            onChange={e => setTempUnit(e.target.value)}
            className="bc-select"
          >
            {TEMP_UNITS.map(u => (
              <option key={u} value={u}>
                {TEMP_UNIT_LABELS[u]} — {u.charAt(0).toUpperCase() + u.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bc-field">
        <label className="bc-label">Baking Presets</label>
        <div className="bc-temp-presets">
          {presets.map(p => (
            <button
              key={p.value}
              onClick={() => {
                setTempVal(p.value.toString());
                setTempUnit("celsius");
              }}
              className="bc-temp-preset-btn"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bc-results-card">
        <div className="bc-results-header">
          <IconThermometer />
          <span>
            {tempVal || "0"} {TEMP_UNIT_LABELS[tempUnit] || ""}
          </span>
        </div>
        {results.map(r => (
          <div
            key={r.unit}
            onClick={() => copyResult(r.value, r.unit)}
            title="Tap to copy"
            className={`bc-result-row${copied === r.unit ? " is-copied" : ""}`}
          >
            <span className="bc-result-unit">{r.unit === "gasmark" ? "Gas Mark" : r.unit}</span>
            <div className="bc-result-value">
              {r.value}
              <span className="bc-result-suffix">{r.label}</span>
              {copied === r.unit && <span className="bc-copied-badge">copied ✓</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="bc-hint">Tap any result to copy</div>

      <div className="bc-temp-guide-section">
        <h3 className="bc-handwriting-title" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>
          Oven Temperature Guide
        </h3>
        <div className="bc-temp-guide-grid">
          {bakingZones.map((zone, idx) => (
            <div key={idx} className="bc-temp-guide-row">
              <div className="bc-temp-guide-left">
                <div className="bc-temp-guide-title">{zone.title}</div>
                <div className="bc-temp-guide-desc">{zone.desc}</div>
              </div>
              <div className="bc-temp-guide-right">{zone.range}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function BakingConverter() {
  const [custom, setCustom] = useState(loadCustom);
  const all = [...DEFAULT_INGREDIENTS, ...custom];

  const [selId, setSelId]       = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [val, setVal]           = useState("");
  const [tab, setTab]           = useState("convert");
  const [newName, setNewName]   = useState("");
  const [newGpc, setNewGpc]     = useState("");
  const [err, setErr]           = useState("");
  const [copied, setCopied]     = useState("");
  const [tempVal, setTempVal]   = useState("180");
  const [tempUnit, setTempUnit] = useState("celsius");
  const [theme, setTheme]       = useState(() => localStorage.getItem("bi_theme") || "standard");

  useEffect(() => {
    localStorage.setItem("bi_theme", theme);
  }, [theme]);

  const ing     = all.find(i => i.id === selId);
  const baseG   = ing ? toGrams(val, fromUnit, ing.gramsPerCup) : 0;
  const results = UNITS.filter(u => u !== fromUnit).map(u => ({
    unit: u, label: UNIT_LABELS[u], value: ing ? formatValue(fromGrams(baseG, u, ing.gramsPerCup), u) : "—",
  }));

  function addCustom() {
    setErr("");
    const name = newName.trim();
    const gpc  = parseFloat(newGpc);
    if (!name)                   { setErr("Please enter an ingredient name."); return; }
    if (isNaN(gpc) || gpc <= 0)  { setErr("Enter a valid grams-per-cup value (e.g. 115)."); return; }
    if (all.some(i => i.name.toLowerCase() === name.toLowerCase())) { setErr("Ingredient already exists."); return; }
    const next = [...custom, { id: "c_" + Date.now(), name, gramsPerCup: gpc, custom: true }];
    setCustom(next); saveCustom(next); setNewName(""); setNewGpc("");
  }

  function delCustom(id) {
    const next = custom.filter(i => i.id !== id);
    setCustom(next); saveCustom(next);
    if (selId === id) setSelId("");
  }

  function copyResult(v, u) {
    navigator.clipboard?.writeText(v + " " + u).catch(() => {});
    setCopied(u); setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className={`bc-wrap theme-${theme}`}>

      {/* ── Header ── */}
      <header className="bc-header">
        <div className="bc-header-top">
          <img src={theme === 'dark' ? LOGO_WHITE : LOGO} alt="Baking Intelligence" className="bc-logo" />
          <div className="bc-theme-switcher">
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bc-theme-select">
              <option value="luxe">Luxe</option>
              <option value="standard">Warm</option>
              <option value="new">Blush</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </div>
        <div className="bc-title-block">
          <h1 className="bc-title-main">Ingredients</h1>
          <p className="bc-title-sub">C O N V E R T E R</p>
        </div>
      </header>

      <div className="bc-body">

        {/* ── CONVERT TAB ── */}
        {tab === "convert" && (
          <>
            <div className="bc-custom-card bc-how-it-works">
              <h3 className="bc-custom-title" style={{ fontSize: '20px', marginBottom: '8px' }}>How it works</h3>
              <p className="bc-custom-footer-note" style={{ textAlign: 'left', margin: '0 24px 24px', lineHeight: '1.5' }}>
                This converter helps you quickly translate baking measurements between different units like grams, cups, ounces, tablespoons, and teaspoons.
                Simply select one from 170+ ingredients, enter the amount and unit you have, and we'll show you the equivalent in other common units.
                Perfect for ensuring precision in your recipes!
              </p>
            </div>

            <div className="bc-field">
              <label className="bc-label">Choose an ingredient</label>
              <IngredientPicker value={selId} onChange={setSelId} customIngredients={custom} />
            </div>

            <div className="bc-row">
              <div className="bc-field">
                <label className="bc-label">Amount</label>
                <input
                  id="amount-input"
                  type="number" min="0" step="any"
                  value={val} onChange={e => setVal(e.target.value)}
                  className="bc-input" placeholder="Type amount"
                />
              </div>
              <div className="bc-field">
                <label className="bc-label">From Unit</label>
                <select id="unit-select" value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="bc-select">
                  <option value="" disabled>Choose unit</option>
                  {UNITS.map(u => <option key={u} value={u}>{UNIT_LABELS[u]} — {u}</option>)}
                </select>
              </div>
            </div>

            <div className="bc-results-card">
              <div className="bc-results-header">
                <IconScale />
                <span>{val || "0"} {UNIT_LABELS[fromUnit] || ""} of {ing?.name || ""}</span>
              </div>
              {results.map(r => (
                <div
                  key={r.unit}
                  onClick={() => copyResult(r.value, r.unit)}
                  title="Tap to copy"
                  className={`bc-result-row${copied === r.unit ? " is-copied" : ""}`}
                >
                  <span className="bc-result-unit">{r.unit}</span>
                  <div className="bc-result-value">
                    {r.value}
                    <span className="bc-result-suffix">{r.label}</span>
                    {copied === r.unit && <span className="bc-copied-badge">copied ✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="bc-hint">Tap any result to copy</div>

            {/* ── Book Ads ── */}
            <EbooksSection />
          </>
        )}

        {/* ── TEMPERATURE TAB ── */}
        {tab === "temperature" && (
          <TemperatureTab
            tempVal={tempVal}
            setTempVal={setTempVal}
            tempUnit={tempUnit}
            setTempUnit={setTempUnit}
            copied={copied}
            setCopied={setCopied}
          />
        )}

        {/* ── EBOOKS TAB ── */}
        {tab === "books" && <EbooksTab />}

        {/* ── CUSTOM TAB ── */}
        {tab === "custom" && (
          <>
            <div className="bc-custom-card bc-how-it-works">
              <h3 className="bc-custom-title" style={{ fontSize: '20px', marginBottom: '8px' }}>How to add custom ingredients</h3>
              <p className="bc-custom-footer-note" style={{ textAlign: 'left', margin: '0 24px 24px', lineHeight: '1.5' }}>
                To add your own ingredients, weigh 1 level cup on a kitchen scale and enter the weight in the 'Grams per Cup' field. This ensures your custom items are converted with the same precision as our standard list.
              </p>
            </div>

            <div className="bc-custom-card">
              <div className="bc-results-header">
                <span className="bc-handwriting-title">Add Custom Ingredient</span>
              </div>
              <div className="bc-custom-fields">
                <div className="bc-field">
                  <label className="bc-label">Ingredient Name</label>
                  <input
                    id="custom-name-input"
                    type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Teff Flour" className="bc-input"
                    onKeyDown={e => e.key === "Enter" && addCustom()}
                  />
                </div>
                <div className="bc-field">
                  <label className="bc-label">Grams per Cup (density)</label>
                  <input
                    id="custom-gpc-input"
                    type="number" min="0" step="any" value={newGpc}
                    onChange={e => setNewGpc(e.target.value)}
                    placeholder="e.g. 115" className="bc-input"
                    onKeyDown={e => e.key === "Enter" && addCustom()}
                  />
                  <div className="bc-trigger-meta bc-note">Weigh 1 level cup on a scale to find this value.</div>
                </div>
                {err && <div className="bc-err">{err}</div>}
                <button id="add-ingredient-btn" onClick={addCustom} className="bc-add-btn">
                  <IconPlus /> ADD INGREDIENT
                </button>
                <p className="bc-custom-footer-note">Tap an ebook to enquire via WhatsApp</p>
              </div>
            </div>

            {custom.length === 0 ? (
              <div className="bc-empty-state">
                No custom ingredients yet.<br />
                <span>Add one above and it'll be saved for future visits.</span>
              </div>
            ) : (
              <>
                <div className="bc-saved-label">Saved ({custom.length})</div>
                {custom.map(ing => (
                  <div key={ing.id} className="bc-custom-item">
                    <div>
                      <div className="bc-custom-item-name">{ing.name}</div>
                      <div className="bc-custom-item-meta">{ing.gramsPerCup}g per cup</div>
                    </div>
                    <div className="bc-custom-actions">
                      <button className="bc-use-btn" onClick={() => { setSelId(ing.id); setTab("convert"); }}>
                        Use <IconArrow />
                      </button>
                      <button className="bc-del-btn" onClick={() => delCustom(ing.id)} title="Delete">
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* ── Bottom Navigation ── */}
      <nav className="bc-tabs">
        <button onClick={() => setTab("convert")} className={`bc-tab ${tab === "convert" ? "active" : ""}`}>
          <IconConvert />
          <span>Converter</span>
        </button>
        <button onClick={() => setTab("temperature")} className={`bc-tab ${tab === "temperature" ? "active" : ""}`}>
          <IconThermometer />
          <span>Temp</span>
        </button>
        <button onClick={() => setTab("custom")} className={`bc-tab ${tab === "custom" ? "active" : ""}`}>
          <IconEdit />
          <span>Custom</span>
        </button>
        <button onClick={() => setTab("books")} className={`bc-tab ${tab === "books" ? "active" : ""}`}>
          <span className="bc-tab-icon">📖</span>
          <span>Ebooks</span>
        </button>
      </nav>

    </div>
  );
}
