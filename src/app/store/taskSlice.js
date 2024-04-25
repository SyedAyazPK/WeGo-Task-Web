import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
import { showMessage } from "./fuse/messageSlice";
import axios from "axios";
const { REACT_APP_API_URL } = process.env;

const initialState = {
  tasks: [],
  getDate: new Date(),
  tasksForAssign: [],
  selectedTasks: [],
  showDelete: true,
  comments: [],
  loadingComments: false,
  commentDialog: {
    open: false,
    id: null,
    task: undefined,
  },
};

export const addTask = createAsyncThunk(
  "task/addTask",
  async (task, { dispatch, getState }) => {
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/tasks/`, task);
      const data = await response;
      dispatch(
        showMessage({
          message: "Task Created",
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error occured while creating task",
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (task, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/tasks?ids=${!task || task === ":id" ? "" : task}`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      // dispatch(
      //   showMessage({
      //     message: error.response.data.message,
      //     autoHideDuration: 2000,
      //     variant: "error",
      //     anchorOrigin: {
      //       vertical: "top",
      //       horizontal: "right",
      //     },
      //   })
      // );
      return null;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.delete(`${REACT_APP_API_URL}/tasks/${id}`);
      const data = await response;
      dispatch(
        showMessage({
          message: "Task Deleted",
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error occured",
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "task/updateTask",
  async (task, { dispatch, getState }) => {
    try {
      const response = await axios.patch(
        `${REACT_APP_API_URL}/tasks/status/${task.id}`,
        { to: task.to, from: task.from }
      );
      const data = await response;
      dispatch(
        showMessage({
          message: "Task Status Updated",
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error occured while updating task",
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const assignTask = createAsyncThunk(
  "task/assignTask",
  async (task, { dispatch, getState }) => {
    try {
      const response = await axios.patch(
        `${REACT_APP_API_URL}/tasks/assign?ids=${task}`,
        { reAssigned: task.reAssigned }
      );
      const data = await response;
      dispatch(
        showMessage({
          message: "Code copied to clipboard!",
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error occured while updating task",
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const getAssignedTask = createAsyncThunk(
  "task/getAssignedTask",
  async (searchParams, { dispatch, getState }) => {
    if (searchParams === ":id") {
      return null;
    }
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/tasks/assigned-task?ids=${searchParams}`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response.data.message,
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const searchTasks = createAsyncThunk(
  "task/searchTasks",
  async (searchParams, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/tasks/${searchParams}`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response.data.message,
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const addComment = createAsyncThunk(
  "task/addComment",
  async (task, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/comment/addcomments`,
        task
      );
      const data = await response;
      dispatch(
        showMessage({
          message: "Comment added",
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error occured while adding comment",
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return null;
    }
  }
);

export const getComments = createAsyncThunk(
  "task/getComments",
  async (task, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/comment/getcomments`,
        task
      );
      const data = await response;
      return data;
    } catch (error) {
      return null;
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    recordDate: (state, action) => {
      state.updatedDate = action.payload;
    },
    setNewDate: (state, action) => {
      state.getDate = action.payload;
    },
    setTasksForAssign: (state, action) => {
      state.tasksForAssign = action.payload;
    },
    openCommentDialog: (state, action) => {
      state.commentDialog = {
        open: true,
        id: action.payload.id,
        task: action.payload,
      };
    },
    closeCommentDialog: (state, action) => {
      state.commentDialog = {
        open: false,
        id: null,
        task: undefined,
      };
    },

    setSelectedTasks: (state, action) => {
      if (action.payload === "close") {
        state.selectedTasks = [];
      } else {
        const isFound = state.selectedTasks.some(function (el) {
          return el === action.payload;
        });
        if (isFound == false) {
          state.selectedTasks.push(action.payload);
        } else {
          state.selectedTasks = state.selectedTasks.filter(
            (item) => item !== action.payload
          );
        }
      }
    },
  },
  extraReducers: {
    [addTask.fulfilled]: (state, action) => {},
    [getTasks.fulfilled]: (state, action) => {
      state.tasks = action.payload ? action.payload.result : [];
      state.showDelete = true;
      state.tasksForAssign = action.payload ? action.payload.result : [];
    },
    [searchTasks.fulfilled]: (state, action) => {
      state.tasks = { results: action.payload };
    },
    [getAssignedTask.fulfilled]: (state, action) => {
      state.tasks = action.payload.result;
      state.showDelete = false;
    },
    [getComments.pending]: (state, action) => {
      state.comments = [];
      state.loadingComments = true;
    },
    [getComments.fulfilled]: (state, action) => {
      state.comments = action.payload.data;
      state.loadingComments = false;
    },
  },
});

export const {
  setNewDate,
  setTasksForAssign,
  setSelectedTasks,
  openCommentDialog,
  closeCommentDialog,
} = taskSlice.actions;

export const selectTasks = ({ task }) => task.tasks;
export const selectDate = ({ task }) => task.getDate;
export const selectTasksForAssign = ({ task }) => task.tasksForAssign;
export const selectSelectedTasks = ({ task }) => task.selectedTasks;
export const selectShowDelete = ({ task }) => task.showDelete;
export const selectCommentDialog = ({ task }) => task.commentDialog;
export const selectComments = ({ task }) => task.comments;
export const selectLoadingComments = ({ task }) => task.loadingComments;

export default taskSlice.reducer;
