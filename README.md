## 🔍 Features

- **Voice & Text Search**  
  Speak or type natural-language requests (e.g. “Show me all chicken recipes”)  
  → GPT → SQL → Supabase → Recipe results.

- **Shopping List Management**  
  Add or remove ingredients from your list via voice or text.

- **Recipe Recommendations**  
  Personalized “Recommended for you” slider powered by:
  1. **Demographic filtering** (city, age, gender)  
  2. **Collaborative filtering** (user ratings)

- **Recipe Details & Ratings**  
  View recipe info, nutrition, instructions, and submit your own rating.

- **User Profile**  
  Enter your name, location, age & gender to unlock personalized recs.

- **Add New Recipes**  
  Authorized users can add recipes via a form (category & difficulty dropdowns).

- **Data Visualization**  
  Bubble chart of **Avg Rating vs. # of Ratings**, sized by servings.

- **Responsive, Modern UI**  
  • Full-page hero with logo & toolbar  
  • Carousel sliders (ngx-owl-carousel-o)  
  • Angular Material components & Flex layout.

---

## 🚀 Quickstart

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- A Supabase project with tables: `profiles`, `recipes`, `ratings`, `shopping_list`
- An OpenAI API key for GPT→SQL

### Environment

Copy `src/environments/environment.ts` from the example and fill in:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-supabase-url',
  supabaseKey: 'your-supabase-key',
  openaiKey: 'your-openai-key',
};
```
Note: Never commit your real keys—use .gitignore for environment files.

### Install & Serve
```
npm install
ng serve
```

### 🏗️ Project Structure

src/
├── app/
│   ├── pages/
│   │   ├── web-speech/           # Voice/text → SQL search
│   │   ├── recipe-results/       # Search results grid
│   │   ├── recommended-recipes/  # Carousel of recs
│   │   ├── recipe-details/       # Recipe detail & rating form
│   │   ├── profile/              # User profile form
│   │   ├── add-recipe/           # Admin: new recipe form
│   │   └── charts/
│   │       └── demographics/     # Bubble chart component
│   ├── shared/
│   │   ├── services/             # Supabase, ChatGPT, charts, speech
│   │   └── material/             # Angular Material imports
│   ├── app.component.*           # App shell & router-outlet
│   └── app-routing.module.ts
├── assets/                       # Images & textures
├── environments/                 # dev/prod env configs
└── styles.scss                   # Global theming & overrides
