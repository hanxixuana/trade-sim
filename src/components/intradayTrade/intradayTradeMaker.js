import React from "react";
import StockSelector from "./stockSelector";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ParameterSetter from "./parameterSetter";
import PositionDisplay from "./positionDisplay";
import { ResponsiveContainer } from "recharts";

import '../../styles/intradayTrade/intradayTradeMaker.css';

export default function IntradayTradeMaker(props) {

    const [dateIdx, setDateIdx] = React.useState(props.positions.dateIdx)

    React.useEffect(
        function() {
            let intervalFunc = setInterval(
                () => {
                    if (dateIdx >= props.closes.length) {
                        clearInterval(intervalFunc)
                    }
                    setDateIdx(
                        prevDateIdx => {
                            return prevDateIdx + 1
                        }
                    )
                   
                },
                1000
            )
            return () => clearInterval(intervalFunc)
        },
        [props.closes, props.trades]
    )

    React.useEffect(
        function() {
            props.handlePositionsUpdate(dateIdx - 1, props.closes[dateIdx - 1])
        },
        [props.closes, dateIdx]
    )

    const dataToPlot = props.closes.slice(0, dateIdx).map(
        item => {
            const tradesOnDate = props.trades.filter(trade => trade.date === item.date)
            const tradeCount = tradesOnDate ? tradesOnDate.reduce((sum, toAdd) => sum + toAdd.tradeSide, 0) : 0
            return {...item, tradeCount: tradeCount}
        }
    )

    const CustomizedDot = (props) => {
        const { cx, cy, stroke, payload, value } = props;
        if (payload.tradeCount > 0) {
            return (
                // b
                <svg 
                    x={cx - 32} 
                    y={cy - 32} 
                    width={64} 
                    height={64} 
                    fill="green"
                >
                    <circle cx="32" cy="32" r="24" fill="#4fd1d9"></circle>
                    <path d="M42.6 20.6c.9 1.2 1.3 2.7 1.3 4.4c0 1.8-.4 3.2-1.3 4.3c-.5.6-1.2 1.2-2.2 1.7c1.5.5 2.6 1.4 3.4 2.6c.8 1.2 1.1 2.6 1.1 4.3c0 1.7-.4 3.3-1.3 4.6c-.5.9-1.2 1.7-2.1 2.3c-.9.7-2 1.2-3.3 1.5s-2.6.4-4.1.4h-13v-29h14c3.6-.2 6.1.9 7.5 2.9m-15.7 1.9v6.4H34c1.3 0 2.3-.2 3.1-.7s1.2-1.3 1.2-2.5c0-1.4-.5-2.2-1.6-2.7c-.9-.3-2-.5-3.4-.5h-6.4m0 11.2v7.7h7c1.3 0 2.2-.2 2.9-.5c1.3-.6 1.9-1.8 1.9-3.6c0-1.5-.6-2.5-1.8-3.1c-.7-.3-1.7-.5-2.9-.5h-7.1" fill="#fff"></path>
                </svg>
            );
        }
        
        if (payload.tradeCount < 0) {
            return (
                // s
                <svg 
                    x={cx - 32} 
                    y={cy - 32} 
                    width={64} 
                    height={64} 
                    fill="red"
                >
                    <circle cx="32" cy="32" r="24" fill="#ff3300"></circle>
                    <path d="M25.8 37.6c.2 1.3.6 2.3 1.1 3c1 1.2 2.7 1.8 5.2 1.8c1.5 0 2.6-.2 3.6-.5c1.7-.6 2.6-1.7 2.6-3.4c0-1-.4-1.7-1.3-2.2c-.8-.5-2.2-1-4-1.4l-3.1-.7c-3.1-.7-5.2-1.4-6.4-2.2c-2-1.3-2.9-3.4-2.9-6.3c0-2.6 1-4.8 2.9-6.5c1.9-1.7 4.7-2.6 8.4-2.6c3.1 0 5.7.8 7.9 2.4c2.2 1.6 3.3 4 3.4 7.1h-5.8c-.1-1.7-.9-3-2.3-3.7c-1-.5-2.2-.7-3.6-.7c-1.6 0-2.9.3-3.8.9s-1.4 1.5-1.4 2.6c0 1 .5 1.8 1.4 2.3c.6.3 1.9.7 3.9 1.2l5.1 1.2c2.2.5 3.9 1.2 5 2.1c1.7 1.4 2.6 3.3 2.6 5.9c0 2.7-1 4.9-3.1 6.6c-2 1.8-4.9 2.6-8.7 2.6c-3.8 0-6.8-.9-9-2.6c-2.4-1.5-3.5-3.9-3.5-6.9h5.8" fill="#fff"></path>
                </svg>
            );
        }

        return (
            <svg 
                x={cx - 6} 
                y={cy - 6} 
                width="24px" 
                height="24px" 
                viewBox="0 0 48 48" 
                fill="none"
            >
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#001A72" strokeWidth="1.5"/>
            </svg>
        )
    };

    return (
        <div className="intraday-trade-maker">
            <div className="intraday-trade-maker-notes">
                <p>
                    NOTE: The APP is using https://polygon.io/ to fetch stock RICs and closes under a few usage restrictions
                </p>
                <p>
                    NOTE: Do not trigger data fetches too quickly to avoid being blocked
                </p>
            </div>
            <StockSelector 
                stockNames={props.stockNames}
                stockName={props.stockName} 
                handleStockNameChange={props.handleStockNameChange}
            />
            <ParameterSetter
                parameters={props.parameters}
                handleParametersChange={props.handleParametersChange}
                handleTradesReset={props.handleTradesReset}
                setDateIdx={setDateIdx}
                closes={props.closes}
            />
            <PositionDisplay 
                positions={props.positions}
            />
            <div className="intraday-trade-maker-buttons">
                <button
                    onClick={props.handleAddTrade('buy', dateIdx, props.closes)}
                >
                    BUY
                </button>
                <button
                    onClick={props.handleAddTrade('sell', dateIdx, props.closes)}
                >
                    SELL
                </button>
            </div>
            <div 
                className="intraday-trade-maker-plot"
            >
                <div>
                    <ResponsiveContainer>
                        <LineChart
                            data={dataToPlot}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Legend />
                            <Line isAnimationActive={false} type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} dot={<CustomizedDot />} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
        </div>
    )
}