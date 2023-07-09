import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';
import { imageAPI } from '../../../api/ConfigAPI';
import axios from 'axios';
import { setErrorValue } from '../../../redux/slices/ErrorSlice';
import Loading from '../../../components/loading/Loading';


CreateBrandModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBrand: PropTypes.func,
};

function CreateBrandModal(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token.value)

  const [isWait, setIsWait] = useState(false);
  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit } = props;

  const [brandName, setBrandName] = useState('');
  const [imageId, setImageId] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateBrand(e) {
    e.preventDefault();
    if(isWait){
      window.alert('Vui lòng chờ hình ảnh được tải lên');
      return;
    }
    if (onSubmit){
      const createBrand = {
        imageId,
        name: brandName
      }
      onSubmit(createBrand);
      setImageId(null)
      setImagePath(null)
      setBrandName('')
    }
  }

  async function handleUploadImage(file){
    try {
      setIsWait(true)    
      const formData = new FormData();
      formData.append('files', file.target.files[0])
      const res = await imageAPI.create(formData, token);
      const data = res.data;
      setImageId(data[0].id);
      setImagePath(data[0].path);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BRAND}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BRAND}));
    } finally{
      setIsWait(false);
    }
  }

  async function handleDeleteImage(e){
    try {
      if(!imageId){
        return
      }
      await imageAPI.delete(imageId, token);
      e.target.value = null;
      setImageId(null);
      setImagePath(null);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BRAND}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BRAND}));
    }
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo thương hiệu</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.CREATE_BRAND ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={(e) => handleCreateBrand(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên thương hiệu</Form.Label>
            <Form.Control type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Type Brand name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Hình ảnh
              {
                 isWait ? 
                 <Loading></Loading>: 
                 imageId ? <Image  height="100" width="100" style={{marginTop: '10px'}}src={imagePath} alt="brand-image" />: <></>
              }
              </Form.Label>
            <Form.Control accept="image/*" type="file" min="1" placeholder="Chọn hình ảnh"  onChange={(e) => handleUploadImage(e)} onClick={(e) => handleDeleteImage(e)}/>
            <Form.Control type="hidden" value={imageId}/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Tạo
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateBrandModal;
