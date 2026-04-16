import { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../services/api';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [uploadStudentId, setUploadStudentId] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleStudentAdded = (newStudent) => {
    setStudents(prevStudents => [...prevStudents, newStudent]);
    setShowAddModal(false);
  };

  const openEditModal = (student) => {
    setStudentToEdit(student);
    setShowEditModal(true);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudents(prevStudents => prevStudents.map(student =>
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setShowEditModal(false);
    setStudentToEdit(null);
  };

  const handleUploadClick = (studentId) => {
    setUploadStudentId(studentId);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadStudentId) {
      return;
    }

    try {
      await studentAPI.uploadMarksheet(uploadStudentId, file);
      alert('Marksheet uploaded successfully!');
      fetchStudents();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload marksheet');
    } finally {
      setUploadStudentId(null);
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
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          Add New Student
        </button>
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
                <button className="edit-btn" onClick={() => openEditModal(student)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(student.id, student.fullName)}>
                  Delete
                </button>
                <button className="marksheet-btn" onClick={() => handleUploadClick(student.id)}>
                  {student.marksheet ? 'Update Marksheet' : 'Upload Marksheet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {showAddModal && (
        <AddStudent
          onStudentAdded={handleStudentAdded}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && studentToEdit && (
        <EditStudent
          student={studentToEdit}
          onStudentUpdated={handleStudentUpdated}
          onCancel={() => {
            setShowEditModal(false);
            setStudentToEdit(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentList;