import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';


UpdateEmployeeModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeEmployee: PropTypes.object,
};

function UpdateEmployeeModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeEmployee } = props;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleClose() {
    if (onClose) onClose();
  }

  useEffect(() => {
    setName(activeEmployee?.name)
    setEmail(activeEmployee?.email)
  },[activeEmployee])

  function handleUpdateEmployee(e) {
    e.preventDefault();
  
    if (onSubmit){
      const updateEmployee = {
        name,
        email,
        password
      }
      onSubmit(updateEmployee);
    }
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.UPDATE_EMPLOYEE ? (
        errorMessage.split('---').map((err, index) => (
          <Alert key={index} severity="error">
            {err}
          </Alert>
        ))
      ) : (
        <></>
      )}
      <Form onSubmit={handleUpdateEmployee}>
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
            <Form.Label>Mật khẩu mới (bỏ qua nếu không cập nhật)</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập " />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Cập nhật
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateEmployeeModal;
