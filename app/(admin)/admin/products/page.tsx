"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import PaginationControls from "@/components/layout/pagination-controls"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllProductsAdmin, updateProductStatus } from "@/services/product.service"
import { formatPrice } from "@/lib/utils"
import useDebounce from "@/hooks/use-debounce"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { queryClient } from "@/components/QueryClientProviders"
import { PaginatedData } from "@/types/commons"
import { ProductAdmin } from "@/types/product"
import { Dialog } from "@/components/ui/dialog"
import DeleteProduct from "@/components/forms/product/delete-product"


export default function ProductsPage() {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const q = useDebounce(search, 500)
    const {
        data: productsData,
    } = useQuery({
        queryKey: ['admin-products', currentPage, itemsPerPage, q],
        queryFn: () => getAllProductsAdmin(currentPage, itemsPerPage, q),
    })
    //
    const totalPages = productsData?.pagination.totalPages || 1
    const totalItems = productsData?.pagination.total || 0
    const products = productsData?.data || []

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deletingProduct, setDeletingProduct] = useState<ProductAdmin | null>(null)

    const getStatusBadge = (stock: number) => {
        if (stock === 0) {
            return <Badge variant="destructive">Hết hàng</Badge>
        }
        if (stock < 50) {
            return <Badge className="bg-yellow-500">Sắp hết</Badge>
        }
        return <Badge className="bg-green-500">Còn hàng</Badge>
    }

    const onChangeStatus = async (product: ProductAdmin) => {
        const previousData = queryClient.getQueryData<
            PaginatedData<ProductAdmin>
        >(['admin-products', currentPage, itemsPerPage, q])

        try {
            queryClient.setQueryData(
                ['admin-products', currentPage, itemsPerPage, q],
                (oldData: PaginatedData<ProductAdmin> | undefined) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        data: oldData.data.map((p) =>
                            p._id === product._id
                                ? { ...p, isActive: !p.isActive }
                                : p
                        ),
                    }
                }
            )

            await updateProductStatus(product._id)
        } catch (error) {
            queryClient.setQueryData(
                ['admin-products', currentPage, itemsPerPage, q],
                previousData
            )
            console.error("Lỗi cập nhật trạng thái sản phẩm:", error)
        }
    }

    const handleDeleteProduct = (product: ProductAdmin) => {
        setDeletingProduct(product);
        setDeleteDialogOpen(true);
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Quản lý sản phẩm</h1>
                    <p className="text-muted-foreground">Quản lý danh sách sản phẩm của cửa hàng</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Button variant="outline" className="bg-transparent">
                            Lọc
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="border-b">
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Sản phẩm</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Danh mục</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Giá</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tồn kho</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Đã bán</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trạng thái</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nổi bật</TableHead>
                                    <TableHead className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Hiển thị</TableHead>
                                    <TableHead className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {totalItems === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                                            Không tìm thấy sản phẩm nào.
                                        </TableCell>
                                    </TableRow>
                                )
                                    :
                                    products.map((product) => (
                                        <TableRow key={product._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                            <TableCell className="py-3 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                        <img
                                                            src={product?.image || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium line-clamp-1">{product.name}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 px-2 text-sm">{product.category?.name}</TableCell>
                                            <TableCell className="py-3 px-2 font-medium">{formatPrice(product.price)}</TableCell>
                                            <TableCell className="py-3 px-2 text-sm">{product.stock}</TableCell>
                                            <TableCell className="py-3 px-2 text-sm">{product.soldQuantity}</TableCell>
                                            <TableCell className="py-3 px-2">{getStatusBadge(product.stock)}</TableCell>
                                            <TableCell className="py-3 px-2">
                                                {product.isActive ? (
                                                    <Badge className="bg-green-500">Đang hiển thị</Badge>
                                                ) : (
                                                    <Badge className="bg-red-500">Đã ẩn</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3 px-2">
                                                {product.isFeatured ? (
                                                    <Badge className="bg-green-500">Nổi bật</Badge>
                                                ) : (
                                                    <Badge className="bg-red-500">Không nổi bật</Badge>
                                                )}
                                            </TableCell>
                                            
                                            <TableCell className="py-3 px-2 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link href={`/admin/products/${product._id}`} className="flex gap-2 items-center">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem sản phẩm
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onChangeStatus(product)}>
                                                            <EyeOff className="h-4 w-4 mr-2" />
                                                            {
                                                                product.isActive ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"
                                                            }
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/admin/products/edit/${product._id}`} className="flex gap-2 items-center">
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Chỉnh sửa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteProduct(product)}
                                                            className="text-destructive">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>

                </CardContent>
            </Card>
            {totalItems > 0 && <PaginationControls totalPages={totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} totalItems={totalItems} />}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DeleteProduct setDeleteDialogOpen={setDeleteDialogOpen} selectedProduct={deletingProduct!} />
            </Dialog>
        </div>
    )
}
