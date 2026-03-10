import { Star } from "lucide-react"

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(Math.max(rating - (star - 1), 0), 1) * 100

        return (
          <div key={star} className="relative h-5 w-5">
            {/* Star nền xám */}
            <Star className="absolute h-5 w-5 text-gray-200" />

            {/* Star vàng fill theo % */}
            <div
              className="absolute overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StarRating