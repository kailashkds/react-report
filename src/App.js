import React from 'react';
import ReportPage from './components/ReportPage'; // adjust path if needed

const App = (props) => {
  const {
    preload,
    budgetsData,
    reportType,
    currentBudgetId,
    lastHistoricalMonth,
    budgets,
    availableReports
  } = props;

  return (
    <ReportPage
      preload={preload}
      budgetsData={budgetsData}
      reportType={reportType}
      currentBudgetId={currentBudgetId}
      lastHistoricalMonth={lastHistoricalMonth}
      budgets={budgets}
      availableReports={availableReports}
    />
  );
};

export default App;