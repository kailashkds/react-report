import React from 'react';

const ReportSelector = ({
    reportType, setReportType,
    budgetId, setBudgetId,
    startYear, setStartYear,
    endYear, setEndYear,
    historical, setHistorical,
    budgets, availableReports,
    budgetsData,
    lastHistoricalMonth, // ✅ add this
    onGenerate
}) => {

console.log('ReportSelector budgets:', budgets);
console.log('ReportSelector availableReports:', availableReports);
    const handleReportChange = (e) => {
        setReportType(Number(e.target.value));
    };

    const handleBudgetChange = (e) => {
        setBudgetId(e.target.value);
    };

    const handleStartYearChange = (e) => {
        setStartYear(Number(e.target.value));
    };

    const handleEndYearChange = (e) => {
        setEndYear(Number(e.target.value));
    };

    const handleHistoricalChange = (e) => {
        const val = e.target.value;
        setHistorical(val === '' ? null : val);
      };

    const dateOptions = (budgetId, reportType) => {
        const range = budgetsData[budgetId]?.availableDatesForReports?.[reportType] || {};
        const { from = 2020, to = 2025 } = range;
        const years = [];
        for (let y = from; y <= to; y++) years.push(y);
        return years;
    };

    const years = dateOptions(budgetId, reportType);

    return (
        <div className="report-selector">
            <select value={reportType} onChange={handleReportChange} id="report-type-select">
                {Object.entries(availableReports).map(([label, val]) => (
                    <option key={val} value={val}>{label}</option>
                ))}
            </select>
            <div class="question-label-container"><p class="select-label">Budget</p></div>
            <select value={budgetId ?? ''} onChange={handleBudgetChange} id='budgets-select'>
                <option value="">Select Budget</option>
                {Object.entries(budgets).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>
            <select value={startYear ?? ''} onChange={handleStartYearChange} id='starting-year-select'>
            <option value="">Select Start Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={endYear ?? ''} onChange={handleEndYearChange} id='ending-year-select'>
            <option value="">Select End Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
  value={historical ?? ''}
  onChange={handleHistoricalChange}
>
  <option value="">None</option>
                <option value={lastHistoricalMonth}>{lastHistoricalMonth}</option>
            </select>
            <button onClick={onGenerate}>Generate Report</button>
        </div>
    );
};

export default ReportSelector;