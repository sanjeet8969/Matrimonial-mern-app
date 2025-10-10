import React, { useState } from 'react';
import { uploadPhoto } from '../../api/profileApi';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';

const PhotoUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a photo');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await uploadPhoto(formData);
      toast.success('Photo uploaded successfully!');
      setFile(null);
      setPreview(null);
      if (onUploadSuccess) onUploadSuccess(response.data.photo);
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-love transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        
        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="mx-auto h-48 rounded-lg object-cover" />
            <div className="flex justify-center space-x-3">
              <label htmlFor="photo-upload">
                <Button variant="secondary" as="span">Change Photo</Button>
              </label>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        ) : (
          <label htmlFor="photo-upload" className="cursor-pointer">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to select a photo</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </label>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
