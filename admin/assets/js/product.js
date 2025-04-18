import { verifyToken, GetAsync, DeleteAsync, PostAsync, PatchAsync, baseUrl, unitWeight, loggedUser, logOutUser, adminCheck } from './services.js';
import { InitDataTable } from '../js/datatables.js';

await verifyToken();
adminCheck();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;

const datatableProduct = document.getElementById("product-list");
if (datatableProduct) {
    let dataTable;
    
    const format = (d) => {
        return (
            '<dl class="px-2 py-2">' +
            '<dt>Produktnamn:</dt>' +
            '<dd>' + d.name + '</dd>' +
            '<dt>Kategori:</dt>' +
            '<dd>' + d.categories.name + '</dd>' +
            '<dt>Beskrivning:</dt>' +
            '<dd>' + d.description + '</dd>' +
            '<dt>Vikt:</dt>' +
            '<dd>' + (d.weight ? d.weight + ' ' + d.weight_unit : 'Ej angiven') + '</dd>' +
            '<dt>Skapad:</dt>' +
            '<dd>' + new Date(d.created_at).toLocaleString() + '</dd>' +
            '<dt>Produkbild:</dt>' +
            '<dd><img src="' + d.image_url + '" style="height: 100px;"></dd>' +
            '</dl>'
        );
    }
    
    var columns = [
        {
            data: null,
            width: "30px",
            className: 'dt-control',
            orderable: false,
            defaultContent: ''
        },
        { data: 'id',  className: "text-start", width: "70px" },
        { data: 'name', width: "200px" },
        { data: 'categories.name', width: "150px" },
        { data: 'price', width: "100px" },
        {
            data: 'stock_quantity',
            width: "100px",
            fnCreatedCell: function (nTd, sData, oData,) {
                if (oData.stock_quantity > 0) {
                    nTd.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
                } else {
                    nTd.innerHTML = '<i class="fa-solid fa-xmark text-danger"></i>';
                }
            }
        },
        {
            data: null,
            width: "50px",
            className: "text-end",
            orderable: false,
            fnCreatedCell: function (nTd, sData, oData) {
                nTd.innerHTML =`
                    <a href="#" data-bs-toggle="modal" data-bs-target="#updateModal" data-product-id="${oData.id}" style="display:inline; color: #4a4e54;" class="nav-link me-3"><i class="fa fa-pen fa-sm"></i></a>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" data-product-id="${oData.id}" style="display:inline; color: #4a4e54;" class="nav-link me-2"><i class="fa fa-trash fa-sm"></i></a>`;
            }
        }
    ];
    
    dataTable = InitDataTable('#product-list', `${baseUrl}/products`, columns, [1, 'asc']);
    
    dataTable.on('click', 'td.dt-control', function (e) {
        var tr = e.target.closest('tr');
        var row = dataTable.row(tr);
    
        if (row.child.isShown()) {
            row.child.hide();
        } else {
            row.child(format(row.data())).show();
        }
    });
}

//Ta bort
const deleteProductModal = document.getElementById("deleteModal");
if(deleteProductModal) {
    document.getElementById("deleteModal").addEventListener("show.bs.modal", (event) => {
        const productId = event.relatedTarget.dataset.productId;
        const deleteButton = document.getElementById("delete-product");
        
        deleteButton.addEventListener("click", () => {
            deleteProduct(productId);
        });
    });
    
    const deleteProduct = async (productId) => {
        try {
            const response = await DeleteAsync(`${baseUrl}/admin/products/delete`, { product_id: productId }, { withCredentials: true });

            if (response.status === 204) {
                window.location.href = "/admin/dashboard/product/index.html";  
            }

        } catch (error) {
            console.log(error);
        }
    
    };
}

const validateInput = (event, type) => {
    let inputValue = event.target.value;
    let errorMessage = document.getElementById(type === "price" ? "error-price" : "error-stock");
    let errorMessages = [];

    if (type === "price") {
        if (inputValue.includes(",") || inputValue.includes(".")) {
            errorMessages.push("Priset får endast innehålla heltal!");
        }

        if (!inputValue.includes(",") && !inputValue.includes(".")) {
            if (isNaN(inputValue) || inputValue < 0 || inputValue > 20000) {
                errorMessages.push("Priset får endast vara mellan 0 och 20000!");
            }
        }
    }

    if (type === "quantity") {
        if (inputValue.includes(",") || inputValue.includes(".")) {
            errorMessages.push("Antalet får endast innehålla heltal!");
        }

        if (inputValue < 0 || inputValue > 1000) {
            errorMessages.push("Antalet får inte vara mindre än 0 eller större än 1000!");
        }
    }

    errorMessage.textContent = errorMessages.length > 0 ? errorMessages.join(" ") : "";
};

//Uppdatera
const updateProductModal = document.getElementById("updateModal");
if (updateProductModal) {
    document.getElementById("price").addEventListener("input", event => validateInput(event, "price"));
    document.getElementById("stock-quantity").addEventListener("input", event => validateInput(event, "quantity"));

    let productId;
    updateProductModal.addEventListener("show.bs.modal", async (event) => {
        const updateFields = document.querySelectorAll("#update input, #update textarea");
        productId = event.relatedTarget.dataset.productId;
    
        const productToUpdate = await GetAsync(`${baseUrl}/products/${productId}`)
    
        updateFields.forEach(field => {
            if (field.tagName.toLowerCase() === "textarea" || field.tagName.toLowerCase() === "input") {
                field.value = productToUpdate.data[field.name] || ''; 
            }
        });
    });
    
    document.getElementById("update-product").addEventListener("click", async () => {
        const updateFields = document.querySelectorAll("#update input, #update textarea");
    
        let product = {};
    
        updateFields.forEach(field => {
            if (field.name) {
                product[field.name] = field.value;
                console.log(`Set ${field.name} to ${field.value}`);
            }
        });

        const priceError = document.getElementById("error-price").textContent;
        const quantityError = document.getElementById("error-stock").textContent;

        if (priceError || quantityError) {
            document.getElementById("error").textContent = "Vänligen korrigera alla fel innan du skickar in formuläret!";
            return;
        }
    
        product["product_id"] = productId;
    
        await updateProduct(product);
    });

    const updateProduct = async (product) => {
        try {
            await PatchAsync(`${baseUrl}/admin/products/update`, product, {withCredentials: true});
            window.location.href = "/admin/dashboard/product/index.html";  
        } catch (error) {
            console.log(error);
        }
    };
}

const location = window.location;
if (location.pathname === "/admin/dashboard/product/create.html") {
    document.getElementById("product-price").addEventListener("input", event => validateInput(event, "price"));
    document.getElementById("product-quantity").addEventListener("input", event => validateInput(event, "quantity"));

    const productUnits = unitWeight;
    const getCategories = await GetAsync(`${baseUrl}/categories`);
    const categories = getCategories.data.sort((a, b) => a.name.localeCompare(b.name));

    const unitSelect = document.getElementById("product-unit");
    const categoriesSelect = document.getElementById("product-category");

    categories.forEach(category => {
        console.log(category.id)
        const option = document.createElement("option");
        option.text = category.name;
        option.value = category.id;
        categoriesSelect.append(option);
    });

    productUnits.forEach(unit => {
        const option = document.createElement("option");
        option.text = unit;
        option.value = unit;
        unitSelect.append(option);
    });

    //Lägg till produkt
    document.getElementById("add-product").addEventListener("click", () => {
        const productTitle = document.getElementById("product-title").value;
        const productPrice = document.getElementById("product-price").value;
        const productDescription = document.getElementById("product-description").value;
        const productCategory = document.getElementById("product-category").value;
        const productImgUrl = document.getElementById("product-image").value;
        const productUnit = document.getElementById("product-unit").value;
        const productQuantity = document.getElementById("product-quantity").value;
            
        if (!productTitle || !productPrice || !productDescription || !productCategory || !productImgUrl || !productUnit || !productQuantity) {
            document.getElementById("error").textContent = "Alla fält måste fyllas i!";
            return;
        }

        const priceError = document.getElementById("error-price").textContent;
        const quantityError = document.getElementById("error-stock").textContent;

        if (priceError || quantityError) {
            document.getElementById("error").textContent = "Vänligen korrigera alla fel innan du skickar in formuläret!";
            return;
        }

        let product = {
            name: productTitle,
            price: productPrice,
            description: productDescription,
            category_id: productCategory,
            image_url: productImgUrl,
            weight_unit: productUnit,
            stock_quantity: productQuantity
        }
    
        addProduct(product);  
    });
    
    const addProduct = async (product) => {
        try {
            const response = await PostAsync(`${baseUrl}/admin/products/add`, product, {withCredentials: true});

            if (response.status === 201) {
                window.location.href = "/admin/dashboard/product/index.html";  
            }
        } catch (error) {
            console.log(error);
        }
    }
}