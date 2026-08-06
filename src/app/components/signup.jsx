"use client";
import React from "react";
import { Input, Label, Button } from "@/components/ui";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { classes,categories } from "../../constants/gloabl";
const Signup = () => {

    const router=useRouter();
    const [formData,setFormData] = useState({
  name:"",
  email:"",
  mobile:"",
  className:"",
  category:"",
  password:"",
  confirmPassword:""
});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(formData)
    });


    const data = await response.json();

  console.log(response.status);
  console.log(data);

    if(!response.ok){
      
      throw new Error(data.message);
    }


    console.log(data);


    // redirect after successful signup
    router.push("/");


  } catch(error){

    console.log(error.message);

  }
};

  return (
    <div className="min-h-screen flex items-center justify-center border-red-500 bg-white px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 shadow-xl p-4">
        
        <div className="flex flex-col items-start gap-2 ">
          <h1 className="text-3xl font-bold text-black">
            Create Account
          </h1>

          <p className="text-gray-600">
            Register to access your dashboard.
          </p>
        </div>

        <form className="space-y-4 "onSubmit={handleSubmit}>

          {/* Name */}
          <div className="flex justify-between gap-2">
 <div className="space-y-2  w-1/2">
            <Label htmlFor="name">
              Full Name
            </Label>

            <Input
              id="name"
              type="text"
               value={formData.name}
          onChange={handleChange}
              placeholder="Enter your name"
              className="rounded-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="rounded-none"
            />
          </div>
          </div>
         

          {/* Mobile */}
          <div className="space-y-2 bor">
            <Label htmlFor="mobile">
              Mobile Number
            </Label>

            <Input
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="tel"
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Class */}
          <div className="flex justify-between gap-2 ">
 <div className="space-y-2  w-1/2">
            <Label htmlFor="class">
              Select Class
            </Label>
<Select
  value={formData.className}
  onValueChange={(value) =>
    setFormData({
      ...formData,
      className: value,
    })
  }
>
  <SelectTrigger className="w-full border border-gray-300 px-4  ">
    <SelectValue placeholder="Select your class" />
  </SelectTrigger>

  <SelectContent>
    {classes.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>


          {/* Category */}
          <div className="space-y-2 w-1/2 ">
            <Label htmlFor="category">
              Category
            </Label>

              <Select
               value={formData.category}
               onValueChange={(value) =>
                setFormData({
                ...formData,
                 category: value,
                 })
                }>
  <SelectTrigger className="w-full border border-gray-300 px-4 ">
    <SelectValue placeholder="Select your catergoy" />
  </SelectTrigger>

  <SelectContent>
    {categories?.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>
          </div>
         


          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              value={formData.password} 

              onChange={handleChange}
              placeholder="Create password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Confirm Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
                onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>


          {/* Button */}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Sign Up
          </Button>

        </form>


        <p className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
};

export default Signup;