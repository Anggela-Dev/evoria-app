import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AttendancePage() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
  fetch(`http://localhost:5000/api/attendance?event_id=${id}`)
    .then(res => res.json())
    .then(data => setAttendees(data))
    .catch(err => console.log(err));
}, [id]);


  return (
    <div className="container mt-4">
      <h2>Daftar Kehadiran</h2>
      <p>Event ID: {id}</p>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>NIM / ID</th>
            <th>Waktu Scan</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.username}</td>
              <td>{a.user_id}</td>
              <td>{new Date(a.scan_time).toLocaleString("id-ID")}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendancePage;
