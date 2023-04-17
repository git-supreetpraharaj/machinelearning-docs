import React from "react";
import styles from './Spinner.module.css'

const Spinner = () => {
  return (
    <div className={`${styles['loading-spinner']} ${styles['center']}`}>
      <div className={styles.spin}>
        <div>
          <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
