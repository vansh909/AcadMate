import React, { useState, useEffect } from 'react';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-8">
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
                  {classes.map((classItem) => (
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
      </div>
    </div>
  );
};

export default AssignmentDashboard;