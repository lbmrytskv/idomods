# FormaSint – E-commerce Frontend Showcase

A modern and responsive frontend project for showcasing outdoor clothing products. Built using **HTML5**, **CSS3**, and **JavaScript**, this project replicates a design provided via Figma and integrates product listing from a mock API.


## 🔥 Features

- ⚡ Pure HTML/CSS/JS (no frameworks)
- 📱 Fully responsive layout (mobile → desktop)
- 🧭 SPA-like navigation with `history.pushState`
- 🧩 Product listing with pagination and dropdown selection
- 🖼️ Swiper.js carousel for featured items
- 🪟 Modal popup with enlarged product view
- 🧠 Sticky header with scroll effects
- 🖱️ Logo click animation + scroll to section
- 🎨 Semantic markup and accessibility basics

## 🚀 Getting Started

You can clone and open the project locally:

```bash
git clone https://github.com/your-username/formaSint.git
cd formaSint

Then open index.html in your browser (e.g. double click or via VSCode Live Server).

## 🛠️ Technologies

- HTML5
- CSS3 (custom properties, media queries)
- Vanilla JavaScript (DOM, events, API)
- Swiper.js for carousels

##🧪 API

# Products are fetched dynamically from:
GET https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=14

# Response example:
{
  id: 1,
  image: "https://example.com/image.jpg",
  text: "Product description"
}

# 📁 Project Structure

formaSint/
├── assets/
│   ├── icons/
│   └── images/
├── index.html
├── style.css
└── script.js

# 📌 Notes

- This project was created as part of a frontend recruitment task.
- All product images and styles are for demonstration purposes only.
