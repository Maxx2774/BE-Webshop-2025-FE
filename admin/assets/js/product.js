import { InitDataTable } from '../js/datatables.js';

const verify = async () => {
    try {
        const response = await axios.get("https://webshopbackend.vercel.app/auth/verify", { withCredentials: true });
        console.log(response);     
    } catch (error) {
        console.log(error);
    }

    // console.log("Produkt ID:", productId);
    // bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
};
verify();

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
    { data: 'id', width: "70px" },
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
                <a href="#" style="display:inline; color: #4a4e54;" class="nav-link me-3"><i class="fa fa-pen fa-sm"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" data-product-id="${oData.id}" style="display:inline; color: #4a4e54;" class="nav-link me-2"><i class="fa fa-trash fa-sm"></i></a>`;
        }
    }
];

dataTable = InitDataTable('#product-list', 'https://webshopbackend.vercel.app/products', columns, 'products');

dataTable.on('click', 'td.dt-control', function (e) {
    var tr = e.target.closest('tr');
    var row = dataTable.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
    } else {
        row.child(format(row.data())).show();
    }
});

//Ta bort
document.getElementById("deleteModal").addEventListener("show.bs.modal", (event) => {
    const productId = event.relatedTarget.dataset.productId;
    const deleteButton = document.getElementById("delete-product");
    
    deleteButton.addEventListener("click", () => {
        deleteProduct(productId);
    });
});

const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete("https://webshopbackend.vercel.app/admin/products/delete", {data: {product_id: productId}, withCredentials: true});
        console.log(response);   
    } catch (error) {
        window.location.href = "/admin/dashboard/product/index.html";  
        console.log(error);
    }

};
