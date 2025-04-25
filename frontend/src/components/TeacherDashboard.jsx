import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceForm from './AttendanceForm'; // Add this import

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [showStudentsList, setShowStudentsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch('http://localhost:4000/teacher/profile', {
          credentials: 'include',
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch teacher profile');
        }

        const profileData = await profileResponse.json();
        setTeacherData(profileData.teacher);

        const classesResponse = await fetch('http://localhost:4000/teacher/ClassesList', {
          credentials: 'include',
        });

        if (!classesResponse.ok) {
          throw new Error('Failed to fetch classes');
        }

        const classesData = await classesResponse.json();
        setClassesList(classesData.classes || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchStudentsList = async () => {
    try {
      const response = await fetch('http://localhost:4000/teacher/StudentList', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students list');
      }

      const data = await response.json();
      setStudentsList(data.students);
      setShowStudentsList(true);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    }
  };

  const renderStudentsList = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Students List
        </h3>
        <button
          onClick={() => setShowStudentsList(false)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Classes
        </button>
      </div>
      <div className="border-t border-gray-200">
        {studentsList.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                {/* Add more columns as needed */}
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
                  {/* Add more student details as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4">No students found</div>
        )}
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {classesList.map((classItem, index) => (
        <div
          key={index}
          onClick={() => {
            if (teacherData?.is_class_teacher) {
              fetchStudentsList();
            }
          }}
          className={`bg-white shadow-lg rounded-lg p-6 border border-gray-200 
            ${teacherData?.is_class_teacher ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}`}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Class: {classItem.classId.class_name}
          </h3>
          <p className="text-gray-600">
            <strong>Subject:</strong> {classItem.subjectId.subjectName}
          </p>
          <p className="text-gray-600">
            <strong>Total Students:</strong> {classItem.classId.total_students}
          </p>
          {teacherData?.is_class_teacher && (
            <p className="text-sm text-blue-600 mt-2">
              Click to view students list
            </p>
          )}
        </div>
      ))}
    </div>
  );

  // Add renderProfile function
  const renderProfile = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Teacher Information
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.teacherId?.name}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.teacherId?.email}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(teacherData?.date_of_birth).toLocaleDateString()}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.gender}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.phone_number}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.address}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Years of Experience</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.years_of_experience} years
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Qualifications</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.qualifications?.join(', ')}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Class Teacher Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {teacherData?.is_class_teacher ? 'Yes' : 'No'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

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
      <nav className="bg-blue-600 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => {
                setShowProfile(false);
                setShowAttendance(false);
              }}
              className={`px-4 py-2 rounded-md ${!showProfile && !showAttendance ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
            >
              Classes
            </button>
            <button
              onClick={() => {
                setShowProfile(true);
                setShowAttendance(false);
              }}
              className={`px-4 py-2 rounded-md ${showProfile ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
            >
              Profile
            </button>
            {teacherData?.is_class_teacher && (
              <button
                onClick={() => {
                  setShowProfile(false);
                  setShowAttendance(true);
                }}
                className={`px-4 py-2 rounded-md ${showAttendance ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
              >
                Attendance
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showProfile ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Teacher Profile</h2>
              {renderProfile()}
            </>
          ) : showAttendance ? (
            <AttendanceForm teacherData={teacherData} />
          ) : showStudentsList ? (
            renderStudentsList()
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Classes You Teach</h2>
              {renderClasses()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;