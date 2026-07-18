import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

/**
 * Camera-based barcode scanner. Calls onDetected(code) when a code is read.
 */
export default function BarcodeScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let active = true;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, err, controls) => {
        controlsRef.current = controls;
        if (result && active) {
          onDetected(result.getText());
        }
      })
      .catch((e) => {
        if (active) setError('ไม่สามารถเปิดกล้องได้: ' + e.message);
      });

    return () => {
      active = false;
      controlsRef.current?.stop();
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-black">
        <video ref={videoRef} className="w-full" />
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      <button
        onClick={onClose}
        className="mt-4 rounded-md bg-white px-6 py-2 font-medium text-slate-800"
      >
        ปิดกล้อง
      </button>
    </div>
  );
}
