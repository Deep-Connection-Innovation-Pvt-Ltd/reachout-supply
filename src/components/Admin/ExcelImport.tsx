// src/components/Admin/ExcelImport.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

type Row = { [k: string]: any };

export default function ExcelImport() {
    const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: Row[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      console.log("Preview JSON:", json);

      // Now json is an array of objects with keys = Excel headers
      setPreview(json.slice(0, 50)); // preview first 50 rows
    };
    reader.readAsArrayBuffer(file);
  };

  // Adjust mapping from Excel column names to DB columns here
  const mapRowToDb = (row: Row) => {
    return {
      // Excel header "Name" -> DB column `name`
      name: row['Name'] ?? row['name'] ?? '',
      email: row['Email'] ?? row['email'] ?? '',
      phone: row['Phone'] ?? row['phone'] ?? '',
      job_id: row['Job ID'] ?? row['job_id'] ?? null,
      // add more mappings as needed
    };
  };


  const handleImport = async () => {
    if (!preview.length) {
      setMessage('No rows to import. Please load an Excel file first.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = preview.map(mapRowToDb);
      // Filter out empty rows or rows missing required columns if desired
      const cleaned = payload.filter(r => r.email || r.name); // example
      console.log("Sending payload:", cleaned);


      const res = await fetch('http://localhost/reachout-supply-pri/reachout-supply/backend/import_applications.php', {
      // const res = await fetch('http://localhost/reachout-supply-pri/reachout-supply/backend/import_applications.php', {
       const res = await fetch('/professional/backend/import_applications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // include session cookies if needed
        body: JSON.stringify({ rows: cleaned }),
      });

      const data = await res.json();
      console.log('excel import data is',data);
      if (!res.ok) {
        setMessage(`Import failed: ${data?.message ?? res.statusText}`);
      } else {
        setMessage(`Imported ${data.inserted ?? 0} rows successfully.`);
        setPreview([]); // clear preview if you want
        if (fileRef.current) fileRef.current.value = '';
      }
    } catch (err: any) {
      setMessage('Error: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
         <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Excel Import</h2>
      <button
        onClick={() => navigate(-1)} // Go back to previous page
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        &larr; Back to Dashboard
      </button>
    </div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="mb-3"
      />

      {preview.length > 0 && (
        <>
          <div className="mb-3">
            <strong>Preview ({preview.length} rows)</strong>
            <div style={{ maxHeight: 240, overflow: 'auto', border: '1px solid #eee', marginTop: 6 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {Object.keys(preview[0]).map((h) => (
                      <th key={h} style={{ borderBottom: '1px solid #ddd', padding: 6, textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, idx) => (
                    <tr key={idx}>
                      {Object.keys(preview[0]).map((h) => (
                        <td key={h} style={{ padding: 6 }}>{String(r[h] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button onClick={handleImport} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Importing...' : 'Import to Server'}
          </button>
        </>
      )}

      {message && <div className="mt-3">{message}</div>}
    </div>
  );
}
