import { getAuth } from '@/Context/getContext';
import LoginImg from '../../assets/create.jpg';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUrl, userUrl } from '@/Utilities/Url';
import Swal from 'sweetalert2'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const {setUser,setLoading} = getAuth();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = () =>{
        const loginData = { email, password };
        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        }).then(res => {
            if (res.status == 401) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Login with correct credentials',
                    icon: 'error',
                });
            }
            return res.json();
        }).then(data => {
            localStorage.setItem('accessToken', data.access);
            fetch(userUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${data.access}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    res.status == 200 && Swal.fire("Successfully Logged in !", "", "success");
                    return res.json();
                })
                .then(data => {
                    setUser(data);
                    setLoading(false);
                    navigate(from);
                })

        })
    }

    return (
        <div className='h-screen bg-cover backdrop-blur-lg relative' style={{backgroundImage:`url(${LoginImg})`}}>
            <div className='absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] bg-opacity-85 w-[40%] mx-auto my-auto'>
                <div className='bg-white backdrop-blur-3xl backdrop-opacity-10 bg-opacity-60 rounded-lg p-10 '>
                    <h1 className='font-bold text-4xl'>Sign In</h1>
                    <p className='mt-5 text-xl text-gray-900'>Enter details to login to your account</p>
                    <div className='mt-10'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            className="bg-transparent"
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div className='mt-3'>
                        <Label className="" htmlFor="password">Password</Label>
                        <Input
                            className="bg-transparent"
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <Button className="mt-5 w-full" onClick={handleLogin}> Log In</Button>
                    <h1 className='text-center text-xs mt-10'>Don’t have an account ? <Link className='text-blue-800' to="/register">Register</Link> </h1>
                </div>
            </div>
        </div>
    );
};

export default Login;