import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png'

function AdminLayout(){
    return(
        <div className="flex min-h-screen">
            <aside className="w-52 bg-navy p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-6 px-1">
                    <img src={logo} alt="Notifyr logo" className="w-9 h-9 object-contain"/>
                    <span className="text-white font-medium text-sm">Notifyr Admin</span>
                </div>
                <a href="/admin/qr-generate" className="flex items-center gap-2 px-3 py-2 border-l-2 border-gold bg-gold/10">
                    <span className="text-gold text-sm font-medium">Generate QR</span>
                </a>
                <a href="/admin/qr-list" className="flex items-center gap-2 px-3 py-2">
                <span className="text-white/60 text-sm">QR codes</span>
                </a>
            </aside>

             <main className="flex-1 bg-gray-50 p-8">
             <Outlet />
             </main>
        </div>

    );
}

export default AdminLayout;