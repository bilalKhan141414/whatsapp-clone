import React from "react";
import * as Yup from "yup";
import useYupValidation from "../../shared/custom-hooks/useYupValidation";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { localStorageHelpers } from "../../shared/Helpers/general";
import { loginMutation } from "../../mutations/AuthMutation";

export const YUP_INI_STATE = {
  userName: "",
  password: "",
};
const YUP_SCHEMA = {
  userName: Yup.string().min(1, "Please Enter User Name"),
  password: Yup.string().min(1, "Please Enter Password"),
};

export default function Login({ location }) {
  const navigate = useNavigate();
  const { mutate: submitRequest, isLoading: isSubmiting } = useMutation(
    ["apilogin"].xyzGlobalKey(),
    loginMutation,
    {
      onSuccess: (response) => {
        console.log("onSuccess::", response);
        localStorageHelpers.UserData = response;
        navigate("/");
      },
    }
  );
  const { formState, errors, handleChange, isFormInValid, resetErrors } =
    useYupValidation(YUP_INI_STATE, YUP_SCHEMA);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isFormInValid()) {
      return;
    }
    resetErrors();
    submitRequest(formState);
  };
  return (
    <div className='flex justify-center w-screen h-screen'>
      <div className='w-full mx-auto my-auto max-w-xs'>
        <form
          className='bg-white shadow-md rounded px-8 pb-8 mb-4 pt-18'
          onSubmit={handleFormSubmit}>
          <div className='mb-4'>
            <label
              className='block text-grey-darker text-sm font-bold mb-2'
              htmlFor='userName'>
              User Name
            </label>
            <input
              defaultValue={location?.state?.userName ?? ""}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline ${
                errors.userName.trim().length > 0 ? "error" : ""
              }`}
              id='userName'
              name='userName'
              type='text'
              placeholder='userName'
              onChange={handleChange}
            />
            <p
              className={`text-red-500 text-xs italic ${
                errors.userName.trim().length > 0 ? "block" : "hidden"
              }`}>
              {errors.userName}
            </p>
          </div>
          <div className='mb-6'>
            <label
              className='block text-grey-darker text-sm font-bold mb-2'
              htmlFor='password'>
              Password
            </label>
            <input
              autoFocus={!!location?.state?.userName}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password.trim().length > 0 ? "error" : ""
              }`}
              id='password'
              name='password'
              type='password'
              placeholder='******************'
              onChange={handleChange}
            />
            <p
              className={`text-red-500 text-xs italic ${
                errors.password.trim().length > 0 ? "block" : "hidden"
              }`}>
              {errors.password}
            </p>
          </div>
          <div className='flex items-center justify-between'>
            <button
              disabled={isSubmiting}
              className={`${
                isSubmiting ? "opacity-50" : "opacity-100"
              } bg-blue hover:bg-blue-dark text-black bg-gray-100 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline `}
              type='submit'>
              Sign In
            </button>
            <Link
              className='inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker'
              to='/register'>
              Or Sign Up
            </Link>
          </div>
        </form>
        <p className='text-center text-grey text-xs'>
          ©{new Date().getFullYear()} Bilal. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export async function loader({ request }) {}
