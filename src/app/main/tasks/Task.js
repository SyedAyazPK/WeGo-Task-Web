import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import DemoContent from "@fuse/core/DemoContent";
import AddTaskDialog from "./add-task/AddTaskDialog";
import AssignTaskDialog from "./assign-task/AssignTaskDialog";
import { TaskCard } from "./TaskCard";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  getAssignedTask,
  getTasks,
  selectShowDelete,
  selectTasks,
} from "app/store/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import TaskForm from "./add-task/TaskForm";
import History from "src/@history/@history";
import { selectUser } from "app/store/userSlice";
import { useParams, useSearchParams } from "react-router-dom";
import AddCommentDialog from "./AddCommentDialog";
import { io } from "socket.io-client";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-toolbar": {},
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

function TaskPage(props) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const showDelete = useSelector(selectShowDelete);
  const user = useSelector(selectUser);
  const [searchParams] = useSearchParams();
  // const taskIds = searchParams.get("ids");
  const pathUrl = window.location.pathname.split("/");
  const taskIds = pathUrl[pathUrl.length - 1];
  const socket = io(process.env.REACT_APP_API_URL);

  useEffect(() => {
    dispatch(getTasks(taskIds));
    dispatch(getAssignedTask(taskIds));
  }, []);

  useEffect(() => {
    const socketAssign = async () => {
      if (socket) {
        console.log("sockect running...");
        await socket.on("get-comment", (comment) => {
          console.log("\n\n coment ..>>", comment.message);
          // setCommentList((commentList) => [...commentList, comment]);
        });
      }
    };
  }, []);

  return (
    <Root
      header={
        <div className="p-24 flex flex-col justify-center">
          <div className="flex justify-center">
            <div>
              <AddTaskDialog />
            </div>
            <div className="mx-16">
              <AssignTaskDialog />
            </div>
          </div>
          {user.role.length < 1 && (
            <Typography
              className="font-semibold cursor-pointer text-center mt-16"
              onClick={() => History.push("/sign-up")}
              color="green"
              style={{ textDecoration: "underline" }}
            >
              Register with us for free to enable above Features!
            </Typography>
          )}
        </div>
      }
      content={
        <div className="p-24">
          <br />
          {/* <TaskForm /> */}
          <Box sx={{ width: "100%" }}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {tasks?.map((task) => (
                <Grid item xs={12} md={4}>
                  <TaskCard
                    status={task.status}
                    title={task.title}
                    subtitle={task.description}
                    date={task.dueDate}
                    id={task._id}
                    task={task}
                    showActions
                    showDelete={showDelete}
                  />{" "}
                </Grid>
              ))}
            </Grid>
          </Box>
          <AddCommentDialog />
        </div>
      }
      scroll="content"
    />
  );
}

export default TaskPage;
