import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Icon.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { faPlug, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

const Component = ({type, connectionState}) => {

  const checkIconStyle = (connectionState) => {
    if (connectionState === 'disconnected') return styles.disconnected;
    else if (connectionState === 'poor connection') return styles.poorConnection;
    else return styles.connected;
  };

  return (
    <>
      {type === 'bulb' ?
        <FontAwesomeIcon
          className={clsx(
            styles.icon,
            checkIconStyle(connectionState)
          )}
          icon={faLightbulb} />
        : ''
      }
      {type === 'outlet' ?
        <FontAwesomeIcon
          className={clsx(
            styles.icon,
            checkIconStyle(connectionState)
          )}
          icon={faPlug} />
        : ''
      }
      {type === 'temperatureSensor' ?
        <FontAwesomeIcon
          className={clsx(
            styles.icon,
            checkIconStyle(connectionState)
          )}
          icon={faThermometerHalf} />
        : ''
      }
    </>
  );
};

Component.propTypes = {
  type: PropTypes.string.isRequired,
  connectionState: PropTypes.string,
};

export {
  Component as Icon,
  Component as IconComponent,
};
