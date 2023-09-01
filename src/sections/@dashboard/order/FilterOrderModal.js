import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

import orderStatus from '../../../enums/orderStatus';
FilterOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

function FilterOrderModal(props) {

  const { isShow, onClose, onSubmit, onClear } = props;

  const [status, setStatus] = useState(null);
  const [isPaid, setIsPaid] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [email, setEmail] = useState(null)


  function handleClose() {
    if (onClose) onClose();
  }

  function handleFilterOrder(e) {
    e.preventDefault();
  
    if (onSubmit){
      const filterOrder = {
        status,
        isPaid,
        startDate,
        endDate,
        email
      }
      onSubmit(filterOrder);
    }
  }

  function handleClear(e) {
    setStatus(null)
    setIsPaid(null)
    setEmail(null)
    setStartDate(null)
    setEndDate(null)
    if(onClear)
        onClear()
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bộ lọc</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFilterOrder}>
        <Modal.Body>
        <Form.Group className="mb-3">
            <Form.Label>Trạng thái đơn hàng</Form.Label>
            <Form.Select onChange={(e) => {setStatus(e.target.value)}}>
                <option value={null}>Không lọc</option>
              {
                Object.values(orderStatus).map(item => (
                  <option key={item} value={item}>
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
              <Form.Select onChange={(e) => {setIsPaid(e.target.value)}}>
                <option value={null}>Không lọc</option>
                <option  value={false}>Chưa thanh toán</option>
                <option  value={true}>Đã thanh toán</option>
              </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} onClear={(e) => setStartDate(null)}/>
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Đến ngày</Form.Label>
              <Form.Control type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate ? startDate : null} onClear={(e) => setEndDate(null)}/>
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Email khách hàng</Form.Label>
              <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={handleClear}>
            Xoá bộ lọc
          </Button>
          <Button variant="primary" type="submit">
            Lọc
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default FilterOrderModal;
