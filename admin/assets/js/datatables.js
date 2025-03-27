export const InitDataTable = (tableId, apiUrl, tableColumns, dataSource) => {
    var dataTable = new DataTable(tableId, {
        pageLength: 25,
        ajax: {
            url: apiUrl,
            dataSrc: dataSource
        },
        deferRender: true,
        columnDefs: [
            { targets: '_all', type: 'string' }
        ],
        columns: tableColumns
    });
    
    return dataTable;
}