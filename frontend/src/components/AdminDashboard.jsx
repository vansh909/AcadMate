import React, { useState } from 'react';
import StudentForm from './StudentForm';
import TeacherForm from './TeacherForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('student');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'student':
        return <StudentForm />;
      case 'teacher':
        return <TeacherForm />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Admin Dashboard</h1>

        <div className="flex border-b mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={`w-1/2 py-3 text-lg font-semibold text-center transition duration-300 ${
              activeTab === 'student'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Register Student
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`w-1/2 py-3 text-lg font-semibold text-center transition duration-300 ${
              activeTab === 'teacher'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Register Teacher
          </button>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
