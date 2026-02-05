
import React, { useState, useRef } from "react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash, Edit, Save, X, PlusCircle, Image as ImageIcon, CheckCircle2, XCircle, Upload, Loader2 } from "lucide-react";

interface InventoryTabProps {
    onSwitchToAdd: () => void;
}

export const InventoryTab = ({ onSwitchToAdd }: InventoryTabProps) => {
    const { products, updateProduct, deleteProduct, uploadImage, categories } = useProducts();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const startEditing = (product: any) => {
        setEditingId(product.id);
        setEditFormData({ ...product });
    };

    const handleUpdateProduct = async () => {
        if (editingId && editFormData) {
            await updateProduct(editingId, {
                ...editFormData,
                price: Number(editFormData.price),
                stock: Number(editFormData.stock)
            });
            setEditingId(null);
        }
    };

    const togglePublished = async (id: string, current: boolean) => {
        await updateProduct(id, { isPublished: !current });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editFormData) return;

        setIsUploading(true);
        const url = await uploadImage(file);
        if (url) {
            setEditFormData({ ...editFormData, imageUrl: url });
        }
        setIsUploading(false);
        e.target.value = "";
    };

    return (
        <Card className="border-amber-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Product Inventory</CardTitle>
                    <CardDescription>View, edit, or remove snacks from your storefront.</CardDescription>
                </div>
                <Button onClick={onSwitchToAdd} variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <div className="relative group transition-all">
                                            <img
                                                src={editingId === product.id ? editFormData.imageUrl : product.imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-md border border-amber-50"
                                            />
                                            {(product.images && product.images.length > 1) && (
                                                <Badge className="absolute -bottom-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-amber-600">
                                                    {product.images.length}
                                                </Badge>
                                            )}
                                        </div>
                                        {editingId === product.id && (
                                            <>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-12 border border-amber-100"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                >
                                                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {editingId === product.id ? (
                                        <Input
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full h-8"
                                        />
                                    ) : product.name}
                                </TableCell>
                                <TableCell>
                                    {editingId === product.id ? (
                                        <Select
                                            value={editFormData.category}
                                            onValueChange={(val) => setEditFormData({ ...editFormData, category: val })}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.filter(c => c.id !== "all").map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                            {categories.find(c => c.id === product.category)?.name}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === product.id ? (
                                        <Input
                                            type="number"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                            className="w-20 h-8"
                                        />
                                    ) : `₹${product.price}`}
                                </TableCell>
                                <TableCell>
                                    {editingId === product.id ? (
                                        <Input
                                            type="number"
                                            value={editFormData.stock}
                                            onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                                            className="w-20 h-8"
                                        />
                                    ) : (
                                        <span className={product.stock < 5 ? "text-rose-600 font-bold" : "text-amber-900"}>
                                            {product.stock}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                        {product.stock === 0 ? (
                                            <Badge variant="destructive">Out of Stock</Badge>
                                        ) : product.stock < 5 ? (
                                            <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50">Low</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Good</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={product.isPublished}
                                            onCheckedChange={() => togglePublished(product.id, !!product.isPublished)}
                                        />
                                        {product.isPublished ? (
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                        ) : (
                                            <XCircle size={14} className="text-muted-foreground" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {editingId === product.id ? (
                                            <>
                                                <Button size="icon" variant="ghost" onClick={handleUpdateProduct} className="text-green-600 hover:text-green-700">
                                                    <Save size={18} />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="text-rose-600 hover:text-rose-700">
                                                    <X size={18} />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="icon" variant="ghost" onClick={() => startEditing(product)} className="text-amber-600 hover:text-amber-700">
                                                    <Edit size={18} />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => deleteProduct(product.id)} className="text-rose-600 hover:text-rose-700">
                                                    <Trash size={18} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
