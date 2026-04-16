import { useState } from 'react';
import { studentAPI } from '../services/api';

const AddStudent = ({ onStudentAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    course: '',
    sem: '',
    section: '',
    phone: ''
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

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
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

    if (!formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    } else if (formData.studentId.length < 3) {
      errors.studentId = 'Student ID must be at least 3 characters';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.course.trim()) {
      errors.course = 'Course is required';
    }

    const sem = parseInt(formData.sem);
    if (!formData.sem || isNaN(sem) || sem < 1 || sem > 8) {
      errors.sem = 'Semester must be a number between 1 and 8';
    }

    if (formData.phone && !/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid phone number';
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
      const studentData = {
        ...formData,
        sem: parseInt(formData.sem)
      };

      const response = await studentAPI.createStudent(studentData);

      // Call the callback to refresh the student list
      if (onStudentAdded) {
        onStudentAdded(response.data.student);
      }

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        studentId: '',
        department: '',
        course: '',
        sem: '',
        section: '',
        phone: ''
      });

      alert('Student added successfully!');
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
    <div className="add-student-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Student</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          {error && <div className="error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={validationErrors.fullName ? 'error' : ''}
              />
              {validationErrors.fullName && <span className="field-error">{validationErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={validationErrors.password ? 'error' : ''}
              />
              {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
            </div>

            <div className="form-group">
              <label>Student ID *</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={validationErrors.studentId ? 'error' : ''}
              />
              {validationErrors.studentId && <span className="field-error">{validationErrors.studentId}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={validationErrors.department ? 'error' : ''}
              />
              {validationErrors.department && <span className="field-error">{validationErrors.department}</span>}
            </div>

            <div className="form-group">
              <label>Course *</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={validationErrors.course ? 'error' : ''}
              />
              {validationErrors.course && <span className="field-error">{validationErrors.course}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Semester *</label>
              <select
                name="sem"
                value={formData.sem}
                onChange={handleChange}
                className={validationErrors.sem ? 'error' : ''}
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
              {validationErrors.sem && <span className="field-error">{validationErrors.sem}</span>}
            </div>

            <div className="form-group">
              <label>Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., A, B, C"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +1-234-567-8900"
                className={validationErrors.phone ? 'error' : ''}
              />
              {validationErrors.phone && <span className="field-error">{validationErrors.phone}</span>}
            </div>
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