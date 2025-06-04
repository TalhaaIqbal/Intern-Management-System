import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import validationSchema from '../utils/ValidationSchema';

const skillsOptions = [
    'JavaScript', 'React', 'ML/AI', 'Python', 'Java', 'C++', 'SQL', 'AWS', 'Docker', 'UI/UX Design', 'Other'
];

function ValidationForm({ initialValues }) {
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    // Here you would typically make an API call to register the user
                    console.log('Form submitted with:', values);
                    
                    // After successful registration, navigate to domain selection
                    navigate('/domain-selection');
                } catch (error) {
                    console.error('Registration failed:', error);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="block font-medium text-gray-700">First Name</label>
                            <Field name="firstName" type="text" className="mt-1 block w-full border p-2 rounded" />
                            <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm" />
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="lastName" className="block font-medium text-gray-700">Last Name</label>
                            <Field name="lastName" type="text" className="mt-1 block w-full border p-2 rounded" />
                            <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                        <Field name="email" type="email" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
                        <Field name="password" type="password" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium text-gray-700">Confirm Password</label>
                        <Field name="confirmPassword" type="password" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block font-medium text-gray-700">Phone Number</label>
                        <Field name="phoneNumber" type="text" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="dob" className="block font-medium text-gray-700">Date of Birth</label>
                        <Field name="dob" type="date" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="dob" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Gender</label>
                        <div role="group" aria-labelledby="gender">
                            <label className="mr-4">
                                <Field type="radio" name="gender" value="Male" />
                                {' '}Male
                            </label>
                            <label className="mr-4">
                                <Field type="radio" name="gender" value="Female" />
                                {' '}Female
                            </label>
                        </div>
                        <ErrorMessage name="gender" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="university" className="block font-medium text-gray-700">University</label>
                        <Field name="university" type="text" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="university" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="degree" className="block font-medium text-gray-700">Degree</label>
                        <Field name="degree" type="text" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="degree" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="yearOfStudy" className="block font-medium text-gray-700">Year of Study</label>
                        <Field name="yearOfStudy" type="number" min="1" max="10" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="yearOfStudy" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Skills</label>
                        <div role="group" aria-labelledby="checkbox-group" className="flex flex-wrap gap-4">
                            {skillsOptions.map(skill => (
                                <label key={skill} className="inline-flex items-center">
                                    <Field
                                        type="checkbox"
                                        name="skills"
                                        value={skill}
                                        className="mr-2"
                                    />
                                    {skill}
                                </label>
                            ))}
                        </div>
                        <ErrorMessage name="skills" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="resume" className="block font-medium text-gray-700">Resume</label>
                        <input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf"
                            onChange={(event) => {
                                setFieldValue('resume', event.currentTarget.files[0]);
                            }}
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="resume" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <label htmlFor="linkedIn" className="block font-medium text-gray-700">LinkedIn Profile URL</label>
                        <Field name="linkedIn" type="url" className="mt-1 block w-full border p-2 rounded" />
                        <ErrorMessage name="linkedIn" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Submitting...' : 'Register'}
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
}

export default ValidationForm;