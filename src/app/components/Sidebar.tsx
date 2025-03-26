import Link from 'next/link';
import { 
  HomeIcon, 
  UsersIcon, 
  CreditCardIcon, 
  BotIcon,
  SettingsIcon,
  CalendarIcon,
  PackageIcon,
  BadgeIcon
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'AI Agents', href: '/agents', icon: BotIcon },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Items', href: '/items', icon: PackageIcon },
  { name: 'Subscriptions', href: '/subscriptions', icon: BadgeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>AI Agent Admin</h1>
        </div>
        <nav className={styles.navigation}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={styles.navLink}
            >
              <item.icon className={styles.navIcon} aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
