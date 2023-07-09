import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Page from '../../../enums/page';

CreateProductBenefitModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateProductDetail: PropTypes.func,
  productId: PropTypes.string
};

function CreateProductBenefitModal(props) {
  const {errorMessage, page} = useSelector(state => state.error.value)

    const { isShow, onClose, onSubmit, productId } = props;
    const [name, setName] = useState('')

  function handleClose() {
    if (onClose) onClose();
    }
    

  function handleCreateProductPackage(e) {
    e.preventDefault();
    const data = {
      name, 
      productId
    }
  
    if (onSubmit) onSubmit(data);
    setName('')
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm quyền lợi</Modal.Title>
      </Modal.Header>
      {errorMessage !== "" && errorMessage && page === Page.CREATE_BENEFIT?
                <Alert severity="error">{errorMessage}</Alert> :
                <></>
      }
      <Form onSubmit={handleCreateProductPackage}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên quyền lợi</Form.Label>
            <Form.Control value={name} onChange={(e) => {setName(e.target.value)}} type="text" placeholder="Nhập quyền lợi" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Thêm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateProductBenefitModal;
