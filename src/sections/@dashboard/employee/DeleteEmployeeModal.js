import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteEmployeeModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeEmployee: PropTypes.object,
};

function DeleteEmployeeModal(props) {
  const { isShow, onClose, onSubmit, activeEmployee } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteEmployee(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeEmployee.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeEmployee?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteEmployee}>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Xoá
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Huỷ
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DeleteEmployeeModal;
