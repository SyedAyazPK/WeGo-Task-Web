import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import _ from "@lodash";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Box, Grid, Typography, TextField } from "@mui/material";
import {
  assignTask,
  getTasks,
  selectSelectedTasks,
  selectTasks,
  selectTasksForAssign,
  setSelectedTasks,
  setTasksForAssign,
} from "app/store/taskSlice";
import { TaskCard } from "../TaskCard";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import { showMessage } from "app/store/fuse/messageSlice";
import { selectUser } from "app/store/userSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required("You must enter a name"),
});

export default function AssignTaskDialog() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const tasksForAssign = useSelector(selectTasksForAssign);
  const selectedTasks = useSelector(selectSelectedTasks);
  const user = useSelector(selectUser);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      resolver: yupResolver(schema),
    }
  );

  const form = watch();

  function onSubmitNew(data) {
    console.log(selectedTasks, "data");
    dispatch(assignTask(selectedTasks)).then(() =>
      window.navigator.clipboard.writeText(
        `https://test.wegotask.com/tasks/${selectedTasks.join(",")}`
      )
    );
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setSelectedTasks("close"));
  };

  return (
    <div>
      <Button
        variant="contained"
        color="info"
        style={{ borderRadius: "7px" }}
        disabled={user.role?.length < 1}
        onClick={() => {
          dispatch(getTasks());
          handleClickOpen();
        }}
      >
        <FuseSvgIcon className="text-16" size={16} color="white">
          material-twotone:autorenew
        </FuseSvgIcon>
        <span>Assign Task</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ backgroundColor: "	powderblue" }}
          className="flex justify-between"
        >
          <div>{"Assign Task"} </div>
          <Button className="ml-auto" onClick={handleClose}>
            <FuseSvgIcon className="text-48" size={48} color="error">
              heroicons-solid:x-circle
            </FuseSvgIcon>
          </Button>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "ghostwhite" }}>
          <div className="  my-16">
            <div className="flex items-center mb-24">
              <div className="w-full">
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <TextField
                      className=" w-full  "
                      {...field}
                      label={`${_.upperFirst(form.type)} Code`}
                      placeholder="Selected Tasks"
                      id="Code"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={`https://test.wegotask.com/tasks/${selectedTasks.join(
                        ","
                      )}`}
                    />
                  )}
                />
              </div>

              <Button
                className="ml-16 px-32"
                variant="contained"
                color="info"
                disabled={selectedTasks.length < 1}
                onClick={onSubmitNew}
                style={{ borderRadius: "7px" }}
              >
                Copy
              </Button>
            </div>

            <Typography variant="h6" className="mb-8">
              {" "}
              Select task(s)
            </Typography>
            <Box sx={{ width: "100%" }}>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {tasksForAssign?.map((task) => (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    onClick={() => dispatch(setSelectedTasks(task._id))}
                  >
                    <TaskCard
                      status={task.status}
                      title={task.title}
                      subtitle={task.description}
                      date={task.dueDate}
                      id={task._id}
                      task={task}
                      border={selectedTasks.some(function (el) {
                        return el === task._id;
                      })}
                      showActions
                    />{" "}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
