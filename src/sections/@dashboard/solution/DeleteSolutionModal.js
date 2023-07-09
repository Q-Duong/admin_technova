import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteSolutionModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeSolution: PropTypes.object,
};

function DeleteSolutionModal(props) {
  const { isShow, onClose, onSubmit, activeSolution } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteSolution(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeSolution.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeSolution?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteSolution}>
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

export default DeleteSolutionModal;
