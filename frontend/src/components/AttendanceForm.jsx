import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AttendanceForm = ({ teacherData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'dd-MM-yy'));
  const [className, setClassName] = useState('');

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
        // Set class name if available in response
        if (data.className) setClassName(data.className);
        else if (teacherData?.class_name) setClassName(teacherData.class_name);
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

    if (!className) {
      alert('Class name is missing!');
      return;
    }

    try {
      const attendanceData = {
        className: className,
        date: date,
        attendance: attendance
      };

      const response = await fetch('http://localhost:4000/teacher/Attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(attendanceData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.Message || 'Failed to submit attendance');
      }

      const data = await response.json();
      alert(data.Message);
    } catch (error) {
      alert(`Failed to submit attendance: ${error.message}`);
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
      {/* Display class name and today's date */}
      <div className="mb-4">
        <div className="text-lg font-semibold text-blue-700">
          Class Name: <span className="font-bold">{className || teacherData.class_name || 'N/A'}</span>
        </div>
        <div className="text-lg font-semibold text-blue-700">
          Date: <span className="font-bold">{date}</span>
        </div>
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
