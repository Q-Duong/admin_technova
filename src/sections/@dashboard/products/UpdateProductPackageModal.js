import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import TimeRange from '../../../enums/timeRange';
import Currency from '../../../enums/currency';
import { useSelector } from 'react-redux';
import Page from '../../../enums/page';

UpdateProductPackageModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdateProductDetail: PropTypes.func,
  productId: PropTypes.string
};

function UpdateProductPackageModal(props) {
    const {errorMessage, page} = useSelector(state => state.error.value);

    const { isShow, onClose, onSubmit, activeProductPackage } = props;
    const [name, setName] = useState('')
    const [userNumber, setUserNumber] = useState(1)
    const [timeRangeNumber, setTimeRangeNumber] = useState(1)
    const [timeRange, setTimeRange] = useState()
    const [price, setPrice] = useState(0)
    const [currency, setCurrency] = useState('vnd')

  function handleClose() {
    if (onClose) onClose();
  }
    

  function handleUpdateProductPackage(e) {
    e.preventDefault();
    const data = {
      name, 
      userNumber,
      timeRange,
      timeRangeNumber,
      price,
      currency
    }
    if (onSubmit) onSubmit(data);
  }

  useEffect(() =>{
    if(!activeProductPackage){
      return;
    }

    setName(activeProductPackage.name);
    setUserNumber(activeProductPackage.userNumber);
    setTimeRangeNumber(activeProductPackage.timeRangeNumber);
    setTimeRange(activeProductPackage.timeRange);
    setPrice(activeProductPackage.price);
    setCurrency(activeProductPackage.currency);

  },[activeProductPackage])

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật Gói</Modal.Title>
      </Modal.Header>
      {errorMessage !== "" && errorMessage && page === Page.UPDATE_PACKAGE?
                <Alert severity="error">{errorMessage}</Alert> :
                <></>
      }
      <Form onSubmit={handleUpdateProductPackage}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên gói</Form.Label>
            <Form.Control value={name} onChange={(e) => {setName(e.target.value)}} type="text" placeholder="Nhập tên gói" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số người sở hữu</Form.Label>
            <Form.Control value={userNumber} onChange={(e) => {setUserNumber(Number(e.target.value))}} type="number" placeholder="Nhập số người sở hữu" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thời gian sở hữu</Form.Label>
            <Form.Control value={timeRangeNumber} onChange={(e) => {setTimeRangeNumber(Number(e.target.value))}} type="number" placeholder="Nhập thời gian sở hữu" />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Đơn vị thời gian</Form.Label>
              <Form.Select  onChange={(e) => {setTimeRange(e.target.value)}}>
                  {
                      Object.values(TimeRange).map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                      ))
                  }
              </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giá bán</Form.Label>
            <Form.Control value={price} onChange={(e) => {setPrice(Number(e.target.value))}} type="number" placeholder="Nhập giá bán" />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Đơn vị tiền tệ</Form.Label>
              <Form.Select  onChange={(e) => {setCurrency(e.target.value)}}>
                  {
                      Object.values(Currency).map((currency, index) => (
                          <option key={index} value={currency}>{currency}</option>
                      ))
                  }
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

export default UpdateProductPackageModal;
