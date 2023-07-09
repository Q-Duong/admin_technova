import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';
import { imageAPI } from '../../../api/ConfigAPI';
import { setErrorValue } from '../../../redux/slices/ErrorSlice';
import axios from 'axios';
import Loading from '../../../components/loading/Loading';


UpdateBrandModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeBrand: PropTypes.object,
};

function UpdateBrandModal(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token.value)

  const [isWait, setIsWait] = useState(false);

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeBrand } = props;

  const [brandName, setBrandName] = useState(activeBrand?.name);
  const [imageId, setImageId] = useState(activeBrand?.image?.id);
  const [imagePath, setImagePath] = useState(activeBrand?.image?.path);

  function handleClose() {
    if (onClose) onClose();
  }

  useEffect(() => {
    setBrandName(activeBrand?.name);
    setImageId(activeBrand?.image?.id);
    setImagePath(activeBrand?.image?.path);
  },[activeBrand])

  function handleUpdateBrand(e) {
    e.preventDefault();
    if(isWait){
      window.alert('Vui lòng chờ hình ảnh được tải lên');
      return;
    }
    if (onSubmit){
      const updateBrand = {
        imageId,
        name: brandName
      }
      onSubmit(updateBrand);
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
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_BRAND}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_BRAND}));
    } finally{
      setIsWait(false);
    }
  }

  async function handleDeleteImage(e){
      e.target.value = null;
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.UPDATE_BRAND ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={handleUpdateBrand}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên thương hiệu</Form.Label>
            <Form.Control
              value={brandName}
              defaultValue={''}
              onChange={(e) => setBrandName(e.target.value)}
              type="text"
              placeholder="Type Brand name"
            />
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
            Cập nhật
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateBrandModal;
