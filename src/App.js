import { Search, ChevronLeft, ChevronRight, Heart, X, SlidersHorizontal } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const icons = {
  condition: '/images/check.png',
  year: '/images/calendar.png',
  screenSize: '/images/full-screen.png',
  ram: '/images/brain.png',
  memory: '/images/floppy-disk.png',
  accessories: '/images/phone-charger.png'
};

const ProductCard = ({ product, onToggleSave, isSaved }) => {
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cardRect, setCardRect] = useState(null);
  const cardRef = useRef(null);
  
  
  
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const getConditionStyle = (condition) => {
  const normalizedCondition = condition?.trim();
  const styles = {
    'Brand New': { bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#FFFFFF', hasShimmer: true },
    'Excellent': { bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', textColor: '#FFFFFF', hasShimmer: false },
    'Good': { bgGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', textColor: '#FFFFFF', hasShimmer: false },
    'Fair': { bgGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', textColor: '#FFFFFF', hasShimmer: false },
  };
  return styles[normalizedCondition] || { bgGradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', textColor: '#FFFFFF', hasShimmer: false };
};
  const conditionStyle = getConditionStyle(product.condition);

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextLightboxImage = (e) => {
    e.stopPropagation();
    setLightboxImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = (e) => {
    e.stopPropagation();
    setLightboxImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
<div
  ref={cardRef}
  className={`relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex md:flex flex-col h-full card-wave cursor-pointer border border-gray-100 ${showDetailsModal ? 'opacity-0' : ''}`}
  onClick={(e) => {
    if (cardRef.current) {
      setCardRect(cardRef.current.getBoundingClientRect());
    }
    setShowDetailsModal(true);
  }}
>
<div 
  className="relative overflow-hidden group cursor-pointer w-full flex-shrink-0" 
  style={{ paddingBottom: '100%' }}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  onClick={(e) => {
    e.stopPropagation();
    setShowDetailsModal(false);
    setTimeout(() => openLightbox(currentImageIndex), 100);
  }}
>
          <div 
            className="absolute inset-0 flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} - Image ${idx + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(product.id);
            }}
            className="absolute top-3 right-3 hover:scale-110 transition-all duration-200 z-10"
          >
            <Heart
              size={26}
              strokeWidth={2}
              className={isSaved ? 'fill-red-500 text-red-500' : 'text-white drop-shadow-lg'}
            />
          </button>

          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-10"
              >
                <ChevronLeft className="text-white drop-shadow-lg" size={32} strokeWidth={2.5} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-10"
              >
                <ChevronRight className="text-white drop-shadow-lg" size={32} strokeWidth={2.5} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-gray-800 w-4' : 'bg-gray-400 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-3 md:p-4 flex flex-col h-full w-1/2 md:w-full" style={{ minHeight: '280px' }}>
          <div className="flex justify-between items-start mb-2">
  <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex-1 pr-2">{product.name}</h3>
  <div className="md:hidden flex-shrink-0">
    {product.originalPrice && product.originalPrice !== product.price && (
      <p className="text-xs text-gray-500 line-through text-right">${product.originalPrice.toFixed(2)}</p>
    )}
    <p className="text-lg font-bold text-gray-900 whitespace-nowrap">${product.price.toFixed(2)}</p>
  </div>
</div>

          <div className="mb-2">
            {conditionStyle.hasShimmer ? (
              <span
                className="relative px-4 py-2 rounded-xl text-xs font-bold uppercase overflow-hidden inline-block shadow-md"
                style={{
                  background: conditionStyle.bgGradient,
                  color: conditionStyle.textColor
                }}
              >
                <span className="relative z-10">{product.condition}</span>
                <span
                  className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
                ></span>
              </span>
            ) : (
              <span
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-md"
                style={{
                  background: conditionStyle.bgGradient,
                  color: conditionStyle.textColor
                }}
              >
                {product.condition}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {product.year && (
              <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                {product.year}
              </span>
            )}
            {product.screenSize && (
              <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                {product.screenSize}
              </span>
            )}
            {product.ram && (
              <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                {product.ram}
              </span>
            )}
            {product.memory && (
              <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                {product.memory}
              </span>
            )}
            {product.accessories && (
              <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                Accessories
              </span>
            )}
          </div>

          <div className="mb-2 flex-grow hidden md:block">
  <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
    {product.description}
  </p>
  <button 
  onClick={(e) => {
    e.stopPropagation();
    if (cardRef.current) {
      setCardRect(cardRef.current.getBoundingClientRect());
    }
    setShowDetailsModal(true);
  }}
  className="text-sm text-gray-600 hover:underline font-semibold mt-1"
>
  Read more
</button>
</div>

          <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between mt-auto gap-2">
  <div>
  <p className="text-xs text-gray-500 uppercase mb-0.5">Price</p>
  <div className="flex items-center gap-2">
    {product.originalPrice && product.originalPrice !== product.price && (
      <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
    )}
    <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
  </div>
</div>
  <a
  href={`sms:+17868637769?body=Hello, I'm interested in the ${encodeURIComponent(product.name)}`}
  onClick={(e) => e.stopPropagation()}
  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 whitespace-nowrap flex-shrink-0 text-center shadow-lg hover:shadow-xl transform hover:scale-105"
>
        Buy Now
      </a>
    </div>
  </div>
</div>

      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:scale-110 transition-transform duration-200 z-50"
          >
            <X size={40} strokeWidth={2} />
          </button>

          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxImageIndex]}
              alt={`${product.name} - Image ${lightboxImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform duration-200"
                >
                  <ChevronLeft size={48} strokeWidth={2.5} className="drop-shadow-lg" />
                </button>
                
                <button
                  onClick={nextLightboxImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform duration-200"
                >
                  <ChevronRight size={48} strokeWidth={2.5} className="drop-shadow-lg" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm">
                  {lightboxImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg max-w-md">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm">${product.price.toFixed(2)}</p>
          </div>
        </div>
      )}
      {showDetailsModal && (
  <div 
    className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-4"
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0)',
      animation: 'fadeInBg 0.3s ease-out forwards'
    }}
    onClick={() => {
      setShowDetailsModal(false);
      setCardRect(null);
    }}
  >
    <div 
      className="bg-white rounded-2xl overflow-hidden relative shadow-2xl"
      style={{
        position: 'fixed',
        top: cardRect ? `${cardRect.top}px` : '50%',
        left: cardRect ? `${cardRect.left}px` : '50%',
        width: cardRect ? `${cardRect.width}px` : '90%',
        height: cardRect ? `${cardRect.height}px` : 'auto',
        maxWidth: '900px',
        maxHeight: '85vh',
        transform: cardRect ? 'none' : 'translate(-50%, -50%)',
        animation: cardRect ? 'expandCard 0.3s ease-out forwards' : 'none',
        overflow: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ opacity: 0, animation: 'fadeInContent 0.3s ease-out 0.2s forwards' }}>
        <button
    onClick={() => {
      setShowDetailsModal(false);
      setCardRect(null);
    }}
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-md"
  >
    <X size={24} />
  </button>
  
  <div className="flex flex-col md:flex-row gap-6 p-6">
    <div className="md:w-1/2">
  <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-xl sticky top-6 border border-white border-opacity-30 shadow-lg">
    {/* Main Image */}
    <div 
      className="relative overflow-hidden group cursor-pointer mb-3" 
      style={{ height: '450px' }}
      onClick={(e) => {
        e.stopPropagation();
        setShowDetailsModal(false);
        setTimeout(() => openLightbox(currentImageIndex), 100);
      }}
    >
      <img
        src={images[currentImageIndex]}
        alt={`${product.name} - Image ${currentImageIndex + 1}`}
        className="w-full h-full object-contain"
      />
      
      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage(e);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-10"
          >
            <ChevronLeft className="text-white drop-shadow-lg" size={32} strokeWidth={2.5} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage(e);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-10"
          >
            <ChevronRight className="text-white drop-shadow-lg" size={32} strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
    
    {/* Thumbnails */}
    {hasMultipleImages && (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(index);
            }}
            className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
              index === currentImageIndex ? 'border-white' : 'border-gray-600 opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
</div>

    <div className="md:w-1/2 flex flex-col">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
      
      <div className="mb-4">
        <span
          className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase shadow-lg"
          style={{
            background: conditionStyle.bgGradient,
            color: conditionStyle.textColor
          }}
        >
          {product.condition}
        </span>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        {product.originalPrice && product.originalPrice !== product.price && (
          <p className="text-lg text-gray-400 line-through mb-1">${product.originalPrice.toFixed(2)}</p>
        )}
        <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Specifications</h3>
        <div className="grid grid-cols-2 gap-3">
          {product.year && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <img src={icons.year} alt="Year" className="w-5 h-5 opacity-70" />
              <div>
                <p className="text-xs text-indigo-600 font-semibold">Year</p>
                <p className="font-bold text-gray-800">{product.year}</p>
              </div>
            </div>
          )}
          {product.screenSize && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <img src={icons.screenSize} alt="Screen" className="w-5 h-5 opacity-70" />
              <div>
                <p className="text-xs text-indigo-600 font-semibold">Screen Size</p>
                <p className="font-bold text-gray-800">{product.screenSize}</p>
              </div>
            </div>
          )}
          {product.ram && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <img src={icons.ram} alt="RAM" className="w-5 h-5 opacity-70" />
              <div>
                <p className="text-xs text-indigo-600 font-semibold">RAM</p>
                <p className="font-bold text-gray-800">{product.ram}</p>
              </div>
            </div>
          )}
          {product.memory && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <img src={icons.memory} alt="Memory" className="w-5 h-5 opacity-70" />
              <div>
                <p className="text-xs text-indigo-600 font-semibold">Memory</p>
                <p className="font-bold text-gray-800">{product.memory}</p>
              </div>
            </div>
          )}
          {product.accessories && (
            <div className="flex items-start gap-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 col-span-2">
              <img src={icons.accessories} alt="Accessories" className="w-5 h-5 opacity-70 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-indigo-600 font-semibold">Accessories</p>
                <p className="font-bold text-gray-800 break-words">{product.accessories}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <a
  href={`sms:+17868637769?body=Hello, I'm interested in the ${encodeURIComponent(product.name)}`}
  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl mt-auto block text-center transform hover:scale-105"
>
  Buy Now
</a>
    </div>
  </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

const AirtableStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedProducts, setSavedProducts] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedRam, setSelectedRam] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState([]);
  const [selectedScreenSize, setSelectedScreenSize] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [yearRange, setYearRange] = useState({ min: '', max: '' });

  const AIRTABLE_API_KEY = 'patBxMl5uxbqMh90l.d0fa8c39cd2baed95b4d5f47cfa963e3374a2fbe8999edc690dc7a35bc6d8feb';
  const AIRTABLE_BASE_ID = 'appRMrTPEDmjy6Zka';
  const AIRTABLE_TABLE_NAME = 'Inventory';

  const conditions = ['Brand New', 'Excellent', 'Good', 'Fair'];

  useEffect(() => {
    fetchProducts();
    const saved = localStorage.getItem('savedProducts');
    if (saved) setSavedProducts(JSON.parse(saved));
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
  `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?view=Grid view`,
  { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      const formattedProducts = data.records.map(record => {
        const imageField = record.fields.Image || record.fields.image || [];
        const images = imageField.map(img => img.url);
        // Parse specifications field
const specsText = record.fields.Specifications || record.fields.specifications || '';
const specs = {};

if (specsText) {
  specsText.split('\n').forEach(line => {
    const [key, value] = line.split(':').map(s => s.trim());
    if (key && value) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      specs[normalizedKey] = value;
    }
  });
}

return {
  id: record.id,
  name: record.fields.Name || record.fields.name || 'Unnamed Product',
  price: parseFloat(record.fields['Current Price'] || record.fields.currentPrice || record.fields.Price || record.fields.price || 0),
  originalPrice: record.fields['Starting Price'] || record.fields.startingPrice ? parseFloat(record.fields['Starting Price'] || record.fields.startingPrice) : null,
  description: record.fields.Description || record.fields.description || '',
  condition: record.fields.Condition || record.fields.condition || 'Good',
  year: specs.year || '',
  screenSize: specs.screensize || '',
  ram: specs.ram || '',
  memory: specs.memory || '',
  accessories: specs.accessories || specs.boxandcharger || '',
  images: images
};
      });
      setProducts(formattedProducts);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleSaveProduct = (productId) => {
    setSavedProducts(prev => {
      const newSaved = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('savedProducts', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const toggleArrayFilter = (array, setArray, value) => {
    setArray(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setSelectedConditions([]);
    setSelectedRam([]);
    setSelectedMemory([]);
    setSelectedScreenSize([]);
    setPriceRange({ min: '', max: '' });
    setYearRange({ min: '', max: '' });
  };

  // Get unique values for filters
  const uniqueRam = [...new Set(products.map(p => p.ram).filter(Boolean))].sort();
  const uniqueMemory = [...new Set(products.map(p => p.memory).filter(Boolean))].sort();
  const uniqueScreenSize = [...new Set(products.map(p => p.screenSize).filter(Boolean))].sort();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSaved = !showSavedOnly || savedProducts.includes(product.id);
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
    const matchesRam = selectedRam.length === 0 || selectedRam.includes(product.ram);
    const matchesMemory = selectedMemory.length === 0 || selectedMemory.includes(product.memory);
    const matchesScreenSize = selectedScreenSize.length === 0 || selectedScreenSize.includes(product.screenSize);
    
    const matchesPrice = 
      (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
      (!priceRange.max || product.price <= parseFloat(priceRange.max));
    
    const productYear = parseInt(product.year);
    const matchesYear = 
      (!yearRange.min || productYear >= parseInt(yearRange.min)) &&
      (!yearRange.max || productYear <= parseInt(yearRange.max));
    
    return matchesSearch && matchesSaved && matchesCondition && matchesRam && matchesMemory && matchesScreenSize && matchesPrice && matchesYear;
  });

  const activeFiltersCount = selectedConditions.length + selectedRam.length + selectedMemory.length + selectedScreenSize.length + (priceRange.min || priceRange.max ? 1 : 0) + (yearRange.min || yearRange.max ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-purple-400 mx-auto opacity-30"></div>
          </div>
          <p className="mt-4 text-gray-800 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="glassmorphism rounded-3xl shadow-2xl p-10 max-w-md border border-white/30">
          <div className="text-6xl mb-6 text-center">⚠️</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3 text-center">Configuration Error</h2>
          <p className="text-gray-700 mb-4 text-center text-lg">{error}</p>
          <p className="text-sm text-gray-600 text-center">Please update your Airtable credentials.</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" style={{fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>      <style>{`
  @keyframes scroll-testimonials {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-scroll-testimonials {
  animation: scroll-testimonials 40s linear infinite;
  display: flex;
}
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  @keyframes fadeInBg {
    to { background-color: rgba(0, 0, 0, 0.5); }
  }
  @keyframes expandCard {
    to {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 900px;
      height: auto;
      max-height: 85vh;
    }
  }
  @keyframes fadeInContent {
    to { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .card-wave {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .card-wave:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  .glassmorphism {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
`}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <img
                  src="/images/logo.png"
                  alt="UnrealPrices Logo"
                  className="relative h-32 w-32 object-contain animate-float drop-shadow-2xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
              UnrealPrices
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto mb-4 drop-shadow-md">
              Amazing Deals, Unbeatable Prices
            </p>
            <p className="text-lg text-white/80 max-w-xl mx-auto drop-shadow-md">
              Premium quality products at prices that seem too good to be true
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(248, 250, 252)" fillOpacity="1"/>
          </svg>
        </div>
      </div>

{/* Scrolling Testimonials Strip */}
<div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-y border-indigo-100 py-4 overflow-hidden relative">
  <div className="flex animate-scroll-testimonials whitespace-nowrap">
    {[...Array(2)].map((_, setIndex) => (
      <div key={setIndex} className="flex">

        <div className="flex items-center mx-8 gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
          <span className="text-gray-800 text-sm font-medium">"Amazing quality! Exactly as described." - Sarah M.</span>
          <div className="flex text-amber-400">
            {'★'.repeat(5)}
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-4 flex-shrink-0" />
        </div>

        <div className="flex items-center mx-8 gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
          <span className="text-gray-800 text-sm font-medium">"Fast shipping and great prices!" - John D.</span>
          <div className="flex text-amber-400 mr-2">
            {'★'.repeat(5)}
          </div>
          <img src="/images/offerup-logo.png" alt="OfferUp" className="h-4 flex-shrink-0" />
        </div>

        <div className="flex items-center mx-8 gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
          <span className="text-gray-800 text-sm font-medium">"Best deals I've found anywhere." - Mike R.</span>
          <div className="flex text-amber-400 mr-2">
            {'★'.repeat(5)}
          </div>
        </div>

        <div className="flex items-center mx-8 gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
          <span className="text-gray-800 text-sm font-medium">"Trustworthy seller, will buy again!" - Lisa K.</span>
          <div className="flex text-amber-400">
            {'★'.repeat(5)}
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-4 flex-shrink-0" />
        </div>

        <div className="flex items-center mx-8 gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
          <span className="text-gray-800 text-sm font-medium">"Product looks brand new!" - David P.</span>
          <div className="flex text-amber-400 mr-2">
            {'★'.repeat(5)}
          </div>
          <img src="/images/offerup-logo.png" alt="OfferUp" className="h-4 ml-4 flex-shrink-0" />
        </div>
      </div>
    ))}
  </div>
</div>

<header className="glassmorphism shadow-lg sticky top-0 z-40 border-b border-white/20">
  <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
    <div className="flex items-center space-x-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={22} />
              <input
                type="text"
                placeholder="Search for amazing deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center space-x-2 px-6 py-4 sm:px-6 px-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${showSavedOnly ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'}`}
            >
              <Heart size={20} className={showSavedOnly ? 'fill-white' : ''} />
              <span className="hidden sm:inline">{showSavedOnly ? 'All' : 'Saved'}</span>
              {savedProducts.length > 0 && !showSavedOnly && <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">{savedProducts.length}</span>}
            </button>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center p-4 rounded-2xl font-bold transition-all duration-300 relative shadow-lg hover:shadow-xl transform hover:scale-105 ${filterOpen || activeFiltersCount > 0 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'}`}
              >
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">{activeFiltersCount}</span>}
              </button>
              
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setFilterOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 glassmorphism rounded-2xl shadow-2xl border border-white/30 z-50 p-5 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-800">Filters</h3>
                      {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Condition */}
                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2 text-gray-800">Condition</h4>
                      <div className="space-y-1">
                        {conditions.map(condition => (
                          <label key={condition} className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded text-xs">
                            <input type="checkbox" checked={selectedConditions.includes(condition)} onChange={() => toggleArrayFilter(selectedConditions, setSelectedConditions, condition)} className="w-3.5 h-3.5 text-blue-600 rounded" />
                            <span className="ml-2">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* RAM */}
                    {uniqueRam.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-xs mb-1.5 text-gray-700">RAM</h4>
                        <div className="space-y-1">
                          {uniqueRam.map(ram => (
                            <label key={ram} className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded text-xs">
                              <input type="checkbox" checked={selectedRam.includes(ram)} onChange={() => toggleArrayFilter(selectedRam, setSelectedRam, ram)} className="w-3.5 h-3.5 text-blue-600 rounded" />
                              <span className="ml-2">{ram}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Memory */}
                    {uniqueMemory.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-xs mb-1.5 text-gray-700">Memory</h4>
                        <div className="space-y-1">
                          {uniqueMemory.map(memory => (
                            <label key={memory} className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded text-xs">
                              <input type="checkbox" checked={selectedMemory.includes(memory)} onChange={() => toggleArrayFilter(selectedMemory, setSelectedMemory, memory)} className="w-3.5 h-3.5 text-blue-600 rounded" />
                              <span className="ml-2">{memory}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Screen Size */}
                    {uniqueScreenSize.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-xs mb-1.5 text-gray-700">Screen Size</h4>
                        <div className="space-y-1">
                          {uniqueScreenSize.map(size => (
                            <label key={size} className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded text-xs">
                              <input type="checkbox" checked={selectedScreenSize.includes(size)} onChange={() => toggleArrayFilter(selectedScreenSize, setSelectedScreenSize, size)} className="w-3.5 h-3.5 text-blue-600 rounded" />
                              <span className="ml-2">{size}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Year Range */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-xs mb-1.5 text-gray-700">Year Range</h4>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" value={yearRange.min} onChange={(e) => setYearRange({...yearRange, min: e.target.value})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs" />
                        <span className="text-gray-500 text-xs">-</span>
                        <input type="number" placeholder="Max" value={yearRange.max} onChange={(e) => setYearRange({...yearRange, max: e.target.value})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs" />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-semibold text-xs mb-1.5 text-gray-700">Price Range</h4>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs" />
                        <span className="text-gray-500 text-xs">-</span>
                        <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {showSavedOnly && filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-12 max-w-2xl mx-auto">
            <Heart size={80} className="mx-auto text-pink-300 mb-6" />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">No saved products yet</h3>
            <p className="text-gray-600 text-lg mb-6">Click the heart icon on products to save them here</p>
            <button onClick={() => setShowSavedOnly(false)} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">Browse Products</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-12 max-w-2xl mx-auto">
            <p className="text-gray-700 text-2xl font-bold mb-4">No products found</p>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-indigo-600 hover:text-indigo-800 text-lg font-bold transition-colors">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{filteredProducts.map(product => <ProductCard key={product.id} product={product} onToggleSave={toggleSaveProduct} isSaved={savedProducts.includes(product.id)} />)}
</div>
)}
</main><footer className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 border-t border-indigo-800/50 mt-20 overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
    }}></div>

    <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <img src="/images/logo.png" alt="UnrealPrices Logo" className="relative h-16 w-16 object-contain drop-shadow-2xl" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">UnrealPrices</h3>
        <p className="text-indigo-200 font-medium text-lg mb-4">Amazing Deals, Unbeatable Prices</p>
        <p className="text-indigo-300/80 text-sm">© 2024 UnrealPrices. All rights reserved.</p>

        <div className="mt-8 pt-8 border-t border-indigo-700/30">
          <div className="flex justify-center space-x-6">
            <span className="text-indigo-300/60 text-sm">Premium quality products at unbeatable prices</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>);
};
export default AirtableStore;