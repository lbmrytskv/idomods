const metaDescription = document.querySelector('meta[name="description"]');

const sectionsMeta = {
  "#home": {
    title: "FormaSint – Kurtki i Odzież outdoor",
    description: "Nowa kolekcja kurtek i odzieży outdoorowej. Sprawdź ofertę FormaSint już teraz!"
  },
  "#featured": {
    title: "Polecane produkty – FormaSint",
    description: "Zobacz najczęściej wybierane kurtki i akcesoria od FormaSint."
  },
  "#listing": {
    title: "Lista produktów – FormaSint",
    description: "Pełna lista produktów outdoorowych od FormaSint – odzież na każdą pogodę."
  }
};

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  const meta = sectionsMeta[hash];
  if (meta) {
    document.title = meta.title;
    metaDescription.setAttribute("content", meta.description);
  }
});

// Mobile menu toggle
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("mobileMenu").style.display = "block";
});
document.getElementById("menu-close").addEventListener("click", () => {
  document.getElementById("mobileMenu").style.display = "none";
});

// Fetch featured products
fetch("https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=4")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("featured-products");
    data.data.forEach((product) => {
      const article = document.createElement("article");
      article.innerHTML = `
        <img src="${product.image}" loading="lazy" alt="${product.text}" />
        <p>${product.text}</p>
      `;
      container.appendChild(article);
    });
  });
