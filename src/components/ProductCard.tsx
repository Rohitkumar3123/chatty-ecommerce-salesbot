
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/Product';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useState } from 'react';
import ProductModal from '@/components/ProductModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="hover-scale transition-all duration-300 hover:shadow-lg cursor-pointer group">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
            <Badge className="absolute top-2 left-2">
              {product.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              <Badge variant="secondary">{product.brand}</Badge>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowModal(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.inStock ? 'Add to Cart' : 'Unavailable'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ProductModal 
        product={product} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default ProductCard;
