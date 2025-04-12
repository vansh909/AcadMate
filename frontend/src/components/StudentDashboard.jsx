import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('/student/profile');
        setStudentData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchStudentData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
          
          {studentData ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Student Information
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {studentData.name}
                    </dd>
                  </div>
                  {/* Add more student information fields */}
                </dl>
              </div>
            </div>
          ) : (
            <div className="text-center">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;