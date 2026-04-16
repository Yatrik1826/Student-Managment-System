import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      return;
    }

    try {
      await studentAPI.deleteStudent(studentId);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete student');
    }
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="student-list">
      <div className="list-header">
        <h3>My Students ({students.length})</h3>
        <button className="add-btn">Add New Student</button>
      </div>

      {students.length === 0 ? (
        <div className="no-students">
          <p>No students assigned yet.</p>
          <p>Click "Add New Student" to get started.</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-header">
                <h4>{student.fullName}</h4>
                <span className="student-id">ID: {student.studentId}</span>
              </div>

              <div className="student-details">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Course:</strong> {student.course}</p>
                <p><strong>Semester:</strong> {student.year}</p>
                <p><strong>Section:</strong> {student.section}</p>
                <p><strong>Phone:</strong> {student.phone || 'Not provided'}</p>
              </div>

              <div className="student-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(student.id, student.fullName)}>
                  Delete
                </button>
                <button className="marksheet-btn">
                  {student.marksheet ? 'Update Marksheet' : 'Upload Marksheet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;