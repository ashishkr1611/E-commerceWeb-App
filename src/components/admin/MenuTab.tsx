import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MenuItem } from "@/hooks/useMenu";
import { toast } from "sonner";
import { Trash2, Save, Plus } from "lucide-react";

export function MenuTab() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState<Partial<MenuItem>>({
        label: "",
        path: "/",
        is_visible: true,
        sort_order: 0,
        requires_auth: false,
        requires_admin: false,
    });

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await (supabase as any)
            .from("menu_items")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {
            toast.error("Failed to fetch menu items");
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleUpdate = async (id: string, updates: Partial<MenuItem>) => {
        // Optimistic update
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );

        const { error } = await (supabase as any)
            .from("menu_items")
            .update(updates)
            .eq("id", id);

        if (error) {
            toast.error("Failed to update item");
            fetchItems(); // Revert
        } else {
            toast.success("Item updated");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;

        const { error } = await (supabase as any)
            .from("menu_items")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete item");
        } else {
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success("Item deleted");
        }
    };

    const handleCreate = async () => {
        if (!newItem.label || !newItem.path) return;

        const { data, error } = await (supabase as any)
            .from("menu_items")
            .insert([newItem])
            .select();

        if (error) {
            toast.error("Failed to create item");
        } else {
            setItems([...items, data[0]]);
            setNewItem({
                label: "",
                path: "/",
                is_visible: true,
                sort_order: 0,
                requires_auth: false,
                requires_admin: false,
            });
            toast.success("Item created");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Menu Management</h2>
                <Button onClick={fetchItems} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold mb-4">Add New Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">Label</label>
                        <Input
                            value={newItem.label}
                            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                            placeholder="e.g. Contact"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">Path</label>
                        <Input
                            value={newItem.path}
                            onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                            placeholder="e.g. /contact"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Order</label>
                        <Input
                            type="number"
                            value={newItem.sort_order}
                            onChange={(e) =>
                                setNewItem({ ...newItem, sort_order: parseInt(e.target.value) || 0 })
                            }
                        />
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Path</TableHead>
                            <TableHead>Visible</TableHead>
                            <TableHead>Auth Req</TableHead>
                            <TableHead>Admin Req</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="w-16 h-8"
                                            value={item.sort_order}
                                            onChange={(e) =>
                                                handleUpdate(item.id, { sort_order: parseInt(e.target.value) || 0 })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            className="w-32 h-8"
                                            value={item.label}
                                            onChange={(e) => handleUpdate(item.id, { label: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            className="w-32 h-8"
                                            value={item.path}
                                            onChange={(e) => handleUpdate(item.id, { path: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={item.is_visible}
                                            onCheckedChange={(checked) =>
                                                handleUpdate(item.id, { is_visible: checked })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={item.requires_auth}
                                            onCheckedChange={(checked) =>
                                                handleUpdate(item.id, { requires_auth: checked })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={item.requires_admin}
                                            onCheckedChange={(checked) =>
                                                handleUpdate(item.id, { requires_admin: checked })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
