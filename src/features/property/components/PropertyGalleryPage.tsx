  <PropertyInfo 
    property={property}
    isPurchased={purchaseStatus?.isPurchased}
    isLoading={isPurchaseStatusLoading}
    listingId={listingId}
    price={price}
    isOwner={isOwner}
  />
  
  {/* フィルターアイコン */}
  <div className="mt-4 px-4">
    <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
      <FilterIcon
        image={propertyImages[0]}
        label="全て"
        isSelected={selectedFilter === null}
        onClick={() => setSelectedFilter(null)}
      />
      {roomMainImages.map((image) => (
        <FilterIcon
          key={`room_${image.room_id}`}
          image={image}
          label={image.roomName}
          isSelected={selectedFilter === `room_${image.room_id}`}
          onClick={() => setSelectedFilter(`room_${image.room_id}`)}
        />
      ))}
      {productMainImages.map((image) => (
        <FilterIcon
          key={`product_${image.product_id}`}
          image={image}
          label={image.productName}
          isSelected={selectedFilter === `product_${image.product_id}`}
          onClick={() => setSelectedFilter(`product_${image.product_id}`)}
        />
      ))}
    </div>
  </div>

  {/* 画像グリッド */}
  <div className="mt-2 -mx-4 md:mx-0"> 