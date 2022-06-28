import React from "react";

export default function PositionDisplay(props) {
    const elements = [
        ['cashUsd', 'Current Cash $'],
        ['unusedPreborrowShares', 'Unused Preborrow #'],
        ['stockShares', 'Current Stock #'],
        ['stockMarketValueUsd', 'Current Stock MV $'],
        ['totalValueUsd', 'Current Portfolio Value $'],
        ['pnl', 'PnL $']
    ].map(
        item => {
            return (
                <div key={item[0]}>
                    <label 
                        htmlFor={item[0]}
                    >
                        {item[1]}
                    </label>
                    <input
                        value={props.positions[item[0]].toFixed(2)}
                        name={item[0]}
                        id={item[0]}
                        readOnly
                    />
                </div>
            )
        }
    )
    return (
        <div className="intraday-trade-maker-position-display">
            {elements}
        </div>
    )
}
