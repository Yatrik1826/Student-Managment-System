import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import '../styles/AddStudent.css';

const EditStudent = ({ student, onStudentUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    yearOfStudy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        password: '',
        department: student.department || '',
        yearOfStudy: student.yearOfStudy || ''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
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
      const updateData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        yearOfStudy: formData.yearOfStudy
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await studentAPI.updateStudent(student.id, updateData);

      if (onStudentUpdated) {
        onStudentUpdated(response.data.student);
      }

      onCancel();
    } catch (error) {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.message || 'Failed to update student');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-student-modal">
        <div className="modal-header">
          <h3>Edit Student</h3>
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
              className={validationErrors.email ? 'input-error' : ''}
            />
            {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={validationErrors.password ? 'input-error' : ''}
              placeholder="Leave blank to keep current password"
            />
            {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
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
              {loading ? 'Updating...' : 'Update Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
