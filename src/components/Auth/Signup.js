import React from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signUpMutation } from "../../mutations/AuthMutation";
import useYupValidation from "../../shared/custom-hooks/useYupValidation";
import { YUP_INI_STATE } from "./Login";

const YUP_SCHEMA = {
  userName: Yup.string().trim().min(1, "Please enter user name"),
  password: Yup.string().min(8, "Password must be of 8 characters"),
};

export default function Signup() {
  const navigate = useNavigate();

  const { mutate: submitRequest, isLoading: isSubmiting } = useMutation(
    ["signup"].xyzGlobalKey(),
    signUpMutation,
    {
      onSuccess: () =>
        navigate("/login", {
          state: {
            email: formState.email,
          },
        }),
    }
  );
  const { formState, errors, handleChange, isFormInValid, resetErrors } =
    useYupValidation(YUP_INI_STATE, YUP_SCHEMA); //end yup validation

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isFormInValid()) {
      return;
    }
    resetErrors();
    submitRequest(formState);
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-center items-center h-screen px-6'>
        <div className='w-full xl:w-3/4 lg:w-11/12 flex'>
          <div className='mx-auto bg-white p-5 rounded-lg lg:rounded-l-none'>
            <h3 className='pt-4 text-2xl text-center'>Create an Account!</h3>
            <form
              className='px-8 pt-6 pb-8 mb-4 bg-white rounded'
              onSubmit={handleFormSubmit}
              noValidate>
              <div className='mb-4 w-72 mx-auto md:justify-between'>
                <div className='mb-4 md:mr-2 md:mb-0'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='userName'>
                    User Name
                  </label>
                  <input
                    className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                      errors.userName.trim().length > 0 ? "error" : ""
                    }`}
                    id='userName'
                    type='text'
                    name='userName'
                    placeholder='User Name'
                    onChange={handleChange}
                  />
                  <p
                    className={`text-red-500 text-xs italic ${
                      errors.userName.trim().length > 0 ? "block" : "hidden"
                    }`}>
                    {errors.userName}
                  </p>
                </div>
              </div>
              <div className='mb-4 w-72 mx-auto md:justify-between'>
                <div className='mb-4 md:mr-2 md:mb-0'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='password'>
                    Password
                  </label>
                  <input
                    className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                      errors.password.trim().length > 0 ? "error" : ""
                    }`}
                    id='password'
                    type='password'
                    name='password'
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
              </div>
              <div className='mb-6 text-center'>
                <button
                  disabled={isSubmiting}
                  className={`${
                    isSubmiting ? "opacity-50" : "opacity-100"
                  } w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline`}
                  type='submit'>
                  Register Account
                </button>
              </div>
              <div className='text-center'>
                <Link
                  className='inline-block text-sm text-black align-baseline hover:text-gray-400'
                  to='/login'>
                  Already have an account? Login!
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
