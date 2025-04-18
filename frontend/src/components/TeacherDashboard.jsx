import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teacher profile data
        const profileResponse = await fetch('http://localhost:4000/teacher/profile', {
          credentials: 'include'
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch teacher profile');
        }

        const profileData = await profileResponse.json();
        setTeacherData(profileData);

        // Fetch students list if teacher is a class teacher
        const studentsResponse = await fetch('http://localhost:4000/teacher/StudentList', {
          credentials: 'include'
        });

        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          setStudentsList(studentsData.students || []);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Teacher Dashboard</h1>
              
              {teacherData && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p className="font-medium">{teacherData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium">{teacherData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Subject Specialization:</p>
                      <p className="font-medium">{teacherData.subject_specialization}</p>
                    </div>
                  </div>
                </div>
              )}

              {studentsList.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">My Class Students</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          {/* Add more table headers as needed */}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentsList.map((student, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {student.student_id.name}
                              </div>
                            </td>
                            {/* Add more student information as needed */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;