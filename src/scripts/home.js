const productData = [
    // Matprodukter
    {
      id: 1,
      category: "Mat",
      name: "Laxfilé",
      description: "Fräsch och saftig laxfilé, perfekt för stekning eller grillning, full av omega-3.",
      in_stock: 50,
      image_url: "https://bilder.kolonial.no/prod/local_products/2dd8e210-c8c5-48bc-8fc7-2a198fdcf7f6.jpg?auto=format&fit=max&w=1000&s=8462918ce26a92366dab12cfba5cf37c",
      price: 149,
      discount: 10 // i procent
    },
    {
      id: 2,
      category: "Mat",
      name: "Kycklingfilé",
      description: "Saftig kycklingfilé, färsk och redo för grillning eller stekning.",
      in_stock: true,
      image_url: "https://www.guldfageln.se/app/uploads/2020/11/7qnthqg7wgiqjolhje2narm000000-2.png",
      price: 119,
      discount: 5 // i procent
    },
  
    // Godisprodukter
    {
      id: 3,
      category: "Godis",
      name: "Chokladpraliner",
      description: "Lyxiga chokladpraliner fyllda med vaniljkräm och hasselnötter, perfekta för en festlig stund.",
      in_stock: false,
      image_url: "https://m.media-amazon.com/images/I/51b0MNB11XL._AC_SL1000_.jpg",
      price: 149,
      discount: 15 // i procent
    },
    {
      id: 4,
      category: "Godis",
      name: "Sura Skumgodis",
      description: "Fruktiga och syrliga skumgodisar i olika former och smaker, älskad av både barn och vuxna.",
      in_stock: true,
      image_url: "https://bilder.kolonial.no/prod/local_products/91ed3d78-80db-4200-87a5-b43690301e33.jpg?auto=format&fit=max&w=765&s=bc0b64e1b41649ea4485b60201d8f38e",
      price: 40,
      discount: 0 // i procent
    },
  
    // Dryckprodukter
    {
      id: 5,
      category: "Dryck",
      name: "Apelsinjuice",
      description: "Färskpressad apelsinjuice med 100% naturlig smak, fullpackad med C-vitamin.",
      in_stock: true,
      image_url: "https://outofhome.se/media/catalog/product/cache/30/image/17f82f742ffe127f42dca9de82fb58b1/5/6/56140_1l_pp_bravo_apelsin.jpg",
      price: 25,
      discount: 0 // i procent
    },
    {
      id: 6,
      category: "Dryck",
      name: "Loka Citron",
      description: "Uppfriskande kolsyrat vatten med en lätt citronsmak, perfekt som törstsläckare.",
      in_stock: false,
      image_url: "https://bilder.kolonial.no/prod/local_products/4aa0cb66-d656-4ec0-81df-871396d09998.jpg?auto=format&fit=max&w=296&s=5cb752bb4ee251f59b5d7fb3ddda85b0",
      price: 14,
      discount: 20 // i procent
    },
    {
        id: 7,
        category: "Mat",
        name: "Spaghetti",
        description: "Klassisk italiensk spaghetti, perfekt för att laga dina favoriträtter.",
        in_stock: true,
        image_url: "https://bilder.kolonial.no/prod/local_products/448cfa8e-5b10-4f0e-be98-40711dc8db6a.jpg?auto=format&fit=max&w=1000&s=0ba9a6aa3dc39e80c9c877f60628793e",
        price: 19,
        discount: 0 // i procent
      },
      {
        id: 8,
        category: "Godis",
        name: "Djungelvrål",
        description: "Mjuk och söt lakritsrot, en favorit bland lakritsälskare.",
        in_stock: false,
        image_url: "https://bilder.kolonial.no/prod/local_products/c4d64ad3-043e-42d1-8a30-5d8ee3d8e050.jpg?auto=format&fit=max&w=730&s=898724e8397243912a89103c75f47e19",
        price: 54,
        discount: 10 // i procent
      },
      {
        id: 9,
        category: "Dryck",
        name: "Coca Cola",
        description: "Klassisk cola med bubblor och en söt smak, perfekt för varma dagar.",
        in_stock: true,
        image_url: "https://www.tingstad.com/fixed/images/Main/1607512665/20792028.png",
        price: 17,
        discount: 5 // i procent
      },
      {
        id: 10,
        category: "Mat",
        name: "Färsk Basilika",
        description: "Färsk basilika i kruka, perfekt för att piffa upp dina maträtter.",
        in_stock: false,
        image_url: "https://assets.icanet.se/image/upload/cs_srgb/t_product_large_2x_v1/v1715759550/zatrkhb4bpntqbcqcd9s.webp",
        price: 32,
        discount: 0 // i procent
      },
      {
        id: 11,
        category: "Godis",
        name: "Chokladkaka med Mandel",
        description: "Mörk choklad med krispiga mandelbitar, för den perfekta kombinationen av sött och salt.",
        in_stock: false,
        image_url: "https://bilder.kolonial.no/prod/local_products/4d5f9a91-2da6-4f3f-af25-b4758702bd85.jpg?auto=format&fit=max&w=1000&s=40a0e7079a827a99a32c9d100ae26ab3",
        price: 49,
        discount: 0 // i procent
      }
];

const homeProductListArr = [
  { selectId: "popular"},
  { selectId: "new"},
]

document.addEventListener('DOMContentLoaded', () => {
  homeProductListArr.forEach(item => loadProducts(item.selectId));
});

const loadProducts = (sectionId) => {
    const productListDiv = document.getElementById(`${sectionId}-product-list`);
    const products = productData.slice(0,4);
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productListDiv.append(productCard)
    });
}

// Skapa produktkort
const createProductCard = (product) => {
    const currencySek = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' });

    const colDiv = document.createElement("div");
    colDiv.classList.add("col");

    const anchor = document.createElement("a");
    anchor.classList.add("text-decoration-none");
    anchor.setAttribute("data-id", product.id)
    anchor.setAttribute("data-bs-toggle", "modal")
    anchor.setAttribute("data-bs-target", "#productModal")
    anchor.href = "#"

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    const cardImg = document.createElement("img");
    cardImg.classList.add("card-img-top");
    cardImg.style.height = "200px";
    cardImg.src = product.image_url;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("p");
    cardTitle.classList.add("card-title", "text-center");
    cardTitle.textContent = product.name;

    const cardPrice = document.createElement("p");
    cardPrice.classList.add("card-text", "text-center", "text-danger", "h5");
    cardPrice.textContent = currencySek.format(product.price);

    const cardAddToCartButton = document.createElement("button");
    cardAddToCartButton.classList.add("btn", "btn-primary", "w-100", "shadow-sm")
    cardAddToCartButton.textContent = "Köp";

    cardBody.append(cardTitle, cardPrice, cardAddToCartButton);
    cardDiv.append(cardImg, cardBody);
    anchor.append(cardDiv)
    colDiv.append(anchor);

    return colDiv;
}

document.getElementById("productModal").addEventListener("show.bs.modal", (event) => {
    const productId = Number(event.relatedTarget.dataset.id);
    const currentProduct = productData.find(product => product.id === productId);

    const img = document.getElementById("img");
    img.src = currentProduct.image_url;
    img.style.height = "200px";
    document.getElementById("name").textContent = currentProduct.name;
});