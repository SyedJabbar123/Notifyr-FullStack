import { useState } from "react";
import client from "../../api/client";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';


function QrGeneratePage(){
    const [count,setCount] = useState(10);
    const [generated, setGenerated] = useState([]);


    const handleGenerate = async () =>{
     if (count < 1 || count > 500) {
        console.error("Count must be between 1 and 500");
        return;
      }
        try{
            const res = await client.post('/admin/qr-codes/generate', {count})
            setGenerated(res.data.generated)
        } catch(err){
            console.error(err);
        }
    };

const downloadQr = (dataUrl, qrId) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${qrId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


    const downloadAllAsZip = async () => {
  const zip = new JSZip();

  generated.forEach((qr) => {
    // strip the "data:image/png;base64," prefix — JSZip wants raw base64
    const base64Data = qr.imageDataUrl.split(',')[1];
    zip.file(`${qr.qrId}.png`, base64Data, { base64: true });
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `qr-batch-${Date.now()}.zip`);
};

      return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-semibold text-gray-900">Generate QR codes</h2>
      </div>
      <p className="text-sm text-gray-500 mb-3">Create a new batch of tags for printing</p>
      <div className="w-12 h-[3px] bg-gold mb-8"></div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-end gap-3 mb-8">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Number of codes</label>
          <input
            type="number"
             min="1"
             max="500"
            value={count}
             onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 1) {
                setCount(1);
              } else if (value > 500) {
                setCount(500);
              } else {
                setCount(value);
              }
            }}
            className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>
        <button
          onClick={handleGenerate}
          className="bg-navy text-white px-5 h-[42px] rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors"
        >
          Generate
        </button>
      </div>

      {generated.length === 0 ? (
  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
    <p className="text-sm text-gray-400">No codes generated yet — enter a number above and click Generate.</p>
  </div>
) : (
  <>
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-medium text-gray-400 tracking-wide">RECENTLY GENERATED</p>
      <button
        onClick={downloadAllAsZip}
        className="text-sm text-navy border border-navy rounded-lg px-3 py-1.5"
      >
        Download all as ZIP
      </button>
    </div>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
      {generated.map((qr) => (
          <div key={qr.qrId} className="relative bg-white border border-gray-100 shadow-sm rounded-lg p-3 flex flex-col items-center gap-2">
          <button
            onClick={() => downloadQr(qr.imageDataUrl, qr.qrId)}
            className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-navy hover:bg-gray-50 transition-colors"
            title="Download QR"
          >
            <Download size={14} />
          </button>

          <div className="w-14 h-14 bg-gray-50 rounded flex items-center justify-center">
            <img src={qr.imageDataUrl} alt={qr.qrId} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-mono">{qr.qrId}</span>
          <span className="text-xs text-gray-400">PIN {qr.pinCode}</span>
        </div>
      ))}
    </div>
  </>
)}
    </div>
  );
}




export default QrGeneratePage;

