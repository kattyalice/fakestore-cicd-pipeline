import React from 'react'
import type { Product } from '../types/types'
import { Rating } from '@smastrom/react-rating';
import { Button } from 'react-bootstrap';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/cartSlice';

const ProductCard:React.FC<{product: Product}> = ({product}) => {
    const dispatch = useAppDispatch();

    return (
        <div className="col-md-3 p-3 d-flex flex-column align-items-center justify-center-content gap-3 shadow">
            <h3>{product.title}</h3>
            <img src={product.image} alt={product.title} className="w-25" />
            <h5>{product.category.toUpperCase()}</h5>
            <Rating style={{ maxWidth: 100 }} value={product.rating.rate} readOnly/>
            <p>${product.price}</p>
            <p>{product.description}</p>
            <Button variant="primary" onClick={() => dispatch(addToCart(product))}>Add to cart</Button>
        </div>
  )
}

export default ProductCard
