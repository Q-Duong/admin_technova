import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoading, showLoading } from '../../../redux/slices/LoadingSlice';
import axios from 'axios';
import Loading from '../../../components/loading/Loading';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../../../api/ConfigAPI';
import { Image } from 'react-bootstrap';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const { loading, token } = useSelector(state => {
    return {
      loading: state.loading.value,
      token: state.token.value
    }
  })
  const [readNotifications, setReadNotifications] = useState([]);
  const [unReadNotifications, setUnReadNotifications] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkRead = async (notification) => {
    try {  
      await notificationAPI.update(notification.id, token);
      const tempReadNotifications = [...readNotifications, {...notification, isRead: true}]
      const tempUnReadNotifications = unReadNotifications.filter(n => n.id !== notification.id)
      setReadNotifications(tempReadNotifications);
      setUnReadNotifications(tempUnReadNotifications)
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(alert(error.response ? error.response.data.message : error.message));
      else dispatch(alert(error.toString()));
      navigate("/error")
    }
  }

  const handleMarkAllAsRead = async () => {
      try {  
        await Promise.all(unReadNotifications.map((notification) => notificationAPI.update(notification.id, token)));
        const tempReadNotifications = [...readNotifications, ...unReadNotifications.map(n => {
          return {
            ...n,
            isRead: true
          }
        })]
        setReadNotifications(tempReadNotifications);
        setUnReadNotifications([])
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(alert(error.response ? error.response.data.message : error.message));
        else dispatch(alert(error.toString()));
        navigate("/error")
      }
  };

  useEffect(() => {
    async function getNotifications() {
      dispatch(showLoading());
      try {
        const resReadNotifications = await notificationAPI.getAll("isRead=true", token);
        const resUnReadNotifications = await notificationAPI.getAll("isRead=false", token);
        setReadNotifications(resReadNotifications.data.data);
        setUnReadNotifications(resUnReadNotifications.data.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    getNotifications();
  }, [dispatch, token])
  
   return (
      <>
        <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Badge badgeContent={unReadNotifications?.length} color="error">
            <Iconify icon="eva:bell-fill" />
          </Badge>
        </IconButton>

        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              ml: 0.75,
              width: 360,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">Thông báo</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Bạn có {unReadNotifications?.length} thông báo chưa đọc
              </Typography>
            </Box>

            {unReadNotifications.length > 0 && (
              <Tooltip title="Đánh dấu tất cả đã đọc">
                <IconButton color="primary" onClick={handleMarkAllAsRead}>
                  <Iconify icon="eva:done-all-fill" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  Chưa đọc
                </ListSubheader>
              }
            >
              {unReadNotifications.map((notification) => (
                <NotificationItem handleMarkRead={() => {handleMarkRead(notification)}} key={notification.id} notification={notification} />
              ))}
            </List>

            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  Đã đọc
                </ListSubheader>
              }
            >
              {readNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </List>
          </Scrollbar>

          <Divider sx={{ borderStyle: 'dashed' }} />
        </Popover>
      </>
  );
}

// ----------------------------------------------------------------------


function NotificationItem({handleMarkRead, notification }) {

  return (
    <ListItemButton
      onClick={() => { handleMarkRead(notification) }}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification?.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Image src="/assets/icons/ic_notification_chat.svg" alt="image"/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        secondary={
          <>
          <Typography variant="subtitle2">
      <Typography component="div" variant="body2" sx={{ color: 'text.secondary' }}>
         <div dangerouslySetInnerHTML={{ __html: notification.content }} />
      </Typography>
    </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification?.createdAt)}
          </Typography>
          </>
        }
      />
    </ListItemButton>
  );
}

