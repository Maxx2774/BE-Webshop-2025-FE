import { verifyToken, baseUrl, loggedUser, logOutUser, adminCheck } from './services.js';

import { InitDataTable } from '../js/datatables.js';

await verifyToken();
adminCheck();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;

    var columns = [
        { data: 'id', className: "text-start", width: "70px" },
        { data: 'email', width: "200px" },
        { data: 'created_at',  className: "text-start", render: DataTable.render.date("YYYY-MM-DD HH:mm"), width: "150px" },
    ];
    
InitDataTable('#customer-list', `${baseUrl}/admin/users`, columns, [2, 'asc']);