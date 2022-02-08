import React from 'react';
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

  useEffect(() => {
    dispatch(fetchDevices());

    socket = io.connect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000', {
      transports: ['websocket'],
    });

    socket.on('refresh', () => {
      dispatch(fetchDevices());
    });

  },[dispatch]);

  const devices = useSelector((state) => state.devices.data);

  const handleOpen = (id) => {
    window.open(
      `/${id}`,
      '',
      'toolbar=no,scrollbars=no,width=500px,height=450px'
    );
  };

  const position = { x: 0, y: 0 };

  interact('.draggable').draggable({
    lockAxis: 'y',
    inertia: true,
    restrict: {
      restriction: 'parent',
      endOnly: true,
    },
    listeners: {
      move (event) {
        position.x += event.dx;
        position.y += event.dy;

        event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`;
      },
    },
  });

  if (Object.keys(devices).length !== 0) {
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
                        <Icon type={device.type} />
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
