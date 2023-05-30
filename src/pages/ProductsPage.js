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
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

import SearchIcon from '@mui/icons-material/Search';
import ExcelIcon from '@mui/icons-material/DownloadForOfflineRounded';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { API_URL, xApiKey } from '../api/api';
// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [keySearch, setkeySearch] = useState('');
  const json = JSON.parse(localStorage.getItem('tokens'));
  const user = JSON.parse(localStorage.getItem('user'));
  const [dataUid, setDataUid] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [category2, setCategory2] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [loading, setisLoading] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [rowCountState, setRowCountState] = useState(0);
  const columns = [
    // { field: 'id', headerName: 'ID', hide:true, width: 100, editable: false,},
    { field: 'uid', headerName: 'UID FaceBook', width: 300, editable: true},
    { field: 'msisdn', headerName: 'Số điện thoại', width: 300, editable: true,},
    {
      field: "category",
      headerName: "Danh mục",
      width: 300,
      renderCell: (params) => {
        return <div className="rowitem">{params.row.category.name}</div>;
      },
 },
    { field: 'status', headerName: 'Trạng thái', editable: false, width: 200, align:'center', justifyContent: 'center',
      renderCell: (params) => {
        return (
          <>
            {
              params.row.status === 'active' ?
              <p style={{color: 'green'}}>Chưa lấy</p> 
              : 
              <p style={{color: 'red'}}>Đã lấy</p>
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
  
    setisLoading(true)
    await fetch(`${API_URL}uid/all?keyword=${keySearch}&limit=${limit}&category=${category}&status=${status}&page=${page}`, {
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
      setRowCountState(data.data.total);
      setisLoading(false)
    })  
  }

  const getCategory = async () =>{
    await fetch(`${API_URL}category/all`, {
      headers: {
        'x-api-key': xApiKey,
        'x-client-id': user._id,
        'authorization': json.accessToken
      },
      method: 'GET',
    }).then((response) => response.json())
    .then(data => {
      const dataGrid = data.data;
      setDataCategory(dataGrid)
    })  
  }

  const getExcelUid= async () =>{

    const dataForm = {
      category: category2,
      limit: count
    }

    await fetch(`${API_URL}uid/export?limit=${count}&category=${category2}`, {
      headers: {
        'x-api-key': xApiKey,
        'x-client-id': user._id,
        'authorization': json.accessToken,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=dulieu.xlsx`
      },
      method: 'GET',
      // body: JSON.stringify(dataForm)
    }).then((response) => response.blob())
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `dulieu.xlsx`,
      );
  
      // Append to html link element page
      document.body.appendChild(link);
  
      // Start download
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      handleClose();
      setCount('')
    });
  }

  useEffect( ()=>{
    getCategory();
  },[])

  useEffect( ()=>{
    getDataUid();
  },[status, category])
  useEffect( ()=>{
    setPage(1)
  },[keySearch])
  const handlePaginationModelChange= async(event)=>{
    setLimit(event.pageSize);
    setPage(event.page + 1);
    await getDataUid();
  }

  
  return (
    <>
      <Helmet>
        <title> Dữ liệu khách hàng tiềm năng </title>
      </Helmet>

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4" >
              Khách hàng tiềm năng
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={10} md={4}>
              <TextField 
                id="outlined-search" 
                fullWidth 
                label="Tìm kiếm" 
                type="search"
                onKeyPress={()=> getDataUid()}
                value={keySearch}
                onChange={(event)=> setkeySearch(event.target.value)} 
              />
            
            </Grid>
            <Grid item xs={2} lg={1} md={1}>
              <><SearchIcon onClick={()=> getDataUid()} style={{paddingRight:5, alignContent: 'center', marginTop:13, fontSize: 30, cursor: 'pointer'}} color='success'/></>
            </Grid>
            <Grid item xs={12} lg={3} md={3}>
              <>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Trạng thái"
                  onChange={(event)=>{
                    setStatus(event.target.value)
                  }}
                >
                  {/* {dataCategory.map((item) => console.log(item))} */}
                      <MenuItem value='ALL'>
                        Tất cả
                      </MenuItem>
                      <MenuItem value='active'>
                        Chưa lấy
                      </MenuItem>
                      <MenuItem value='inactive'>
                        Đã lấy
                      </MenuItem>
                
                </Select>
              </FormControl>
              </>
            </Grid>
          
            <Grid item xs={12} lg={3} md={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="Danh mục"
                  onChange={(event)=>{
                    setCategory(event.target.value)
                  }}
                >
                  <MenuItem value='ALL'>
                    Tất cả
                  </MenuItem>
                  {dataCategory.map((option) => {
                    return (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={1} md={1}>
            <><ExcelIcon onClick={handleClickOpen}  style={{paddingRight:5, alignContent: 'center', marginTop:13, fontSize: 30, cursor: 'pointer'}} color='success' label='Xuất'/></>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} mt={3}>
            <div style={{minHeight:500, height:670}}>
              <DataGrid 
                  loading = {loading}
                  rows={dataUid}
                  columns={columns} 
                  
                  pageSizeOptions={[10, 25, 50 , 100]}
                  rowCount={rowCountState}
                  paginationMode="server"

                  onPaginationModelChange={(event)=>handlePaginationModelChange(event)}

                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                        page:1
                      },
                    },
                  }}
                  columnVisibilityModel={{
                    id: false,
                  }}
                
                  showCellVerticalBorder
                  showColumnVerticalBorder
                  
                />
            </div>
            </Grid>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Xuất dữ liệu</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus
            id="outlined-search" 
            fullWidth 
            style={{marginTop:10}}
            label="Số lượng" 
            type="number"
            value={count}
            onChange={(event)=> setCount(event.target.value)} 
          />  
          <FormControl fullWidth   style={{marginTop:20}}>
                <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category2}
                  label="Danh mục"
                  onChange={(event)=>{
                    setCategory2(event.target.value);
                  }}
                >
                  {dataCategory.map((option) => {
                    
                    return (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>    
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={()=>getExcelUid()}>Xuất</Button>
        </DialogActions>
      </Dialog>
        </Container>


          

    </>
  );
}
