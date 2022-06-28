import React from "react";


export default function StockSelector(props) {
    const options = props.stockNames.map(
        name => (
            <option key={name} name={name} value={name}>
                {name}
            </option>
        )
    )
    // options.push(<option key='--Select A RIC--' value='--Select A RIC--'>--Select A US Stock--</option>)
    return (
        <div className="intraday-trade-stock-selector">
            <label 
                htmlFor='intraday-trade-stock-selector-list'
                className="intraday-trade-stock-selector-list-label"
            >
                US Stock To Trade
            </label>
            <select
                className='intraday-trade-stock-selector-list'
                value={props.stockName}
                onChange={props.handleStockNameChange}
                name='intraday-trade-stock-selector-list'
            >
                {options}
            </select>
        </div>
    )
}