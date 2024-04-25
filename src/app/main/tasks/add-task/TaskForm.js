import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
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
import { useDeepCompareEffect } from "@fuse/hooks";
import clsx from "clsx";
import { getAssignedTask, getTasks } from "app/store/taskSlice";
import { useState } from "react";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required("You must enter a name"),
});

const TaskForm = (props) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const history = useNavigate();

  const [searchParams] = useSearchParams();
  const taskIds = searchParams.get("ids");
  console.log(taskIds, "taskIds");
  useEffect(() => {
    dispatch(getAssignedTask(taskIds));
  }, [taskIds]);

  const { watch, register } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  return (
    <div className="relative flex flex-auto items-center justify-center mb-16 w-full">
      <div>
        <input
          className={clsx(
            "border-1 outline-none rounded-8 p-11 w-full px-120 items-center"
          )}
          style={{ textAlign: "center" }}
          placeholder="Paste code here"
          {...register("title")}
          required
          value={taskIds}
          onChange={
            (e) =>
              e.target.value === ""
                ? dispatch(getTasks()).then(() =>
                    history({
                      pathname: window.location.pathname,
                      search: "?ids=",
                    })
                  )
                : history({
                    pathname: window.location.pathname,
                    search: `?ids=${e.target.value}`,
                  })
            // dispatch(getAssignedTask(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default TaskForm;
