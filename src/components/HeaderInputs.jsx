import React, { useState } from 'react';

const HeaderInputs = ({ onSubmit }) => {
  const [individualHeaders, setIndividualHeaders] = useState(['']);
  const [totalHeaders, setTotalHeaders] = useState(['']);
  const [reportType, setReportType] = useState('PnL');

  const handleIndividualChange = (index, value) => {
    const newHeaders = [...individualHeaders];
    newHeaders[index] = value;
    setIndividualHeaders(newHeaders);
  };

  const handleTotalChange = (index, value) => {
    const newHeaders = [...totalHeaders];
    newHeaders[index] = value;
    setTotalHeaders(newHeaders);
  };

  const addIndividualRow = () => setIndividualHeaders([...individualHeaders, '']);
  const addTotalRow = () => setTotalHeaders([...totalHeaders, '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ reportType, individualHeaders, totalHeaders });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Generate Report</h2>

      <div className="mb-4">
        <label className="block font-semibold">Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="PnL">PnL</option>
          <option value="Balance Sheet">Balance Sheet</option>
          <option value="Cash Flow">Cash Flow</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Individual Headers (Years):</label>
        {individualHeaders.map((val, idx) => (
          <input
            key={idx}
            value={val}
            onChange={(e) => handleIndividualChange(idx, e.target.value)}
            className="border p-2 w-full my-1"
          />
        ))}
        <button type="button" onClick={addIndividualRow} className="text-sm text-blue-500 mt-1">
          + Add Year
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Total Headers:</label>
        {totalHeaders.map((val, idx) => (
          <input
            key={idx}
            value={val}
            onChange={(e) => handleTotalChange(idx, e.target.value)}
            className="border p-2 w-full my-1"
          />
        ))}
        <button type="button" onClick={addTotalRow} className="text-sm text-blue-500 mt-1">
          + Add Total Line
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Generate Report
      </button>
    </form>
  );
};

export default HeaderInputs;
