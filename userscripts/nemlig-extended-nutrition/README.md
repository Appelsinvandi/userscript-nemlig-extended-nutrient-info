# Userscript - Nemlig Extended Nutrient Info

A simple userscript that adds macronutrients and some extra advisory info to nemlig.com food.

# Features

Below is a preview of what the userscript will display for the following item: https://www.nemlig.com/kinder-maelkesnitte-5009926

![Preview](.static/preview.png)

Going from top to bottom the displayed information is as follows.

## Allergen information

The userscript reads the item's ingredient list and looks for known allergens, these are what can be seen at the very top of the preview image. Please be advised that the userscript might _miss_ an allergen, either due to a spelling mistake in the ingredient list or an error in the userscript.

Currently the following allergies are supported:

| Allergen       |  Reliability |
| -------------- | ------------ |
| Eggs           | Good         |
| Fish           | Fair         |
| Gluten         | Good         |
| Milk / Lactose | Very good    |
| Peanut         | Fair         |
| Sesame         | Fair         |
| Shellfish      | Fair         |
| Soy            | Fair         |
| Tree nut       | Fair         |
| Wheat          | Good         |

I'm continually adding new allergens and improving the reliability of existing allergens, when I become aware of something missing.

## Dietary advisory

Based on the nutritional information provided for the item, the userscript will deliver some dietary advisories, this is what is seen in the middle of the preview image. These advisories are meant to make you aware of certain good and bad qualities of the item you are viewing, helping you make better decisions for a healthier diet.

## Macronutrients

Based on the nutritional information provided for the item, the userscript will calculate the items macronutritional content. Macronutrients are good way of balancing your diet, and this information should help you choose the right items to achieve that balance.

You can read more about macronutrients, and what distribution you should aim for [here](https://www.healthline.com/nutrition/how-to-count-macros) (No affiliation).

# Versions

The script usually change quite a bit between major versions, so every previous major version remains in a maintenance mode state.

## 2.x.x

_This is the current mainline version._

With this release the extended nutrient info is moved out of the food declaration section, into a fixed floating element. This will negate the need to ever scroll to see the extended nutrient info. In addition, it also adds nutrient advisory messages.

Find this version here: https://appelsinvandi.github.io/userscript-online-grocery-tools/nemlig-extended-nutrition.user.js

## 1.x.x

This version only adds macronutrients, but does so is a away that is more idiomatic to the flow of the site.

Find this version here: https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-extended-nutrient-info/version/1.x.x/userscript.js
