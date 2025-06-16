import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserAccountDrawerProps {
  user: { // Assuming user object structure
    name: string;
    email: string;
    role: string;
    companyId: string;
    companyName: string;
    lastLogin?: string; // Optional, if you want to display it
  } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserAccountDrawer({ user, isOpen, onOpenChange }: UserAccountDrawerProps) {
  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            View your personal and company information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <p className="col-span-3">{user.name}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <p className="col-span-3">{user.email}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <p className="col-span-3">{user.role}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">
              Company Name
            </Label>
            <p className="col-span-3">{user.companyName}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyId" className="text-right">
              Company ID
            </Label>
            <p className="col-span-3">{user.companyId}</p>
          </div>
          {user.lastLogin && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastLogin" className="text-right">
                Last Login
              </Label>
              <p className="col-span-3">{new Date(user.lastLogin).toLocaleString()}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 