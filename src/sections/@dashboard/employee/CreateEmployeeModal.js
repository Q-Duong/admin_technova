import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';

CreateEmployeeModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateEmployee: PropTypes.func,
};

function CreateEmployeeModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit } = props;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateEmployee(e) {
    e.preventDefault();
  
    if (onSubmit){
      const createEmployee = {
        name,
        email,
        password
      }
      onSubmit(createEmployee);
      setName('')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo nhân viên</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.CREATE_EMPLOYEE ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={(e) => handleCreateEmployee(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên nhân viên</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập " />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập " />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập " />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Tạo
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateEmployeeModal;
