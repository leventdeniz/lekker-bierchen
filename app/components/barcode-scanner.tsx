'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, SwitchCamera } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from '~/components/ui/button';

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const devicesIndexRef = useRef<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState('');
  const [hasMoreThanOneDevice, setHasMoreThanOneDevice] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const codeReader = useRef(new BrowserMultiFormatReader());

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError('');
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      if (videoInputDevices.length > 1) {
        setHasMoreThanOneDevice(true);
      } else {
        setHasMoreThanOneDevice(false);
      }
      const mediaDeviceInfo = videoInputDevices[devicesIndexRef.current ?? 0];
      const selectedDeviceId = mediaDeviceInfo.deviceId;
      setDeviceInfo(mediaDeviceInfo.label + ' |\n ' + mediaDeviceInfo.groupId);

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
      setError('Failed to access camera: '+ err.message);
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
  const switchCamera = async () => {
    const videoInputDevices = await codeReader.current.listVideoInputDevices();
    devicesIndexRef.current = (devicesIndexRef.current + 1) % videoInputDevices.length;
    return startScanning();
  };

  useEffect(() => {
    return () => stopScanning();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      scanning: {isScanning ? 'true' : 'false'}
      <br/>
      result: {result}
      <br/>
      activeCamId: {`${devicesIndexRef.current}`}
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
            {hasMoreThanOneDevice && (
              <Button
                onClick={switchCamera}
                className="flex items-center  bg-red-500 text-white rounded-lg"
                size="icon"
              >
                <SwitchCamera/>
              </Button>
            )}
            <Button
              onClick={stopScanning}
              className="flex items-center  bg-red-500 text-white rounded-lg"
              size="icon"
            >
              <CameraOff/>
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {deviceInfo && (
        <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
      )}
    </div>
  );
};

export default BarcodeScanner;
