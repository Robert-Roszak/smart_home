import React from 'react';

import styles from './NotFound.module.scss';

export const NotFound = () => (
  <div className={styles.root}>
    <h2>NotFound</h2>
    <img className={styles.image} src="https://images.pexels.com/photos/4271933/pexels-photo-4271933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt='error_404' />
  </div>
);
