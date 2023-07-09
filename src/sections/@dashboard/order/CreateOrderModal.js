import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, FormLabel } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import { Alert, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Page from '../../../enums/page';
import CreateOrderDetailModal from './CreateOrderDetail';
import { fCurrency } from '../../../utils/formatNumber';
CreateOrderModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateOrder: PropTypes.func,
};

function CreateOrderModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, onShow } = props;

  const [totalPrice, setTotalPrice] = useState(0)

  const [phone, setPhone] = useState('')

  const [email, setEmail] = useState('')

  const [name, setName] = useState('')

  const [details, setDetails] = useState([]);

  const [isShowAddDetail, setIsShowAddDetail] = useState(false);

  const handleShowAddDetailModal = () => {
    setIsShowAddDetail(true)
    onClose()

  }

  const handleCloseAddDetailModal = () => {
    setIsShowAddDetail(false)
    onShow()
  }

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateOrder(e) {
    e.preventDefault();
  
    if (onSubmit){
      const createOrder = {
        totalPrice,
        phone,
        email,
        customerName: name,
        details
      }
      onSubmit(createOrder);
      setTotalPrice(0)
      setPhone('')
      setEmail('')
      setName('')
      setDetails([])
      setName('')
    }
  }

  useEffect(() => {
    setTotalPrice(
      details.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      )
    )
  },[details])

  function handleAddProduct(data) {
    const found = details.find(item => item.productPackageId === data.productPackageId)
    if(found){
      found.quantity += data.quantity;
      setDetails([
        ...details.filter(item => item.productPackageId !== data.productPackageId),
        found
      ]
      )
    } else {
      setDetails([...details, data])
    }
  }

  function handleRemoveProduct(productPackageId){
    setDetails([
      ...details.filter(item => item.productPackageId !== productPackageId),
    ])
  }

  return (
    <>
     <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Đơn hàng</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.CREATE_SOLUTION ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={(e) => handleCreateOrder(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên khách hàng</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập" />
          </Form.Group>
         
          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control  type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập" />
          </Form.Group>

          <FormGroup>
            <FormLabel >
              Sản phẩm
              <Button onClick={handleShowAddDetailModal}>+</Button>
            </FormLabel>
            {
              details.map(detail => (
                <FormControlLabel
                control={
                  <Checkbox checked={true} onChange={() => handleRemoveProduct(detail.id)} />
                }
                label={`${detail.productName} ${detail.quantity} sản phẩm`}
              />    
              ))
            }
          </FormGroup>

          <Form.Group className="mb-3">
            <Form.Label>Tổng tiền</Form.Label>
            <Form.Control type="text" value={fCurrency(totalPrice)}  disabled/>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Tạo
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    <CreateOrderDetailModal 
        isShow={isShowAddDetail}
        onClose={handleCloseAddDetailModal}
        onSubmit={handleAddProduct}
    />
    </>
  );
}

export default CreateOrderModal;
