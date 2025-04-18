import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
    qualifications: '', // Will be converted to array on submit
    subject_specialization: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    date_of_birth: Yup.date().required('Required'),
    gender: Yup.string().oneOf(['male', 'female'], 'Invalid gender').required('Required'),
    years_of_experience: Yup.number().positive('Must be positive').required('Required'),
    phone_number: Yup.string()
      .matches(/^\d+$/, 'Must be only digits')
      .min(10, 'Must be at least 10 digits')
      .required('Required'),
    address: Yup.string().required('Required'),
    qualifications: Yup.string().required('Required'),
    subject_specialization: Yup.string().required('Required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Convert qualifications to array as expected by the backend
      const formattedValues = {
        ...values,
        qualifications: values.qualifications.split(',').map(qual => qual.trim()),
        phone_number: parseInt(values.phone_number), // Convert to number as per schema
        years_of_experience: parseInt(values.years_of_experience), // Convert to number
        role: 'teacher' // Ensure role is set
      };

      console.log('Submitting values:', formattedValues); // Debug log

      const response = await fetch('http://localhost:4000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.Message || 'Registration failed');
      }

      const data = await response.json();

      alert('Teacher registered successfully!');
      resetForm();
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Field
                name="email"
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Field
                name="password"
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <Field
                name="date_of_birth"
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="date_of_birth" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <Field as="select" name="gender" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <Field
                name="years_of_experience"
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="years_of_experience" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <Field
                name="phone_number"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Field
                name="address"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Qualifications</label>
              <Field
                name="qualifications"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="qualifications" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Classes Assigned</label>
              <Field
                name="classes_assigned"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="classes_assigned" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Specialization</label>
              <Field
                name="subject_specialization"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="subject_specialization" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
          >
            {isSubmitting ? 'Registering...' : 'Register Teacher'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;
