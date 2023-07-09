import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
// components

import {productAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';

import CreateProductModal from '../sections/@dashboard/products/CreateProductModal';
import Scrollbar from '../components/scrollbar/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';
import { Image } from 'react-bootstrap';
import UpdateProductModal from '../sections/@dashboard/products/UpdateProductModal';
import Iconify from '../components/iconify/Iconify';
import ProductDetailModal from '../sections/@dashboard/products/ProductDetailModal';
import Page from '../enums/page';
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';
import DeleteProductModal from '../sections/@dashboard/products/DeleteProductModal';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', alignRight: false },
  { id: 'brand', label: 'Thương hiệu', alignRight: false },
  { id: 'category', label: 'Loại sản phẩm', alignRight: false },
  { id: 'contactToSale', label: 'Liên hệ để thanh toán', alignRight: false },
  { id: 'image', label: 'Hình ảnh', alignRight: false },
  {id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function ProductsPage() {
  const token = useSelector(state => state.token.value)

  const dispatch = useDispatch()

  const [products, setProducts] = useState([{}])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const [searchTerm, setSearchTerm] = useState('')


  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };

  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(product) {
    setClickedElement(product)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(product) {
    setClickedElement(product);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  function handleDetailModalShow(product) {
    setClickedElement(product);
    setShowDetailModal(true);
  }

  function handleCloseDetailModalShow() {
    setShowDetailModal(false)
  }

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await productAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setProducts(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    if(token)
      getProducts();
  }, [token, activePage, searchTerm]);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    try {
      const res = await productAPI.create(data, token)
      const newProducts = [...products]
      newProducts.unshift(res.data)
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_PRODUCT}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_PRODUCT}))
      setShowCreateForm(true)
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    try {
      data['id'] = clickedElement.id
      const resData = await productAPI.update(data, token)
      const filterProducts = products.filter((r) => r.id !== resData.data.id)
      console.log(resData.data)
      const result = {...resData.data, isContactToSell: resData.data.isContactToSell == 'true' ? true : false} ;
      console.log(111,resData.data)
      const newProducts = [resData.data, ...filterProducts]
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_PRODUCT}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_PRODUCT}))
      setShowUpdateForm(true)
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    try {
      await productAPI.delete(clickedElement.id, token)
      const newProducts = products.filter((r) => r.id !== clickedElement.id)
      setProducts(newProducts)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        alert(error.response ? error.response.data.message : error.message)
      else
        alert(error.toString())
    }
  }

  return(
    <>
    <Helmet>
      <title> Sản phẩm </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Sản phẩm
      </Typography>
      <Button onClick={handleCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
        Tạo mới
      </Button>
    </Stack>

    <Card>
    <SearchBar
          filterName={searchTerm}
          onFilterName={
            (e) => {setSearchTerm(e.target.value)}
          }
        />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {products.map((row) => {
                const { id, name, brand, category, image, isContactToSell} = row;
                // const selectedUser = selected.indexOf(name) !== -1;

                return (
                  <TableRow key={id}>
                    {/*  <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}> */}
                    {/* <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                      </TableCell> */}

                    <TableCell align="left" component="th" scope="row" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="left">{brand?.name}</TableCell>

                    <TableCell align="left">{category?.name}</TableCell>
                    <TableCell align="left">{isContactToSell ? 'Bật' : 'Tắt'}</TableCell>

                    <TableCell align="left">
                      <Image src={image?.path} alt={name} height={100} width={100} />
                    </TableCell>
                    <TableCell align="right">
                        <ActionDropdown
                          clickedElement={row}
                          onUpdateClick={() => {
                            handleUpdateFormShow(row)
                          }}
                          onDeleteClick={() => {
                            handleDeleteFormShow(row)
                          }}
                          onDetailClick={() => {
                            handleDetailModalShow(row)
                          }}
                        />
                      </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
        </TableContainer>
      </Scrollbar>
    </Card>

    <CreateProductModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateProductModal
        isShow={showUpdateForm}
        updateProduct={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => {handleCloseUpdateFormShow()}}
      />

    <DeleteProductModal
        isShow={showDeleteForm}
        activeProduct={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitDelete(data);
        }}
        onClose={() => {handleCloseDeleteFormShow()}}
      />

      <ProductDetailModal 
        isShow = {showDetailModal}
        onClose={() => {handleCloseDetailModalShow()}}
        product = {clickedElement}
      />
  </>
  );
}
