import React from 'react';
import ValidationForm from '../components/ValidationForm';

const Register = () => {
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        university: '',
        degree: '',
        yearOfStudy: '',
        skills: [],
        resume: null,
        linkedIn: '',
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] pt-16 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-800">
                        Register to your account
                    </h2>
                </div>
                <ValidationForm initialValues={initialValues} />
            </div>
        </div>
    );
};

export default Register;