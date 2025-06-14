import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import validationSchema from '../utils/ValidationSchema';

const skillsOptions = [
    'JavaScript',
    'React',
    'ML/AI',
    'Python',
    'Java',
    'C++',
    'SQL',
    'AWS',
    'Docker',
    'UI/UX Design',
    'Other'
];

function ValidationForm({ initialValues }) {
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const formData = new FormData();

                    formData.append('firstName', values.firstName);
                    formData.append('lastName', values.lastName);
                    formData.append('email', values.email);
                    formData.append('password', values.password);
                    formData.append('confirmPassword', values.confirmPassword);
                    formData.append('phoneNumber', values.phoneNumber);
                    formData.append('dob', values.dob);
                    formData.append('gender', values.gender);
                    formData.append('university', values.university);
                    formData.append('degree', values.degree);
                    formData.append('yearOfStudy', values.yearOfStudy);

                    formData.append('skills', JSON.stringify(values.skills));

                    if (values.resume) {
                        formData.append('resume', values.resume);
                    }

                    formData.append('linkedIn', values.linkedIn);

                    console.log('Submitting formData:', [...formData.entries()]);

                    const res = await axios.post(
                        'http://localhost:5000/api/register',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    const user = res.data.user;
                    localStorage.setItem("userEmail", user.email);
                    console.log("User Email:", user);
                    navigate('/domain-selection');
                } catch (error) {
                    console.error('Registration failed:', error.response?.data?.message || error.message);
                    alert(error.response?.data?.message || 'Registration failed');
                } finally {
                    setSubmitting(false);
                }
            }}

        >
            {({ setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                    {/* First Name & Last Name */}
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="block font-medium text-gray-700">
                                First Name
                            </label>
                            <Field
                                name="firstName"
                                type="text"
                                className="mt-1 block w-full border p-2 rounded"
                            />
                            <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm" />
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="lastName" className="block font-medium text-gray-700">
                                Last Name
                            </label>
                            <Field
                                name="lastName"
                                type="text"
                                className="mt-1 block w-full border p-2 rounded"
                            />
                            <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium text-gray-700">
                            Email
                        </label>
                        <Field
                            name="email"
                            type="email"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block font-medium text-gray-700">
                            Password
                        </label>
                        <Field
                            name="password"
                            type="password"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <Field
                            name="confirmPassword"
                            type="password"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-600 text-sm"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block font-medium text-gray-700">
                            Phone Number
                        </label>
                        <Field
                            name="phoneNumber"
                            type="text"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="text-red-600 text-sm"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="dob" className="block font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <Field
                            name="dob"
                            type="date"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="dob" component="div" className="text-red-600 text-sm" />
                    </div>

                    {/* Gender */}
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

                    {/* University */}
                    <div>
                        <label htmlFor="university" className="block font-medium text-gray-700">
                            University
                        </label>
                        <Field
                            name="university"
                            type="text"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="university" component="div" className="text-red-600 text-sm" />
                    </div>

                    {/* Degree */}
                    <div>
                        <label htmlFor="degree" className="block font-medium text-gray-700">
                            Degree
                        </label>
                        <Field
                            name="degree"
                            type="text"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="degree" component="div" className="text-red-600 text-sm" />
                    </div>

                    {/* Year of Study */}
                    <div>
                        <label htmlFor="yearOfStudy" className="block font-medium text-gray-700">
                            Year of Study
                        </label>
                        <Field
                            name="yearOfStudy"
                            type="number"
                            min="1"
                            max="10"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage
                            name="yearOfStudy"
                            component="div"
                            className="text-red-600 text-sm"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block font-medium text-gray-700">Skills</label>
                        <div role="group" aria-labelledby="checkbox-group" className="flex flex-wrap gap-4">
                            {skillsOptions.map((skill) => (
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

                    {/* Resume Upload */}
                    <div>
                        <label htmlFor="resume" className="block font-medium text-gray-700">
                            Resume
                        </label>
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

                    {/* LinkedIn URL */}
                    <div>
                        <label htmlFor="linkedIn" className="block font-medium text-gray-700">
                            LinkedIn Profile URL
                        </label>
                        <Field
                            name="linkedIn"
                            type="url"
                            className="mt-1 block w-full border p-2 rounded"
                        />
                        <ErrorMessage name="linkedIn" component="div" className="text-red-600 text-sm" />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Submitting...' : 'Register'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default ValidationForm;