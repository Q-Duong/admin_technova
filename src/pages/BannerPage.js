import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';

import { bannerAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import CreateBannerModal from '../sections/@dashboard/banner/CreateBannerModal';
import UpdateBannerModal from '../sections/@dashboard/banner/UpdateBannerModal';
import DeleteBannerModal from '../sections/@dashboard/banner/DeleteBannerModal';
import Page from '../enums/page';
import BannerList from '../sections/@dashboard/banner/BannerList';
// ----------------------------------------------------------------------
export default function BannerPage() {
  const token = useSelector((state) => state.token.value);

  const dispatch = useDispatch();

  const [banners, setBanners] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);


  function hanldeCreateFormShow() {
    setShowCreateForm(true);
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(banner) {
    setClickedElement(banner);
    setShowUpdateForm(true);
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false);
  }

  function handleDeleteFormShow(banner) {
    setClickedElement(banner);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false);
  }

  useEffect(() => {
    async function getBanners() {
      try {
        const res = await bannerAPI.getAll(token);
        setBanners(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message))
      else
        alert((error.toString()))
      } 
    }
    if(token)
      getBanners();
  }, [token]);

  async function handleOnSubmitCreate(formData) {
    setShowCreateForm(false);
    try {
      const res = await bannerAPI.create(formData, token);
      let newBanners = [...banners];
      newBanners.unshift(res.data);
      newBanners = newBanners.sort((a,b) => a.collocate - b.collocate)
      setBanners(newBanners);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BANNER}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BANNER}));
      setShowCreateForm(true);
    }
  }

  async function handleOnSubmitUpdate(formData) {

    setShowUpdateForm(false);
    try {
      formData['id'] = clickedElement.id;
      const resData = await bannerAPI.update(formData, token);
      const filterBanners = banners.filter((r) => r.id !== clickedElement.id);
      const newBanners = [resData.data, ...filterBanners];
      setBanners(newBanners);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_BANNER}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_BANNER}))
      setShowUpdateForm(true);
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false);
    try {
      await bannerAPI.delete(clickedElement.id, token);
      let newBanners = banners.filter((r) => r.id !== clickedElement.id);
      newBanners = newBanners.sort((a,b) => a.collocate - b.collocate)
      setBanners(newBanners);
    } catch (error) {
      if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message));
      else 
        alert(error.toString());
    } 
  }
  return (
    <>
      <Helmet>
        <title>Hình đại diện</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Hình quảng cáo đại diện
          </Typography>
            <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
        </Stack>
            <BannerList
              banners={banners}
              onUpdateClick={handleUpdateFormShow}
              onDeleteClick={handleDeleteFormShow}
            /> 
      </Container>
      <CreateBannerModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

      <UpdateBannerModal
        isShow={showUpdateForm}
        activeBanner={clickedElement}
        onSubmit={(formData) => handleOnSubmitUpdate(formData)}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <DeleteBannerModal
        isShow={showDeleteForm}
        activeBanner={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
