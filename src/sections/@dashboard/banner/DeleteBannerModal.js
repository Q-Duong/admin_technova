import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteBannerModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeBanner: PropTypes.object,
};

function DeleteBannerModal(props) {
  const { isShow, onClose, onSubmit, activeBanner } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteBanner(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeBanner.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeBanner?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteBanner}>
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

export default DeleteBannerModal;
