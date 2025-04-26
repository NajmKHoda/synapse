"use client"

import { useEffect, useState } from "react"
import AddClassDialog from "@/components/dashboard/AddClassDialog"
import ClassCard from '@/components/dashboard/ClassCard'
import { supabase } from '@/lib/supabase'
import { useAuthStatus } from '@/components/useAuthStatus'

export default function TeacherDashboard() {
  const { user } = useAuthStatus();
  const [classes, setClasses] = useState<any[]>([])
  
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
  }, [ user ]);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold">Welcome!</h1>
      <p className="text-gray-600 mt-2">Manage your classes and students</p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Classes</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => setIsDialogOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Class
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
            <ClassCard key={cls.id} classData={cls} />
        ))}
      </div>

      {isDialogOpen && <AddClassDialog onClose={() => setIsDialogOpen(false)} onSubmit={handleClassAdd} />}
    </div>
  )
}

interface Class {
  id: string,
  name: string
}