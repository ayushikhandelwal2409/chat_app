import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isLoading: state.isLoading,
  }));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__brand" onClick={() => navigate('/')}>
        Chat App
      </div>
      <nav className="navbar__links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'navbar__link is-active' : 'navbar__link'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? 'navbar__link is-active' : 'navbar__link'
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'navbar__link is-active' : 'navbar__link'
          }
        >
          Settings
        </NavLink>
      </nav>
      <div className="navbar__actions">
        {user ? (
          <>
            <div className="navbar__user">
              <span className="navbar__avatar">
                {user.fullName?.charAt(0)?.toUpperCase() || '?'}
              </span>
              <div>
                <p className="navbar__name">{user.fullName}</p>
                <p className="navbar__email">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Logout'}
            </button>
          </>
        ) : (
          <div className="navbar__auth">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;