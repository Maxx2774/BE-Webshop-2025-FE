import { verifyToken, baseUrl, loggedUser, logOutUser, adminCheck } from './services.js';

import { InitDataTable } from '../js/datatables.js';

await verifyToken();
adminCheck();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;

    var columns = [
        { data: 'id', classname: "text-start", width: "70px" },
        { data: 'name', width: "200px" },
        { data: 'slug', width: "150px" },
    ];
    
InitDataTable('#category-list', `${baseUrl}/categories`, columns, [0, 'asc']);