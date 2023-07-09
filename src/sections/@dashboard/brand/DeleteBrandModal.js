import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteBrandModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeBrand: PropTypes.object,
};

function DeleteBrandModal(props) {
  const { isShow, onClose, onSubmit, activeBrand } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteBrand(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeBrand.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeBrand?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteBrand}>
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

export default DeleteBrandModal;
