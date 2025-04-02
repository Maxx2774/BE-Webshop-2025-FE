import { verifyToken, baseUrl, loggedUser, logOutUser, adminCheck } from './services.js';

import { InitDataTable } from '../js/datatables.js';

await verifyToken();
adminCheck();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;

    var columns = [
        { data: 'id', width: "70px" },
        { data: 'email', width: "200px" },
        { data: 'created_at', width: "150px" },
    ];
    
InitDataTable('#customer-list', `${baseUrl}/admin/users`, columns);