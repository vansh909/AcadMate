import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const TeacherForm = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    date_of_birth: '',
    gender: '',
    years_of_experience: '',
    phone_number: '',
    address: '',
    is_class_teacher: false,
    qualifications: '',
    classes_assigned: '',
    subject_specialization: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    date_of_birth: Yup.date().required('Required'),
    gender: Yup.string().required('Required'),
    years_of_experience: Yup.number().required('Required'),
    phone_number: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    qualifications: Yup.string().required('Required'),
    classes_assigned: Yup.string().required('Required'),
    subject_specialization: Yup.string().required('Required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/user/signup', values);
      alert('Teacher registered successfully!');
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Field
                name="name"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Add other fields similarly */}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Registering...' : 'Register Teacher'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;