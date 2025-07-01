export interface HealthDataRow {
  timestamp: string;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  oxygenSaturation: number;
  temperature: number;
  status: string;
  notes: string;
}

export class HealthDataExporter {
  static generateSampleData(rows: number = 50): HealthDataRow[] {
    const data: HealthDataRow[] = [];
    const now = new Date();

    for (let i = 0; i < rows; i++) {
      // Generate timestamp going backwards in time (every 30 minutes)
      const timestamp = new Date(now.getTime() - (i * 30 * 60 * 1000));
      
      // Generate realistic vital signs with some variation
      const baseHeartRate = 72;
      const baseSystolic = 120;
      const baseDiastolic = 80;
      const baseO2 = 98;
      const baseTemp = 98.6;

      const heartRate = Math.max(60, Math.min(100, baseHeartRate + (Math.random() * 20 - 10)));
      const systolicBP = Math.max(90, Math.min(140, baseSystolic + (Math.random() * 20 - 10)));
      const diastolicBP = Math.max(60, Math.min(90, baseDiastolic + (Math.random() * 15 - 7)));
      const oxygenSaturation = Math.max(95, Math.min(100, baseO2 + (Math.random() * 4 - 2)));
      const temperature = Math.max(97, Math.min(100, baseTemp + (Math.random() * 2 - 1)));

      // Determine status based on vitals
      let status = 'Normal';
      const notes: string[] = [];

      if (heartRate < 60 || heartRate > 100) {
        status = 'Warning';
        notes.push(heartRate < 60 ? 'Bradycardia' : 'Tachycardia');
      }

      if (systolicBP > 130 || diastolicBP > 85) {
        status = 'Warning';
        notes.push('Elevated BP');
      }

      if (oxygenSaturation < 95) {
        status = 'Critical';
        notes.push('Low O2');
      }

      if (temperature > 99.5 || temperature < 97) {
        status = status === 'Critical' ? 'Critical' : 'Warning';
        notes.push(temperature > 99.5 ? 'Fever' : 'Hypothermia');
      }

      data.push({
        timestamp: timestamp.toLocaleString(),
        heartRate: Math.round(heartRate),
        systolicBP: Math.round(systolicBP),
        diastolicBP: Math.round(diastolicBP),
        oxygenSaturation: Math.round(oxygenSaturation * 10) / 10,
        temperature: Math.round(temperature * 10) / 10,
        status,
        notes: notes.join(', ') || 'No issues detected'
      });
    }

    return data.reverse(); // Show oldest to newest
  }

  static exportToCSV(data: HealthDataRow[], filename: string = 'health-data-export'): void {
    const headers = [
      'Timestamp',
      'Heart Rate (BPM)',
      'Systolic BP (mmHg)',
      'Diastolic BP (mmHg)',
      'Oxygen Saturation (%)',
      'Temperature (°F)',
      'Status',
      'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.timestamp}"`,
        row.heartRate,
        row.systolicBP,
        row.diastolicBP,
        row.oxygenSaturation,
        row.temperature,
        `"${row.status}"`,
        `"${row.notes}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  static exportToExcel(data: HealthDataRow[], filename: string = 'health-data-export'): void {
    // Create a simple Excel-compatible format using HTML table
    const headers = [
      'Timestamp',
      'Heart Rate (BPM)',
      'Systolic BP (mmHg)',
      'Diastolic BP (mmHg)',
      'Oxygen Saturation (%)',
      'Temperature (°F)',
      'Status',
      'Notes'
    ];

    let excelContent = `
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th style="background-color: #4F46E5; color: white; padding: 8px; border: 1px solid #ccc;">${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ccc;">${row.timestamp}</td>
              <td style="padding: 6px; border: 1px solid #ccc; text-align: center;">${row.heartRate}</td>
              <td style="padding: 6px; border: 1px solid #ccc; text-align: center;">${row.systolicBP}</td>
              <td style="padding: 6px; border: 1px solid #ccc; text-align: center;">${row.diastolicBP}</td>
              <td style="padding: 6px; border: 1px solid #ccc; text-align: center;">${row.oxygenSaturation}</td>
              <td style="padding: 6px; border: 1px solid #ccc; text-align: center;">${row.temperature}</td>
              <td style="padding: 6px; border: 1px solid #ccc; text-align: center; background-color: ${
                row.status === 'Critical' ? '#FEE2E2' : 
                row.status === 'Warning' ? '#FEF3C7' : '#ECFDF5'
              };">${row.status}</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${row.notes}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}