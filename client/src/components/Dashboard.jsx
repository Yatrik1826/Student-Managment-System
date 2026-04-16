import { useAuth } from '../contexts/AuthContext';
import StudentList from './StudentList';
import { userAPI } from '../services/api';
import { useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadMarksheet = async () => {
    if (!user.marksheet) {
      alert('No marksheet uploaded yet.');
      return;
    }

    setDownloading(true);
    try {
      const response = await userAPI.downloadMarksheet();

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', user.marksheet.originalName || 'marksheet.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download marksheet. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Student Management Portal</h1>
            <p className="subtitle">Welcome, {user.name}</p>
          </div>
          <div className="user-actions">
            <span className="user-role">{user.role === 'student' ? 'Student' : user.role === 'faculty' ? 'Faculty' : 'Principal'}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {user.role === 'faculty' && (
          <div className="faculty-section">
            <StudentList />
          </div>
        )}

        {user.role === 'student' && (
          <div className="student-section">
            <div className="student-profile-card">
              <h2>My Profile</h2>
              <div className="profile-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{user.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Student ID</label>
                    <p>{user.rollNumber}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <p>{user.department}</p>
                  </div>
                  <div className="info-item">
                    <label>Year of Study</label>
                    <p>{user.yearOfStudy}{'st4th'[user.yearOfStudy - 1] || 'th'} Year</p>
                  </div>
                  <div className="info-item">
                    <label>Assigned Faculty</label>
                    <p>{user.assignedFaculty?.name || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="marksheet-card">
              <h2>Marksheet</h2>
              <div className="marksheet-content">
                {user.marksheet ? (
                  <div className="marksheet-available">
                    <div className="marksheet-info">
                      <p><strong>File:</strong> {user.marksheet.originalName}</p>
                      <p><strong>Uploaded:</strong> {new Date(user.marksheet.uploadedAt).toLocaleDateString()}</p>
                      <p><strong>Size:</strong> {(user.marksheet.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      className="download-marksheet-btn"
                      onClick={handleDownloadMarksheet}
                      disabled={downloading}
                    >
                      {downloading ? 'Downloading...' : 'Download Marksheet'}
                    </button>
                  </div>
                ) : (
                  <div className="no-marksheet">
                    <p>No marksheet uploaded yet.</p>
                    <p className="hint">Your assigned faculty will upload your marksheet here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {user.role === 'principal' && (
          <div className="principal-section">
            <h2>Principal Panel</h2>
            <p className="coming-soon">Principal dashboard features coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;