import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteUserModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeUser: PropTypes.object,
};

function DeleteUserModal(props) {
  const { isShow, onClose, onSubmit, activeUser } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteUser(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeUser.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeUser?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteUser}>
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

export default DeleteUserModal;
