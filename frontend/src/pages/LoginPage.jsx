import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuthStore((state) => ({
    login: state.login,
    isLoading: state.isLoading,
    user: state.user,
  }));
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(formData);
  };

  return (
    <div className="auth-page">
      <form className="card card--auth" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="card__subtitle">
          Log in to continue chatting with your friends.
        </p>
        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <p className="card__footer">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;