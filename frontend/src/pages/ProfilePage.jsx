import { useMemo, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import Loader from '../components/Loader.jsx';

const ProfilePage = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore(
    (state) => ({
      user: state.user,
      updateProfile: state.updateProfile,
      isUpdatingProfile: state.isUpdatingProfile,
    })
  );
  const [preview, setPreview] = useState('');
  const [localMessage, setLocalMessage] = useState('');

  const initials = useMemo(() => {
    if (!user?.fullName) return '?';
    return user.fullName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.fullName]);

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setLocalMessage('Please pick a file smaller than 2MB.');
      return;
    }
    try {
      const base64 = await convertFileToBase64(file);
      setPreview(base64);
      setLocalMessage('');
    } catch (error) {
      setLocalMessage('Could not read the selected file.');
    }
  };

  const handleSave = async () => {
    if (!preview) {
      setLocalMessage('Select a picture first.');
      return;
    }
    await updateProfile({ profilePic: preview });
    setPreview('');
  };

  if (!user) {
    return (
      <div className="page page--narrow">
        <Loader label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <section className="card">
        <h1>Your profile</h1>
        <p className="card__subtitle">
          Update your personal info and profile picture.
        </p>

        <div className="profile-card">
          <div className="profile-card__avatar">
            {preview || user?.profilePic ? (
              <img
                src={preview || user?.profilePic}
                alt="Profile"
                loading="lazy"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <p className="profile-card__name">{user?.fullName}</p>
            <p className="profile-card__email">{user?.email}</p>
          </div>
        </div>

        <label className="form-field">
          <span>Profile picture</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {localMessage && <p className="helper-text">{localMessage}</p>}

        <button
          type="button"
          className="btn"
          onClick={handleSave}
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? 'Saving...' : 'Save picture'}
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
