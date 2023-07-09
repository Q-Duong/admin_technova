import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import { productAPI} from '../../../api/ConfigAPI';

CreateOrderDetailModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateOrderDetail: PropTypes.func,
};

function CreateOrderDetailModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit } = props;

  const [products, setProducts] = useState([]);
  const [productPackages, setProductPackages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPackageId, setProductPackageId] = useState(null);
  const [price, setPrice] = useState(500);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateOrderDetail(e) {
    e.preventDefault();

    if(!productPackageId || productName === '' || quantity <= 0){
        return
    }
  
    const payload = {
        productPackageId,
        productName,
        quantity,
        price
    }
    if (onSubmit){
      onSubmit(payload);
      handleClose()
      setProductPackageId(null)
      selectedProduct(null)
      setPrice(500)
      setProductName('')
      setQuantity(1)
    }
  }

  useEffect(
    () => {
        async function getProducts(){
            try {
                const res = await productAPI.getAll();
                setProducts(res.data.data);
                setSelectedProduct(res.data.data[0])
            } catch (error) {
                console.log(error)
            }
        }
        getProducts()
    },[]
  )

  useEffect(
    () => {
      async function getPackages(){
          try {
              const res = await productAPI.getPackages(selectedProduct.id)
              setProductPackages(res.data)
              setProductPackageId(res.data[0].id)
              setProductName(`${selectedProduct.name} - ${res.data[0].name}`)
              setPrice(res.data[0].price)
          } catch (error) {
              console.log(error)
          }
      }
      if(selectedProduct)
          getPackages()
    }, [selectedProduct]
  )

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm sản phẩm</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleCreateOrderDetail(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Sản phẩm</Form.Label>
            <Form.Select onChange={(e) => {
                const foundProduct = products.find(p => p.id === e.target.value);
                setSelectedProduct(foundProduct);
            }}>
                {
                    products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))
                }
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Gói</Form.Label>
            <Form.Select onChange={(e) => {
                setProductPackageId(e.target.value);
                const foundPackage = productPackages.find(p => p.id === e.target.value);
                setProductName(`${selectedProduct.name} - ${foundPackage.name}`)
                setPrice(foundPackage.price)
            }}>
                {
                    productPackages.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))
                }
            </Form.Select>
          </Form.Group>
         
          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
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

export default CreateOrderDetailModal;
