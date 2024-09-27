import { ReactNode } from 'react';
import styles from './dashboard.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className={styles.dashboardContainer}>
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
