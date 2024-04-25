import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  selectCommentDialog,
  closeCommentDialog,
  addComment,
  getComments,
} from "app/store/taskSlice";
import { selectUser } from "app/store/userSlice";
import io from "socket.io-client";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  message: yup.string().required("You must enter a comment"),
});

const defaultValues = {
  message: "",
};

export default function AddCommentDialog() {
  const open = useSelector(selectCommentDialog).open;
  const taskId = useSelector(selectCommentDialog).id;
  const task = useSelector(selectCommentDialog).task;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(data) {
    const updatedData = {
      ...data,
      taskId: taskId,
      from: user?._id ? user._id : taskId,
      to: user?._id ? taskId : task.userId,
      taskCreaterId: task.userId,
    };
    const socket = io(process.env.REACT_APP_API_URL);
    var socketComment = {
      msg: {
        message: {
          text: data.message,
        },
        sender: user?._id ? user._id : taskId,
        taskId: taskId,
        taskCreaterId: task.userId,
      },
      to: taskId,
    };
    console.log("\n\n ===> send comment, ", socketComment);
    socket.emit("add-comment", socketComment);
    dispatch(addComment(updatedData))
      .then(() => dispatch(getComments({ taskId: taskId })))
      .then(() => handleClose());
  }

  const handleClose = () => {
    dispatch(closeCommentDialog());
    reset(defaultValues);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ backgroundColor: "	#90EE90" }}
        >
          {"Add New Comment"}{" "}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#DAF7A6" }}>
          <div className="relative flex flex-col flex-auto items-center">
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Comment"
                  placeholder="Comment"
                  id="notes"
                  error={!!errors.notes}
                  helperText={errors?.notes?.message}
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  InputProps={{
                    className: "max-h-min h-min items-start",
                    startAdornment: (
                      <InputAdornment className="mt-16" position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:menu-alt-2
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
          <Box className="flex items-center mt-40 py-14">
            <Button className="ml-auto" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="ml-8"
              variant="contained"
              color="success"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
