import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import _ from "@lodash";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DateTimePicker from "@mui/lab/DateTimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers";

import { useDeepCompareEffect } from "@fuse/hooks";
import TaskForm from "./TaskForm";
import { addTask, selectDate, setNewDate } from "app/store/taskSlice";
import { getTasks } from "../../../store/taskSlice";
import { selectUser } from "app/store/userSlice";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";
import moment from "moment";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required("You must enter a name"),
});

const defaultValues = {
  title: "",
  dueDate: new Date(),
  description: "",
};

export default function AddTaskDialog() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [value, setDate] = React.useState(new Date());
  const newDate = useSelector(selectDate);
  const user = useSelector(selectUser);

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  function onSubmitNew(data) {
    data.dueDate = newDate;
    let newDates;
    if (
      data.reminder == "30" ||
      data.reminder == "60" ||
      data.reminder == "1"
    ) {
      console.log(data.reminder);
      newDates = moment(newDate).subtract(data.reminder, "minutes").toDate();
    }
    const updatedData = {
      ...data,
      reminder: {
        isCron: newDates ? false : true,
        value: newDates ? newDates : data.reminder,
      },
    };
    console.log(updatedData, "updatedData");

    dispatch(addTask(updatedData))
      .then(() => dispatch(getTasks()))
      .then(() => {
        reset(defaultValues);
        handleClose();
      });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        onClick={handleClickOpen}
        className="px-24"
        style={{ borderRadius: "7px" }}
        disabled={user.role?.length < 1}
      >
        <FuseSvgIcon className="text-48" size={16} color="white">
          material-outline:add
        </FuseSvgIcon>{" "}
        <span> Add Task</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ backgroundColor: "	#90EE90" }}
        >
          {"Add New Task"}{" "}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#DAF7A6" }}>
          <div className="relative flex flex-col flex-auto items-center">
            <div className="md:flex w-full justify-between">
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextField
                    className="mt-16 max-h-auto"
                    {...field}
                    label={`${_.upperFirst(form.type)} Title`}
                    placeholder="Task title"
                    id="title"
                    error={!!errors.title}
                    helperText={errors?.title?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <div className="flex w-full md:ml-16 mt-16 mb-16 items-center">
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField {...props} fullWidth />
                      )}
                      label="Due Date"
                      value={newDate}
                      onClose={() => console.log("bye")}
                      onChange={(newValue) => {
                        dispatch(setNewDate(newValue));
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  className="mt-8"
                  {...field}
                  label={`${_.upperFirst(form.type)} Description`}
                  // placeholder="Description"
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
            <div className="w-full md:flex justify-between mt-8">
              <Controller
                render={({ field }) => (
                  <FormControl error={!!errors.Select} fullWidth>
                    <FormLabel
                      className="font-medium text-12 mt-8"
                      component="legend"
                    >
                      Reminder
                    </FormLabel>
                    <Select {...field} variant="outlined" fullWidth>
                      <MenuItem value="*/15 * * * *">Every 15 minutes</MenuItem>
                      <MenuItem value="*/30 * * * *">Every 30 minutes</MenuItem>
                      <MenuItem value="0 */1 * * *">Every 1 hour</MenuItem>
                      <MenuItem value="30">30 minutes before due time</MenuItem>
                      <MenuItem value="60">1 hour before due time</MenuItem>
                    </Select>
                    <FormHelperText>{errors?.reminder?.message}</FormHelperText>
                  </FormControl>
                )}
                name="reminder"
                control={control}
              />
            </div>
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
              onClick={handleSubmit(onSubmitNew)}
            >
              Create
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
