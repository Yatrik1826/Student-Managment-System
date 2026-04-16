import { useState } from 'react';
import { studentAPI } from '../services/api';
import '../styles/AddStudent.css';

const AddStudent = ({ onStudentAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    yearOfStudy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.rollNumber.trim()) {
      errors.rollNumber = 'Roll number is required';
    } else if (formData.rollNumber.length < 3) {
      errors.rollNumber = 'Roll number must be at least 3 characters';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.yearOfStudy) {
      errors.yearOfStudy = 'Year of study is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await studentAPI.createStudent(formData);

      // Call the callback to refresh the student list
      if (onStudentAdded) {
        onStudentAdded(response.data.student);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        department: '',
        yearOfStudy: ''
      });

      // Close modal after successful submission
      onCancel();
    } catch (error) {
      if (error.response?.data?.errors) {
        // Backend validation errors
        setValidationErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.message || 'Failed to add student');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-student-modal">
        <div className="modal-header">
          <h3>Add New Student</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              className={validationErrors.name ? 'input-error' : ''}
            />
            {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={validationErrors.email ? 'input-error' : ''}
            />
            {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className={validationErrors.password ? 'input-error' : ''}
            />
            {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number *</label>
            <input
              id="rollNumber"
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g., 2024CS001"
              className={validationErrors.rollNumber ? 'input-error' : ''}
            />
            {validationErrors.rollNumber && <span className="field-error">{validationErrors.rollNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className={validationErrors.department ? 'input-error' : ''}
            />
            {validationErrors.department && <span className="field-error">{validationErrors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="yearOfStudy">Year of Study *</label>
            <select
              id="yearOfStudy"
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={handleChange}
              className={validationErrors.yearOfStudy ? 'input-error' : ''}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            {validationErrors.yearOfStudy && <span className="field-error">{validationErrors.yearOfStudy}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding Student...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;