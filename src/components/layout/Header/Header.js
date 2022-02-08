import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './Header.module.scss';

export const Header = () => (
  <div className={styles.root}>
    <Container>
      <Row className={styles.titleWrapper}>
        <Col xs lg="3" className={styles.titleWrapper}>
          <p className={styles.title}>Your smart home</p>
        </Col>
      </Row>
    </Container>
  </div>
);
