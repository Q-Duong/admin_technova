import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';

import orderStatus from '../../../enums/orderStatus';

UpdateOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeOrder: PropTypes.object,
};

function UpdateOrderModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeOrder } = props;

  const [status, setStatus] = useState(orderStatus.PENDING);
  const [isPaid, setIsPaid] = useState(false);


  function handleClose() {
    if (onClose) onClose();
  }

  useEffect(() => {
    if(!activeOrder){
      return;
    }

    setStatus(activeOrder.status)
    setIsPaid(activeOrder.isPaid)
  },[activeOrder])

  function handleUpdateOrder(e) {
    e.preventDefault();
  
    if (onSubmit){
      const updateOrder = {
        status,
        isPaid
      }
      onSubmit(updateOrder);
    }
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.UPDATE_SOLUTION ? (
        errorMessage.split('---').map((err, index) => (
          <Alert key={index} severity="error">
            {err}
          </Alert>
        ))
      ) : (
        <></>
      )}
      <Form onSubmit={handleUpdateOrder}>
        <Modal.Body>
        <Form.Group className="mb-3">
            <Form.Label>Trạng thái đơn hàng</Form.Label>
            <Form.Select onChange={(e) => {setStatus(e.target.value)}}>
              {
                Object.values(orderStatus).map(item => (
                  <option selected={item === status} key={item} value={item}>
                    {
                     item === orderStatus.PENDING ? 'Chờ duyệt' :
                      item === orderStatus.SUCCESS  ? 'Thành công' :
                      'Thất bại'
                    }
                  </option>
                ))
              }
            </Form.Select>
          </Form.Group>
         
          <Form.Group className="mb-3">
              <Form.Label>Trạng thái thanh toán</Form.Label>
              <Form.Select onChange={(e) => {setIsPaid(Boolean(e.target.value))}}>
                <option selected={!isPaid} value={0}>Chưa thanh toán</option>
                <option selected={isPaid}  value={1}>Đã thanh toán</option>
              </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Cập nhật
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateOrderModal;
