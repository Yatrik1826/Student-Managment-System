import { useAuth } from '../contexts/AuthContext';
import StudentList from './StudentList';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header>
        <h1>Student Management System</h1>
        <div className="user-info">
          <span>Welcome, {user.fullName} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <h2>Dashboard</h2>
        <p>You are logged in as a {user.role}.</p>

        {user.role === 'faculty' && (
          <div className="faculty-section">
            <StudentList />
          </div>
        )}

        {user.role === 'student' && (
          <div className="student-section">
            <h3>Student Panel</h3>
            <div className="student-info">
              <h4>Your Information</h4>
              <p><strong>Student ID:</strong> {user.studentId}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Department:</strong> {user.department}</p>
              <p><strong>Course:</strong> {user.course}</p>
              <p><strong>Semester:</strong> {user.year}</p>
              <p><strong>Section:</strong> {user.section}</p>
              <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
              <p><strong>Faculty:</strong> {user.assignedFaculty?.fullName || 'Not assigned'}</p>
            </div>

            <div className="student-actions">
              <h4>Actions</h4>
              <button className="marksheet-btn">
                {user.marksheet ? 'Download Marksheet' : 'No marksheet uploaded'}
              </button>
            </div>
          </div>
        )}

        {user.role === 'principal' && (
          <div className="principal-section">
            <h3>Principal Panel</h3>
            <p>Principal dashboard features coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;