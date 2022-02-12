import React, { useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchDeviceById, toggleDevice as toggleDeviceRedux } from '../../../redux/devicesRedux';
import { Icon } from '../../features/Icon/Icon';
import styles from './Device.module.scss';
import { Spinner, Row, Col, Card, Button } from 'react-bootstrap';

let socket;

export const Device = () => {
  const dispatch = useDispatch();
  const id = window.location.pathname.replace('/','');
  const [device, setDevice] = useState();
  const [connectionState, setConnectionState] = useState();
  
  useEffect(() => {
    dispatch(fetchDeviceById(id));

    socket = io.connect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000', {
      transports: ['websocket'],
    });

    socket.on('refresh', () => {
      dispatch(fetchDeviceById(id));
    });

  },[dispatch, id]);

  const deviceData = useSelector((state) => state.devices);

  useEffect(() => {
    setDevice(deviceData.data[0]);
  },[deviceData]);

  useEffect(() => {
    if (device) {
      setConnectionState(device.connectionState);
    }
  },[device]);

  const toggleDevice = (device) => {
    if (device.connectionState === 'connected' || device.connectionState === 'poor connection') {
      device.connectionState = 'disconnected';
      setConnectionState('disconnected');
    }
    else {
      const connectionState = ['connected', 'poor connection'];
      const randomStateNumber = Math.floor(Math.random() * connectionState.length);
      const randomState = connectionState[randomStateNumber];
      device.connectionState = randomState;
      setConnectionState(randomState);
    }
    socket.emit('refresh');
    dispatch(toggleDeviceRedux(device, socket));
  };

  if (device) {
    return (
      <div className={styles.root}>
        <Row className="justify-content-md-center" key={device.id}>
          <Col xs lg="3">
            <Card border="secondary" className={styles.card}>
              <Card.Body>
                <div className={styles.iconWrapper}>
                  <Icon type={device.type} connectionState={connectionState}/>
                </div>
                <Card.Title>
                  {device.name}
                </Card.Title>
                <Card.Text>
                  Status: <i>{connectionState}</i>
                </Card.Text>
                {
                  device.type === 'bulb' ?
                    <>
                      <Card.Text>
                        Is turned on? {device.isTurnedOn ? <i>Yes</i> : <i>No</i>}
                      </Card.Text>
                      <Card.Text>
                        Brightness: <i>{device.brightness}</i>
                      </Card.Text>
                      <Card.Text>
                        Bulb&apos;s color:
                        <span className={styles.bulbColor} style={{backgroundColor: device.color}} />
                      </Card.Text>
                    </>
                    : ''
                }

                {
                  device.type === 'outlet' ?
                    <>
                      <Card.Text>
                        Is turned on? {device.isTurnedOn ? <i>Yes</i> : <i>No</i>}
                      </Card.Text>
                      <Card.Text>
                        Current consumption: <i>{device.powerConsumption}W</i>
                      </Card.Text>
                    </>
                    : ''
                }

                {
                  device.type === 'temperatureSensor' ?
                    <>
                      <Card.Text>
                        Temperature: <i>{device.temperature}&#8451;</i>
                      </Card.Text>
                    </>
                    : ''
                }
                <Button className={styles.button} variant="primary" onClick={() => toggleDevice(device)}>Toggle the device</Button>
              </Card.Body>                    
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  else return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}; 
