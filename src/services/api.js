export async function generateReportData(report, fromYear, toYear, lastMonth, budget) {
    const response = await fetch(Routing.generate("budgeto_analysis_generate_report"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ report, fromYear, toYear, lastMonth, budget }),
    });

    if (!response.ok) throw new Error("Report generation failed");
    return response.json();
}
