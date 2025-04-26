"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Brain,
  Plus,
  Users,
  BookOpen,
  MoreHorizontal,
  Search,
  UserPlus,
  Settings,
  Trash2,
} from "lucide-react"

import Button from "@/components/ui/Button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/dashboard/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dashboard/dropdown-menu"
import AddClassDialog from "@/components/dashboard/add-class-dialog"
import { supabase } from '@/lib/supabase'
import { useAuthStatus } from '@/components/useAuthStatus'
import DeleteClassDialog from "@/components/dashboard/delete-class-dialog"
import ProtectedRoute from "@/components/ProtectedRoute"

// Types for our class data
interface ClassData {
  id: string
  name: string
  studentCount?: number  // Make optional since we won't display it
  description: string
  color: string
}

export default function Dashboard() {
  const { user } = useAuthStatus();
  const [classes, setClasses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false)
  const [deleteDialogState, setDeleteDialogState] = useState<{ isOpen: boolean; classId: string; className: string }>({
    isOpen: false,
    classId: "",
    className: ""
  })

  useEffect(() => {
    async function fetchClasses() {
      if (!user) return [];
      const { data } = await supabase.from('Class')
        .select()
        .eq('teacher_id', user.id);
      if (!data) return [];

      return data;
    }

    fetchClasses().then(cls => setClasses(cls));
  }, [user]);

  async function handleClassAdd(name: string) {
    if (!user) return;
    console.log(user.id);

    const { data: instances, error } = await supabase.from('Class')
      .insert([{ name }])
      .select();

    console.log(error);

    if (!instances) return;
    const instance = instances[0];

    setClasses([...classes, { id: instance.id, name: instance.name }])
  };

  // Filter classes based on search query
  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle creating a new class
  const handleCreateClass = (classData: {
    name: string
    description: string
  }) => {
    handleClassAdd(classData.name);
    setIsAddClassDialogOpen(false);
  }

  // Handle deleting a class
  const handleDeleteClass = async (id: string) => {
    if (!user) return;
    
    // Delete the class from the database
    const { error } = await supabase.from('Class')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting class:", error);
      return;
    }
    
    // Update the UI
    setClasses(classes.filter((cls) => cls.id !== id));
    setDeleteDialogState({ isOpen: false, classId: "", className: "" });
  }
  
  // Show delete confirmation dialog
  const openDeleteDialog = (id: string, name: string) => {
    setDeleteDialogState({
      isOpen: true,
      classId: id,
      className: name
    });
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light">

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
              <p className="text-gray-600">Create and manage your classes to start pairing students.</p>
            </div>

            <Button
              onClick={() => setIsAddClassDialogOpen(true)}
              className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 gap-2 rounded-xl shadow-fun"
            >
              <Plus className="h-4 w-4 inline-flex items-center" /> Create New Class
            </Button>
          </div>

          {/* Search and filter */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search classes by name..."
                className="pl-10 border-gray-200 focus:border-[var(--secondary)] rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Classes grid */}
          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => (
                <Card
                  key={cls.id}
                  className="border-none shadow-fun hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <div className={`h-2 bg-${cls.color} w-full`}></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="rounded-full bg-[var(--primary)]/20 p-2">
                        <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-lg">
                          <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" /> Edit Class
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <UserPlus className="mr-2 h-4 w-4" /> Add Students
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => openDeleteDialog(cls.id, cls.name)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">{cls.name}</h3>
                    {cls.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cls.description}</p>}
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:border-[var(--secondary)] hover:text-[var(--secondary)] rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button size="sm" className={`bg-${cls.color} text-white hover:bg-${cls.color}/90 rounded-lg`}>
                      Create Pairs
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : classes.length > 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-fun">
              <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? "No classes match your search criteria." : "No classes match your filters."}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setIsAddClassDialogOpen(true)
                }}
                className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 gap-2 rounded-xl shadow-fun inline-flex items-center"
              >
                <Plus className="h-4 w-4" /> Create New Class
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-fun">
              <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Yet</h3>
              <p className="text-gray-600 mb-6">Create your first class to get started with Synapse.</p>
              <Button
                onClick={() => setIsAddClassDialogOpen(true)}
                className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 gap-2 rounded-xl shadow-fun inline-flex items-center"
              >
                <Plus className="h-4 w-4" /> Create Your First Class
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add Class Dialog */}
      {isAddClassDialogOpen && (
        <AddClassDialog onClose={() => setIsAddClassDialogOpen(false)} onSubmit={handleCreateClass} />
      )}
      
      {/* Delete Class Confirmation Dialog */}
      {deleteDialogState.isOpen && (
        <DeleteClassDialog 
          className={deleteDialogState.className}
          onClose={() => setDeleteDialogState({ ...deleteDialogState, isOpen: false })}
          onConfirm={() => handleDeleteClass(deleteDialogState.classId)}
        />
      )}
    </div>
    </ProtectedRoute>
  )
}