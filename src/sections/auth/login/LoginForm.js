import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {  Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { authAPI } from '../../../api/ConfigAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../redux/slices/TokenSlice';
import axios from 'axios';
import { closeLoading, showLoading } from '../../../redux/slices/LoadingSlice';
import Loading from '../../../components/loading/Loading';
import { Form } from 'react-bootstrap';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { loading } = useSelector(state => {
    return {
      loading: state.loading.value,
    }
  })
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    try {
      e.preventDefault()
      dispatch(showLoading());
      const res = await authAPI.login({email, password})
      dispatch(setToken(res.data.accessToken))
      navigate("/dashboard")
    } catch (error) {
      if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message));
      else alert((error.toString()));
    } finally {
      dispatch(closeLoading());
    }
  };

  return (
    loading ?
      <Loading /> :
      <>
        <Form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField value={email} onChange={(e) => { setEmail(e.target.value) }} name="text" label="Nhập email" />
            <TextField
              name="password"
              label="Nhập mật khẩu"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <LoadingButton style={{ marginTop: "10px" }} fullWidth size="large" type="submit" variant="contained">
            Đăng nhập
          </LoadingButton>
        </Form>
      </>
  );
}
