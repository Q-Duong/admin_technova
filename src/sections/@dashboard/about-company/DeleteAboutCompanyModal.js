import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteAboutCompanyModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeAboutCompany: PropTypes.object,
};

function DeleteAboutCompanyModal(props) {
  const { isShow, onClose, onSubmit, activeAboutCompany } = props;

  function handleClose() {
    if (onClose) onClose();
  }

  function handleDeleteAboutCompany(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(activeAboutCompany.id);
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc muốn xoá {activeAboutCompany?.name}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDeleteAboutCompany}>
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

export default DeleteAboutCompanyModal;
