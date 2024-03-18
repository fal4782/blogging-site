import { useNavigate } from "react-router-dom";
import Appbar from "../components/AppBar";
import { useForm } from "react-hook-form";
import { BACKEND_URl } from "../config";
import axios from "axios";
import { useEffect } from "react";

export default function User() {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    axios
      .get(`${BACKEND_URl}/api/v1/user`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setValue("name", response.data.name);
        setValue("bio", response.data.bio);
      });
  }, [setValue]);

  return (
    <>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid px-10 gap-5 mb-6 md:grid-cols-2 max-w-screen-lg w-full pt-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Rahmatdeep"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Bio
            </label>
            <input
              type="text"
              {...register("bio")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Bio"
              required
            />
          </div>
          <button
            type="button"
            className="focus:outline-none text-black bg-slate-100  hover:bg-slate-200  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 md:col-span-2"
          >
            Update
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 md:col-span-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}