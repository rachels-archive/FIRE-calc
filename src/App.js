import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const initialFireAmt = Number(localStorage.getItem('fireAmt') || 0);
  const initialMonthlyIncome = Number(localStorage.getItem('monthlyIncome') || 3000);
  const initialTargetSavingsRate = Number(localStorage.getItem('targetSavingsRate') || 40);
  const initialWithdrawalRate =  Number(localStorage.getItem('withdrawalRate') || 4);
  const initialYearsOfWork = Number(localStorage.getItem('withdrawalRate') || 0);

  const [ fireAmt, setFireAmt ] = useState(initialFireAmt);
  const [ monthlyIncome, setMonthlyIncome ] = useState(initialMonthlyIncome);
  const [ targetSavingsRate, setTargetSavingsRate ] = useState(initialTargetSavingsRate);
  const [ withdrawalRate, setWithdrawalRate ] = useState(initialWithdrawalRate);
  const [ yearsOfWork, setYearsOfWork ] = useState(initialYearsOfWork);

  const calculateFireAmt = (income, savings, withdrawal) => {
    const monthlySavings = income * (savings / 100);
    const annualExpenses = (income - monthlySavings) * 12;
    const targetAmt = annualExpenses / (withdrawal / 100);
    return targetAmt;
  }

  const calculateYearOfWork = (income, savingsRate) => {
    const monthlySavings = income * (savingsRate / 100);
    const annualSavings = 12 * (income * (savingsRate / 100));
    const annualExpenses = (income - monthlySavings) * 12;
    const yearsOfWork = annualExpenses / annualSavings;
    return yearsOfWork;
  }

  const validateCalculation = (input) => {
    if (input === "$NaN" || input ===  "$∞" || input =="-$∞" || input == "Infinity" || input == "NaN") {
      return "?";
    } else {
      return input;
    }
  };

  const formatter = new Intl.NumberFormat('en-us', {
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  });

  useEffect(() => {
    localStorage.setItem('fireAmt', fireAmt);
    localStorage.setItem('monthlyIncome', monthlyIncome);
    localStorage.setItem('targetSavingsRate', targetSavingsRate);
    localStorage.setItem('withdrawalRate', withdrawalRate);

    const targetFireAmt = calculateFireAmt(monthlyIncome, targetSavingsRate, withdrawalRate)
    setFireAmt(targetFireAmt);

    const targetTime = calculateYearOfWork(monthlyIncome, targetSavingsRate);
    setYearsOfWork(targetTime);
  }
  , [
    monthlyIncome, 
    targetSavingsRate, 
    withdrawalRate
  ])

  return (
  <div className='fire-calc'>
    <h1 className='fire-calc-title'>FIRE Calculator</h1>
    <div className='fire-calc-results'>
      <h2>Your target FIRE amount is {validateCalculation(formatter.format(fireAmt))}</h2>
      <h2>It will take you {validateCalculation(yearsOfWork.toFixed(2))} years of work to save 1 year of living expenses.</h2>
    </div>
    <form className='fire-calc-form'>
      <label>Monthly Income:&nbsp;
        <input type='number' onChange={(e) => setMonthlyIncome(parseInt(e.target.value))} value={monthlyIncome} min='0'/>
      </label>
      <label>Target Savings Rate(%):&nbsp;
        <input type='number' onChange={(e) => setTargetSavingsRate(parseInt(e.target.value))} value={(targetSavingsRate)}  min='0' max='100'/>
      </label>
      <label>Withdrawal Rate(%):&nbsp;
        <input type='number' onChange={(e) => setWithdrawalRate(parseInt(e.target.value))} value={(withdrawalRate)} min='0' max='100'/>
      </label>
    </form>
    <div className='fire-calc-details'>
      <h3>How the FIRE amount is calculated:</h3>
      <p>1. FIRE amount = annual expenses / withdrawal rate</p>
      <p>2. monthly savings = monthly income * savings rate</p>
      <p>3. monthly expenses = monthly income - monthly savings</p>
      <p>4. annual expenses = monthly income * 12</p>
    </div>
  </div>
  );
}

export default App;
