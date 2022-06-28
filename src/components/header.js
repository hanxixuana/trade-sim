import React from "react"
import '../styles/header.css'

function getClassNameFunctionTitle(functionName, props) {
    return `main-header-function-name ${props.functionName === functionName ? 'main-header-function-name-selected' : ''}`
}

export default function Header(props) {
    return (
        <div className="headers">
            <header className="main-header">
                <img src="./assets/pics/logo.png" alt="main-header-logo" className="main-header-logo" />
                <div>
                    <h2 className="main-header-title">Trade Simulator</h2>
                </div>
                <div className="main-header-functions">
                    <button 
                        className={getClassNameFunctionTitle('intraday-trading', props)} 
                        onClick={props.handleFunctionNameChange} 
                        name='intraday-trading'
                    >
                        Intraday Trading
                    </button>
                    <button 
                        className={getClassNameFunctionTitle('placeholder-1', props)} 
                        onClick={props.handleFunctionNameChange} 
                        name='placeholder-1'
                    >
                       Placeholder 1
                    </button>
                    <button 
                        className={getClassNameFunctionTitle('placeholder-2', props)} 
                        onClick={props.handleFunctionNameChange} 
                        name='placeholder-2'
                    >
                        Placeholder 2
                    </button>
                    <button 
                        className={getClassNameFunctionTitle('placeholder-3', props)} 
                        onClick={props.handleFunctionNameChange} 
                        name='placeholder-3'
                    >
                        Placeholder 3
                    </button>
                    <button 
                        className={getClassNameFunctionTitle('placeholder-4', props)} 
                        onClick={props.handleFunctionNameChange} 
                        name='placeholder-4'
                    >
                        Placeholder 4
                    </button>
                </div>
                <div className="main-header-menu">
                    <h3>Menu</h3>
                </div>
            </header>
        </div>
    )
}

