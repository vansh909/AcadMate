import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceForm from './AttendanceForm'; 

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showCirculars, setShowCirculars] = useState(false); 
  const [circulars, setCirculars] = useState([]); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [showStudentsList, setShowStudentsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch profile
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

        // Then try to fetch classes
        try {
          const classesResponse = await fetch('http://localhost:4000/teacher/ClassesList', {
            credentials: 'include',
          });

          if (!classesResponse.ok) {
            // Don't throw error, just set empty classes list
            setClassesList([]);
            return;
          }

          const classesData = await classesResponse.json();
          setClassesList(classesData.classes || []);
        } catch (classesError) {
          // If classes fetch fails, don't fail the whole component
          console.warn('Could not fetch classes:', classesError);
          setClassesList([]);
        }

      } catch (err) {
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

  const fetchCirculars = async () => {
    try {
      const response = await fetch('http://localhost:4000/teacher/get-circulars', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch circulars');
      }

      const data = await response.json();
      setCirculars(data || []);
    } catch (err) {
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

  const renderCirculars = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Circulars</h3>
      </div>
      <div className="border-t border-gray-200">
        {circulars.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {circulars.map((circular, index) => (
              <div key={index} className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{circular.title}</h4>
                <p className="text-sm text-gray-600 mb-2">For: {circular.circularFor}</p>
                {/* PDF Viewer Container */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={circular.circularUrl}
                    width="100%"
                    height="600px"
                    title={`Circular ${circular.title}`}
                    className="w-full"
                    style={{ border: 'none' }}
                  />
                </div>
                {/* Fallback download link */}
                <a
                  href={circular.circularUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Open PDF in new tab
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">No circulars available</div>
        )}
      </div>
    </div>
  );

  const renderClasses = () => {
    if (!classesList || classesList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-8 min-h-[300px]">
          <div className="flex flex-col items-center text-center">
            <svg 
              className="w-16 h-16 text-blue-500 mb-4" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to AcadMate!
            </h3>
            <p className="text-gray-600 max-w-md mb-4">
              Your teaching journey is about to begin. The administrator will assign your classes soon.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> Once classes are assigned, they will appear here automatically.
                No need to refresh the page.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
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
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Modern Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-2xl font-bold tracking-wide">Teacher Dashboard</h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <NavButton 
              active={!showProfile && !showAttendance && !showStudentsList && !showCirculars}
              onClick={() => {
                setShowProfile(false);
                setShowAttendance(false);
                setShowStudentsList(false);
                setShowCirculars(false);
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Classes
            </NavButton>

            <NavButton 
              active={showProfile}
              onClick={() => {
                setShowProfile(true);
                setShowAttendance(false);
                setShowStudentsList(false);
                setShowCirculars(false);
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </NavButton>

            {teacherData?.is_class_teacher && (
              <NavButton 
                active={showAttendance}
                onClick={() => {
                  setShowProfile(false);
                  setShowAttendance(true);
                  setShowStudentsList(false);
                  setShowCirculars(false);
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Attendance
              </NavButton>
            )}

            <NavButton 
              active={showCirculars}
              onClick={() => {
                setShowProfile(false);
                setShowAttendance(false);
                setShowStudentsList(false);
                setShowCirculars(true);
                fetchCirculars();
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Circulars
            </NavButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-6">
          {showProfile ? (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-3xl font-bold text-gray-900">Teacher Profile</h2>
              </div>
              {renderProfile()}
            </div>
          ) : showAttendance ? (
            <AttendanceForm teacherData={teacherData} />
          ) : showCirculars ? (
            renderCirculars()
          ) : showStudentsList ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h2 className="text-3xl font-bold text-gray-900">Students List</h2>
                </div>
                <button
                  onClick={() => setShowStudentsList(false)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Classes
                </button>
              </div>
              {renderStudentsList()}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <h2 className="text-3xl font-bold text-gray-900">Your Classes</h2>
              </div>
              {renderClasses()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add this NavButton component at the top of your file
const NavButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
        : 'text-white hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

export default TeacherDashboard;