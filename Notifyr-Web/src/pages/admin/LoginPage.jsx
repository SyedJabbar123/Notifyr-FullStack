import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const handleLogin = async () =>{
        setError('')
        try{
            const res = await client.post('/auth/login', {email, password});
            const {token, user} = res.data;

            if (!user.is_admin){
                setError('This account does not have admin access.');
                return;
            }

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));
            navigate('/admin/qr-generate')

        } catch(err){
           setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        }  
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-96">
        <h2 className="text-xl font-semibold mb-1">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage Notifyr tags</p>



            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
            <input 
            type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"/>


            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Password</label>
            <input 
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"/>


            <button
            onClick={handleLogin}
            className="w-full bg-navy text-white py-2 rounded-lg text-sm font-medium hover:bg-navy/90"
            >Log In </button>
            </div>
        </div>
    );

}

export default LoginPage;