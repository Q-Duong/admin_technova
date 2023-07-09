import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteProductModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    activeProduct: PropTypes.object,
};

function DeleteProductModal(props) {
    const { isShow, onClose, onSubmit, activeProduct } = props

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleDeleteProduct(e) {
        e.preventDefault()
        if (onSubmit)
            onSubmit(activeProduct.id)
    }

    return (
        <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Bạn có chắc muốn xoá {activeProduct?.name}</Modal.Title>
            </Modal.Header>
    
            <Form onSubmit={handleDeleteProduct} >
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

export default DeleteProductModal;