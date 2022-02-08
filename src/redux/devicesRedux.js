import Axios from 'axios';
import { API_URL } from '../config';

/* selectors */
export const getAll = ({ devices }) => devices.data;

/* action name creator */
const reducerName = 'devices';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });

/* thunk creators */
export const fetchDevices = () => (dispatch) => {
  dispatch(fetchStarted());
  Axios
    .get(`${API_URL}/devices`)
    .then(res => dispatch(fetchSuccess(res.data)))
    .catch(err => dispatch(fetchError(err.message || true)));
};

export const fetchDeviceById = (id) => (dispatch) => {
  dispatch(fetchStarted());
  Axios
    .get(`${API_URL}/devices/${id}`)
    .then(res => dispatch(fetchSuccess(res.data)))
    .catch(err => dispatch(fetchError(err.message || true)));
};

export const toggleDevice = (socket, deviceToPost) => (dispatch) => {
  Axios
    .post(`${API_URL}/devices/`, deviceToPost)
    .then(res => {
      socket.broadcast.emit('refresh');
    } )
    .catch(err => dispatch(fetchError(err.message || true)));
};

/* reducer */
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    default:
      return statePart;
  }
}
