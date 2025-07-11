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

// Popup functionality
const popupOverlay = document.getElementById('popup-overlay');
const popupImage = document.getElementById('popup-image');
const popupId = document.querySelector('.popup-id');
const popupCloseMenu = document.querySelector('.popup-close-menu');

function openPopup(product, index) {
  popupImage.src = product.image;
  popupImage.alt = product.text;
  popupId.textContent = `ID: ${String(index + 1).padStart(2, '0')}`;
  popupOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popupOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

popupCloseMenu.addEventListener('click', closePopup);

popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) {
    closePopup();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePopup();
  }
});

// Fetch featured products
fetch("https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=4")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("featured-products");
    data.data.forEach((product, index) => {
      const article = document.createElement("article");
      article.classList.add("product-card");
      article.innerHTML = `
        <img src="${product.image}" loading="lazy" alt="${product.text}" />
        <div class="product-title">${product.text}</div>
        <div class="product-price">€200.00</div>
      `;

      article.addEventListener("click", () => {
        openPopup(product, index);
      });

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

// === CUSTOM DROPDOWN SYNC WITH SELECT ===
const customToggle = document.getElementById("customSelectToggle");
const customOptions = document.getElementById("customOptions");
const selectedSpan = customToggle.querySelector(".custom-selected");
const optionItems = customOptions.querySelectorAll(".custom-option");

if (customToggle && customOptions && selectedSpan && optionItems.length) {
  let isOpen = false;

  function updateDropdownValue(value) {
    selectedSpan.textContent = value;

    optionItems.forEach(i => i.classList.remove("selected"));
    const selectedItem = customOptions.querySelector(`[data-value="${value}"]`);
    if (selectedItem) selectedItem.classList.add("selected");

    pageSizeSelect.value = value;
    pageSize = parseInt(value);
    currentPage = 1;
    loadProducts();
  }

  customToggle.addEventListener("click", () => {
    isOpen = !isOpen;
    customToggle.style.display = isOpen ? "none" : "flex";
    customOptions.classList.toggle("active", isOpen);
  });

  optionItems.forEach(option => {
    option.addEventListener("click", () => {
      const value = option.getAttribute("data-value");
      updateDropdownValue(value);

      isOpen = false;
      customToggle.style.display = "flex";
      customOptions.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !customToggle.contains(e.target) &&
      !customOptions.contains(e.target)
    ) {
      isOpen = false;
      customToggle.style.display = "flex";
      customOptions.classList.remove("active");
    }
  });
}



// Function for measuring columns count in grid
function getGridColumns() {
  const grid = document.getElementById("product-listing");
  if (!grid) return 1;

  const computed = getComputedStyle(grid);
  const columnCount = computed.gridTemplateColumns.split(" ").length;

  return columnCount;
}

// Function for measuring banner position 
function getBannerPosition(columns) {
  switch(columns) {
    case 4:
      return { position: 5, span: 2 }; 
    case 3:
      return { position: 4, span: 2 }; 
    case 2:
      return { position: 4, span: 2 }; 
    default:
      return { position: 5, span: 2 }; 
  }
}

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

  const columns = getGridColumns();
  const bannerConfig = getBannerPosition(columns);

  let bannerInserted = false;

  products.forEach((product, index) => {
    if (currentPage === 1 && index === bannerConfig.position && !bannerInserted) {
      const banner = document.createElement("div");
      banner.className = "banner";
      banner.style.gridColumn = `span ${Math.min(bannerConfig.span, columns)}`;
     banner.innerHTML = `
  <div class="banner-text">
    <div class="banner-label">FORMA’SINT.</div>
    <div class="banner-title">You'll look and feel like the champion.</div>
  </div>
  <button class="banner-btn">
    CHECK THIS OUT
    <span class="banner-icon">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5L15 12L8 19" stroke="#1D1D1D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</span>

  </button>
`;

      productGrid.appendChild(banner);
      bannerInserted = true;
    }

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
    <div class="product-id">ID:${product.id}</div>
      <img src="${product.image}" loading="lazy" alt="${product.text}" />
      
      
    `;

    card.addEventListener("click", () => {
      openPopup(product, index);
    });

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

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (currentPage === 1) {
      loadProducts();
    }
  }, 250);
});
