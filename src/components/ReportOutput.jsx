import React from 'react';

const ReportOutput = ({ data, individualHeaders, totalHeaders }) => {
  if (!data) return null;

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <h3 className="text-xl font-bold mb-4">{data.report_name} Report</h3>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 text-left">Line Item</th>
            {individualHeaders.map((year, idx) => (
              <th key={idx} className="border p-2 text-left">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.lines.map((line, idx) => (
            <tr key={idx}>
              <td className={`border p-2 font-semibold ${totalHeaders.includes(line) ? 'bg-gray-100 font-bold' : ''}`}>
                {line}
              </td>
              {individualHeaders.map((_, i) => (
                <td key={i} className="border p-2">0</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportOutput;