import { verifyToken, baseUrl, loggedUser, logOutUser, adminCheck } from './services.js';

import { InitDataTable } from '../js/datatables.js';

await verifyToken();
adminCheck();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;

    var columns = [
        { 
            data: 'null', 
            render: function(data, type, row) {
                let names = row.order_information.map(orderInfo => {
                    return `${orderInfo.shipping_address.first_name} ${orderInfo.shipping_address.last_name}`;
                });
                return names.join(', ');
            },
            width: "300px"
        },
        {
            data: 'status',
            render: function(data, type, row) {
                let badgeClass = '';
                let badgeText = '';
    
                switch (data) {
                    case 'processing':
                        badgeClass = 'text-bg-warning';
                        badgeText = 'Ordern behandlas';
                        break;
                    case 'out_for_delivery':
                        badgeClass = 'text-bg-primary';
                        badgeText = 'Ordern är ute för leverans';
                        break;
                    case 'delivered':
                        badgeClass = 'text-bg-success';
                        badgeText = 'Ordern är levererad';
                        break;
                    case 'canceled':
                        badgeClass = 'text-bg-danger';
                        badgeText = 'Ordern är avbruten';
                        break;
                    case 'returned':
                        badgeClass = 'text-bg-secondary';
                        badgeText = 'Ordern är returnerad';
                        break;
                }
    
                return `<span class="badge ${badgeClass}">${badgeText}</span>`;
            },
            width: "150px"
        },
        {
            data: 'payment_status',
            render: function(data, type, row) {
                let badgeClass = '';
                let badgeText = '';
        
                switch (data) {
                    case 'pending':
                        badgeClass = 'text-bg-warning';
                        badgeText = 'Väntar på betalning';
                        break;
                    case 'paid':
                        badgeClass = 'text-bg-success';
                        badgeText = 'Betalad';
                        break;
                    case 'failed':
                        badgeClass = 'text-bg-danger';
                        badgeText = 'Betalning misslyckades';
                        break;
                    case 'refunded':
                        badgeClass = 'text-bg-secondary';
                        badgeText = 'Återbetalad';
                        break;
                }
        
                return `<span class="badge ${badgeClass}">${badgeText}</span>`;
            },
            width: "150px"
        },
        {
            data: 'total_price',
            render: function(data, type, row) {
                return `${data} kr`;
            },
            width: "100px",
            className: 'text-end'
        },
        { data: 'created_at', render: DataTable.render.date("YYYY-MM-DD HH:mm"), width: "150px", className: "text-end", },
        {
            data: null,
            width: "50px",
            className: "text-end",
            orderable: false,
            fnCreatedCell: function (nTd, sData, oData) {
                nTd.innerHTML =`
                    <a href="#" data-bs-toggle="modal" data-bs-target="#updateModal" data-product-id="${oData.id}" style="display:inline; color: #4a4e54;" class="nav-link me-3"><i class="fa fa-pen fa-sm"></i></a>`;
            }
        }
    ];
    
InitDataTable('#order-list', `${baseUrl}/admin/orders`, columns, [0, 'asc']);