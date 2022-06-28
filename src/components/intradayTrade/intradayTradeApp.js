import React from "react";
import IntradayTradeHeader from "./intradayTradeHeader";
import IntradayTradeMaker from "./intradayTradeMaker.js";
import IntradayTradeHistory from "./intradayTradeHistory";
import "../../styles/intradayTrade/intradayTradeApp.css"
import {getRICsSync, getClosesSync} from "../../utils/stock"

function getDefaultDate(offset) {
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultStartDate.getDate() + offset)
    return defaultStartDate
}

function changeCurrentFeatureWrapper(setter) {
    return function(event) {
        setter(event.target.name)
    }
}

function changeStockNameWrapper(setter) {
    return function(event) {
        setter(event.target.value)
    }
}

function changeStartAndEndDatesWrapper(setter) {
    return function() {
        setter([getDefaultDate(-100), getDefaultDate(-2)])
    }
}

function changeTradesWrapper(setter) {
    return function(newTrade) {
        setter(prevTrades => [...prevTrades, newTrade])
    }
}

function resetTradesWrapper(tradesSetter, initialParameters, positionsSetter) {
    return function(closes) {
        console.log(`[intradayTradeApp resetTradesWrapper] Reset and start trading for ${closes.length} days`)
        tradesSetter([])
        positionsSetter(
            {
                dateIdx: 0,
                cashUsd: initialParameters.initialCashUsd,
                unusedPreborrowShares: initialParameters.initialPreborrowShares,
                stockShares: 0,
                stockMarketValueUsd: 0,
                totalValueUsd: initialParameters.initialCashUsd,
                pnl: 0
            }
        )
        return true
    }
}

function changeParametersWrapper(setter) {
    return function(event) {
        console.log('[intradayTradeApp changeParametersWrapper] Parameter (' + event.target.name + ') to ' + event.target.value)
        setter(
            prevParameters => {
                return {
                    ...prevParameters,
                    [event.target.name]: event.target.value
                }
            }
        )
    }
}

function addTradeWrapper(tradesSetter, positionsSetter, parameters) {
    return function(direction, dateIdx, marketData) {
        return function() {
            const tradeSide = direction.toLowerCase() === 'buy' ? 1 : -1;
            if (dateIdx === undefined || !marketData || dateIdx >= marketData.length) {
                console.log(`[intradayTradeApp addTradeWrapper] Cannot add a trade coz tradeIdx is ${dateIdx} and/or marketData of length ${marketData.length} is ${JSON.stringify(marketData)}`)
                return
            }
            const market = marketData[dateIdx]
            if (!('date' in market && 'close' in market)) {
                console.log(`[intradayTradeApp addTradeWrapper] bad market data: ${market}`)
                return
            }
            console.log(`[intradayTradeApp addTrade] Going to add a ${direction} trade with ${JSON.stringify(market)}`)
            tradesSetter(
                prevTrades => [
                    ...prevTrades, 
                    {
                        date: market.date,
                        close: market.close, 
                        direction: direction, 
                        tradeSide: tradeSide,
                        tradeSize: parameters.tradeSizeShares
                    }
                ]
            )
            positionsSetter(
                prevPositions => {
                    const newCashUsd = prevPositions.cashUsd - tradeSide * market.close * parameters.tradeSizeShares
                    if (newCashUsd < 0) {
                        console.log(`[intradayTradeApp addTrade] Insufficient Cash ${prevPositions.cashUsd} to buy ${parameters.tradeSizeShares} stocks at ${market.close}`)
                        return prevPositions
                    }
                    const newUnusedPreborrowShares = (
                        prevPositions.unusedPreborrowShares - 
                        (prevPositions.stockShares <= 0 && tradeSide === -1) * parameters.tradeSizeShares + 
                        (prevPositions.stockShares < 0 && tradeSide === 1) * parameters.tradeSizeShares 
                    )
                    if (newUnusedPreborrowShares < 0) {
                        console.log(`[intradayTradeApp addTrade] Insufficient Preborrow ${prevPositions.unusedPreborrowShares} to short sell ${parameters.tradeSizeShares} stocks at ${market.close}`)
                        return prevPositions
                    }
                    const newStockShares = prevPositions.stockShares + tradeSide * parameters.tradeSizeShares
                    const newStockMarketValueUsd = newStockShares * market.close
                    const newTotalValueUsd = newCashUsd + newStockMarketValueUsd
                    const newPnl = newTotalValueUsd - parameters.initialCashUsd
                    return {
                        ...prevPositions,
                        cashUsd: newCashUsd,
                        unusedPreborrowShares: newUnusedPreborrowShares,
                        stockShares: newStockShares,
                        stockMarketValueUsd: newStockMarketValueUsd,
                        totalValueUsd: newTotalValueUsd,
                        pnl: newPnl
                    }
                }
            )
        }
    }
}

function updatePositionsWrapper(setter) {
    return function(newDateIdx, newClose) {
        if (newClose !== undefined && 'date' in newClose && 'close' in newClose) {
            console.log('[intradayTradeApp updatePositionsWrapper] latest close: ' + JSON.stringify(newClose))
            setter(
                prevPositions => {
                    return {
                        ...prevPositions,
                        dateIdx: newDateIdx,
                        stockMarketValueUsd: prevPositions.stockShares * newClose.close,
                        totalValueUsd: prevPositions.stockShares * newClose.close + prevPositions.cashUsd,
                        pnl: prevPositions.pnl + prevPositions.stockShares * newClose.close - prevPositions.stockMarketValueUsd
                    }
                }
            )
        }
    }
}

export default function IntradayTradeApp() {
    
    const [currentFeatureName, setCurrentFeatureName] = React.useState('intraday-trade-maker')
    const [stockNames, setStockNames] = React.useState(['Waiting For Fetching RICs'])
    const [stockName, setStockName] = React.useState('AAPL')
    const [startAndEndDates, setStartAndEndDates] = React.useState([getDefaultDate(-100), getDefaultDate(-2)])
    const [closes, setCloses] = React.useState([])
    const [trades, setTrades] = React.useState([])
    const [parameters, setParameters] = React.useState(
        {
            initialCashUsd: 1e6,
            initialPreborrowShares: 1e4,
            tradeSizeShares: 1000
        }
    )
    const [positions, setPositions] = React.useState(
        {
            dateIdx: 0,
            cashUsd: parameters.initialCashUsd,
            unusedPreborrowShares: parameters.initialPreborrowShares,
            stockShares: 0,
            stockMarketValueUsd: 0,
            totalValueUsd: parameters.initialCashUsd,
            pnl: 0
        }
    )
    
    React.useEffect(() => getRICsSync(startAndEndDates[1], setStockNames), [startAndEndDates])
    React.useEffect(() => getClosesSync(stockName, startAndEndDates[0], startAndEndDates[1], setCloses), [stockName, startAndEndDates])

    let body
    switch(currentFeatureName)
    {
        case 'intraday-trade-maker':
            body = <IntradayTradeMaker 
                stockNames={stockNames}
                stockName={stockName}
                handleStockNameChange={changeStockNameWrapper(setStockName)}
                startAndEndDates={startAndEndDates}
                handleStartAndEndDatesChange={changeStartAndEndDatesWrapper(setStartAndEndDates)}
                closes={closes}
                trades={trades}
                handleTradesChange={changeTradesWrapper(setTrades)}
                handleTradesReset={resetTradesWrapper(setTrades, parameters, setPositions)}
                parameters={parameters}
                handleParametersChange={changeParametersWrapper(setParameters)}
                positions={positions}
                handleAddTrade={addTradeWrapper(setTrades, setPositions, parameters)}
                handlePositionsUpdate={updatePositionsWrapper(setPositions)}
            />
            break;
        case 'intraday-trade-history':
            body = <IntradayTradeHistory 
                trades={trades}
            />
            break;
        default:
            body = undefined
    }

    return (
        <div className="intraday-trade-app">
            <IntradayTradeHeader 
                featureName={currentFeatureName}
                handleFeatureNameChange={changeCurrentFeatureWrapper(setCurrentFeatureName)}
                trades={trades}
                parameters={parameters}
                positions={positions}
            />
            {body}
        </div>
    )
}