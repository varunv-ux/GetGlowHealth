interface UploadedPhotoSectionProps {
  imageUrl: string;
  onStartAnalysis: () => void;
  onRemovePhoto: () => void;
}

export default function UploadedPhotoSection({ 
  imageUrl, 
  onStartAnalysis, 
  onRemovePhoto 
}: UploadedPhotoSectionProps) {
  return (
    <div className="bg-[#f4f4f0] h-[200px] w-full rounded-[32px] relative">
      <div className="flex flex-col items-center justify-center h-full px-6 py-2.5 gap-4">
        <div className="text-[12px] leading-[16px] text-[#79716b] font-ibm-plex-sans">
          Photo uploaded successfully
        </div>
        
        <button
          onClick={onStartAnalysis}
          className="bg-[#0c0a09] flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl hover:bg-[#1c1917] transition-colors w-[140px]"
        >
          <div className="text-[14px] leading-[20px] text-white font-ibm-plex-sans">
            Start analysis
          </div>
        </button>

        <button
          onClick={onRemovePhoto}
          className="bg-white flex flex-row gap-2.5 items-center justify-center px-3 py-2 rounded-xl hover:bg-[#f5f5f4] transition-colors w-[140px]"
        >
          <div className="text-[14px] leading-[20px] text-[#79716b] font-ibm-plex-sans">
            Remove photo
          </div>
        </button>
      </div>
    </div>
  );
}
