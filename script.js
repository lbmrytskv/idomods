const metaDescription = document.querySelector('meta[name="description"]');

const sectionsMeta = {
  "/": {
    title: "FormaSint – Jackets & Outdoor Wear",
    description: "Discover the new collection of jackets and outdoor clothing. Check out the FormaSint offer now!",
    selector: "#home"
  },
  "/featured": {
    title: "Featured Products – FormaSint",
    description: "See the most popular jackets and accessories from FormaSint.",
    selector: "#featured"
  },
  "/listing": {
    title: "Product List – FormaSint",
    description: "Complete list of outdoor products from FormaSint – clothing for every weather condition.",
    selector: "#listing"
  }
};


function normalizePath(path) {
  if (path === "" || path === "/index.html") return "/";
  return path.replace(/\/+$/, "");
}

function handleRoute(path) {
  const cleanPath = normalizePath(path);
  const meta = sectionsMeta[cleanPath] || sectionsMeta["/"];
  document.title = meta.title;
  metaDescription.setAttribute("content", meta.description);

  const section = document.querySelector(meta.selector);
  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  }

  if (cleanPath === "/listing") {
    loadProducts();
  }
}


document.querySelectorAll('a.nav-link, .logo-link').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    const fullUrl = new URL(href, window.location.origin);
    const newPath = fullUrl.pathname;
    history.pushState({}, "", newPath);
    handleRoute(newPath);
  });
});

window.addEventListener("popstate", () => {
  handleRoute(location.pathname);
});

window.addEventListener("DOMContentLoaded", () => {
  handleRoute(location.pathname);
  loadProducts();
});

// Fetch featured products
fetch("https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=4")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("featured-products");
    data.data.forEach((product) => {
      const article = document.createElement("article");
      article.classList.add("product-card");
      article.innerHTML = `
        <img src="${product.image}" loading="lazy" alt="${product.text}" />
        <div class="product-title">${product.text}</div>
        <div class="product-price">€200.00</div>
      `;
      container.appendChild(article);
    });
  });

// === PRODUCT LISTING ===
const listingSection = document.getElementById("listing");

const productGrid = document.getElementById("product-listing");
const pagination = document.getElementById("pagination");
const pageSizeSelect = document.getElementById("pageSizeSelect");


let currentPage = 1;
let pageSize = 14;
let totalPages = 1;

pageSizeSelect.addEventListener("change", (e) => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  loadProducts();
});


function loadProducts() {
  fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=${currentPage}&pageSize=${pageSize}`)
    .then((res) => res.json())
    .then((data) => {
      totalPages = data.totalPages;
      renderProducts(data.data);
      renderPagination();
    });
}

function renderProducts(products) {
  productGrid.innerHTML = "";

  products.forEach((product, index) => {
    if (currentPage === 1 && index === 6) {
      const banner = document.createElement("div");
      banner.className = "banner";
      banner.innerHTML = `
        <div class="banner-title">You’ll look and feel like the champion.</div>
        <button class="banner-btn">Check this out →</button>
      `;
      productGrid.appendChild(banner);
    }

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" loading="lazy" alt="${product.text}" />
      <div class="product-title">${product.text}</div>
      <div class="product-price">€200.00</div>
    `;
    productGrid.appendChild(card);
  });
}

function renderPagination() {
  pagination.innerHTML = "";

  for (let i = 1; i <= Math.min(totalPages, 10); i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn";
    if (i === currentPage) btn.classList.add("active");

    btn.addEventListener("click", () => {
      currentPage = i;
      loadProducts();
    });

    pagination.appendChild(btn);
  }
}
