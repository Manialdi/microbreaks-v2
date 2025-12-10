
export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Total Breaks</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Focus Time</h3>
                    <p className="text-3xl font-bold mt-2">4h 30m</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Stress Level</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">Low</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                    Chart Placeholder
                </div>
            </div>
        </div>
    )
}
