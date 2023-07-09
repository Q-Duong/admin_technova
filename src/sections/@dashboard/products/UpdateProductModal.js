import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { brandAPI, categoryAPI, imageAPI } from '../../../api/ConfigAPI';
import { setErrorValue } from '../../../redux/slices/ErrorSlice';
import axios from 'axios';
import Loading from '../../../components/loading/Loading';


UpdateProductModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onUpdateProduct: PropTypes.func,
    categories: PropTypes.array,
    brands: PropTypes.array,
};

function UpdateProductModal(props) {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token.value)

    const {errorMessage, page} = useSelector(state => state.error.value)

    const [isWait, setIsWait] = useState(false);
    const [name, setName] = useState('')
    const [isContactToSell, setIsContactToSell] = useState(false);
    const [brandId, setBrandId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [imageId, setImageId] = useState('')
    const [imagePath, setImagePath] = useState(null)
    const [description, setDescription] = useState('')
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const { isShow, onClose, onSubmit, updateProduct} = props

    useEffect(
        () => {
            if(!updateProduct){
                return;
            }
            setName(updateProduct.name);
            setDescription( updateProduct.description);
            setIsContactToSell(updateProduct.isContactToSell);
            setBrandId( updateProduct.brand?.id);
            setCategoryId( updateProduct.category?.id);
            setImageId( updateProduct.image?.id);
            setImagePath( updateProduct.image?.path);

            async function getPropertyOptions() {
                try {

                    const resBrands = await brandAPI.getAll();
                    const resCategories = await categoryAPI.getAll();
                    setBrands(resBrands.data.data);
                    setCategories(resCategories.data.data);
                } catch (error) {
                 alert(error);   
                }
            }
            getPropertyOptions();

        
        }
        ,[isShow, onClose, onSubmit, updateProduct]
    )

    function handleClose() {
        if (onClose)
            onClose()
    }

    function handleUpdateProduct(e) {
        e.preventDefault()

        if(isWait){
            window.alert('Vui lòng chờ hình được upload');
            return;
        }

        const data = {
            name,
            categoryId,
            brandId,
            imageId,
            description,
            isContactToSell
        }
        if (onSubmit)
            onSubmit(data)
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
            dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_PRODUCT}));
          else 
            dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_PRODUCT}));
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
            dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_PRODUCT}));
          else 
            dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_PRODUCT}));
        }
      }

    return (
        <Modal style={{ zIndex: 10000}} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật sản phẩm</Modal.Title>
            </Modal.Header>
            {errorMessage !== "" && errorMessage && page === Page.UPDATE_PRODUCT?
                <Alert severity="error">{errorMessage}</Alert> :
                <></>
            }
            <Form onSubmit={handleUpdateProduct} >

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control value={name} onChange={(e) => {setName(e.target.value)}} type="text" placeholder="Type product name" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={description}
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                console.log( { event, editor, data } );
                                setDescription(data);
                            } }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Liên hệ để thanh toán</Form.Label>
                        <Form.Select onChange={(e) => {setIsContactToSell(e.target.value)}}>
                            <option selected={isContactToSell} value={true}>Bật</option>
                            <option  selected={!isContactToSell} value={false}>Tắt</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                        Hình ảnh
                        {
                            isWait ? 
                            <Loading></Loading>: 
                            imageId ? <Image  height="100" width="100" style={{marginTop: '10px'}}src={imagePath} alt="product-image" />: <></>
                        }
                        </Form.Label>
                        <Form.Control accept="image/*" type="file" min="1" placeholder="Chọn hình ảnh"  onChange={(e) => handleUploadImage(e)} onClick={(e) => handleDeleteImage(e)}/>
                        <Form.Control type="hidden" value={imageId}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Loại</Form.Label>
                        <Form.Select name="r_category" aria-label="Select Category" onChange={(e) => {setCategoryId(e.target.value)}}>
                            {
                                categories?.map(cate => (
                                    <option selected={cate.id === categoryId} key={cate.id} value={cate.id}>{cate.name}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Thương hiệu</Form.Label>
                        <Form.Select name="r_brand" aria-label="Select Brand" onChange={(e) => {setBrandId(e.target.value)}}>
                            {
                                brands?.map(brand => (
                                    <option selected={brand.id === brandId} key={brand.id} value={brand.id}>{brand.name}</option>
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

export default UpdateProductModal;