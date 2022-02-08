import React from 'react';
import PropTypes from 'prop-types';

import styles from './Icon.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { faPlug, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

const Component = ({type}) => {
  return (
    <>
      {type === 'bulb' ? <FontAwesomeIcon className={styles.icon} icon={faLightbulb} /> : ''}
      {type === 'outlet' ? <FontAwesomeIcon className={styles.icon} icon={faPlug} /> : ''}
      {type === 'temperatureSensor' ? <FontAwesomeIcon className={styles.icon} icon={faThermometerHalf} /> : ''}
    </>
  );
};

Component.propTypes = {
  type: PropTypes.string.isRequired,
};

export {
  Component as Icon,
  Component as IconComponent,
};
