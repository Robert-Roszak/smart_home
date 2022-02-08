import React from 'react';
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
  
  useEffect(() => {
    dispatch(fetchDeviceById(id));

    socket = io.connect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000', {
      transports: ['websocket'],
    });

    socket.on('refresh', () => {
      dispatch(fetchDeviceById(id));
    });

  },[dispatch, id]);

  const device = useSelector((state) => state.devices.data[0]);

  const toggleDevice = (socket, device) => {
    let changedDevice = device;
    if (changedDevice.connectionState === 'connected' || changedDevice.connectionState === 'poor connection') {
      changedDevice.connectionState = 'disconnected';
    }
    else {
      const connectionState = ['connected', 'poor connection'];
      const randomStateNumber = Math.floor(Math.random() * connectionState.length);
      const randomState = connectionState[randomStateNumber];
      changedDevice.connectionState = randomState;
    } 
    dispatch(toggleDeviceRedux(socket, changedDevice));
  };

  if (device) {
    return (
      <div className={styles.root}>
        <Row className="justify-content-md-center" key={device.id}>
          <Col xs lg="3">
            <Card border="secondary" className={styles.card}>
              <Card.Body>
                <div className={styles.iconWrapper}>
                  <Icon type={device.type} />
                </div>
                <Card.Title>
                  {device.name}
                </Card.Title>
                <Card.Text>
                  Status: <i>{device.connectionState}</i>
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
                        <span style={{backgroundColor: device.color, color: 'transparent'}}>device color</span>
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
                <Button className={styles.button} variant="primary" onClick={() => toggleDevice(socket, device)}>Toggle the device</Button>
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
