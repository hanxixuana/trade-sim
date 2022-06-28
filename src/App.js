import './styles/App.css'
import React from 'react'
import Header from './components/header'
import IntradayTradeApp from './components/intradayTrade/intradayTradeApp'

function App() {

  const [currentFunctionName, setCurrentFunctionName] = React.useState('intraday-trading')

  function changeCurrentFunction(event) {
    setCurrentFunctionName(event.target.name)
  }

  let body;
  switch(currentFunctionName)
  {
    case 'intraday-trading':
      body = <IntradayTradeApp />
      break;
    default:
      body = <IntradayTradeApp />
  }

  return (
    <div className="App">
      <Header functionName={currentFunctionName} handleFunctionName={changeCurrentFunction}/>
      {body}
    </div>
  )
}

export default App
