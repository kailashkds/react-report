import React, { useState, useEffect } from 'react';
import ReportSelector from './ReportSelector';
import ReportTable from './ReportTable';
import { generateReportData } from '../services/api';

const ReportPage = ({
    preload,
    budgetsData,
    reportType: initialReportType,
    currentBudgetId,
    lastHistoricalMonth,
    budgets,
    availableReports
}) => {
    const [reportType, setReportType] = useState(initialReportType);
    const [budgetId, setBudgetId] = useState(currentBudgetId);
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [historical, setHistorical] = useState(lastHistoricalMonth);
    const [reportData, setReportData] = useState(preload?.reportData || null);
    const [monthHeaders, setMonthHeaders] = useState(preload?.monthHeaders || null);
    const handleGenerate = async () => {
        const response = await generateReportData(reportType, startYear, endYear, historical, budgetId);
        setReportData(response.reportData);
        setMonthHeaders(response.monthHeaders);
    };

    useEffect(() => {
        if (!preload) {
            // set initial year range based on budgetsData
            const range = budgetsData[budgetId]?.availableDatesForReports?.[reportType];
            if (range) {
                let { from, to } = range;
                if (to - from >= 10) from = to - 9;
                setStartYear(from);
                setEndYear(to);
            }
        }
    }, [budgetId, reportType]);
    console.log('ReportPage props:', {
        budgets,
        availableReports,
        budgetsData,
        currentBudgetId,
        reportType,
        preload,
        lastHistoricalMonth
      });
    return (
        <div>
            <ReportSelector
                reportType={reportType}
                setReportType={setReportType}
                budgetId={budgetId}
                setBudgetId={setBudgetId}
                startYear={startYear}
                setStartYear={setStartYear}
                endYear={endYear}
                setEndYear={setEndYear}
                historical={historical}
                setHistorical={setHistorical}
                budgets={budgets}
                availableReports={availableReports}
                budgetsData={budgetsData}
                onGenerate={handleGenerate}
                lastHistoricalMonth={lastHistoricalMonth}
            />
            {reportData && (
                <ReportTable
                    reportData={reportData}
                    monthHeaders={monthHeaders}
                    isYearView={true}
                />
            )}
        </div>
    );
};

export default ReportPage;