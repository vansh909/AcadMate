import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AttendanceForm = ({ teacherData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'dd-MM-yy'));

  // Fetch students list for the class teacher
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:4000/teacher/StudentList', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(data.students);
        setAttendance(data.students.map(student => ({
          studentId: student._id,
          status: 'present'
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (teacherData?.is_class_teacher) {
      fetchStudents();
    }
  }, [teacherData]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => 
      prev.map(a => 
        a.studentId === studentId ? { ...a, status } : a
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/teacher/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          className: teacherData.class_name,
          date,
          attendance
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.Message || 'Failed to submit attendance');
      }

      alert('Attendance marked successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (!teacherData?.is_class_teacher) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Only class teachers can mark attendance.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date (DD-MM-YY)
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="DD-MM-YY"
            pattern="\d{2}-\d{2}-\d{2}"
            required
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.student_id.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={attendance.find(a => a.studentId === student._id)?.status || 'present'}
                      onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Attendance
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;