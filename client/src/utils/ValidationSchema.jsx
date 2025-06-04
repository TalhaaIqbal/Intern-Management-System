import * as Yup from 'yup';

const SUPPORTED_RESUME_FORMATS = [
    'application/pdf',
];

const validationSchema = Yup.object({
    firstName: Yup.string()
        .min(2, 'First Name must be at least 2 characters')
        .max(50, 'First Name cannot exceed 50 characters')
        .required('First Name is required'),

    lastName: Yup.string()
        .min(2, 'Last Name must be at least 2 characters')
        .max(50, 'Last Name cannot exceed 50 characters')
        .required('Last Name is required'),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),

    phoneNumber: Yup.string()
        .matches(/^[0-9+\-() ]+$/, 'Phone Number is not valid')
        .required('Phone Number is required'),

    dob: Yup.date()
        .max(new Date(), 'Date of birth cannot be in the future')
        .required('Date of birth is required'),

    gender: Yup.string()
        .oneOf(['Male', 'Female', 'Other'], 'Select a valid gender')
        .required('Gender is required'),

    university: Yup.string()
        .min(2, 'University name must be at least 2 characters')
        .required('University is required'),

    degree: Yup.string()
        .min(2, 'Degree must be at least 2 characters')
        .required('Degree is required'),

    yearOfStudy: Yup.number()
        .typeError('Year of Study must be a number')
        .min(1, 'Year of Study must be at least 1')
        .max(10, 'Year of Study cannot exceed 10')
        .required('Year of Study is required'),

    skills: Yup.array()
        .of(Yup.string().min(2, 'Skill must be at least 2 characters'))
        .min(1, 'At least one skill is required')
        .required('Skills are required'),

    resume: Yup.mixed()
        .required('Resume is required')
        .test(
            'fileFormat',
            'Unsupported file format. Please upload PDF or Word document',
            value => value && SUPPORTED_RESUME_FORMATS.includes(value.type)
        ),

    linkedIn: Yup.string()
        .url('Invalid LinkedIn URL')
        .required('LinkedIn profile is required'),
});

export default validationSchema;