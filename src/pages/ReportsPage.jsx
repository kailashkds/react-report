import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from '../styles/HomePage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedLines, setSelectedLines] = useState({});
  const [inputs, setInputs] = useState([]);
  const [individualHeaders, setIndividualHeaders] = useState('');
  const [totalHeaders, setTotalHeaders] = useState('');
  const [inputValues, setInputValues] = useState([]);
  const accessToken = localStorage.getItem('access_token');
  const [reportLines, setReportLines] = useState([]);  // new state to hold lines
  const [selectedReportName, setSelectedReportName] = useState('');


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/rest/reports/docs`, {
          headers: { Authorization: `${accessToken}` },
        });
        setReports(response.data.reports);
        const initialSelections = response.data.reports.reduce((acc, report) => {
          acc[report.report_name] = [];
          return acc;
        }, {});
        setSelectedLines(initialSelections);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    if (accessToken) fetchReports();
  }, [accessToken]);

  const handleReportSelect = async (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    setSelectedReport(e.target.value);

    if (!isNaN(selectedIndex)) {
      const report = reports[selectedIndex];
      setReportLines(report.lines || []);  // set the lines to state for display
      const totalLines = report.lines.filter(line => line.toLowerCase().includes('total'));

      if (totalLines.length > 0) {
        try {
          const payload = {
            reports: [{ report_name: report.report_name, lines: totalLines }],
            is_no_descriptions: false,
          };
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/rest/reports/docs/line-inputs`,
            payload,
            { headers: { Authorization: `${accessToken}` } }
          );
          setInputs(response.data.inputs);
        } catch (error) {
          console.error("Error loading default lines:", error);
        }
      } else {
          setReportLines([]); // clear lines if no selection
        }
    }
  };

  const handleHeadersChange = async (e, type) => {
    const value = e.target.value;
    if (type === 'individual') {
      setIndividualHeaders(value);
    } else {
      setTotalHeaders(value);
    }

    const months = individualHeaders.split(',').map(m => parseInt(m.trim())).filter(m => m >= 1 && m <= 12);
    const years = totalHeaders.split(',').map(y => y.trim()).filter(Boolean);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (months.length && years.length && inputs.length) {
      const headers = [];
      years.forEach(year => {
        months.forEach(m => {
          headers.push(`${monthNames[m - 1]} ${year.slice(-2)}`);
        });
      });
      prepareInputValues(inputs, headers);
    }
  };

  const prepareInputValues = (inputGroups, headers) => {
    const allInputs = inputGroups.flatMap(group => group.inputs);
    const columnCount = headers.length;

    const newInputValues = allInputs.map(input => ({
      name: input.name.trim(),
      nameUpper: input.name.trim().toUpperCase(),
      description: input.description || '',
      values: Array(columnCount).fill(''),
    }));

    setInputValues(newInputValues);
  };

  const handleValueChange = (name, colIdx, newVal) => {
    setInputValues(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(i => i.nameUpper === name.toUpperCase());

      if (idx !== -1) {
        const values = [...updated[idx].values];
        values[colIdx] = newVal;
        updated[idx] = { ...updated[idx], values };
      }
      return updated;
    });
  };

  const handleSubmitReport = async () => {
    const selectedIndex = parseInt(selectedReport, 10);
    if (isNaN(selectedIndex)) return alert('Please select a report');
  
    const reportName = reports[selectedIndex].report_name;
  
    const selectedLineNames = (selectedLines[reportName] || []).map(name => name.trim().toUpperCase());
    const usedInputs = inputValues.filter(input =>
      selectedLineNames.includes(input.nameUpper)
    );
  
    const inputsPayload = usedInputs.flatMap(input =>
      input.values.map((val, idx) => ({
        name: input.name,
        description: input.description,
        value: val
      }))
    );
  
    const months = individualHeaders.split(',').map(m => parseInt(m.trim())).filter(m => m >= 1 && m <= 12);
    const years = totalHeaders.split(',').map(y => y.trim()).filter(Boolean);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const individualHeadersMatrix = years.map(year =>
      months.map(m => `${monthNames[m - 1]} ${year.slice(-2)}`)
    );
  
    const payload = {
      reports: [
        {
          report_name: reportName,
          lines: selectedLineNames
        }
      ],
      inputs: inputsPayload,
      individual_headers: individualHeadersMatrix,
      total_headers: years
    };

    console.log('Submitting report with payload:', JSON.stringify(payload, null, 2));
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/rest/reports/generation/json`,
        payload,
        {
          headers: {
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Report submitted:', response.data);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Submission failed!');
    }
  };

  const renderInputTable = () => {
    const months = individualHeaders.split(',').map(m => parseInt(m.trim())).filter(m => m >= 1 && m <= 12);
    const years = totalHeaders.split(',').map(y => y.trim()).filter(Boolean);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const headers = [];

    years.forEach(year => {
      months.forEach(m => {
        headers.push(`${monthNames[m - 1]} ${year.slice(-2)}`);
      });
    });

    return (
      <>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th></th>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inputs.map(group => {
            const groupInputs = group.inputs.map(input => {
              return (
                inputValues.find(i => i.nameUpper === input.name.toUpperCase()) || {
                  name: input.name,
                  nameUpper: input.name.toUpperCase(),
                  values: Array(headers.length).fill(''),
                }
              );
            });

            const groupTotals = Array(headers.length).fill(0);
            groupInputs.forEach(input => {
              input.values.forEach((val, idx) => {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                  groupTotals[idx] += num;
                }
              });
            });

            return (
              <React.Fragment key={group.group}>
                <tr>
                  <th className="bg-light text-dark fw-bold text-uppercase">{group.title}</th>
                  <td colSpan={headers.length} className="bg-light"></td>
                </tr>
                {groupInputs.map((input, iIdx) => (
                  <tr key={iIdx}>
                    <td>{input.name}</td>
                    {headers.map((_, idx) => (
                      <td key={idx}>
                        <input
                          type="text"
                          className="form-control"
                          value={input.values[idx]}
                          onChange={e => handleValueChange(input.name, idx, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-light">
                  <td className="fw-bold">{group.group}</td>
                  {groupTotals.map((t, i) => (
                    <td key={i} className="fw-bold">{t.toFixed(2)}</td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

    <div className="text-center mt-4">
      <button className="btn btn-success" onClick={handleSubmitReport}>
        Submit Report
      </button>
    </div>
    </>
    );
  };

  return (
    <div>
      <header className={classes.header}>
        <div className={classes.logo}>Budgeto</div>
      </header>

      <div className="container-fluid">
        <h1>Report Selection</h1>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Select a Report:</label>
            <select className='form-select' value={selectedReport} onChange={handleReportSelect}>
              <option value="">-- Select Report --</option>
              {reports.map((report, index) => (
                <option key={report.report_name} value={index}>
                  {report.report_name}
                </option>
              ))}
            </select>

            {/* New part: Display lines as a list */}
            {/* {reportLines.length > 0 && (
              <ul className="mt-3">
                {reportLines.map((line, idx) => (
                  <li key={idx}>
                   <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`line-${idx}`}
                      checked={selectedLines[reports[parseInt(selectedReport, 10)]?.report_name]?.includes(line) || false}
                      onChange={(e) => {
                        const reportName = reports[parseInt(selectedReport, 10)]?.report_name;
                        const prevSelected = selectedLines[reportName] || [];
                        const updatedLines = e.target.checked
                          ? [...prevSelected, line]
                          : prevSelected.filter(l => l !== line);

                        setSelectedLines({
                          ...selectedLines,
                          [reportName]: updatedLines
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor={`line-${idx}`}>
                      {line}
                    </label>
                  </div>
                  </li>
                ))}
              </ul>
            )} */}
          </div>

          <div className="col-md-4">
            <label className="form-label">Individual Headers (Months like 1,2,3):</label>
            <input
              type="text"
              className='form-control'
              value={individualHeaders}
              onChange={e => handleHeadersChange(e, 'individual')}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Total Headers (Years like 78,79):</label>
            <input
              type="text"
              className='form-control'
              value={totalHeaders}
              onChange={e => handleHeadersChange(e, 'total')}
            />
          </div>
        </div>

        {inputs.length > 0 && renderInputTable()}
      </div>
    </div>
  );
};

export default ReportsPage;