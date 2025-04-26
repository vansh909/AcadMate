import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TeacherMapping = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, subjectsRes, classesRes] = await Promise.all([
          fetch('http://localhost:4000/admin/teachers', {
            credentials: 'include'
          }),
          fetch('http://localhost:4000/admin/subjects', {
            credentials: 'include'
          }),
          fetch('http://localhost:4000/admin/classes', {
            credentials: 'include'
          })
        ]);

        if (!teachersRes.ok || !subjectsRes.ok || !classesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const teachersData = await teachersRes.json();
        const subjectsData = await subjectsRes.json();
        const classesData = await classesRes.json();

        // Log the data to see what we're getting
        console.log('Teachers data:', teachersData);

        setTeachers(teachersData.teachers || []);
        setSubjects(subjectsData.subjects || []);
        setClasses(classesData.classes || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object({
    teacherName: Yup.string().required('Teacher is required'),
    subjectName: Yup.string().required('Subject is required'),
    className: Yup.string().required('Class is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      const response = await fetch('http://localhost:4000/admin/mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || 'Failed to assign teacher');
      }

      alert('Teacher assigned successfully!');
      resetForm();
    } catch (error) {
      setFieldError('general', error.message);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Teacher to Class</h2>
      
      <Formik
        initialValues={{
          teacherName: '',
          subjectName: '',
          className: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-6">
            {errors.general && (
              <div className="text-red-600 text-sm">{errors.general}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
              <Field
                as="select"
                name="teacherName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Choose a teacher</option>
                {teachers.map((teacher) => (
                  // Update this part to correctly access the teacher name
                  <option key={teacher._id} value={teacher.teacherId.name}>
                    {teacher.teacherId.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="teacherName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Subject</label>
              <Field
                as="select"
                name="subjectName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Choose a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.subjectName}>
                    {subject.subjectName}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="subjectName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Class</label>
              <Field
                as="select"
                name="className"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.class_name}>
                    {cls.class_name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="className" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TeacherMapping;