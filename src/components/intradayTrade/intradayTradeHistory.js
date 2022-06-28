import React from "react";
import { AgGridReact } from "ag-grid-react";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export default function IntradayTradeHistory(props) {
    const columnDefs = [
        {field: 'date'},
        {field: 'close'},
        {field: 'direction'},
        {field: 'tradeSide'},
        {field: 'tradeSize'}
    ]
    return (
        <div className="ag-theme-alpine" style={{height: '100vh', width: '100vw'}}>
           <AgGridReact
               rowData={props.trades}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
    )
}