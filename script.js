const metaDescription = document.querySelector('meta[name="description"]');

const sectionsMeta = {
  "/": {
    title: "FormaSint – Kurtki i Odzież outdoor",
    description: "Nowa kolekcja kurtek i odzieży outdoorowej. Sprawdź ofertę FormaSint już teraz!",
    selector: "#home"
  },
  "/featured": {
    title: "Polecane produkty – FormaSint",
    description: "Zobacz najczęściej wybierane kurtki i akcesoria od FormaSint.",
    selector: "#featured"
  },
  "/listing": {
    title: "Lista produktów – FormaSint",
    description: "Pełna lista produktów outdoorowych od FormaSint – odzież na każdą pogodę.",
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

  document.querySelectorAll("main section").forEach((sec) => {
    if (sec.id !== "featured") {
      sec.style.display = "none";
    }
  });
  const section = document.querySelector(meta.selector);
  if (section) section.style.display = "block";
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
