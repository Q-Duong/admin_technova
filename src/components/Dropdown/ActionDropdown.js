import React from 'react';
import { IconButton, MenuItem, Popover } from '@mui/material';
import { useState } from 'react';
import Iconify from '../iconify/Iconify';

function ActionDropdown(props) {
  const { clickedElement, onUpdateClick, onDeleteClick, onDetailClick } = props;
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleUpdateClick = () => {
    handleCloseMenu()
    if (onUpdateClick)
      onUpdateClick(clickedElement)
  }
  const handleDeleteClick = () => {
    handleCloseMenu()
    if (onDeleteClick)
      onDeleteClick(clickedElement)
  }

  const handleDetailClick = () => { 
    handleCloseMenu()
    if (onDetailClick)
      onDetailClick(clickedElement)
  }

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
        <Iconify icon={'eva:more-vertical-fill'} />
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {onDetailClick && (
          <MenuItem onClick={handleDetailClick}>
            <Iconify icon={'majesticons:checkbox-list-detail-line'} sx={{ mr: 2 }} />
            Xem chi tiết
          </MenuItem>
        )}
        {onUpdateClick && (
          <MenuItem onClick={handleUpdateClick}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Sửa
          </MenuItem>
        )}

        {onDeleteClick && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Xóa
          </MenuItem>
        )}
      </Popover>
    </>
  );
}

export default ActionDropdown;