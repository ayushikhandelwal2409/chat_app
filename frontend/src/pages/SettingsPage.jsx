import { useState } from 'react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [preferences, setPreferences] = useState({
    theme: 'system',
    notifications: true,
    readReceipts: true,
    messagePreview: true,
    sound: true,
  });

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success('Settings saved');
  };

  return (
    <div className="page page--narrow">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Preferences</h1>
        <p className="card__subtitle">
          Tune how the app looks, feels, and notifies you.
        </p>

        <div className="settings-section">
          <h2>Appearance</h2>
          <label className="form-field">
            <span>Theme</span>
            <select
              name="theme"
              value={preferences.theme}
              onChange={handleSelectChange}
            >
              <option value="system">System default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={() => handleToggle('notifications')}
            />
            <span>Enable push notifications</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.sound}
              onChange={() => handleToggle('sound')}
            />
            <span>Play sound on new message</span>
          </label>
        </div>

        <div className="settings-section">
          <h2>Privacy</h2>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.readReceipts}
              onChange={() => handleToggle('readReceipts')}
            />
            <span>Send read receipts</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.messagePreview}
              onChange={() => handleToggle('messagePreview')}
            />
            <span>Show message preview in notifications</span>
          </label>
        </div>

        <button type="submit" className="btn">
          Save changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;