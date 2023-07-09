import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { BrandList } from '../sections/@dashboard/brand';
import Iconify from '../components/iconify';

import { brandAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Loading from '../components/loading/Loading';
import CreateBrandModal from '../sections/@dashboard/brand/CreateBrandModal';
import UpdateBrandModal from '../sections/@dashboard/brand/UpdateBrandModal';
import DeleteBrandModal from '../sections/@dashboard/brand/DeleteBrandModal';
import Page from '../enums/page';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';
// ----------------------------------------------------------------------
export default function BrandPage() {
  const token = useSelector((state) => state.token.value);

  const dispatch = useDispatch();

  const [brands, setBrands] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const [searchTerm, setSearchTerm] = useState('')

  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };

  function hanldeCreateFormShow() {
    setShowCreateForm(true);
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(brand) {
    setClickedElement(brand);
    setShowUpdateForm(true);
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false);
  }

  function handleDeleteFormShow(brand) {
    setClickedElement(brand);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false);
  }

  useEffect(() => {
    async function getBrands() {
      try {
        const res = await brandAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setBrands(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message))
      else
        alert((error.toString()))
      } 
    }
    if(token)
      getBrands();
  }, [token, activePage, searchTerm]);

  async function handleOnSubmitCreate(formData) {
    setShowCreateForm(false);
    try {
      const res = await brandAPI.create(formData, token);
      const newBrands = [...brands];
      newBrands.unshift(res.data);
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BRAND}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BRAND}));
      setShowCreateForm(true);
    }
  }

  async function handleOnSubmitUpdate(formData) {
    setShowUpdateForm(false);
    try {
      formData['id'] = clickedElement.id
      const resData = await brandAPI.update(formData, token);
      const filterBrands = brands.filter((r) => r.id !== clickedElement.id);
      const newBrands = [resData.data, ...filterBrands];
      setBrands(newBrands);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_BRAND}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_BRAND}))
      setShowUpdateForm(true);
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false);
    try {
      await brandAPI.delete(clickedElement.id, token);
      const newBrands = brands.filter((r) => r.id !== clickedElement.id);
      setBrands(newBrands);
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
        <title>Thương hiệu</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thương hiệu
          </Typography>
            <Button onClick={hanldeCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
        </Stack>
        <Stack>
          <SearchBar
            filterName={searchTerm}
            onFilterName={
              (e) => {setSearchTerm(e.target.value)}
            }
          />
        </Stack>
            <BrandList
              brands={brands}
              onUpdateClick={handleUpdateFormShow}
              onDeleteClick={handleDeleteFormShow}
            /> 
            <Stack>
            <ReactPaginate
          className="pagination"
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={4}
                pageCount={pageCount? pageCount: 0}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
            </Stack>
      </Container>
      <CreateBrandModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

      <UpdateBrandModal
        isShow={showUpdateForm}
        activeBrand={clickedElement}
        onSubmit={(formData) => handleOnSubmitUpdate(formData)}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <DeleteBrandModal
        isShow={showDeleteForm}
        activeBrand={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
