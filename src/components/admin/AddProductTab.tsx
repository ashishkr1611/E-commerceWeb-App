
import React, { useState, useRef } from "react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, X, Image as ImageIcon, Upload, Loader2 } from "lucide-react";

interface AddProductTabProps {
    onSuccess: () => void;
}

export const AddProductTab = ({ onSuccess }: AddProductTabProps) => {
    const { addProduct, uploadImage, categories } = useProducts();
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        category: "savory",
        description: "",
        imageUrl: "",
        featured: false,
        new: true,
        stock: "10"
    });
    const [extraImages, setExtraImages] = useState<string[]>([]);
    const [currentExtraImage, setCurrentExtraImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isExtraUploading, setIsExtraUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const extraFileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (isMain) setIsUploading(true);
        else setIsExtraUploading(true);

        const url = await uploadImage(file);

        if (url) {
            if (isMain) {
                setNewItem({ ...newItem, imageUrl: url });
            } else {
                setExtraImages([...extraImages, url]);
            }
        }

        if (isMain) setIsUploading(false);
        else setIsExtraUploading(false);

        // Reset input
        e.target.value = "";
    };

    const addExtraImage = () => {
        if (currentExtraImage && currentExtraImage.startsWith('http')) {
            setExtraImages([...extraImages, currentExtraImage]);
            setCurrentExtraImage("");
        }
    };

    const removeExtraImage = (index: number) => {
        setExtraImages(extraImages.filter((_, i) => i !== index));
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        await addProduct({
            ...newItem,
            price: Number(newItem.price),
            stock: Number(newItem.stock),
            images: [newItem.imageUrl, ...extraImages].filter(Boolean)
        });
        setNewItem({
            name: "",
            price: "",
            category: "savory",
            description: "",
            imageUrl: "",
            featured: false,
            new: true,
            stock: "10"
        });
        setExtraImages([]);
        onSuccess();
    };

    return (
        <Card className="border-amber-100 shadow-sm max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Boutique Snack</CardTitle>
                <CardDescription>Fill in the details to add a new item to your collection.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Snack Name</label>
                            <Input
                                placeholder="e.g. Masala Cashews"
                                required
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (₹)</label>
                            <Input
                                type="number"
                                placeholder="299"
                                required
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select
                                value={newItem.category}
                                onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c.id !== "all").map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Initial Stock</label>
                            <Input
                                type="number"
                                placeholder="10"
                                required
                                value={newItem.stock}
                                onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Main Image</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://images.unsplash.com/..."
                                value={newItem.imageUrl}
                                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                className="flex-grow"
                            />
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => handleFileUpload(e, true)}
                                accept="image/*"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="shrink-0 border-amber-200 text-amber-700"
                            >
                                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                            </Button>
                        </div>
                        {newItem.imageUrl && (
                            <div className="mt-2 relative w-24 h-24 border rounded-md overflow-hidden">
                                <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setNewItem({ ...newItem, imageUrl: "" })}
                                    className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-amber-900 flex items-center gap-2">
                            <ImageIcon size={16} /> Additional Media Gallery
                        </label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add another photo URL..."
                                value={currentExtraImage}
                                onChange={(e) => setCurrentExtraImage(e.target.value)}
                            />
                            <Button type="button" variant="outline" onClick={addExtraImage}>
                                <Plus size={18} />
                            </Button>
                            <input
                                type="file"
                                className="hidden"
                                ref={extraFileInputRef}
                                onChange={(e) => handleFileUpload(e, false)}
                                accept="image/*"
                                multiple
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => extraFileInputRef.current?.click()}
                                disabled={isExtraUploading}
                                className="shrink-0 border-amber-200 text-amber-700"
                            >
                                {isExtraUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                            </Button>
                        </div>
                        {extraImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {extraImages.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 group">
                                        <img src={img} alt="" className="w-full h-full object-cover rounded-md border" />
                                        <button
                                            type="button"
                                            onClick={() => removeExtraImage(idx)}
                                            className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            placeholder="Describe the taste, ingredients, and uniqueness..."
                            className="min-h-[100px]"
                            required
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={newItem.featured}
                                onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })}
                                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="featured" className="text-sm font-medium">Featured Item</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="new"
                                checked={newItem.new}
                                onChange={(e) => setNewItem({ ...newItem, new: e.target.checked })}
                                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="new" className="text-sm font-medium">New Arrival</label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 mt-4 h-12">
                        <Plus className="mr-2" /> Add Item to Store
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
