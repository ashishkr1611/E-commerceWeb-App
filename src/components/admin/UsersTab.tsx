
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { User, ShieldAlert, ShieldCheck, History, Mail } from "lucide-react";
import { UserHistoryDialog } from "./UserHistoryDialog";

export const UsersTab = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to load users.",
                variant: "destructive"
            });
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleUserBlock = async (userId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('profiles')
            .update({ is_blocked: !currentStatus })
            .eq('id', userId);

        if (error) {
            toast({
                title: "Error",
                description: "Failed to change user status.",
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: `User ${!currentStatus ? 'blocked' : 'unblocked'} successfully.`,
            });
            fetchUsers();
        }
    };

    return (
        <Card className="border-amber-100 shadow-sm">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View all registered customers and manage account access.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading users...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((profile) => (
                                <TableRow key={profile.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold uppercase">
                                                {profile.full_name?.charAt(0) || <User size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-amber-950">{profile.full_name || 'Guest'}</div>
                                                <div className="text-xs text-muted-foreground">{profile.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={profile.role === 'admin' ? "default" : "secondary"}>
                                            {profile.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {profile.is_blocked ? (
                                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                <ShieldAlert size={12} /> Blocked
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 flex items-center gap-1 w-fit">
                                                <ShieldCheck size={12} /> Active
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-amber-600 hover:text-amber-700"
                                                title="Order History"
                                                onClick={() => {
                                                    setSelectedUserId(profile.id);
                                                    setSelectedUserName(profile.full_name || "Guest");
                                                    setIsHistoryOpen(true);
                                                }}
                                            >
                                                <History size={18} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => toggleUserBlock(profile.id, profile.is_blocked)}
                                                className={profile.is_blocked ? "text-emerald-600" : "text-rose-600"}
                                                title={profile.is_blocked ? "Unblock User" : "Block User"}
                                            >
                                                {profile.is_blocked ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <UserHistoryDialog
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                userId={selectedUserId}
                userName={selectedUserName}
            />
        </Card>
    );
};
