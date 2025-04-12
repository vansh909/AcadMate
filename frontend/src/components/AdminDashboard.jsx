import React, { useState } from 'react';
import StudentForm from './StudentForm';
import TeacherForm from './TeacherForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === 'student'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('student')}
              >
                Register Student
              </button>
              <button
                className={`${
                  activeTab === 'teacher'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('teacher')}
              >
                Register Teacher
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'student' ? <StudentForm /> : <TeacherForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;