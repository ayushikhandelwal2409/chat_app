import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, user } = useAuthStore((state) => ({
    signup: state.signup,
    isLoading: state.isLoading,
    user: state.user,
  }));
  const [formData, setFormData] = useState({
    fullName: '',
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
    await signup(formData);
  };

  return (
    <div className="auth-page">
      <form className="card card--auth" onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <p className="card__subtitle">It only takes a couple of seconds.</p>
        <label className="form-field">
          <span>Full name</span>
          <input
            type="text"
            name="fullName"
            placeholder="Jane Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>
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
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;