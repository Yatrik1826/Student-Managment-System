import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    role: 'student',
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    yearOfStudy: '',
    assignedFaculty: ''
  });
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (formData.role === 'student') {
      fetchFaculties();
    }
  }, [formData.role]);

  const fetchFaculties = async () => {
    try {
      const response = await authAPI.getFaculties();
      setFaculties(response.data.faculties || []);
    } catch (err) {
      setFaculties([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.email.trim()) errors.email = 'Email is required.';
    if (!formData.password.trim()) errors.password = 'Password is required.';

    if (formData.role === 'student') {
      if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number is required.';
      if (!formData.department.trim()) errors.department = 'Department is required.';
      if (!formData.yearOfStudy) errors.yearOfStudy = 'Year of study is required.';
      if (!formData.assignedFaculty) errors.assignedFaculty = 'Please choose a faculty.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        role: formData.role,
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        ...(formData.role === 'student' && {
          rollNumber: formData.rollNumber.trim(),
          department: formData.department.trim(),
          yearOfStudy: Number(formData.yearOfStudy),
          assignedFaculty: formData.assignedFaculty
        })
      };

      const result = await register(payload);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed.');
        if (result.details) {
          setFieldErrors(result.details);
        }
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Student Management Portal</h1>
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={fieldErrors.name ? 'input-error' : ''}
              required
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={fieldErrors.email ? 'input-error' : ''}
              required
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className={fieldErrors.password ? 'input-error' : ''}
              required
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number</label>
                <input
                  id="rollNumber"
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 2024CS001"
                  className={fieldErrors.rollNumber ? 'input-error' : ''}
                  required
                />
                {fieldErrors.rollNumber && <span className="field-error">{fieldErrors.rollNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className={fieldErrors.department ? 'input-error' : ''}
                  required
                />
                {fieldErrors.department && <span className="field-error">{fieldErrors.department}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="yearOfStudy">Year of Study</label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className={fieldErrors.yearOfStudy ? 'input-error' : ''}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                {fieldErrors.yearOfStudy && <span className="field-error">{fieldErrors.yearOfStudy}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="assignedFaculty">Assign Faculty</label>
                <select
                  id="assignedFaculty"
                  name="assignedFaculty"
                  value={formData.assignedFaculty}
                  onChange={handleChange}
                  className={fieldErrors.assignedFaculty ? 'input-error' : ''}
                  required
                >
                  <option value="">Select your faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.assignedFaculty && <span className="field-error">{fieldErrors.assignedFaculty}</span>}
                {faculties.length === 0 && (
                  <p className="field-hint">
                    No faculties are registered yet. Please ask a faculty member to register first.
                  </p>
                )}
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="login-note">
          Already have an account? <Link to="/login">Log in here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Register;
