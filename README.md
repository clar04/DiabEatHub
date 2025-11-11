# DiabEat Hub 🍽️
A diabetes-friendly food & recipe finder that aggregates data from **Nutritionix**, **Spoonacular**, and **Open Food Facts** and turns it into simple, actionable labels: **OK**, **Watch Carbs**, or **High Sugar**.

> Goal: help people with diabetes decide *quickly* whether a food, recipe, or packaged product is suitable, without reading long nutrition tables.

---

## Features

### 1. Food Check (Nutritionix)
- Search everyday foods (e.g. `fried rice`, `sweet iced tea`, `chicken satay`).
- Fetches nutrition from **Nutritionix**.
- Shows carbs, sugar, serving size.
- Applies diabetes rule:
  - Sugar > 10 g → **High Sugar** 🔴
  - Carbs > 40 g → **Watch Carbs** 🟡
  - Otherwise → **OK** 🟢

### 2. Diabetes-Friendly Recipes (Spoonacular)
- Fetches recipes from **Spoonacular Food API**.
- Filters for low-carb / low-sugar style recipes.
- Displays per-serving carbs & sugar, cook time.
- Marks safe ones with **Diabetes-Friendly** badge.

### 3. Packaged Product Checker (Open Food Facts)
- Search packaged foods/drinks.
- Fetches nutrition from **Open Food Facts**.
- Highlights sugars per 100g and scans ingredients for sweeteners (e.g. `sugar`, `glucose syrup`, `fructose`).
- Gives a short recommendation (avoid / choose plain / portion control).

### 4. Unified Nutrition View
- All 3 sources are normalized to the same structure so the UI looks consistent.
- User doesn’t need to know which API the data came from.

### 5. Recent Checks (optional)
- Stores the last few items checked by the user.
- Useful for repeating daily foods.

---

## Tech Stack
- **Frontend**: React + Tailwind CSS 
- **Backend**: Laravel
- **Data Sources**:
  - [Nutritionix API](https://www.nutritionix.com/api)
  - [Spoonacular Food API](https://spoonacular.com/food-api)
  - [Open Food Facts](https://world.openfoodfacts.org/data)

---

## Project Structure

```text
diabeat-hub/
├─ backend/
│  ├─ src/
│  │  ├─ routes/
│  │  │  ├─ food.js        # /api/food/check
│  │  │  ├─ recipes.js     # /api/recipes/diabetes
│  │  │  └─ products.js    # /api/products/search
│  │  ├─ services/         # calls to 3rd-party APIs
│  │  ├─ utils/diabetes.js # rules engine
│  └─ .env.example
└─ frontend/
   └─ src/
      ├─ pages/
      ├─ components/
      └─ lib/api.ts
````

---

## API Design

### 1) Food Check

```http
GET /api/food/check?q={query}
```

**Response**

```json
{
  "items": [
    {
      "name": "Fried Rice",
      "serving": "1 cup",
      "carbs_g": 45,
      "sugar_g": 3,
      "diabetes_flag": "Watch Carbs",
      "notes": "High carbohydrates, control portion."
    }
  ]
}
```

### 2) Diabetes Recipes

```http
GET /api/recipes/diabetes?maxCarbs=30&readyIn=30
```

**Response**

```json
{
  "items": [
    {
      "name": "Grilled Chicken Salad",
      "ready_in_min": 20,
      "carbs_g": 14,
      "sugar_g": 5,
      "diabetes_flag": "OK",
      "notes": "Lean protein and fiber; watch the dressing."
    }
  ]
}
```

### 3) Product Checker

```http
GET /api/products/search?q={query}
```

**Response**

```json
{
  "items": [
    {
      "name": "Strawberry Yogurt",
      "serving": "100 g",
      "carbs_g": 13,
      "sugar_g": 11,
      "ingredients": "milk, strawberry, sugar",
      "diabetes_flag": "High Sugar",
      "notes": "Prefer plain yogurt or no-added-sugar variant."
    }
  ]
}
```

## Sample Mock Data

```json
[
  {
    "id": "food_002",
    "source": "nutritionix",
    "name": "Sweet Iced Tea",
    "serving": "250 ml",
    "carbs_g": 22,
    "sugar_g": 21,
    "diabetes_flag": "High Sugar",
    "notes": "Choose unsweetened tea or a zero-calorie sweetener."
  },
  {
    "id": "recipe_101",
    "source": "spoonacular",
    "name": "Grilled Chicken Salad",
    "carbs_g": 14,
    "sugar_g": 5,
    "diabetes_flag": "OK",
    "notes": "Good for diabetes; dressing can add sugars."
  },
  {
    "id": "product_301",
    "source": "openfoodfacts",
    "name": "Strawberry Yogurt",
    "carbs_g": 13,
    "sugar_g": 11,
    "diabetes_flag": "High Sugar",
    "notes": "Prefer plain yogurt."
  }
]
```

---

