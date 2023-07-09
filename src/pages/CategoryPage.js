import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Button, Stack, Typography } from '@mui/material';
// components
import { CategoryList } from '../sections/@dashboard/categories';
import Iconify from '../components/iconify';

import { categoryAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Loading from '../components/loading/Loading';
import CreateCategoryModal from '../sections/@dashboard/categories/CreateCategoryModal';
import DeleteCategoryModal from '../sections/@dashboard/categories/DeleteCategoryModal';
import UpdateCategoryModal from '../sections/@dashboard/categories/UpdateCategoryModal';
import { reject } from 'lodash';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';
// ----------------------------------------------------------------------
export default function CategoriesPage() {
  const token = useSelector((state) => state.token.value);

  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);

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

  function handleCreateFormShow() {
    setShowCreateForm(true);
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(category) {
    setClickedElement(category);
    setShowUpdateForm(true);
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false);
  }

  function handleDeleteFormShow(category) {
    setClickedElement(category);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false);
  }

  useEffect(() => {
    async function getCategories() {
      dispatch(showLoading());
      try {
        const res = await categoryAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setCategories(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
      } finally {
        dispatch(closeLoading());
      }
    }
    if(token)
      getCategories();
  }, [token, activePage, searchTerm]);

  async function handleOnSubmitCreate(formData) {
    setShowCreateForm(false);
    try {
      const res = await categoryAPI.create(formData, token);
      const newCategories = [...categories];
      newCategories.unshift(res.data);
      setCategories(newCategories);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      setShowCreateForm(true);
    }
  }

  async function handleOnSubmitUpdate(formData) {
    setShowUpdateForm(false);
    try {
      formData['id'] =  clickedElement.id;
      const resData = await categoryAPI.update(formData, token);
      const filterCategories = categories.filter((r) => r.id !== clickedElement.id);
      const newCategories = [resData.data, ...filterCategories];
      setCategories(newCategories);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      setShowUpdateForm(true);
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false);
    try {
      await categoryAPI.delete(clickedElement.id, token);
      const newCategories = categories.filter((r) => r.id !== clickedElement.id);
      setCategories(newCategories);
    } catch (error) {
      if (axios.isAxiosError(error)) alert(error.response ? error.response.data.message : error.message);
      else alert(error.toString());
    }
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: Loại sản phẩm</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Loại sản phẩm
          </Typography>
          <Button onClick={handleCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
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
        <CategoryList
          categories={categories}
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
      <CreateCategoryModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

      <UpdateCategoryModal
        isShow={showUpdateForm}
        activeCategory={clickedElement}
        onSubmit={(formData) => handleOnSubmitUpdate(formData)}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <DeleteCategoryModal
        isShow={showDeleteForm}
        activeCategory={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
