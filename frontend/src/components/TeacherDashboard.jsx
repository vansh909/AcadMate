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
  const [showAssignments, setShowAssignments] = useState(false);
  const [circulars, setCirculars] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentName, setAssignmentName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [showStudentsList, setShowStudentsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teacher profile
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

        // Fetch classes
        const classesResponse = await fetch('http://localhost:4000/teacher/ClassesList', {
          credentials: 'include',
        });

        if (!classesResponse.ok) {
          throw new Error('Failed to fetch classes');
        }

        const classesData = await classesResponse.json();
        setClassesList(classesData.classes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchAssignments(); // Fetch assignments on component mount
  }, [navigate]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:4000/assignment/assignmentList', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      alert('Please select a class before submitting.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('assignmentName', assignmentName);
    formData.append('endDate', endDate);
    formData.append('file', file);
    formData.append('class_name', selectedClass);

    try {
      const response = await fetch('http://localhost:4000/assignment/addAssignment', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload assignment');
      }

      alert('Assignment uploaded successfully!');
      setAssignmentName('');
      setEndDate('');
      setFile(null);
      setSelectedClass('');
      fetchAssignments(); // Refresh the assignments list
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAssignments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Assignment List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Uploaded Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li key={assignment._id} className="p-4 border rounded-md">
                <p className="font-medium">Name: {assignment.name}</p>
                <p>End Date: {assignment.endDate}</p>
                <p>Class: {assignment.classAssigned?.class_name || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No assignments uploaded yet.</p>
        )}
      </div>

      {/* Assignment Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload Assignment</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Name
            </label>
            <input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter assignment name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a class
              </option>
              {classesList.map((classItem) => (
                <option key={classItem.classId._id} value={classItem.classId.class_name}>
                  {classItem.classId.class_name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Assignment'}
          </button>
        </form>
      </div>
    </div>
  );

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

  const renderCirculars = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Circulars</h3>
      </div>
      <div className="border-t border-gray-200">
        {circulars.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {circulars.map((circular, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <h4 className="text-sm font-medium text-gray-900">{circular.title}</h4>
                <p className="text-sm text-gray-600">For: {circular.circularFor}</p>
                <a
                  href={circular.circularUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Circular
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">No circulars available</div>
        )}
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => {
                setShowProfile(false);
                setShowAttendance(false);
                setShowCirculars(false);
                setShowAssignments(false);
                setShowStudentsList(false);
              }}
              className={`px-4 py-2 rounded-md ${
                !showProfile && !showAttendance && !showCirculars && !showAssignments && !showStudentsList
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-700'
              }`}
            >
              Classes
            </button>
            <button
              onClick={() => {
                setShowProfile(true);
                setShowAttendance(false);
                setShowCirculars(false);
                setShowAssignments(false);
                setShowStudentsList(false);
              }}
              className={`px-4 py-2 rounded-md ${
                showProfile ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'
              }`}
            >
              Profile
            </button>
            {teacherData?.is_class_teacher && (
              <button
                onClick={() => {
                  setShowProfile(false);
                  setShowAttendance(true);
                  setShowCirculars(false);
                  setShowAssignments(false);
                  setShowStudentsList(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  showAttendance ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'
                }`}
              >
                Attendance
              </button>
            )}
            <button
              onClick={() => {
                setShowProfile(false);
                setShowAttendance(false);
                setShowCirculars(true);
                setShowAssignments(false);
                setShowStudentsList(false);
                fetchCirculars();
              }}
              className={`px-4 py-2 rounded-md ${
                showCirculars ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'
              }`}
            >
              Circulars
            </button>
            <button
              onClick={() => {
                setShowProfile(false);
                setShowAttendance(false);
                setShowCirculars(false);
                setShowAssignments(true);
                setShowStudentsList(false);
              }}
              className={`px-4 py-2 rounded-md ${
                showAssignments ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'
              }`}
            >
              Assignments
            </button>
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
          ) : showCirculars ? (
            renderCirculars()
          ) : showAssignments ? (
            renderAssignments()
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