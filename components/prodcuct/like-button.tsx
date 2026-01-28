import React from 'react'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { toast } from 'sonner'
import { HomeProduct,Product } from '@/types/product'
interface LikeButtonProps {
    product: HomeProduct | Product
}
const LikeButton = ({ product }: LikeButtonProps) => {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth)
    const handleLikeProduct = ()=>{
        if(!isAuthenticated){
            toast.error("Vui lòng đăng nhập để sử dụng tính năng này!")
            return
        }

    }
    return (
        <Button
            size="icon"
            className={
                product.isLiked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-muted hover:bg-accent"
            }
            onClick={(e) => {
                e.preventDefault()
                handleLikeProduct()
            }}
        >
            <Heart className="h-5 w-5 text-black" />
        </Button>
    )
}

export default LikeButton
