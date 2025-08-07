import { TabsContent } from "@radix-ui/react-tabs";
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoles } from "@/types/AuthProps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useDashboard } from "@/contexts/DashboardContext";

const UserTable = () => {
  const { users, handleDeleteUser, handleUpdateUserRole } = useDashboard();
  return (
    <TabsContent value="users" className="space-y-4">
      <div className="flex justify-between items-center p-6 pb-4">
        <h3 className="text-lg font-semibold text-white">User Management</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
            />
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400">Join Date</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="border-gray-800">
                <TableCell className="text-white font-medium">
                  {`${user.firstName} ${user.lastName}`}
                </TableCell>
                <TableCell className="text-gray-300">{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(newRole: UserRoles) =>
                      handleUpdateUserRole(user.id, newRole)
                    }
                  >
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="user" className="text-gray-300">
                        User
                      </SelectItem>
                      <SelectItem value="author" className="text-gray-300">
                        Author
                      </SelectItem>
                      <SelectItem value="admin" className="text-gray-300">
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-gray-300">
                  {user.createdAt}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                        <button onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};

export default UserTable;
