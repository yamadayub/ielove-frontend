import React from 'react';
import { useParams } from 'react-router-dom';
import { useProperty } from '../api/quieries/useProperty';
import { useRooms } from '../api/quieries/useRooms';
import { useImages } from '../api/quieries/useImages';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyInfo } from '../components/property/PropertyInfo';
import { RoomList } from '../components/property/RoomList';

export const PropertyPage = () => {
  const { id: propertyId } = useParams();
  
  const { 
    data: property,
    isLoading: isLoadingProperty,
    isError: isPropertyError 
  } = useProperty(propertyId);

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isError: isRoomsError
  } = useRooms(propertyId);

  const {
    data: images,
    isLoading: isLoadingImages,
    isError: isImagesError
  } = useImages({
    entity_type: 'property',
    entity_id: parseInt(propertyId || '0')
  });

  console.log('Images data:', {
    images,
    isLoading: isLoadingImages,
    isError: isImagesError
  });

  if (isLoadingProperty || isLoadingRooms || isLoadingImages) {
    return <div>Loading...</div>;
  }

  if (isPropertyError || isRoomsError || isImagesError || !property) {
    return <div>Error loading property details</div>;
  }

  return (
    <div className="bg-white">
      <PropertyGallery images={images || []} />
      <PropertyInfo property={property} />
      <RoomList rooms={rooms || []} propertyId={propertyId!} />
    </div>
  );
};