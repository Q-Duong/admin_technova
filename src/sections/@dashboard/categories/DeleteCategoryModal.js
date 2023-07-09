import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteCategoryModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeCategory: PropTypes.object,
};

function DeleteCategoryModal(props) {
  const { isShow, onClose, onSubmit, activeCategory } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteCategory(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeCategory.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure to delete {activeCategory?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteCategory}>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Delete
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancle
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DeleteCategoryModal;
