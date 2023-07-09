import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
// components

import { orderAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Loading from '../components/loading/Loading';
import Scrollbar from '../components/scrollbar/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';
import {fDate} from '../utils/formatTime';
import Iconify from '../components/iconify/Iconify';
import UpdateOrderModal from '../sections/@dashboard/order/UpdateOrderModal';
import CreateOrderModal from '../sections/@dashboard/order/CreateOrderModal';
import Page from '../enums/page';
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import ReactPaginate from 'react-paginate';
import FilterBar from '../components/filtertoolbar';
import FilterOrderModal from '../sections/@dashboard/order/FilterOrderModal';

const TABLE_HEAD = [
  { id: 'ID', label: 'Mã định danh', alignRight: false },
  { id: 'CusotmerName', label: 'Tên khách hàng', alignRight: false },
  { id: 'Phone', label: 'Số điện thoại', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'Products', label: 'Sản phẩm', alignRight: false },
  { id: 'Status', label: 'Trạng thái', alignRight: false },
  { id: 'CreatedAt', label: 'Ngày tạo', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function OrderPage() {
  const token = useSelector(state => state.token.value)

  const dispatch = useDispatch()


  const [orders, setOrder] = useState([])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showFilterForm, setShowFilterForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const [searchTerm, setSearchTerm] = useState('')

  const [filterOptions, setFilterOptions] = useState('')

  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };

  function handleShowFilterModal() {
    setShowFilterForm(true)
  }
  function handleCloseFilterModal() {
    setShowFilterForm(false)
  }

  function handleOnSubmitFilter(filterOptions) {

    let query = '';
      query = filterOptions.email !== null ? `email=${filterOptions.email}&`: query
      query = filterOptions.startDate  !== null && filterOptions.startDate  !== ''? query + `startDate=${filterOptions.startDate}&`: query
      query = filterOptions.endDate !== null && filterOptions.endDate  !== '' ? query + `endDate=${filterOptions.endDate}&`: query
      query = filterOptions.status !== null ? query + `status=${filterOptions.status}&`: query      
      query = filterOptions.isPaid !== null ? query + `isPaid=${filterOptions.isPaid}`: query

    setFilterOptions(query);
    handleCloseFilterModal();
  }

  function handleClearFilter() {
    setFilterOptions('')
    handleCloseFilterModal();
  }

  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(order) {
    setClickedElement(order)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  useEffect(() => {
    async function getOrder() {
      try {
        const res = await orderAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}&${filterOptions}`,token);
        setOrder(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      }
    }
    if(token)
      getOrder();
  }, [token, activePage, searchTerm, filterOptions]);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await orderAPI.create(data, token)
      const newOrder = [...orders]
      newOrder.unshift(res.data)
      setOrder(newOrder)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_NEWS}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_NEWS}))
      setShowCreateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    dispatch(showLoading())
    try {
      data['id'] = clickedElement.id
      const resData = await orderAPI.update(data, token)
      const filterOrder = orders.filter((r) => r.id !== resData.data.id)
      const newOrder = [resData.data, ...filterOrder]
      setOrder(newOrder)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_NEWS}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_NEWS}))
      setShowUpdateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }


  return (
    <>
    <Helmet>
      <title> Đơn hàng </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Đơn hàng
      </Typography>
      <Button onClick={handleCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
        Tạo mới
      </Button>
    </Stack>
    <Stack>
      <FilterBar
        filterName={searchTerm}
        onFilterName={
          (e) => {setSearchTerm(e.target.value)}
        }
        onShowFilter={handleShowFilterModal}
      />
    </Stack>
    <Card>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {orders.map((row) => {
                const { id, customerName, phone, email, createdAt, details, status, isPaid} = row;
                return (
                  <TableRow key={id}>
                    <TableCell align="left">{id}</TableCell>

                    <TableCell align="left">{customerName}</TableCell>

                    <TableCell align="left">{phone}</TableCell>
                    <TableCell align="left">{email}</TableCell>
                    <TableCell align="left">{
                      <select>
                          {
                             details.map(detail => (
                              <option>{`${detail.productName} - ${detail.quantity}`}</option>
                            ))
                          }
                      </select>
                     
                    }</TableCell>

                    <TableCell align="left">{
                      `${status === 'pending' ? 'Chờ duyệt' : status === 'success' ? 'Thành cộng' : 'Thất bại'} - ${isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`
                    }</TableCell>

                    <TableCell align="left">{
                      fDate(createdAt)
                    }</TableCell>

                    <TableCell align="left">
                        <ActionDropdown
                          clickedElement={row}
                          onUpdateClick={() => {
                            handleUpdateFormShow(row)
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
            pageRangeDisplayed={2}
            pageCount={pageCount? pageCount: 0}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </TableContainer>
      </Scrollbar>
    </Card>

    <CreateOrderModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onShow={() => handleCreateFormShow()}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateOrderModal
        isShow={showUpdateForm}
        activeOrder={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <FilterOrderModal
        isShow={showFilterForm}
        onSubmit={handleOnSubmitFilter}
        onClear={handleClearFilter}
        onClose={() => handleCloseFilterModal()}
      />
  </>
  );
}
