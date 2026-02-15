'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Fixed the path here
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// This is the "Big & Good" attractive input style from your image
const StyledInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base shadow-sm transition-all duration-200",
      "placeholder:text-slate-400 text-slate-700",
      "focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  />
);

const MOCK_DATA = [
  { id: "1", name: "Apac Byiringiro", email: "apac@gmail.com", phone: "0788888888", address: "Gasabo, Kigali", notes: "Regular client" },
  { id: "2", name: "Chrispin Yao", email: "Chrispinyao@gmail.com", phone: "0788312431", address: "Beijing, China", notes: "VIP Member" },
];

export default function Clients() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Logic to save data so it doesn't disappear when you change menus
  const [localClients, setLocalClients] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_clients_persistent");
      return saved ? JSON.parse(saved) : MOCK_DATA;
    }
    return MOCK_DATA;
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Save to browser memory whenever clients change
  useEffect(() => {
    localStorage.setItem("app_clients_persistent", JSON.stringify(localClients));
  }, [localClients]);

  const filteredClients = useMemo(() => {
    return localClients.filter((client: any) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        (client.phone && client.phone.includes(searchLower)) ||
        (client.address && client.address.toLowerCase().includes(searchLower))
      );
    });
  }, [localClients, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setLocalClients((prev: any[]) => prev.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
      toast.success("Client updated");
    } else {
      const newClient = { ...formData, id: Date.now().toString() };
      setLocalClients((prev: any[]) => [newClient, ...prev]);
      toast.success("Client created");
    }
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
    setEditingId(null);
  };

  const handleEdit = (client: any) => {
    setEditingId(client.id);
    setFormData({ ...client });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setLocalClients((prev: any[]) => prev.filter(c => c.id !== id));
      toast.error("Client deleted");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Client database management</p>
        </div>
        
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl px-6 bg-blue-600 hover:bg-blue-700 transition-colors">
              <Plus className="mr-2 h-5 w-5" /> New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white p-6 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingId ? "Edit Client" : "Create Client"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label className="font-semibold ml-1">Name</Label>
                <StyledInput 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="font-semibold ml-1">Email</Label>
                <StyledInput 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="john@example.com" 
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="font-semibold ml-1">Phone</Label>
                <StyledInput 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="(555) 123-4567" 
                />
              </div>
              <div className="space-y-1">
                <Label className="font-semibold ml-1">Address</Label>
                <StyledInput 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  placeholder="123 Main St" 
                />
              </div>
              <div className="space-y-1">
                <Label className="font-semibold ml-1">Notes</Label>
                <StyledInput 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                  placeholder="Additional notes" 
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-bold mt-2">
                {editingId ? "Update" : "Create"} Client
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <StyledInput 
          placeholder="Search name, email, or address..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-12" 
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold py-4">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Phone</TableHead>
              <TableHead className="font-bold">Address</TableHead>
              <TableHead className="font-bold">Notes</TableHead>
              <TableHead className="text-right font-bold pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client: any) => (
              <TableRow key={client.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium py-4">{client.name}</TableCell>
                <TableCell className="text-slate-600">{client.email}</TableCell>
                <TableCell className="text-slate-600">{client.phone || "—"}</TableCell>
                <TableCell className="text-slate-600">{client.address || "—"}</TableCell>
                <TableCell className="text-slate-400 max-w-[150px] truncate">{client.notes || "—"}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(client)} className="rounded-lg h-9 border-slate-200 hover:bg-slate-50">
                      <Pencil className="h-4 w-4 mr-1 text-slate-500" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(client.id)} className="rounded-lg h-9 border-red-100 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}