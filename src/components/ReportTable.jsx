import React, { useState } from 'react';

const ReportTable = ({ reportData, monthHeaders, isYearView: defaultIsYearView }) => {
    const [isYearView, setIsYearView] = useState(defaultIsYearView);
    const [detailLevel, setDetailLevel] = useState(1); // 0=overview, 1=standard, 2=full

    const activeYear = Object.keys(reportData)[0];
    const headers = isYearView
        ? Object.keys(reportData)
        : Object.values(monthHeaders?.[activeYear] || {});

    const toggleView = () => setIsYearView(prev => !prev);

    return (
        <div className="bud-table-wrapper">
            <div className="bud-flex-inline detail-toggle-controls">
                <button onClick={toggleView} className="button button--green">
                    {isYearView ? 'Show Month View' : 'Show Year View'}
                </button>
                <div className="detail-level-buttons">
                    <button className={`detail-level ${detailLevel === 0 ? 'active' : ''}`} onClick={() => setDetailLevel(0)}>Overview</button>
                    <button className={`detail-level ${detailLevel === 1 ? 'active' : ''}`} onClick={() => setDetailLevel(1)}>Standard</button>
                    <button className={`detail-level ${detailLevel === 2 ? 'active' : ''}`} onClick={() => setDetailLevel(2)}>Full</button>
                </div>
            </div>

            <div className="bud-table">
                <div className="bud-table-header">
                    <div className="bud-table-head bud-table-head--first"></div>
                    {headers.map((h, i) => (
                        <div key={i} className="bud-table-head bud-text-center">{h}</div>
                    ))}
                </div>
                {isYearView
                    ? renderYearlyReport(reportData, detailLevel)
                    : renderMonthlyReport(reportData, activeYear, detailLevel)}
            </div>
        </div>
    );
};

function renderYearlyReport(data, detailLevel) {
    const titleKeys = Object.keys(data);
    const rows = Object.keys(data[titleKeys[0]]);

    return rows.map((rowTitle, i) => {
        const line = data[titleKeys[0]][rowTitle];
        if (!shouldRenderLine(line, detailLevel)) return null;

        return (
            <div key={i} className="bud-table-row">
                <div className="bud-table-data">{rowTitle.replace(/---\d+$/, '')}</div>
                {titleKeys.map((year, j) => (
                    <div key={j} className="bud-table-data bud-text-right">
                        {data[year]?.[rowTitle] ?
                            formatFirstNumericValue(data[year][rowTitle]) : ''}
                    </div>
                ))}
                {line?.variation && <div className="bud-table-row bud-global-variation-report-line">
                    <div className="bud-table-data">{line.variation}</div>
                    {titleKeys.map((_, k) => <div key={k} className="bud-table-data bud-text-right">-</div>)}
                </div>}
                {line?.partOfRevenue && <div className="bud-table-row bud-global-variation-report-line" data-revenue="true">
                    <div className="bud-table-data">{line.partOfRevenue}</div>
                    {titleKeys.map((_, k) => <div key={k} className="bud-table-data bud-text-right">-</div>)}
                </div>}
            </div>
        );
    });
}

function renderMonthlyReport(data, activeYear, detailLevel) {
    const yearData = data[activeYear];
    return Object.entries(yearData).map(([lineTitle, lineData], idx) => {
        if (!shouldRenderLine(lineData, detailLevel)) return null;

        return (
            <div key={idx} className="bud-table-row">
                <div className="bud-table-data">{lineTitle.replace(/---\d+$/, '')}</div>
                {Object.entries(lineData).map(([k, v], i) => (
                    typeof v === 'number' ? (
                        <div key={i} className="bud-table-data bud-text-right">
                            {v.toLocaleString()}
                        </div>
                    ) : null
                ))}
                {lineData?.variation && <div className="bud-table-row bud-global-variation-report-line">
                    <div className="bud-table-data">{lineData.variation}</div>
                    {Object.keys(lineData).map((k, i) => (
                        typeof lineData[k] === 'number' ? (
                            <div key={i} className="bud-table-data bud-text-right">-</div>
                        ) : null
                    ))}
                </div>}
                {lineData?.partOfRevenue && <div className="bud-table-row bud-global-variation-report-line" data-revenue="true">
                    <div className="bud-table-data">{lineData.partOfRevenue}</div>
                    {Object.keys(lineData).map((k, i) => (
                        typeof lineData[k] === 'number' ? (
                            <div key={i} className="bud-table-data bud-text-right">-</div>
                        ) : null
                    ))}
                </div>}
            </div>
        );
    });
}

function shouldRenderLine(line, detailLevel) {
    if (!line || typeof line !== 'object') return true;
    const type = line.type || 0;
    if (detailLevel === 0) return [0, 1].includes(type); // overview
    if (detailLevel === 1) return [0, 1, 2, 3].includes(type); // standard
    return true; // full
}

function formatFirstNumericValue(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'number') {
            return obj[key].toLocaleString();
        }
    }
    return '';
}

export default ReportTable;
