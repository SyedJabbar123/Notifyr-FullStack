import { useEffect, useState } from 'react';
import client from '../../api/client';

function QrListPage() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'assigned' | 'unassigned'

  const [viewingQr, setViewingQr] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  const fetchQrCodes = async (status = 'all') => {
    setLoading(true);
    try {
      const params = status !== 'all' ? { status } : {};
      const res = await client.get('/admin/qr-codes', { params });
      setQrCodes(res.data.qrCodes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes(statusFilter);
  }, [statusFilter]);

  const handleView = async (qr) => {
    setViewingQr(qr);
    setViewImage(null);
    try {
      const res = await client.get(`/admin/qr-codes/${qr.qrId}/image`, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(res.data);
      setViewImage(imageUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    if (viewImage) {
      URL.revokeObjectURL(viewImage);
    }
    setViewingQr(null);
    setViewImage(null);
  };

  const handleUnassign = async (qr) => {
    const confirmed = window.confirm(`Unassign ${qr.qrId}? This will disconnect it from its current item.`);
    if (!confirmed) return;
    try {
      await client.patch(`/admin/qr-codes/${qr.qrId}/unassign`);
      setQrCodes((prev) =>
        prev.map((c) =>
          c.qrId === qr.qrId ? { ...c, status: 'unassigned', itemId: null, itemNickname: null } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const downloadBatchZip = async () => {
    try {
      const ids = filteredCodes.map((qr) => qr.qrId).join(',');
      const res = await client.get('/admin/qr-codes/download-batch-zip', {
        params: { ids },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-batch-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCodes = qrCodes.filter((qr) =>
    qr.qrId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">QR codes</h2>
        <p className="text-sm text-gray-500 mb-8">All generated tags and their status</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by QR ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
          {filteredCodes.length > 0 && (
            <button
              onClick={downloadBatchZip}
              className="text-sm text-navy border border-navy rounded-lg px-3 py-1.5"
            >
              Download filtered as ZIP
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-10">Loading...</p>
          ) : filteredCodes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No QR codes match your search.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-medium">QR ID</th>
                  <th className="px-4 py-3 font-medium">PIN</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Bound to</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((qr) => (
                  <tr key={qr.qrId} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-700">{qr.qrId}</td>
                    <td className="px-4 py-3.5 text-gray-500">{qr.pinCode}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        qr.status === 'assigned'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {qr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">{qr.itemNickname || '—'}</td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {new Date(qr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-3">
                      <button
                        onClick={() => handleView(qr)}
                        className="text-navy hover:underline text-xs font-medium"
                      >
                        View
                      </button>
                      {qr.status === 'assigned' && (
                        <button
                          onClick={() => handleUnassign(qr)}
                          className="text-red-600 hover:underline text-xs font-medium"
                        >
                          Unassign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewingQr && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="bg-white rounded-xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">{viewingQr.qrId}</h3>
            <div className="w-32 h-32 mx-auto bg-gray-50 rounded flex items-center justify-center mb-4">
              {viewImage ? (
                <img src={viewImage} alt={viewingQr.qrId} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">Loading...</span>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">PIN {viewingQr.pinCode}</p>
            <button
              onClick={closeModal}
              className="w-full bg-navy text-white py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default QrListPage;