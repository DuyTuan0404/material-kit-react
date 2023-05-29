import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { API_URL, xApiKey } from '../../../api/api';
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });
export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [message,  setMessage] = useState('');
  const [typeNoti, setTypeNoti]= useState("success");
  const handleOpen = () => {
    setOpen(true);
  };


  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleClick = async () => {
    const dataForm = {
      email,
      password
    }
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': xApiKey
     },
      body: JSON.stringify(dataForm)
    };
    const response = await fetch(`${API_URL}auth/signin`, requestOptions);
    const result = await response.json();
    setMessage(result.message)
    console.log(result);
    if (result.status === 'success' || result.status === 200) {
      setTypeNoti("success")
      localStorage.setItem('user', JSON.stringify(result.data.user));
      localStorage.setItem('tokens', JSON.stringify(result.data.tokens));
       navigate('/dashboard', { replace: true });
    }else{
      setTypeNoti("error")
     
    }
    handleOpen();

  };

  return (
    <>
      <Stack spacing={3}>
        <TextField type='email' name="email" label="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />

        <TextField
          name="password"
          label="Mật khẩu"
          value={password} onChange={(event) => setPassword(event.target.value)}
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Ghi nhớ đăng nhập" />
        <Link variant="subtitle2" underline="hover">
          Quên mật khẩu?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Đăng nhập
      </LoadingButton>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}  anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        {/* <Alert onClose={handleClose} severity={typeNoti} sx={{ width: '100%' }}>
          {message}
        </Alert> */}
        <Alert severity={typeNoti}>{message}</Alert>
      </Snackbar>
      

    </>
  );
}
