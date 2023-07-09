import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteProductPackageModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    activeProductPackage: PropTypes.object,
};

function DeleteProductPackageModal(props) {
    const { isShow, onClose, onSubmit, activeProductPackage } = props

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleDeleteProductPackage(e) {
        e.preventDefault()
        if (onSubmit)
            onSubmit(activeProductPackage.id)
    }

    return (
        <Modal style={{ zIndex: 10001 }} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Bạn có chắc muốn xoá {activeProductPackage?.name}</Modal.Title>
            </Modal.Header>
    
            <Form onSubmit={handleDeleteProductPackage} >
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

export default DeleteProductPackageModal;