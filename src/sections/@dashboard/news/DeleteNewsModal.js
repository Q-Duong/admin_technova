import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteNewsModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeNews: PropTypes.object,
};

function DeleteNewsModal(props) {
  const { isShow, onClose, onSubmit, activeNews } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteNews(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeNews.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeNews?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteNews}>
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

export default DeleteNewsModal;
