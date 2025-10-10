import React, { useState } from 'react';
import { deletePhoto, setPrimaryPhoto } from '../../api/profileApi';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const PhotoGallery = ({ photos, onUpdate }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    setDeleting(photoId);
    try {
      await deletePhoto(photoId);
      toast.success('Photo deleted successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to delete photo');
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrimary = async (photoId) => {
    try {
      await setPrimaryPhoto(photoId);
      toast.success('Primary photo updated');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to update primary photo');
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No photos uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo._id} className="relative group">
          <img
            src={photo.url}
            alt="Profile"
            className="w-full h-48 object-cover rounded-lg"
          />
          
          {photo.isPrimary && (
            <div className="absolute top-2 left-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Primary
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
            {!photo.isPrimary && (
              <button
                onClick={() => handleSetPrimary(photo._id)}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Set as primary"
              >
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </button>
            )}
            
            <button
              onClick={() => handleDelete(photo._id)}
              disabled={deleting === photo._id}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
