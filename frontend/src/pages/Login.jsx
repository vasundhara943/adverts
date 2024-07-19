import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import axios from "axios";

async function loginUser(credentials) {
  return fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

const Login = ({setToken}) => {
 
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [exUsers, setExUsers] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/get");
        console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setExUsers(response.data.data);
          console.log("Users data:", response.data.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

   const handleSubmit = async e => {
    e.preventDefault();
    // const token = await loginUser({
    //   email,
    //   password
    // });
    
    // setToken(token);

    const user = exUsers.find(user => user.email === email && user.password === password);
    
    if (user) {
      const token = await loginUser({
        email,
        password
      });
      setToken(token);
    } else {
      alert('Invalid email or password');
    }
  }

  // const authLogic = () => {

  //   //navigate('/describe_ad');
  // };
  
  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <div className="grid gap-8">
        <div id="back-div" className="rounded-[26px] m-4 bg-red-800">
          <div className="border-[20px] border-transparent rounded-[20px]  bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold text-5xl text-center cursor-default">
              Log in
            </h1>
            <form action="#" method="post" className="space-y-4">
              <div>
                <label for="email" className="mb-2  dark:text-gray-400 text-lg">
                  Email
                </label>
                <input
                  id="email"
                  className="border p-3   shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={e => setEmail(e.target.value)}
                  // onChange={handleInput}
                />
              </div>
              <div>
                <label
                  for="password"
                  className="mb-2 dark:text-gray-400 text-lg"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="border p-3 shadow-md  placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  type="password"
                  placeholder="Password"
                  required
                  onChange={e => setPassword(e.target.value)}
                  // onChange={handleInput}
                />
              </div>
              {/* <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Forget your password?
                </span>
              </a> */}
              <button
                className="bg-red-800 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
                onClick={handleSubmit}
              >
                LOG IN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
