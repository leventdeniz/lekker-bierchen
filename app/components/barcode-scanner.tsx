'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from '~/components/ui/button';

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string|null>(null);
  const [error, setError] = useState('');
  const codeReader = useRef(new BrowserMultiFormatReader());

  const startScanning = async() => {
    try {
      setIsScanning(true);
      setError('');
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;

      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result) => {
          if (result) {
            setResult(result.getText());
            stopScanning();
          }
        },
      );
    } catch (err) {
      setError('Failed to access camera');
      setIsScanning(false);
    }
  };

  // Clean up function to stop scanning
  const stopScanning = () => {
    setIsScanning(false);

    if (videoRef.current?.srcObject && videoRef.current.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    codeReader.current.reset();
  };

  useEffect(() => {
    return () => stopScanning();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      scanning: {isScanning ? 'true' : 'false'}
      <br/>
      result: {result}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startScanning}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              <Camera className="w-5 h-5"/>
              Start Scanning
            </button>
          </div>
        )}
        {isScanning && (
          <div className="absolute bottom-0 right-0 flex items-center justify-center">
            <Button
              onClick={stopScanning}
              className="flex items-center  bg-red-500 text-white rounded-lg"
              size="icon"
            >
              <CameraOff />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
