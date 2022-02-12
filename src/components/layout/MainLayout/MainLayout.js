import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../Header/Header';

import styles from './MainLayout.module.scss';

export const MainLayout = ({children}) => (
  <div className={styles.root}>
    <Header />
    {children}
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};