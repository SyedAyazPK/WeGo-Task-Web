import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import { Avatar, Typography, Button, Tooltip } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  assignTask,
  deleteTask,
  getAssignedTask,
  getComments,
  getTasks,
  openCommentDialog,
  selectComments,
  selectLoadingComments,
  updateTaskStatus,
} from "app/store/taskSlice";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import io from "socket.io-client";
import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CircularProgress from "@mui/material/CircularProgress";

export const TaskCard = ({
  id,
  status,
  title,
  subtitle,
  date,
  task,
  showActions,
  border,
  showDelete,
}) => {
  const dispatch = useDispatch();

  const setColor = (status) => {
    if (status === "inCompleted") {
      return "#FF5700";
    } else if (status === "completed") {
      return "#00B070";
    } else return "#CBC3E3";
  };

  const pathUrl = window.location.pathname.split("/");
  const taskIds = pathUrl[pathUrl.length - 1];
  const comments = useSelector(selectComments);
  const user = useSelector(selectUser);
  const loadingComments = useSelector(selectLoadingComments);
  const [open, setOpen] = useState(false);
  const handleClickAway = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <div
      style={
        border == true
          ? {
              backgroundColor: setColor(status),
              color: "white",
              borderRadius: "7px",
              border: "5px solid black",
            }
          : {
              backgroundColor: setColor(status),
              color: "white",
              borderRadius: "7px",
            }
      }
    >
      <div
        style={
          task.reAssigned == true && task.isAssignedToOther == true
            ? { backgroundColor: "purple", borderRadius: "7px" }
            : { borderRadius: "7px" }
        }
        className="p-16 cursor-pointer"
      >
        <div className="flex justify-between  w-full">
          <div className="w-full">
            <div>
              <Typography className="uppercase card-title">{title}</Typography>
              <Typography className="turncate">{subtitle}</Typography>
            </div>
          </div>
          <div className="w-full flex justify-end">
            {moment(task.dueDate).format("MM/DD/YYYY hh:mm A")}
          </div>
        </div>
        <div className="flex justify-between items-center w-full pt-16">
          <div className="w-full">
            <div className="flex items-center">
              <Avatar src={""} />
              <Typography variant="" className="mx-8">
                +03
              </Typography>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Typography className="mx-8 font-semibold uppercase">
              {status}
            </Typography>
          </div>
        </div>

        {showActions && (
          <div className="flex justify-between items-center w-full pt-16">
            <div className="w-full">
              <Button
                className=""
                variant="contained"
                color={status === "completed" ? "error" : "success"}
                onClick={() => {
                  dispatch(
                    updateTaskStatus({
                      to: status === "completed" ? "inCompleted" : "completed",
                      from: status,
                      id: id,
                    })
                  )
                    .then(() => dispatch(getTasks()))
                    .then(() => dispatch(getAssignedTask(taskIds)));
                }}
              >
                {status === "completed" ? "Mark Incompleted" : "Mark Completed"}
              </Button>
            </div>
            <div className="  flex justify-end items-center">
              <div
                className=" mx-8 rounded-full p-8"
                style={{ backgroundColor: "white" }}
                onClick={() => {
                  dispatch(openCommentDialog(task));
                }}
              >
                <Tooltip title="Add Comment">
                  <FuseSvgIcon className="text-16" size={24} color="info">
                    material-twotone:comment
                  </FuseSvgIcon>
                </Tooltip>
              </div>

              {showDelete && (
                <div
                  className=" rounded-full p-8"
                  style={{ backgroundColor: "white" }}
                  onClick={() =>
                    dispatch(deleteTask(id)).then(() => dispatch(getTasks()))
                  }
                >
                  <Tooltip title="Delete">
                    <FuseSvgIcon className="text-16" size={24} color="error">
                      heroicons-solid:trash
                    </FuseSvgIcon>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Accordion
            expanded={open}
            onChange={(e, expanded) => {
              setOpen(expanded);
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-content`}
              id={id}
              onClick={() => {
                const socket = io(process.env.REACT_APP_API_URL);
                socket.emit("add-user", id);
                dispatch(getComments({ taskId: id }));
              }}
            >
              <Typography>View Comments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {loadingComments && <CircularProgress disableShrink />}
              {comments?.map((comment, index) => (
                <Typography key={index}>
                  <b>
                    {" "}
                    {comment.sender === comment.taskCreaterId
                      ? "Admin: "
                      : "Anonymous: "}
                  </b>
                  {comment.message.text}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        </ClickAwayListener>
      </div>
    </div>
  );
};
