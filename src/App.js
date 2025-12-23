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
    'Brand New': { bgColor: '#0284C7', textColor: '#FFFFFF', hasShimmer: true },
    'Excellent': { bgColor: '#16A34A', textColor: '#FFFFFF', hasShimmer: false },
    'Good': { bgColor: '#86EFAC', textColor: '#1F2937', hasShimmer: false },
    'Fair': { bgColor: '#FEF08A', textColor: '#1F2937', hasShimmer: false },
  };
  return styles[normalizedCondition] || { bgColor: '#0D9488', textColor: '#FFFFFF', hasShimmer: false };
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
  className={`relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex md:flex flex-col h-full card-wave cursor-pointer ${showDetailsModal ? 'opacity-0' : ''}`}
  onClick={(e) => {
    if (cardRef.current) {
      setCardRect(cardRef.current.getBoundingClientRect());
    }
    setShowDetailsModal(true);
  }}
>
<div 
  className="relative overflow-hidden group cursor-pointer w-full flex-shrink-0 bg-gray-900" 
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

        <div className="p-4 flex flex-col md:flex-col h-full w-full">
  <div className="flex justify-between gap-4">
    {/* Left side - Title and specs */}
    <div className="flex-1">
      <h3 className="text-xl md:text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
      
      <div className="mb-3">
        {conditionStyle.hasShimmer ? (
          <span 
            className="relative px-3 py-1 rounded-md text-xs font-normal uppercase overflow-hidden inline-block"
            style={{ 
              backgroundColor: conditionStyle.bgColor, 
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
            className="px-3 py-1 rounded-md text-xs font-normal uppercase"
            style={{ 
              backgroundColor: conditionStyle.bgColor, 
              color: conditionStyle.textColor 
            }}
          >
            {product.condition}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {product.year && (
          <span className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-xs font-normal">
            {product.year}
          </span>
        )}
        {product.screenSize && (
          <span className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-xs font-normal">
            {product.screenSize}
          </span>
        )}
        {product.ram && (
          <span className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-xs font-normal">
            {product.ram}
          </span>
        )}
        {product.memory && (
          <span className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-xs font-normal">
            {product.memory}
          </span>
        )}
        {product.accessories && (
          <span className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-xs font-normal">
            Accessories
          </span>
        )}
      </div>
    </div>

    {/* Right side - Price and button (mobile only) */}
    <div className="md:hidden flex flex-col items-end justify-start flex-shrink-0">
      <p className="text-xs text-gray-500 uppercase mb-1">PRICE</p>
      {product.originalPrice && product.originalPrice !== product.price && (
        <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
      )}
      <p className="text-2xl font-bold text-gray-900 mb-3">${product.price.toFixed(2)}</p>
      
      <a 
        href={`sms:+17868637769?body=Hello, I'm interested in the ${encodeURIComponent(product.name)}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1f2937] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#374151] transition-colors duration-200 whitespace-nowrap text-center w-full"
      >
        Buy Now
      </a>
    </div>
  </div>

  {/* Description - hidden on mobile */}
  <div className="mt-3 hidden md:block">
    <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
      {product.description}
    </p>
    <button className="text-base text-gray-600 hover:underline font-semibold mt-1">
      Read more
    </button>
  </div>

  {/* Desktop price and button */}
  <div className="hidden md:flex items-center justify-between mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
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
      className="bg-[#1f2937] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#374151] transition-colors duration-200 whitespace-nowrap text-center"
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
  className="bg-white rounded-xl overflow-auto relative"
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
  
  <div className="flex flex-col md:flex-row gap-6 pt-0 px-6 pb-6 md:p-6">
    <div className="md:w-1/2 -mx-6 md:mx-0 mb-6 md:mb-0">
  <div className="bg-white bg-opacity-20 backdrop-blur-md md:p-4 p-0 rounded-b-xl md:rounded-xl sticky top-6 md:border border-white border-opacity-30 md:shadow-lg">
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
        className="absolute inset-0 w-full h-full object-cover md:object-contain"
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
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
      
      <div className="mb-4">
        <span 
          className="px-4 py-2 rounded-lg text-sm font-semibold uppercase"
          style={{ 
            backgroundColor: conditionStyle.bgColor, 
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
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <img src={icons.year} alt="Year" className="w-5 h-5 opacity-60" />
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="font-semibold text-gray-800">{product.year}</p>
              </div>
            </div>
          )}
          {product.screenSize && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <img src={icons.screenSize} alt="Screen" className="w-5 h-5 opacity-60" />
              <div>
                <p className="text-xs text-gray-500">Screen Size</p>
                <p className="font-semibold text-gray-800">{product.screenSize}</p>
              </div>
            </div>
          )}
          {product.ram && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <img src={icons.ram} alt="RAM" className="w-5 h-5 opacity-60" />
              <div>
                <p className="text-xs text-gray-500">RAM</p>
                <p className="font-semibold text-gray-800">{product.ram}</p>
              </div>
            </div>
          )}
          {product.memory && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <img src={icons.memory} alt="Memory" className="w-5 h-5 opacity-60" />
              <div>
                <p className="text-xs text-gray-500">Memory</p>
                <p className="font-semibold text-gray-800">{product.memory}</p>
              </div>
            </div>
          )}
          {product.accessories && (
  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg col-span-2">
    <img src={icons.accessories} alt="Accessories" className="w-5 h-5 opacity-60 flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">Accessories</p>
      <p className="font-semibold text-gray-800 break-words">{product.accessories}</p>
    </div>
  </div>
)}
        </div>
      </div>

      <a 
  href={`sms:+17868637769?body=Hello, I'm interested in the ${encodeURIComponent(product.name)}`}
  className="w-full bg-[#1f2937] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#374151] transition-all duration-200 shadow-lg hover:shadow-xl mt-auto block text-center"
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
  const [showSellPopup, setShowSellPopup] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellProduct, setSellProduct] = useState('');
  const [sellCondition, setSellCondition] = useState('Brand New');
  const [sellAccessories, setSellAccessories] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [hasOpenedForm, setHasOpenedForm] = useState(false);
  

  const AIRTABLE_API_KEY = 'patBxMl5uxbqMh90l.d0fa8c39cd2baed95b4d5f47cfa963e3374a2fbe8999edc690dc7a35bc6d8feb';
  const AIRTABLE_BASE_ID = 'appRMrTPEDmjy6Zka';
  const AIRTABLE_TABLE_NAME = 'Inventory';

  const conditions = ['Brand New', 'Excellent', 'Good', 'Fair'];

  useEffect(() => {
    fetchProducts();
    const saved = localStorage.getItem('savedProducts');
    if (saved) setSavedProducts(JSON.parse(saved));
  }, []);
  useEffect(() => {
  const timer = setTimeout(() => {
    setShowSellPopup(true);
  }, 5000);
  return () => clearTimeout(timer);
}, []);
useEffect(() => {
  const timer = setTimeout(() => {
    setShowSellPopup(true);
  }, 5000);
  return () => clearTimeout(timer);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please update your Airtable credentials.</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gray-50" style={{fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>      <style>{`
  @font-face {
  font-family: 'Archivo';
  src: url('/fonts/Archivo-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
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
@keyframes slideInBounce {
  0% {
    transform: translateX(400px);
    opacity: 0;
  }
  60% {
    transform: translateX(-30px);
    opacity: 1;
  }
  80% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}
.animate-slideInBounce {
  animation: slideInBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  ..card-wave {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-wave:hover {
  transform: translateY(-8px) scale(1.02);
}
`}</style>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800">
  <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
    <div className="flex justify-center">
      <img 
        src="/images/logo.png" 
        alt="UnrealPrices Logo" 
        className="h-80 w-80 object-contain animate-float" 
        style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.2))' }}
        onError={(e) => { e.target.style.display = 'none'; }} 
      />
    </div>
  </div>
</div>

{/* Scrolling Testimonials Strip */}
<div className="bg-white border-b border-gray-200 py-3 overflow-hidden relative">
  <div className="flex animate-scroll-testimonials whitespace-nowrap">
    {[...Array(2)].map((_, setIndex) => (
      <div key={setIndex} className="flex">

        <div className="flex items-center mx-8 gap-3">
  <span className="text-gray-700 text-sm">"Amazing quality! Exactly as described." - Sarah M.</span>
  <div className="flex text-yellow-400">
    {'★'.repeat(5)}
  </div>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-4 flex-shrink-0" />
</div>
        
        <div className="flex items-center mx-8 gap-3">
                    <span className="text-gray-700 text-sm">"Fast shipping and great prices!" - John D.</span>
<div className="flex text-yellow-400 mr-2">
            {'★'.repeat(5)}
          </div>
          <img src="/images/offerup-logo.png" alt="OfferUp" className="h-4 flex-shrink-0" />
        </div>
        
        <div className="flex items-center mx-8 gap-3">
                    <span className="text-gray-700 text-sm">"Best deals I've found anywhere." - Mike R.</span>
<div className="flex text-yellow-400 mr-2">
            {'★'.repeat(5)}
          </div>
        </div>
        
        <div className="flex items-center mx-8 gap-3">
  <span className="text-gray-700 text-sm">"Trustworthy seller, will buy again!" - Lisa K.</span>
  <div className="flex text-yellow-400">
    {'★'.repeat(5)}
  </div>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-4 flex-shrink-0" />
</div>
        
        <div className="flex items-center mx-8 gap-3">
                    <span className="text-gray-700 text-sm">"Product looks brand new!" - David P.</span>
<div className="flex text-yellow-400 mr-2">
            {'★'.repeat(5)}
          </div>
          <img src="/images/offerup-logo.png" alt="OfferUp" className="h-4 ml-4 flex-shrink-0" />        </div>
      </div>
    ))}
  </div>
</div>

<header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
    <div className="flex items-center space-x-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-200" />
            </div>
            <button onClick={() => setShowSavedOnly(!showSavedOnly)} className={`flex items-center space-x-2 px-6 py-3 sm:px-6 px-3 rounded-full font-semibold transition-all duration-200 ${showSavedOnly ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
  <Heart size={20} className={showSavedOnly ? 'fill-white' : ''} />
  <span className="hidden sm:inline">{showSavedOnly ? 'All' : 'Saved'}</span>
  {savedProducts.length > 0 && !showSavedOnly && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{savedProducts.length}</span>}
</button>
            <div className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)} className={`flex items-center p-3 rounded-full font-semibold transition-all duration-200 relative ${filterOpen || activeFiltersCount > 0 ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFiltersCount}</span>}
              </button>
              
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-3 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm">Filters</h3>
                      {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Condition */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-xs mb-1.5 text-gray-700">Condition</h4>
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
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No saved products yet</h3>
            <p className="text-gray-600">Click the heart icon on products to save them here</p>
            <button onClick={() => setShowSavedOnly(false)} className="mt-6 bg-[#1f2937] text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200">Browse Products</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-2">No products found</p>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{filteredProducts.map(product => <ProductCard key={product.id} product={product} onToggleSave={toggleSaveProduct} isSaved={savedProducts.includes(product.id)} />)}
</div>
)}

{/* Big button - only shows before first click */}
{showSellPopup && !hasOpenedForm && (
  <div className="fixed bottom-6 right-6 z-50">
    <button onClick={() => { setShowSellForm(true); setHasOpenedForm(true); }} className="relative group animate-slideInBounce">
      <div className="absolute -inset-4 bg-black opacity-30 blur-xl rounded-full"></div>
      <img 
        src="/images/lookingtosell.png" 
        alt="Looking to Sell?" 
        className="relative w-48 h-48 hover:scale-110 transition-transform duration-200 drop-shadow-2xl"
      />
    </button>
  </div>
)}

{/* Form popup */}
{showSellForm && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-80 border-2 border-[#1f2937]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Sell Your Item</h3>
        <button 
          onClick={() => setShowSellForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product</label>
          <input 
            type="text" 
            placeholder="e.g., iPhone 15 Pro" 
            value={sellProduct}
            onChange={(e) => setSellProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
          <select 
            value={sellCondition}
            onChange={(e) => setSellCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>Brand New</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Accessories</label>
          <input 
            type="text" 
            placeholder="e.g., Box, Charger" 
            value={sellAccessories}
            onChange={(e) => setSellAccessories(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Asking Price</label>
          <input 
            type="text" 
            placeholder="$0.00" 
            value={sellPrice}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '');
              setSellPrice(value ? `$${value}` : '');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
          />
        </div>
        <a 
          href={`sms:+17868637769?body=Product: ${encodeURIComponent(sellProduct)}%0ACondition: ${encodeURIComponent(sellCondition)}%0AAccessories: ${encodeURIComponent(sellAccessories)}%0AAsking Price: ${encodeURIComponent(sellPrice)}`}
          className="block w-full bg-[#1f2937] text-white px-6 py-3 rounded-xl text-center font-bold hover:bg-[#374151] transition-colors"
        >
          Submit
        </a>
      </div>
    </div>
  </div>
)}

{/* Mini persistent button after closing form */}
{hasOpenedForm && !showSellForm && (
  <button 
    onClick={() => setShowSellForm(true)}
    className="fixed bottom-4 right-4 z-40"
  >
    <img 
      src="/images/lookingtosell.png" 
      alt="Sell" 
      className="w-32 h-32 hover:scale-110 transition-transform drop-shadow-lg"
    />
  </button>
)}
</main><footer className="bg-gray-50 border-t border-gray-200 mt-20">
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <img src="/images/logo.png" alt="UnrealPrices Logo" className="h-12 w-12 object-contain mx-auto mb-4" />
        <p className="text-gray-700 font-medium">UnrealPrices - Amazing Deals, Unbeatable Prices</p>
        <p className="text-gray-500 text-sm mt-2">© 2024 UnrealPrices. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>);
};
export default AirtableStore;