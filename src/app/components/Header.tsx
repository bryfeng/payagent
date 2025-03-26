import { BellIcon } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.pageTitle}>
          {/* This will be dynamically set based on the current page */}
          <span id="page-title">Dashboard</span>
        </h1>
        <div className={styles.actionsContainer}>
          <button
            type="button"
            className={styles.notificationButton}
          >
            <span className={styles.srOnly}>View notifications</span>
            <BellIcon className={styles.notificationIcon} aria-hidden="true" />
          </button>
          <div className={styles.userContainer}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                <span className={styles.userInitials}>AD</span>
              </div>
              <span className={styles.userName}>Admin User</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
