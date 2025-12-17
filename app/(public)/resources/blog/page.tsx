export default function BlogPage() {
    return (
        <div className="bg-white py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">The MicroBreaks Blog</h1>
                    <p className="text-xl text-slate-600">Latest news, wellness tips, and product updates.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Dummy Post 1 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-slate-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">Image</div>
                        </div>
                        <span className="text-blue-600 text-sm font-bold uppercase tracking-wide">Wellness</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">Why 2 Minutes is All You Need</h3>
                        <p className="text-slate-600 mt-2 text-sm line-clamp-3">Recent studies show that micro-dosing movement throughout the day is more effective than a single gym session for longevity.</p>
                    </div>

                    {/* Dummy Post 2 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-slate-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">Image</div>
                        </div>
                        <span className="text-purple-600 text-sm font-bold uppercase tracking-wide">Product</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">Introducing: Team Challenges</h3>
                        <p className="text-slate-600 mt-2 text-sm line-clamp-3">Gamify health with our newest feature. Compete with other departments for the highest wellness streak.</p>
                    </div>

                    {/* Dummy Post 3 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-slate-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">Image</div>
                        </div>
                        <span className="text-orange-600 text-sm font-bold uppercase tracking-wide">Science</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">The Eye Strain Epidemic</h3>
                        <p className="text-slate-600 mt-2 text-sm line-clamp-3">Digital eye strain is affecting productivity. Here are 3 simple exercises to combat it immediately.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
