import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button, Card, NativeSelect, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import { useState } from 'react';
import Iconify from '../../../components/iconify/Iconify';
import {  benefitValueAPI, productAPI, productBenefitAPI, productPackageAPI } from '../../../api/ConfigAPI';
import CreateProductPackageModal from './createProductPackageModal';
import CreateProductBenefitModal from './CreateProductBenefitModal';
import axios from 'axios';
import { setErrorValue } from '../../../redux/slices/ErrorSlice';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../enums/page';
import months from '../../../enums/transLateTimeRange'
import { fCurrency } from '../../../utils/formatNumber';
import UpdateProductPackageModal from './UpdateProductPackageModal';
import DeleteProductBenefitModal from './DeleteProductBenefitModal';
import DeleteProductPackageModal from './DeleteProductPackageModal';

ProductDetailModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    product: PropTypes.object,
};

function ProductDetailModal(props) {
    const token = useSelector(state => state.token.value);
    const dispatch = useDispatch();
    const { isShow, onClose, product } = props
    const updateValueRef = useRef(null)
    const [productPackages, setProductPackages] = useState([]);
    const [productBenefits, setProductBenefits] = useState([]);

    const [showCreatePackageForm, setShowCreatePackageForm] = useState(false);
    const [showCreateBenefitForm, setShowCreateBenefitForm] = useState(false);
    const [showUpdatePackageForm, setShowUpdatePackageForm] = useState(false);
    const [showDeletePackageForm, setShowDeletePackageForm] = useState(false);
    const [showDeleteBenefitForm, setShowDeleteBenefitForm] = useState(false);

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedBenefit, setSelectedBenefit] = useState(null);
  

    function handleShowUpdatePackageForm(selectedItem) {
      setShowUpdatePackageForm(true);
      setSelectedPackage(selectedItem)
    }
  
    function handleCloseUpdatePackageForm() {
      setShowUpdatePackageForm(false);
    }

    function handleShowDeletePackageForm(selectedItem) {
      setShowDeletePackageForm(true);
      setSelectedPackage(selectedItem)
    }
  
    function handleCloseDeletePackageForm() {
      setShowDeletePackageForm(false);
    }

    function handleShowDeleteBenefitForm(selectedItem) {
      setShowDeleteBenefitForm(true);
      setSelectedBenefit(selectedItem)
    }
  
    function handleCloseDeleteBenefitForm() {
      setShowDeleteBenefitForm(false);
    }

    function handleCreatePackageFormShow() {
      setShowCreatePackageForm(true);
    }
  
    function handleCloseCreatePackageFormShow() {
      setShowCreatePackageForm(false);
    }

    function handleCreateBenefitFormShow() {
      setShowCreateBenefitForm(true);
    }
  
    function handleCloseCreateBenefitFormShow() {
      setShowCreateBenefitForm(false);
    }

    function handleClose() {
        if (onClose)
            onClose()
    };

    useEffect(
      () => {
        if(!product){
          return;
        }
        async function prepareData() {
          try {
            const resPackages = await productAPI.getPackages(product.id);
            const resBenefits = await productAPI.getBenefits(product.id);

            const productPackages = resPackages.data;
            const benefits = resBenefits.data;
            
            const sortBenefits = benefits.map(benefit => {
              const values = benefit.benefitValues;

              const sortBenefitValues = [];
              for(const productPackage of productPackages){
                const foundValue = values.find(v => v.productPackage.id === productPackage.id)
                sortBenefitValues.push(foundValue);
              }    
              benefit.benefitValues = sortBenefitValues;
              return benefit;
            })
            
            setProductPackages(productPackages)
            setProductBenefits(sortBenefits)
          } catch (error) {
            if (axios.isAxiosError(error))
              alert(error.response ? error.response.data.message : error.message);
            else 
              alert(error.toString());
          }
        }
        prepareData()
      },[product])

    async function handleCreatePackage(data){
      try {
        handleCloseCreatePackageFormShow()
        const resCreatePackage = await productPackageAPI.create(data, token);
        const newCreatePackage = resCreatePackage.data;
        const newProductPackages = [...productPackages];
        newProductPackages.push(newCreatePackage)
        setProductPackages(newProductPackages);

        const newBenefits = productBenefits.map(benefit => {
          const newValue = newCreatePackage.benefitValues.find(value => value.benefit.id === benefit.id)
          const newBenefitValues = benefit.benefitValues.push(newValue)
          return {
            ...benefit,
            newBenefitValues
          }
        })
        setProductBenefits(newBenefits);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_PACKAGE}))
        else
          dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_PACKAGE}))
      }
    }

    async function handleCreateBenefit(data){
      try {
        handleCloseCreateBenefitFormShow()
        const res = await productBenefitAPI.create(data, token);
        const newProductBenefits = [...productBenefits];
        newProductBenefits.push(res.data)

        const sortBenefits = newProductBenefits.map(benefit => {
          const values = benefit.benefitValues;

          const sortBenefitValues = [];
          for(const productPackage of productPackages){
            const foundValue = values.find(v => v.productPackage.id === productPackage.id)
            sortBenefitValues.push(foundValue);
          }    
          benefit.benefitValues = sortBenefitValues;
          return benefit;
        })
        setProductBenefits(sortBenefits);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BENEFIT}))
        else
          dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BENEFIT}))
      }
    }

    async function handelUpdateBenefitValue(id, value){
      try {
        await benefitValueAPI.update({id, value}, token)
        const newBenefits = productBenefits.map(benefit => {
          const foundBenefitValue = benefit.benefitValues.find(b => b.id === id)
          
          if(foundBenefitValue){
            foundBenefitValue.value = value;
            const newBenefitValues = benefit.benefitValues.map(b => b.id === foundBenefitValue.id ? foundBenefitValue : b);
            return {
              ...benefit,
              benefitValues: newBenefitValues
            }
          }
          return benefit;
        })
        setProductBenefits(newBenefits);  
      } catch (error) {
        alert(error)
      } 
    }

    async function handleUpdateProductPackage(data) {
      setShowUpdatePackageForm(false)
      try {
        data['id'] = selectedPackage.id
        const resData = await productPackageAPI.update(data, token)
        const filterProductPackages = productPackages.filter((r) => r.id !== resData.data.id)
        const newProductPackages = [resData.data, ...filterProductPackages]
        setProductPackages(newProductPackages)
      }
      catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_PRODUCT_PACKAGE}))
        else
          dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_PRODUCT_PACKAGE}))
          setShowUpdatePackageForm(true)
      }
    }

    
    async function handleDeleteProductPackage() {
      setShowDeletePackageForm(false)
      try {
        await productPackageAPI.delete(selectedPackage.id, token)
        const newProductPackages = productPackages.filter((r) => r.id !== selectedPackage.id)
        setProductPackages(newProductPackages)
      }
      catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message)
        else
          alert(error.toString())
      }
    }

    async function handleDeleteProductBenefit() {
      setShowDeleteBenefitForm(false)
      try {
        await productBenefitAPI.delete(selectedBenefit.id, token)
        const newProductBenefits = productBenefits.filter((r) => r.id !== selectedBenefit.id)
        setProductBenefits(newProductBenefits)
      }
      catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message)
        else
          alert(error.toString())
      }
    }
  
  
    return (
      <>
        <Modal size="xl" style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{product?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 1000 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell></TableCell>
                              {
                                productPackages?.map(productPackage => (
                                  <TableCell  width="400">
                                    <NativeSelect id="select"
                                    onChange={(e) => {
                                      if(Number(e.target.value) === 1){
                                        handleShowUpdatePackageForm(productPackage)

                                      }else if(Number(e.target.value) === 0) {
                                        handleShowDeletePackageForm(productPackage)
                                      }
                                      e.target.selectedIndex = 0;
                                    }}>
                                      <option selected>{productPackage.name}</option>
                                      <option value={1}>Chỉnh Sửa</option>
                                      <option value={0}>Xoá</option>
                                    </NativeSelect>  
                                </TableCell>
                          ))
                        }
                        <TableCell>
                          <Button onClick={() => {handleCreatePackageFormShow(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                            Gói
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                      <TableRow >
                        <TableCell>Số người sở hữu</TableCell>
                        {
                          productPackages?.map(productPackage => (
                              <TableCell className="package_title">
                                  {
                                  productPackage.userNumber
                                  }                                                                          
                                  
                              </TableCell>
                          ))
                        }
                      </TableRow>
                      }
                      {
                        <TableRow >
                            <TableCell>Thời hạn sử dụng</TableCell>
                            {
                              productPackages?.map(productPackage => (
                                  <TableCell className="package_title">
                                      {
                                      `${productPackage.timeRangeNumber} ${months[productPackage.timeRange]}` 
                                      }                                                                          
                                      
                                  </TableCell>
                              ))
                            }
                        </TableRow>
                      }
                      {
                        <TableRow >
                            <TableCell>Giá</TableCell>
                            {
                              productPackages?.map(productPackage => (
                                  <TableCell className="package_title">
                                      {
                                        fCurrency(productPackage.price)
                                      }                                                                          
                                  </TableCell>
                              ))
                            }
                        </TableRow>
                      }
                      {
                        productBenefits?.map(benefit => (
                          <TableRow >
                            <TableCell component="th" scope="row" width={450} align="left">
                              <NativeSelect id="select"
                                onChange={(e) => {
                                  if(Number(e.target.value) === 1){
                                    handleShowDeleteBenefitForm(benefit)
                                  }
                                  e.target.selectedIndex = 0;
                              }}>
                                <option selected>{benefit.name}</option>
                                <option value={1}>Xoá</option>
                              </NativeSelect>  
                            </TableCell>
                            
                            {
                              benefit.benefitValues.map(benefitValue => (
                                <TableCell align="left">
                                  
                                  <TextField
                                    variant="standard"
                                    defaultValue={benefitValue? benefitValue.value: ''}
                                    onChange={
                                      (e) => {
                                        if(updateValueRef.current){
                                          clearTimeout(updateValueRef.current)
                                        }

                                        updateValueRef.current = setTimeout(
                                          () => {
                                            handelUpdateBenefitValue(benefitValue.id, e.target.value)
                                          },
                                          300
                                        )

                                      }
                                    }
                                  />
                                </TableCell>
                              ))
                            }
                          </TableRow>
                        ))
                      }
                          <TableRow >
                            <TableCell  align="left">
                                <Button style={{ width: 150 }} onClick={() => {handleCreateBenefitFormShow(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Quyền lợi
                              </Button>
                            </TableCell>
                          </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Modal.Body>
        </Modal>

        <CreateProductPackageModal
          isShow={showCreatePackageForm}
          onClose={() => {
            handleCloseCreatePackageFormShow(false);
          }}
          onSubmit={handleCreatePackage}
          productId={product? product?.id: ''}
        />

        <UpdateProductPackageModal
          isShow={showUpdatePackageForm}
          onClose={() => {
            handleCloseUpdatePackageForm(false);
          }}
          onSubmit={handleUpdateProductPackage}
          activeProductPackage={selectedPackage}
        />

        <DeleteProductPackageModal
          isShow={showDeletePackageForm}
          onClose={() => {
            handleCloseDeletePackageForm(false);
          }}
          onSubmit={handleDeleteProductPackage}
          activeProductPackage={selectedPackage}
        />

        <CreateProductBenefitModal
          isShow={showCreateBenefitForm}
          onClose={() => {
            handleCloseCreateBenefitFormShow(false);
          }}
          onSubmit={handleCreateBenefit}
          productId={product? product?.id: ''}
        />    

        <DeleteProductBenefitModal
          isShow={showDeleteBenefitForm}
          onClose={() => {
            handleCloseDeleteBenefitForm(false);
          }}
          onSubmit={handleDeleteProductBenefit}
          activeProductBenefit={selectedBenefit}
        />
      </>
    );
}

export default ProductDetailModal;