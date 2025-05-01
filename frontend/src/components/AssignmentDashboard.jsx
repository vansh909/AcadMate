import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AssignmentDashboard = () => {
  const [assignmentName, setAssignmentName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]); // State to store uploaded assignments

  useEffect(() => {
    // Fetch the list of classes the teacher teaches
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:4000/teacher/ClassesList', {
          credentials: 'include',
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            throw new Error('Received an HTML response instead of JSON. Check the backend.');
          }
          throw new Error('Failed to fetch classes');
        }

        const data = await response.json();
        setClasses(data.classes || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClasses();
    fetchAssignments(); // Fetch assignments on component mount
  }, []);

  const fetchAssignments = async () => {
    // Fetch the list of uploaded assignments
    try {
      const response = await fetch('http://localhost:4000/assignment/assignmentList', {
        credentials: 'include',
      });

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
    formData.append('class_name', selectedClass); // Send class_name instead of classId

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
      fetchAssignments(); // Refresh the assignments list after upload
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assignment Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage and track class assignments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assignments List */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <svg 
                className="w-8 h-8 text-blue-500 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">Uploaded Assignments</h2>
            </div>

            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div 
                    key={assignment._id} 
                    className="bg-white/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                            Due: {format(new Date(assignment.endDate), 'PPP')}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                              />
                            </svg>
                            Class: {assignment.classAssigned?.class_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {assignment.fileUrl && (
                        <a 
                          href={assignment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p className="mt-2 text-gray-600">No assignments uploaded yet</p>
              </div>
            )}
          </div>

          {/* Upload Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <svg 
                className="w-8 h-8 text-blue-500 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">Upload Assignment</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Name
                </label>
                <input
                  type="text"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter assignment name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                    file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="" disabled>Select a class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.classId._id} value={classItem.classId.class_name}>
                      {classItem.classId.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg 
                  font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : 'Upload Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDashboard;