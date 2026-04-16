import { useAuth } from '../contexts/AuthContext';

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
        
        {/* We'll add role-specific content here in next parts */}
        {user.role === 'faculty' && (
          <div>
            <h3>Faculty Panel</h3>
            <p>Manage your assigned students here.</p>
          </div>
        )}
        
        {user.role === 'student' && (
          <div>
            <h3>Student Panel</h3>
            <p>View your profile and marksheet here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;