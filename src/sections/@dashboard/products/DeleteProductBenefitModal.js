import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

DeleteProductBenefitModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    activeProductBenefit: PropTypes.object,
};

function DeleteProductBenefitModal(props) {
    const { isShow, onClose, onSubmit, activeProductBenefit } = props

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleDeleteProductBenefit(e) {
        e.preventDefault()
        if (onSubmit)
            onSubmit(activeProductBenefit.id)
    }

    return (
        <Modal style={{ zIndex: 99999 }} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Bạn có chắc muốn xoá {activeProductBenefit?.name}</Modal.Title>
            </Modal.Header>
    
            <Form onSubmit={handleDeleteProductBenefit} >
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

export default DeleteProductBenefitModal;