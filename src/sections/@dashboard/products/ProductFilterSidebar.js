import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';
import { useEffect, useState } from 'react';
import { categoryAPI, productAPI } from '../../../api/ConfigAPI';
import axios from 'axios';
import { setErrorValue } from '../../../redux/slices/ErrorSlice';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export const COLORS = [
  "blue",
  "brown",
  "gray",
  "green",
  "orange",
  "pink",
  "red",
  "black",
  "white"
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, onFilter }) {


  function handleChangeColor(isChecked, color) {
    // if (isChecked) {
    //   const tempColors = [...selectedColors, color]
    //   setSelectedColors(tempColors)
    // } else {
    //   const tempColors = selectedColors.filter(c => c !== color)
    //   setSelectedColors(tempColors)
    // }
  }
  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Lọc&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Lọc sản phẩm
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Danh mục sản phẩm
              </Typography>
              <RadioGroup>
                {/* {categories.map((item) => (
                  <FormControlLabel onChange={(e) => {
                    setSelectedCate(e.target.value)
                  }} key={item._id} value={item._id} control={<Radio />} label={item.name} />
                ))} */}
              </RadioGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Màu sắc
              </Typography>
              <ColorMultiPicker
                name="colors"
                //selected={selectedColors}
                colors={COLORS}
                onChangeColor={handleChangeColor}
                sx={{ maxWidth: 38 * 4 }}
              />
            </div>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            // onClick={() => {
            //   if (openFilter)
            //     onFilter({ selectedCate, selectedColors })
            // }}
          >
            Thực hiện lọc
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
