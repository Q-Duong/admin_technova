import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteTechnovaServiceModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeTechnovaService: PropTypes.object,
};

function DeleteTechnovaServiceModal(props) {
  const { isShow, onClose, onSubmit, activeTechnovaService } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteTechnovaService(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeTechnovaService.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeTechnovaService?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteTechnovaService}>
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

export default DeleteTechnovaServiceModal;
