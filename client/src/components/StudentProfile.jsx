import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import '../styles/StudentProfile.css';

const StudentProfile = ({ studentId, facultyId, onClose }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudentById(studentId);
      setStudent(response.data.student);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="profile-loading">Loading student details...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!student) return <div className="profile-error">Student not found</div>;

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h3>Student Profile</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h4>Personal Information</h4>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Full Name:</label>
              <p>{student.name}</p>
            </div>
            <div className="profile-item">
              <label>Email:</label>
              <p>{student.email}</p>
            </div>
            <div className="profile-item">
              <label>Student ID:</label>
              <p>{student.rollNumber}</p>
            </div>
            <div className="profile-item">
              <label>Department:</label>
              <p>{student.department}</p>
            </div>
            <div className="profile-item">
              <label>Year of Study:</label>
              <p>{student.yearOfStudy}</p>
            </div>
            <div className="profile-item">
              <label>Phone:</label>
              <p>{student.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {student.marksheet && (
          <div className="profile-section">
            <h4>Marksheet Information</h4>
            <div className="marksheet-info">
              <p><strong>File:</strong> {student.marksheet.originalName}</p>
              <p><strong>Uploaded:</strong> {new Date(student.marksheet.uploadedAt).toLocaleDateString()}</p>
              <p><strong>File Size:</strong> {(student.marksheet.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}

        <div className="profile-section">
          <h4>Account Details</h4>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Role:</label>
              <p>{student.role}</p>
            </div>
            <div className="profile-item">
              <label>Assigned Faculty:</label>
              <p>{student.assignedFaculty?.name || 'Not assigned'}</p>
            </div>
            <div className="profile-item">
              <label>Account Created:</label>
              <p>{new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
