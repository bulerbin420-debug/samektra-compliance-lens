import React, { useRef, useState } from 'react';
import { CURRENT_VERSION } from '../changelog';
import { Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so same file can be selected again if needed
    event.target.value = '';
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (base64Str: string, maxWidth = 1280, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width *= maxWidth / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(img, 0, 0, width, height);
           resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
           // Fallback if context fails
           resolve(base64Str);
        }
      };
      img.onerror = () => {
        // Fallback if image load fails
        resolve(base64Str);
      }
    });
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // 1. Read file
      const base64 = await readFileAsBase64(file);
      
      // 2. Compress
      // Max dimension 1280px is optimal for AI analysis (balances detail vs token size)
      const compressedBase64 = await compressImage(base64, 1280, 0.8);
      
      onImageSelected(compressedBase64);
    } catch (error) {
      console.error("Image processing failed", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-slate-800 border border-slate-700 mb-4 shadow-xl shadow-black/30">
          <Camera className="h-10 w-10 text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Code Compliance</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          Instant AI analysis for NFPA, IBC, and NEC violations.
        </p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-3xl p-6 transition-all duration-300 ease-in-out
          ${isDragging ? 'border-teal-500 bg-slate-800/80 scale-[1.02]' : 'border-slate-700 bg-slate-800/40'}
          ${isProcessing ? 'opacity-75 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-3xl">
             <Loader2 className="h-8 w-8 text-teal-400 animate-spin mb-2" />
             <p className="text-sm font-medium text-white">Compressing Image...</p>
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest text-xs">Start Inspection</p>
          </div>

          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
            className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="h-6 w-6 group-hover:scale-110 transition-transform" />
            Take Photo
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium">OR</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-700 text-slate-100 rounded-xl font-semibold hover:bg-slate-600 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5 text-slate-300" />
            Upload from Gallery
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          ref={cameraInputRef}
          onChange={handleFileChange}
        />
      </div>
      
      <p className="text-center text-xs text-slate-600 mt-8">
        {`Samektra Compliance Lens v${CURRENT_VERSION} • Optimized for Mobile`}
      </p>
    </div>
  );
};

export default ImageUploader;