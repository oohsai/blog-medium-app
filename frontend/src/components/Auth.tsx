import { SignupInput } from "@tested-demo/honoapp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

//trpc - check cohort 1

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setpostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      const jwt = response.data;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="grid ">
        <div className="grid justify-center">
          <div className="text-xl font-bold">Create your account ? </div>
          <div className="font-light text-slate-200">
            {type === "signin"
              ? "Dont have an Account?"
              : "Already have an account?"}
            <Link
              className="pl-2 underline"
              to={type === "signin" ? "/signup" : "/signin"}
            >
              {type === "signin" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </div>
        <div className="px-10 py-3">
          {type === "signup" ? (
            <LabeledInput
              label="Name"
              placeholder="John Doe"
              OnChange={(e) => {
                setpostInputs({
                  ...postInputs,
                  name: e.target.value,
                });
              }}
            />
          ) : null}
          <LabeledInput
            label="Username"
            placeholder="demo@gmail.com"
            OnChange={(e) => {
              setpostInputs({
                ...postInputs,
                username: e.target.value,
              });
            }}
          />
          <LabeledInput
            label="Password"
            placeholder="Password"
            type={"password"}
            OnChange={(e) => {
              setpostInputs({
                ...postInputs,
                password: e.target.value,
              });
            }}
          />
          <button
            onClick={sendRequest}
            type="button"
            className=" mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {type === "signup" ? "Sign Up " : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface labeledinput {
  label: string;
  placeholder: string;
  OnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabeledInput({ label, placeholder, OnChange, type }: labeledinput) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-black pt-2">
        {label}
      </label>
      <input
        type={type || "text"}
        onChange={OnChange}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}
