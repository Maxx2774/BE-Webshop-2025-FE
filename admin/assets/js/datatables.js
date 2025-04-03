export const InitDataTable = (tableId, apiUrl, tableColumns, sortColumn) => {
    var dataTable = new DataTable(tableId, {
        pageLength: 10,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Swedish.json'
        },
        ajax: {
            url: apiUrl,
            dataSrc: '',
            xhrFields: {
              withCredentials: true
            },
        },
        deferRender: true,
        columnDefs: [
            { targets: '_all', type: 'string' }
        ],
        columns: tableColumns,
        order: sortColumn
    });
    
    return dataTable;
}