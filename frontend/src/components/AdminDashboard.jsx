import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from './StudentForm';
import TeacherForm from './TeacherForm';
import TeacherMapping from './TeacherMapping';

const CircularForm = () => {
  const [title, setTitle] = useState('');
  const [circularFor, setCircularFor] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !circularFor) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('circularFor', circularFor);
    formData.append('circular', file);

    try {
      const response = await fetch('http://localhost:4000/admin/circulars', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.Message || 'Failed to upload circular');
      }

      alert('Circular uploaded successfully!');
      setTitle('');
      setCircularFor('');
      setFile(null);
      e.target.reset();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Circular</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Circular Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Circular For
          </label>
          <select
            value={circularFor}
            onChange={(e) => setCircularFor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select audience</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Circular (PDF)
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Uploading...' : 'Upload Circular'}
        </button>
      </form>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('student');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear cookies using document.cookie
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login page
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'student':
        return <StudentForm />;
      case 'teacher':
        return <TeacherForm />;
      case 'mapping':
        return <TeacherMapping />;
      case 'circular':
        return <CircularForm />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Logout
          </button>
        </div>

        <div className="flex flex-wrap border-b mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={`w-1/4 py-3 text-lg font-semibold text-center transition duration-300 ${
              activeTab === 'student'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Register Student
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`w-1/4 py-3 text-lg font-semibold text-center transition duration-300 ${
              activeTab === 'teacher'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Register Teacher
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`w-1/4 py-3 text-lg font-semibold text-center transition duration-300 ${
              activeTab === 'mapping'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Assign Classes
          </button>
          <button
            onClick={() => setActiveTab('circular')}
            className={`w-1/4 py-3 text-lg font-semibold text-center transition duration-300 ${
              activeTab === 'circular'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Post Circular
          </button>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
