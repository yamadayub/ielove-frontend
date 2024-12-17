import React from 'react';
import { Material } from '../../types';
import { MaterialCard } from './MaterialCard';

interface MaterialGridProps {
  materials: Material[];
  onEditMaterial: (material: Material) => void;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({ materials, onEditMaterial }) => {
  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          onEdit={() => onEditMaterial(material)}
        />
      ))}
    </div>
  );
};