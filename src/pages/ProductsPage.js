import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';

import { API_URL, xApiKey } from '../api/api';
// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [keySearch, setkeySearch] = useState('');
  const json = JSON.parse(localStorage.getItem('tokens'));
  const user = JSON.parse(localStorage.getItem('user'));
  const [dataUid, setDataUid] = useState([]);


  const columns = [
    // { field: 'id', headerName: 'ID', hide:true, width: 100, editable: false,},
    { field: 'uid', headerName: 'UID', width: 300, editable: true,},
    { field: 'msisdn', headerName: 'Số điện thoại', width: 300, editable: true,},
    { field: 'status', headerName: 'Trạng thái', editable: false, width: 200, align:'center',
      renderCell: (params) => {
        const onClick= () => {
          
        }
        return (
          <>
            {
              params.row.status === 'active' ?
              <p style={{color: 'green'}}>Hoạt động</p> 
              : 
              <p style={{color: 'red'}}>không hoạt động</p>
            }
          </>
        )
      }
    },

  ];
  const renameObjectKey = (object) => {
    // gán giá trị cũ vào thuộc tính mới
    object.id = object._id;
    
    delete object._id;
  };
  const getDataUid = async ()=>{
  
      
    await fetch(`${API_URL}uid/all?keyword=${keySearch}`, {
      headers: {
        'x-api-key': xApiKey,
        'x-client-id': user._id,
        'authorization': json.accessToken
      },
      method: 'GET',
    }).then((response) => response.json())
    .then(data => {
      const dataGrid = data.data.selectUid;
      dataGrid.forEach(element => {
        
        renameObjectKey(element);
      });
      setDataUid(dataGrid)
    })  
  }

  useEffect( ()=>{
    getDataUid()
 },[])
  return (
    <>
      <Helmet>
        <title> Dữ liệu khách hàng tiềm năng </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" >
          Khách hàng tiềm năng
        </Typography>
        {/* <TextField
          id="outlined-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          fullWidth
        />
        <Typography variant="h4" >
          Khách hàng tiềm năng
        </Typography> */}
      </Stack>

        {/* <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between">
          <Grid item lg={6}>
          </Grid>
         
          
        </Stack> */}

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField id="outlined-search" fullWidth label="Search field" type="search" />
          </Grid>
          <Grid item xs={12} lg={4} md={4}>
            {/* <Item>xs=6 md=4</Item> */}sad
          </Grid>
        </Grid>

          <DataGrid 
            rows={dataUid}
            columns={columns} 
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            columnVisibilityModel={{
              id: false,
            }}
            pageSizeOptions={[5, 10, 25]}
            showCellVerticalBorder
            showColumnVerticalBorder
            
          />


          

    </>
  );
}
