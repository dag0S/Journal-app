import styles from './Logo.module.css';
import { memo } from 'react';

const Logo = ({ image }) => {
  console.log('Logo');
  return <img className={styles.logo} src={image} alt="logo" />;
};

export default memo(Logo);
