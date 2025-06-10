import React, { useState } from 'react';
import axios from 'axios';

const ReportGenerator = () => {
  const [reportType, setReportType] = useState('ProfitAndLoss');
  const [individualHeaders, setIndividualHeaders] = useState('2078,2079,2080,2081,2082,2083,2084');
  const [totalHeaders, setTotalHeaders] = useState('Total revenue,Total variable costs,Total fixed costs,EBITDA');
  const [reportData, setReportData] = useState(null);

  const handleGenerate = async () => {
    try {
      const response = await axios.get('http://localhost/api/v1/rest/reports/docs', {
        params: { reports_list: reportType },
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzgxNjI2NywianRpIjoiYzRhZmEwNTMtMGQ0YS00MmE1LTgxY2YtMzYxMzA0NGQyMzhlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImU1ZDFiOGI1LTgyMDMtNDZiYi05NmQwLTVmM2M1MTViNmVmNSIsIm5iZiI6MTc0NzgxNjI2NywiY3NyZiI6ImEzYWViYWE0LTFhNTUtNDg1Zi04NmNhLTRlZGIyYjY2MzY2ZCIsImV4cCI6MTc0NzgxNzQ2Nywicm9sZXMiOlsiYWRtaW4iXX0._6Cxv9pxaDXqe4hGzQ3DbrK7qSiXz98UzwoaV8UJY_Y'
        }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    }
  };

  const parseHeaders = () => individualHeaders.split(',').map(h => h.trim());
  const parseTotals = () => totalHeaders.split(',').map(t => t.trim().toLowerCase());

  const renderTable = () => {
    if (!reportData?.lines?.length) return <p>No data found.</p>;

    const years = parseHeaders();
    const totals = parseTotals();

    return (
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Line Item</th>
            {years.map(year => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportData.lines.map((line, index) => {
            const isTotal = totals.includes(line.label.toLowerCase());

            return (
              <tr key={index} style={{ backgroundColor: isTotal ? '#e8f0fe' : 'transparent' }}>
                <td style={{ fontWeight: isTotal ? 'bold' : 'normal' }}>{line.label}</td>
                {years.map(year => (
                  <td key={year} style={{ textAlign: 'right', fontWeight: isTotal ? 'bold' : 'normal' }}>
                    {line.values[year] !== undefined ? line.values[year] : '-'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dynamic Financial Report</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block font-medium">Select Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="PnL">Profit and Loss</option>
            <option value="BalanceSheet">Balance Sheet</option>
            <option value="CashFlow">Cash Flow</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block font-medium">Individual Headers (years):</label>
          <input
            type="text"
            value={individualHeaders}
            onChange={(e) => setIndividualHeaders(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="e.g., 2078,2079,2080"
          />
        </div>

        <div className="flex-1">
          <label className="block font-medium">Total Headers (bolded):</label>
          <input
            type="text"
            value={totalHeaders}
            onChange={(e) => setTotalHeaders(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="e.g., Total revenue,EBITDA"
          />
        </div>

        <div className="self-end">
          <button
            onClick={handleGenerate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded shadow">{renderTable()}</div>
    </div>
  );
};

export default ReportGenerator;