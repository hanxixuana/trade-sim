import React from "react"
import "../../styles/intradayTrade/intradayTradeHeader.css"

function getClassNameFunctionTitle(featureName, props) {
    return `intraday-trade-header-feature-name ${props.featureName === featureName ? 'intraday-trade-header-feature-name-selected' : ''}`
}

export default function IntradayTradeHeader(props) {

    const buyCount = props.trades.filter(trade => trade.tradeSide > 0).length
    const sellCount = props.trades.filter(trade => trade.tradeSide < 0).length
    
    return (
        <div className="intraday-trade-body-header">
            <div
                className={getClassNameFunctionTitle('intraday-trade-maker', props)} 
            >
                <div>
                    <div>
                        Makde Trades
                    </div>
                    <div>
                        Return: {props.parameters.initialCashUsd ? (props.positions.pnl / props.parameters.initialCashUsd * 100.0).toFixed(2) : 0.00}%
                    </div>
                </div>
                <input
                    type='button' 
                    name='intraday-trade-maker'
                    onClick={props.handleFeatureNameChange}
                />
            </div>
            <div className="separate-line"></div>
            <div
                className={getClassNameFunctionTitle('intraday-trade-history', props)} 
            >
                <div>
                    <div>
                        Trade History
                    </div>
                    <div>
                        Buy #: {buyCount}
                    </div>
                    <div>
                        Sell #: {sellCount}
                    </div>
                </div>
                <input
                    type='button'
                    name='intraday-trade-history'
                    onClick={props.handleFeatureNameChange}
                />
            </div>
        </div>
    )
}