import React, { useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import clsx from 'clsx';
import interact from 'interactjs';
import { Icon } from '../../features/Icon/Icon';
import { fetchDevices } from '../../../redux/devicesRedux';
import styles from './Devices.module.scss';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';

let socket;

export const Devices = () => {
  const dispatch = useDispatch();
  const [devices, setDevices] = useState();

  useEffect(() => {
    dispatch(fetchDevices());

    socket = io.connect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000', {
      transports: ['websocket'],
    });

    socket.on('refresh', () => {
      dispatch(fetchDevices());
    });

  },[dispatch]);
  
  const devicesData = useSelector((state) => state.devices);

  useEffect(() => {
    setDevices(devicesData.data);
  },[devicesData]);

  const handleOpen = (id) => {
    window.open(
      `/${id}`,
      '',
      'toolbar=no,scrollbars=no,width=500px,height=450px'
    );
  };

  interact('.draggable')
    .draggable({
      inertia: true,
      restrict: {
        restriction: 'parent',
        endOnly: true,
      },
      onmove: function(event) {
        const dataY = event.target.getAttribute('data-y');
        const initialY = parseFloat(dataY) || 0;
        const deltaY = event.dy;
        const newY = initialY + deltaY/10;
        event.target
          .style
          .transform = `translateY(${newY}px)`;
        event.target.setAttribute('data-y', newY);
      },
    });

  if (devices && Object.keys(devices).length !== 0) {
    return (
      <Container className={styles.root}>
        <Row className={styles.list}>
          <Col xs={12} lg={9}>
            <img className={styles.smartImage} src='../smart_home.jpg' alt='smart_home'/>
          </Col>
          <Col xs={12} lg={3}>
            <p><i>Tap to open device</i></p>
            {
              devices.map(device => {
                return (
                  <Card key={device.id} border="secondary" className={clsx(styles.card, 'draggable')} onDoubleClick={() => handleOpen(device.id)}>
                    <Card.Body>
                      <div className={styles.iconWrapper}>
                        <Icon type={device.type} connectionState={device.connectionState} />
                      </div>
                      <Card.Title>
                        {device.name}
                      </Card.Title>
                      <Card.Text>
                        <i>{device.connectionState}</i>
                      </Card.Text>
                    </Card.Body>                    
                  </Card>
                );
              })
            }
          </Col>
        </Row>
      </Container>
    );
  }
  else return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}; 
