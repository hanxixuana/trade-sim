import React from "react";

export default function ParameterSetter(props) {
    return (
        <div className="intraday-trade-parameter-setter">
            <label htmlFor="initialCashUsd">
                Initial Cash $
            </label>
            <input
                onKeyPress={
                    (event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }
                }
                type='text'
                onChange={props.handleParametersChange}
                value={props.parameters.initialCashUsd}
                name='initialCashUsd'
                id='initialCashUsd'
            />
            <label htmlFor="initialPreborrowShares">
                Initial Preborrow #
            </label>
            <input
                onKeyPress={
                    (event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }
                }
                type='text'
                onChange={props.handleParametersChange}
                value={props.parameters.initialPreborrowShares}
                name='initialPreborrowShares'
                id='initialPreborrowShares'
            />
            <label htmlFor="tradeSizeShares">
                Trade Size #
            </label>
            <input
                onKeyPress={
                    (event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }
                }
                type='text'
                onChange={props.handleParametersChange}
                value={props.parameters.tradeSizeShares}
                name='tradeSizeShares'
                id='tradeSizeShares'
            />
            <button
                className="intraday-trade-maker-reset-button"
                onClick={() => props.handleTradesReset(props.closes) && props.setDateIdx(0)}
            >
                Start Trading
            </button>
        </div>
    )
}