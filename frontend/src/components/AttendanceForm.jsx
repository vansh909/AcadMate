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
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <svg 
          className="w-8 h-8 text-blue-600 mr-3" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <h2 className="text-3xl font-bold text-gray-900">Mark Attendance</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/50 rounded-xl p-6 shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="DD-MM-YY"
            pattern="\d{2}-\d{2}-\d{2}"
            required
          />
        </div>

        <div className="bg-white/50 rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-blue-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">
                          {student.student_id.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.student_id.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={attendance.find(a => a.studentId === student._id)?.status || 'present'}
                      onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                      className={`rounded-full text-sm font-medium px-4 py-2 border-0 focus:ring-2 focus:ring-blue-500
                        ${
                          attendance.find(a => a.studentId === student._id)?.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
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

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg 
            font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;