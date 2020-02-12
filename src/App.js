import React, { useEffect, useState } from 'react'
import CurrencyRow from './CurrencyRow'

import './App.css'

const BASE_URL = 'https://api.exchangeratesapi.io/latest'

const App = () => {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangerate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangerate
  } else {
    toAmount = amount
    fromAmount = amount / exchangerate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(({rates, base}) => {
        const baseCurrency = Object.keys(rates)[0]
        setCurrencyOptions([base, ...Object.keys(rates)])
        setFromCurrency(base)
        setToCurrency(baseCurrency)
        setExchangeRate(rates[baseCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${ BASE_URL }?base=${ fromCurrency }&symbol=${ toCurrency }`)
        .then(res => res.json())
        .then(({rates}) => setExchangeRate(rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  const handleFromAmountChange = e => {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  const handleToAmountChange = e => {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={ currencyOptions }
        selectedCurrency={ fromCurrency }
        onChangeCurrency={ e => setFromCurrency(e.target.value) }
        amount={ fromAmount }
        onChangeAmount={ handleFromAmountChange }
      />
      <div className={ 'equals' }>=</div>
      <CurrencyRow
        currencyOptions={ currencyOptions }
        selectedCurrency={ toCurrency }
        onChangeCurrency={ e => setToCurrency(e.target.value) }
        amount={ toAmount }
        onChangeAmount={ handleToAmountChange }
      />
    </>
  )
}

export default App
