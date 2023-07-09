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

UpdateCategoryModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeCategory: PropTypes.object,
};

function UpdateCategoryModal(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token.value)

  const [isWait, setIsWait] = useState(false);

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeCategory } = props;

  const [categoryName, setCategoryName] = useState(activeCategory?.name);
  const [imageId, setImageId] = useState(activeCategory?.image?.id);
  const [imagePath, setImagePath] = useState(activeCategory?.image?.path);

  function handleClose() {
    if (onClose) onClose();
  }

  useEffect(() => {
    setCategoryName(activeCategory?.name);
    setImageId(activeCategory?.image?.id);
    setImagePath(activeCategory?.image?.path);
  },[activeCategory])

  function handleUpdateCategory(e) {
    e.preventDefault();
    if(isWait){
      window.alert('Vui lòng chờ hình ảnh được tải lên');
      return;
    }
    if (onSubmit){
      const updateCategory = {
        imageId,
        name: categoryName
      }
      onSubmit(updateCategory);
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
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_CATEGORY}));
      else 
      dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_CATEGORY}));
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
      {errorMessage !== '' && errorMessage && page === Page.UPDATE_CATEGORY ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      
      ) : (
        <></>
      )}
      <Form onSubmit={handleUpdateCategory}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên thương hiệu</Form.Label>
            <Form.Control
              value={categoryName}
              defaultValue={''}
              onChange={(e) => setCategoryName(e.target.value)}
              type="text"
              placeholder="Type Category name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Hình ảnh
              {
                 isWait ? 
                 <Loading></Loading>: 
                 imageId ? <Image  height="100" width="100" style={{marginTop: '10px'}}src={imagePath} alt="category-image" />: <></>
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

export default UpdateCategoryModal;
