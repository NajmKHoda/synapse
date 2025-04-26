interface ClassData {
    id: string
    name: string
}

export default function ClassCard({ classData }: { classData: ClassData }) {
return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
    <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold">{classData.name}</h3>
    </div>
    <div className="p-5">
        <div className="flex justify-between items-center">
        <div>
            <p className="text-sm text-gray-600">Students</p>
            <p className="text-2xl font-medium">{0}</p>
        </div>
        <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
            View Details
        </button>
        </div>
    </div>
    </div>
)
}
  