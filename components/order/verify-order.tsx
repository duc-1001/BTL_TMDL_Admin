import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { XCircle } from "lucide-react"
import axios from "@/lib/axios"
import { requestOrderViewToken } from "@/services/order.service"
import { useRouter } from "next/navigation"

interface GuestVerifyOrderProps {
    orderCode: string
}

export default function VerifyOrder({ orderCode }: GuestVerifyOrderProps) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setErrorMessage(null)

            const data = await requestOrderViewToken(orderCode, email)
            if (!data?.viewToken) {
                throw new Error("Không nhận được token hợp lệ.")
            }
            router.replace(`/orders/${orderCode}?token=${data.viewToken}`)
        } catch (err: any) {
            setErrorMessage(err?.message || "Không thể xác thực email.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card border rounded-xl p-6 shadow-sm">
                <XCircle className="mx-auto mb-4 text-amber-500" size={48} />

                <h2 className="text-2xl font-semibold text-center">
                    Xác thực để xem đơn hàng
                </h2>

                <p className="text-muted-foreground mt-2 text-center">
                    Nhập email đã dùng khi đặt hàng để nhận quyền truy cập.
                </p>
                <div className="mt-6 space-y-3">
                    <Input
                        type="email"
                        placeholder="Nhập email đặt hàng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!email || loading}
                    >
                        {loading ? "Đang xác thực..." : "Xác thực"}
                    </Button>
                </div>
            </div>
        </div>
    )
}