import { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../services/api';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import StudentProfile from './StudentProfile';
import ConfirmationModal from './ConfirmationModal';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [uploadStudentId, setUploadStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from fullName
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from studentId
        student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.yearOfStudy.toString().includes(searchTerm.toLowerCase()) // Changed from year
      );
      setFilteredStudents(filtered);
    }
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (studentId, studentName) => {
    setDeleteModal({ studentId, studentName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;

    setDeleting(true);
    try {
      await studentAPI.deleteStudent(deleteModal.studentId);
      setStudents(students.filter(student => student.id !== deleteModal.studentId));
      setDeleteModal(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleting(false);
    }
  };

  const handleStudentAdded = (newStudent) => {
    setStudents(prevStudents => [newStudent, ...prevStudents]);
    setShowAddModal(false);
  };

  const openEditModal = (student) => {
    setStudentToEdit(student);
    setShowEditModal(true);
  };

  const openProfileModal = (studentId) => {
    setSelectedStudentId(studentId);
    setShowProfileModal(true);
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
    return <div className="loading-state">Loading students...</div>;
  }

  return (
    <div className="student-list">
      <div className="list-header">
        <h3>My Students ({filteredStudents.length})</h3>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Add New Student
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name, email, roll number, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {students.length === 0 ? (
        <div className="no-students">
          <p>No students assigned yet.</p>
          <p>Click "Add New Student" to get started.</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="no-students">
          <p>No students match your search.</p>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="students-grid">
          {filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-header">
                <h4>{student.name}</h4> {/* Changed from fullName */}
                <span className="student-id">Roll No: {student.rollNumber}</span> {/* Changed from studentId */}
              </div>

              <div className="student-details">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year:</strong> {student.yearOfStudy}</p> {/* Changed from year */}
                {student.marksheet && (
                  <p className="marksheet-status"><strong>✓</strong> Marksheet uploaded</p>
                )}
              </div>

              <div className="student-actions">
                <button 
                  className="view-btn" 
                  onClick={() => openProfileModal(student.id)}
                  title="View detailed student information"
                >
                  View Details
                </button>
                <button 
                  className="edit-btn" 
                  onClick={() => openEditModal(student)}
                  title="Edit student information"
                >
                  Edit
                </button>
                <button 
                  className="marksheet-btn" 
                  onClick={() => handleUploadClick(student.id)}
                  title={student.marksheet ? 'Update marksheet' : 'Upload marksheet'}
                >
                  {student.marksheet ? 'Update' : 'Upload'}
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteClick(student.id, student.name)}
                  title="Delete student record"
                >
                  Delete
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

      {showProfileModal && selectedStudentId && (
        <div className="modal-overlay">
          <StudentProfile 
            studentId={selectedStudentId}
            onClose={() => {
              setShowProfileModal(false);
              setSelectedStudentId(null);
            }}
          />
        </div>
      )}

      {deleteModal && (
        <ConfirmationModal
          title="Delete Student"
          message={`Are you sure you want to delete ${deleteModal.studentName}? This action cannot be undone. The student's marksheet (if any) will also be deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          isLoading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
};

export default StudentList;