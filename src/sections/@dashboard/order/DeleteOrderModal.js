import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeOrder: PropTypes.object,
};

function DeleteOrderModal(props) {
  const { isShow, onClose, onSubmit, activeOrder } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteOrder(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeOrder.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeOrder?.id}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteOrder}>
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

export default DeleteOrderModal;
